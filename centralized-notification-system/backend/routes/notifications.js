
const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

router.post('/', async (req, res) => {
  const { template_id, project_id, data, priority=0, scheduled_at, dedup } = req.body;
  let dedup_hash = null;
  if (dedup) {
    dedup_hash = crypto.createHash('sha256').update(JSON.stringify({template_id, project_id, dedup})).digest('hex');
  }

  try {
    const r = await db.query(
      `INSERT INTO notifications (template_id, project_id, data, priority, status, dedup_hash, scheduled_at)
       VALUES ($1,$2,$3,$4,'queued',$5,$6) RETURNING *`,
      [template_id, project_id, data, priority, dedup_hash, scheduled_at || new Date()]
    );
    res.json({ notification: r.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'duplicate' });
    }
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/', async (req, res) => {
  const r = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100');
  res.json({ notifications: r.rows });
});

module.exports = router;
