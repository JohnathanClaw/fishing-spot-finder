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
  const limit = Number.parseInt(req.query.limit, 10) || 20;
  const offset = Number.parseInt(req.query.offset, 10) || 0;
  if (limit <= 0 || offset < 0) {
    return res.status(400).json({ data: null, error: 'Invalid pagination parameters' });
  }
  try {
    const result = await pool.query('SELECT * FROM spot_reviews LIMIT $1 OFFSET $2', [limit, offset]);
    return res.json({ data: result.rows, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: 'Failed to fetch reviews' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM spot_reviews WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ data: null, error: 'Review not found' });
    }
    return res.json({ data: result.rows[0], error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: 'Failed to fetch review' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { fishing_spot_id, rating, review_text } = req.body || {};
  if (!fishing_spot_id || typeof rating === 'undefined') {
    return res.status(400).json({ data: null, error: 'fishing_spot_id and rating are required' });
  }
  const parsedRating = Number.parseInt(rating, 10);
  if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ data: null, error: 'rating must be an integer between 1 and 5' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO spot_reviews (user_id, fishing_spot_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, fishing_spot_id, parsedRating, review_text || null]
    );
    return res.status(201).json({ data: result.rows[0], error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: 'Failed to create review' });
  }
});

module.exports = router;