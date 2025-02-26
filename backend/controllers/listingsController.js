// backend/controllers/listingsController.js
const { Pool } = require('pg');

// Create a pool using environment variables (make sure they're set in your backend/.env)
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

// GET all listings
exports.getAllListings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM listings');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// GET single listing by ID/Key
exports.getListingById = async (req, res) => {
  const listingParam = req.params.id; // Could be ListingKey or ListingId
  try {
    const result = await pool.query(
      `SELECT * 
       FROM listings
       WHERE listingkey = $1 OR listingid = $1`,
      [listingParam]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};