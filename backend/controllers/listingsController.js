// backend/controllers/listingsController.js
const { Pool } = require('pg');

// Create a connection pool using environment variables from your .env file
const pool = new Pool({
  host: process.env.PGHOST,         // e.g., database-1.c7s6ewq8sbmg.us-east-2.rds.amazonaws.com
  port: process.env.PGPORT,         // typically 5432
  user: process.env.PGUSER,         // e.g., postgres
  password: process.env.PGPASSWORD, // your password
  database: process.env.PGDATABASE, // e.g., postgres (or your custom DB name)
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET all listings with pagination
exports.getAllListings = async (req, res) => {
  // Use query parameters for pagination; defaults: limit = 100, page = 1
  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    // Use SELECT * to return all columns. Since your table uses quoted, case‐sensitive names,
    // the returned JSON keys will match the original MLS feed fields (e.g., "ListingKey", "City", etc.)
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

// GET single listing by ID/Key
exports.getListingById = async (req, res) => {
  const listingParam = req.params.id; // This should match either "ListingKey" or "ListingId"
  try {
    // Explicitly quote column names so the response JSON keys match exactly as defined in your table.
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