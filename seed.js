'use strict';
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Seed users
// await pool.query('INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3)', [/* values */]);

// Seed fishing_spots
// await pool.query('INSERT INTO fishing_spots (name, description, latitude, longitude, created_by) VALUES ($1, $2, $3, $4, $5)', [/* values */]);

// Seed spot_reviews
// await pool.query('INSERT INTO spot_reviews (user_id, fishing_spot_id, rating, review_text) VALUES ($1, $2, $3, $4)', [/* values */]);

// Seed user_settings
// await pool.query('INSERT INTO user_settings (user_id, receive_notifications, preferred_radius_km) VALUES ($1, $2, $3)', [/* values */]);

// Seed audit_logs
// await pool.query('INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)', [/* values */]);

console.log('Seed complete');
pool.end();