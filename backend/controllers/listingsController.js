// backend/controllers/listingsController.js
const { Pool } = require('pg');

// Create a connection pool using environment variables
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

// GET all listings with dynamic filtering, ordering, and pagination
exports.getAllListings = async (req, res) => {
  // Extract query parameters
  const { all, limit, page, city, priceMin, priceMax, beds, baths } = req.query;

  // Build dynamic WHERE clause parts
  let query = 'SELECT * FROM listings';
  const queryParams = [];
  const filters = [];

  // Filter by city (case-insensitive)
  if (city) {
    filters.push(`"City" ILIKE $${queryParams.length + 1}`);
    queryParams.push(`%${city}%`);
  }

  // Filter by minimum price (assuming your table has a "Price" column)
  if (priceMin) {
    filters.push(`"Price" >= $${queryParams.length + 1}`);
    queryParams.push(priceMin);
  }

  // Filter by maximum price
  if (priceMax) {
    filters.push(`"Price" <= $${queryParams.length + 1}`);
    queryParams.push(priceMax);
  }

  // Filter by number of beds (assuming a "Beds" column)
  if (beds) {
    filters.push(`"Beds" = $${queryParams.length + 1}`);
    queryParams.push(beds);
  }

  // Filter by number of baths (assuming a "Baths" column)
  if (baths) {
    filters.push(`"Baths" = $${queryParams.length + 1}`);
    queryParams.push(baths);
  }

  // Append filters if any exist
  if (filters.length > 0) {
    query += ' WHERE ' + filters.join(' AND ');
  }

  // Add an ORDER BY clause to ensure a consistent, full-table search before pagination.
  // Adjust "ListingId" to a column that makes sense for your data (like a timestamp or primary key).
  query += ' ORDER BY "ListingId" ASC';

  // If "all=true" is specified, bypass pagination (useful for testing full searches)
  if (all && all.toLowerCase() === 'true') {
    try {
      const result = await pool.query(query, queryParams);
      return res.json(result.rows);
    } catch (error) {
      console.error('Error fetching all listings:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
  }

  // Otherwise, apply pagination
  const numericLimit = Number(limit) || 100;
  const numericPage = Number(page) || 1;
  const offset = (numericPage - 1) * numericLimit;

  // Append pagination clauses; note that parameter indexes follow any filtering parameters
  query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(numericLimit, offset);

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// GET a single listing by ID/Key
exports.getListingById = async (req, res) => {
  const listingParam = req.params.id; // Matches either "ListingKey" or "ListingId"
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