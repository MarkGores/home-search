// backend/controllers/listingsController.js
const { Pool } = require('pg');

// Create a pool using environment variables (ensure these are set in your backend/.env)
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET all listings with pagination, returning all fields
exports.getAllListings = async (req, res) => {
  // Get pagination parameters from the query string (defaults: limit=100, page=1)
  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const query = `
      SELECT *
      FROM listings
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// GET single listing by ID/Key, returning all fields
exports.getListingById = async (req, res) => {
  const listingParam = req.params.id; // Could be "ListingKey" or "ListingId"
  try {
    const query = `
      SELECT *
      FROM listings
      WHERE "ListingKey" = $1 OR "ListingId" = $1
    `;
    const result = await pool.query(query, [listingParam]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};