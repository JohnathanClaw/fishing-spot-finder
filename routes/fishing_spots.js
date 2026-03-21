const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');

router.get('/', async (req, res) => {
  const limit = Number.parseInt(req.query.limit, 10) || 20;
  const offset = Number.parseInt(req.query.offset, 10) || 0;
  if (limit <= 0 || offset < 0) {
    return res.status(400).json({ data: null, error: 'Invalid pagination parameters' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM fishing_spots LIMIT $1 OFFSET $2', [limit, offset]);
    return res.json({ data: rows, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: 'Failed to fetch fishing spots' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fishing_spots WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ data: null, error: 'Fishing spot not found' });
    }
    return res.json({ data: rows[0], error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: 'Failed to fetch fishing spot' });
  }
});

router.post('/', async (req, res) => {
  const { name, description, latitude, longitude } = req.body || {};
  if (!req.user || !req.user.id) {
    return res.status(401).json({ data: null, error: 'Authentication required' });
  }
  if (!name || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ data: null, error: 'name, latitude, and longitude are required' });
  }
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ data: null, error: 'latitude and longitude must be numbers' });
  }
  try {
    const insertQuery = `
      INSERT INTO fishing_spots (name, description, latitude, longitude, created_by)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const { rows } = await pool.query(insertQuery, [name, description || null, lat, lng, req.user.id]);
    return res.status(201).json({ data: rows[0], error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: 'Failed to create fishing spot' });
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ data: null, error: 'Authentication required' });
  }
  try {
    const spot = await pool.query('SELECT id, created_by FROM fishing_spots WHERE id = $1', [req.params.id]);
    if (spot.rows.length === 0) {
      return res.status(404).json({ data: null, error: 'Fishing spot not found' });
    }
    if (spot.rows[0].created_by !== req.user.id) {
      return res.status(403).json({ data: null, error: 'Not authorized to delete this fishing spot' });
    }
    await pool.query('DELETE FROM fishing_spots WHERE id = $1', [req.params.id]);
    return res.json({ data: { id: req.params.id }, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: 'Failed to delete fishing spot' });
  }
});

module.exports = router;