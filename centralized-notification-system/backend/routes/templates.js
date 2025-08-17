const express = require('express');
const router = express.Router();
const db = require('../db');

async function getProjectSelectedTemplates(projectId) {
  if (!projectId) return [];
  const r = await db.query('SELECT selected_templates FROM projects WHERE id = $1', [Number(projectId)]);
  if (r.rowCount === 0) return [];
  return r.rows[0].selected_templates || [];
}

router.get('/', async (req, res) => {
  try {
    const apiKey = (req.headers['x-api-key'] || req.query.api_key || '').trim();

    if (!apiKey) {
      const r = await db.query(
        `SELECT id, name, type, content, created_at
         FROM templates
         WHERE (project_id IS NULL)
         ORDER BY id DESC`
      );
      return res.json({ templates: r.rows });
    }

    if (/^\d+$/.test(apiKey)) {
      const selected = await getProjectSelectedTemplates(apiKey);

      if (!selected || selected.length === 0) {

        return res.json({ templates: [] });
      }

      const r = await db.query(
        `SELECT id, name, type, content, created_at
         FROM templates
         WHERE id = ANY($1::int[])
         ORDER BY id DESC`,
        [selected]
      );

      return res.json({ templates: r.rows });
    }


    const legacy = await db.query('SELECT * FROM api_keys WHERE key = $1 AND revoked = false', [apiKey]);
    if (legacy.rowCount > 0) {

      const r = await db.query(
        `SELECT id, name, type, content, created_at
         FROM templates
         WHERE (project_id IS NULL)
         ORDER BY id DESC`
      );
      return res.json({ templates: r.rows });
    }

    return res.status(403).json({ error: 'Invalid API key' });
  } catch (err) {
    console.error('templates GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const apiKey = (req.headers['x-api-key'] || req.query.api_key || '').trim();

    if (!apiKey || !/^\d+$/.test(apiKey)) {
      return res.status(403).json({ error: 'Project API key required to create template' });
    }

    const pr = await db.query('SELECT id FROM projects WHERE id = $1', [Number(apiKey)]);
    if (pr.rowCount === 0) return res.status(403).json({ error: 'Invalid project API key' });

    const { name, type, content } = req.body;
    if (!name || !type || !content) {
      return res.status(400).json({ error: 'Name, type, and content are required' });
    }

    const r = await db.query(
      `INSERT INTO templates (name, type, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, type, content]
    );

    res.json({ template: r.rows[0] });
  } catch (err) {
    console.error('templates POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
