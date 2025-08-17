const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { project_no, name, status, created_by, server_id, selected_templates } = req.body;

    const r = await db.query(
      `INSERT INTO projects 
       (project_no, name, status, created_by, server_id, selected_templates)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        project_no,
        name,
        status,
        created_by,
        server_id,
        selected_templates || []
      ]
    );

    const project = r.rows[0];
    
    const apiKey = String(project.api_key);

    res.json({ project, apiKey });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

module.exports = router;
