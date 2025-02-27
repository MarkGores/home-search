// backend/controllers/listingsController.js
const { Pool } = require('pg');

// Create a connection pool using your online database credentials
const pool = new Pool({
  host: process.env.PGHOST,         // e.g., database-1.c7s6ewq8sbmg.us-east-2.rds.amazonaws.com
  port: process.env.PGPORT,         // typically 5432
  user: process.env.PGUSER,         // e.g., postgres
  password: process.env.PGPASSWORD, // your password
  database: process.env.PGDATABASE, // e.g., postgres or your chosen DB name
  ssl: { rejectUnauthorized: false },
});

exports.getAllListings = async (req, res) => {
  // Extract query parameters from the request
  const {
    all,
    limit,
    page,
    city,
    priceMin,
    priceMax,
    bedroomsMin,
    bedroomsMax,
    bathroomsMin,
    bathroomsMax,
    lotSizeMin,
    lotSizeMax,
    lotSizeUnit,
    waterfrontOnly,
  } = req.query;

  // Start building the base query (we'll append WHERE clauses as needed)
  let baseQuery = 'FROM listings';
  const queryParams = [];
  const filters = [];

  // Filter by city (case-insensitive)
  if (city) {
    filters.push(`"City" ILIKE $${queryParams.length + 1}`);
    queryParams.push(`%${city}%`);
  }

  // Price filtering on "ListPrice"
  if (priceMin) {
    filters.push(`"ListPrice" >= $${queryParams.length + 1}`);
    queryParams.push(priceMin);
  }
  if (priceMax) {
    filters.push(`"ListPrice" <= $${queryParams.length + 1}`);
    queryParams.push(priceMax);
  }

  // Bedrooms filtering on "BedroomsTotal"
  if (bedroomsMin) {
    filters.push(`"BedroomsTotal" >= $${queryParams.length + 1}`);
    queryParams.push(bedroomsMin);
  }
  if (bedroomsMax) {
    filters.push(`"BedroomsTotal" <= $${queryParams.length + 1}`);
    queryParams.push(bedroomsMax);
  }

  // Bathrooms filtering on "BathroomsTotalInteger"
  if (bathroomsMin) {
    filters.push(`"BathroomsTotalInteger" >= $${queryParams.length + 1}`);
    queryParams.push(bathroomsMin);
  }
  if (bathroomsMax) {
    filters.push(`"BathroomsTotalInteger" <= $${queryParams.length + 1}`);
    queryParams.push(bathroomsMax);
  }

  // Lot size filtering: choose column based on lotSizeUnit
  if (lotSizeMin) {
    if (lotSizeUnit && lotSizeUnit.toLowerCase() === "sqft") {
      filters.push(`"LotSizeSquareFeet" >= $${queryParams.length + 1}`);
    } else {
      filters.push(`"LotSizeArea" >= $${queryParams.length + 1}`);
    }
    queryParams.push(lotSizeMin);
  }
  if (lotSizeMax) {
    if (lotSizeUnit && lotSizeUnit.toLowerCase() === "sqft") {
      filters.push(`"LotSizeSquareFeet" <= $${queryParams.length + 1}`);
    } else {
      filters.push(`"LotSizeArea" <= $${queryParams.length + 1}`);
    }
    queryParams.push(lotSizeMax);
  }

  // Waterfront filtering: if waterfrontOnly is "true", require WaterfrontYN to be true
  if (waterfrontOnly && waterfrontOnly.toLowerCase() === "true") {
    filters.push(`"WaterfrontYN" = true`);
  }

  // Append filters to the base query if any exist
  if (filters.length > 0) {
    baseQuery += ' WHERE ' + filters.join(' AND ');
  }

  // Define a consistent ORDER BY clause (adjust "ListingId" if needed)
  const orderByClause = ' ORDER BY "ListingId" ASC';

  // First, get a count of total matching records
  const countQuery = 'SELECT COUNT(*) ' + baseQuery;
  let totalCount;
  try {
    const countResult = await pool.query(countQuery, queryParams);
    totalCount = parseInt(countResult.rows[0].count, 10);
  } catch (error) {
    console.error('Error fetching count:', error);
    return res.status(500).json({ error: 'Database query failed' });
  }

  // If "all=true" is specified, bypass pagination and return all matches
  if (all && all.toLowerCase() === 'true') {
    const fullQuery = 'SELECT * ' + baseQuery + orderByClause;
    try {
      const result = await pool.query(fullQuery, queryParams);
      return res.json({ listings: result.rows, totalCount });
    } catch (error) {
      console.error('Error fetching all listings:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
  }

  // Otherwise, apply pagination
  const numericLimit = Number(limit) || 100;
  const numericPage = Number(page) || 1;
  const offset = (numericPage - 1) * numericLimit;
  const paginatedQuery =
    'SELECT * ' +
    baseQuery +
    orderByClause +
    ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  const paginatedParams = [...queryParams, numericLimit, offset];

  try {
    const result = await pool.query(paginatedQuery, paginatedParams);
    return res.json({ listings: result.rows, totalCount });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return res.status(500).json({ error: 'Database query failed' });
  }
};

exports.getListingById = async (req, res) => {
  const listingParam = req.params.id;
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
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return res.status(500).json({ error: 'Database query failed' });
  }
};