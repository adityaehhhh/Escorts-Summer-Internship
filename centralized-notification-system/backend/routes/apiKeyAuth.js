const db = require('../db');

async function apiKeyAuth(req, res, next) {
  const key = (req.header('x-api-key') || req.query.api_key || '').trim();
  if (!key) return res.status(401).json({ error: 'API key required' });

  try {

    if (/^\d+$/.test(key)) {
      const r = await db.query('SELECT id, selected_templates FROM projects WHERE id = $1', [Number(key)]);
      if (r.rowCount === 0) return res.status(403).json({ error: 'Invalid API key' });
      req.projectId = r.rows[0].id;
      req.projectSelectedTemplates = r.rows[0].selected_templates || [];
      return next();
    }


    const r2 = await db.query('SELECT * FROM api_keys WHERE key = $1 AND revoked = false', [key]);
    if (r2.rowCount > 0) {
      req.apiKeyUserId = r2.rows[0].user_id;

      return next();
    }

    return res.status(403).json({ error: 'Invalid API key' });
  } catch (err) {
    console.error('apiKeyAuth error:', err);
    res.status(500).json({ error: 'db error' });
  }
}

module.exports = apiKeyAuth;
