const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { name, config } = req.body;
  const r = await db.query('INSERT INTO services (name, config) VALUES ($1,$2) RETURNING *', [name, config]);
  res.json({ service: r.rows[0] });
});

router.get('/', async (req, res) => {
  const r = await db.query('SELECT * FROM services');
  res.json({ services: r.rows });
});

module.exports = router;
