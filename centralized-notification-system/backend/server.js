require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

const auth = require('./routes/auth');
const templates = require('./routes/templates');
const projects = require('./routes/projects');
const services = require('./routes/services');
const notifications = require('./routes/notifications');
const apiKeyAuth = require('./routes/apiKeyAuth');

app.use('/auth', auth);
app.use('/templates', templates);
app.use('/projects', projects);
app.use('/services', services);
app.use('/notifications', notifications);

app.post('/api/send', apiKeyAuth, async (req, res) => {
  const { template_id, project_id, data, priority, scheduled_at, dedup } = req.body;
  const crypto = require('crypto');
  try {
    const dedupHash = dedup ? crypto.createHash('sha256').update(JSON.stringify({ template_id, project_id, dedup })).digest('hex') : null;
    const r = await db.query(
      `INSERT INTO notifications (template_id, project_id, data, priority, status, dedup_hash, scheduled_at)
       VALUES ($1,$2,$3,$4,'queued', $5, $6) RETURNING *`,
      [template_id, project_id, data, priority, dedupHash, scheduled_at || new Date()]
    );
    res.json({ notification: r.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'db error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
