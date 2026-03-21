const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../lib/db');

const router = express.Router();

const ensureAuth = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ data: null, error: 'Authentication required' });
  }
  return next();
};

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;
    if (limit <= 0 || offset < 0) {
      return res.status(400).json({ data: null, error: 'Invalid pagination parameters' });
    }
    const result = await pool.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
    return res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error('GET /users error:', err);
    return res.status(500).json({ data: null, error: 'Failed to fetch users' });
  }
});

router.get('/me', ensureAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ data: null, error: 'User not found' });
    }
    return res.json({ data: result.rows[0], error: null });
  } catch (err) {
    console.error('GET /users/me error:', err);
    return res.status(500).json({ data: null, error: 'Failed to fetch profile' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ data: null, error: 'User not found' });
    }
    return res.json({ data: result.rows[0], error: null });
  } catch (err) {
    console.error('GET /users/:id error:', err);
    return res.status(500).json({ data: null, error: 'Failed to fetch user' });
  }
});

router.post('/', async (req, res) => {
  const { email, password, display_name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ data: null, error: 'Email and password are required' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name, created_at, updated_at',
      [email, passwordHash, display_name || null]
    );
    return res.status(201).json({ data: result.rows[0], error: null });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ data: null, error: 'Email already in use' });
    }
    console.error('POST /users error:', err);
    return res.status(500).json({ data: null, error: 'Failed to create user' });
  }
});

module.exports = router;