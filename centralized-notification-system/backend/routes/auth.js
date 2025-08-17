const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req, res) => {
  const { username, name, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const r = await db.query(
      'INSERT INTO users (username, name, password_hash) VALUES ($1,$2,$3) RETURNING id, username, name, created_at',
      [username, name, hash]
    );
    res.json({ user: r.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'username exists' });
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const r = await db.query('SELECT * FROM users WHERE username=$1', [username]);
  if (r.rowCount === 0) return res.status(401).json({ error: 'invalid credentials' });
  const user = r.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
});

const authMiddleware = (req,res,next)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'missing auth'});
  const parts = auth.split(' ');
  if(parts.length !== 2) return res.status(401).json({error:'malformed auth'});
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch(e) { return res.status(401).json({error:'invalid token'}); }
};

router.post('/apikey', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const apiKey = uuidv4() + '-' + Math.random().toString(36).slice(2,10);
  try {
    await db.query('INSERT INTO api_keys (user_id, key) VALUES ($1,$2)', [userId, apiKey]);
    res.json({ apiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
