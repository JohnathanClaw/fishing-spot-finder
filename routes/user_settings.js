const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');

const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ data: null, error: 'Authentication required' });
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * limit;
    const { rows } = await pool.query('SELECT * FROM user_settings LIMIT $1 OFFSET $2', [limit, offset]);
    return res.json({ data: rows, error: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ data: null, error: 'Failed to fetch user settings' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM user_settings WHERE id = $1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ data: null, error: 'User settings not found' });
    }
    return res.json({ data: rows[0], error: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ data: null, error: 'Failed to fetch user settings' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, receive_notifications, preferred_radius_km } = req.body || {};
    if (!user_id) {
      return res.status(400).json({ data: null, error: 'user_id is required' });
    }
    if (preferred_radius_km !== undefined && (isNaN(parseInt(preferred_radius_km, 10)) || parseInt(preferred_radius_km, 10) < 1)) {
      return res.status(400).json({ data: null, error: 'preferred_radius_km must be a positive integer' });
    }
    const receive = typeof receive_notifications === 'boolean' ? receive_notifications : true;
    const radius = preferred_radius_km !== undefined ? parseInt(preferred_radius_km, 10) : 10;
    const { rows } = await pool.query(
      'INSERT INTO user_settings (user_id, receive_notifications, preferred_radius_km) VALUES ($1, $2, $3) RETURNING *',
      [user_id, receive, radius]
    );
    return res.status(201).json({ data: rows[0], error: null });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ data: null, error: 'Settings already exist for this user' });
    }
    return res.status(500).json({ data: null, error: 'Failed to create user settings' });
  }
});

router.put('/me', requireAuth, async (req, res) => {
  try {
    const { receive_notifications, preferred_radius_km } = req.body || {};
    const fields = [];
    const values = [];
    if (typeof receive_notifications === 'boolean') {
      fields.push(`receive_notifications = $${fields.length + 1}`);
      values.push(receive_notifications);
    }
    if (preferred_radius_km !== undefined) {
      const radius = parseInt(preferred_radius_km, 10);
      if (isNaN(radius) || radius < 1) {
        return res.status(400).json({ data: null, error: 'preferred_radius_km must be a positive integer' });
      }
      fields.push(`preferred_radius_km = $${fields.length + 1}`);
      values.push(radius);
    }
    if (!fields.length) {
      return res.status(400).json({ data: null, error: 'No valid fields provided' });
    }
    values.push(req.user.id);
    const sql = `UPDATE user_settings SET ${fields.join(', ')}, updated_at = now() WHERE user_id = $${values.length} RETURNING *`;
    const { rows } = await pool.query(sql, values);
    if (!rows.length) {
      return res.status(404).json({ data: null, error: 'User settings not found for current user' });
    }
    return res.json({ data: rows[0], error: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ data: null, error: 'Failed to update user settings' });
  }
});

module.exports = router;