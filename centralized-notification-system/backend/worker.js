require('dotenv').config();
const db = require('./db');
const { render } = require('./utils/tmplParser');
const { sendEmail } = require('./services/mailer');

const POLL_MS = parseInt(process.env.WORKER_POLL_INTERVAL_MS || 3000, 10);

async function pickAndProcess() {
  try {
    const r = await db.query(
      `SELECT n.*, t.content as template_content, t.type as template_type
       FROM notifications n
       LEFT JOIN templates t ON n.template_id = t.id
       WHERE n.status='queued' AND n.scheduled_at <= now()
       ORDER BY n.priority DESC, n.created_at ASC
       LIMIT 1`
    );

    if (r.rowCount === 0) return;
    const notif = r.rows[0];

    await db.query('UPDATE notifications SET status=$1 WHERE id=$2', ['sending', notif.id]);

    const th = await db.query('SELECT * FROM throttle WHERE notification_id=$1', [notif.id]);
    if (th.rowCount > 0) {
      const t = th.rows[0];
      const windowStart = new Date(Date.now() - (t.window_seconds * 1000));
      if (t.count >= t.max_count && new Date(t.sent_at) > windowStart) {
        await db.query('UPDATE notifications SET status=$1 WHERE id=$2', ['failed', notif.id]);
        await db.query('INSERT INTO dlq (notification_id, reason, payload) VALUES ($1,$2,$3)', [
          notif.id,
          'throttle_exceeded',
          notif
        ]);
        console.log('Throttle exceeded for', notif.id);
        return;
      }
    }

    const rendered = render(notif.template_content || '', notif.data || {});
    if (notif.template_type === 'email') {
      const to = notif.data?.to;
      const subject = notif.data?.subject || `Notification #${notif.id}`;
      try {
        await sendEmail({ to, subject, text: rendered });
        await db.query('UPDATE notifications SET status=$1, attempts=attempts+1 WHERE id=$2', ['sent', notif.id]);
      } catch (err) {
        console.error('email send failed', err.message || err);
        await db.query('UPDATE notifications SET status=$1, attempts=attempts+1 WHERE id=$2', ['failed', notif.id]);
        await db.query('INSERT INTO dlq (notification_id, reason, payload) VALUES ($1,$2,$3)', [
          notif.id,
          'email_error:' + String(err.message || err),
          { notif }
        ]);
      }
    } else {
      await db.query('UPDATE notifications SET status=$1 WHERE id=$2', ['failed', notif.id]);
      await db.query('INSERT INTO dlq (notification_id, reason, payload) VALUES ($1,$2,$3)', [
        notif.id,
        'unsupported_type',
        { notif }
      ]);
    }

    if (th.rowCount > 0) {
      await db.query('UPDATE throttle SET count = count + 1, sent_at = now() WHERE id=$1', [th.rows[0].id]);
    }
  } catch (err) {
    console.error('Worker err:', err);
  }
}

async function loop() {
  await pickAndProcess();
  setTimeout(loop, POLL_MS);
}

console.log('Worker started, polling every', POLL_MS, 'ms');
loop();
