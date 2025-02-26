// ingest.js
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function ingestListings() {
  // Configure your PostgreSQL connection using environment variables
  const pool = new Pool({
    host: process.env.PGHOST || 'database-1.c7s6ewq8sbmg.us-east-2.rds.amazonaws.com',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'YOUR_PASSWORD_HERE',
    database: process.env.PGDATABASE || 'postgres',
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Load the MLS JSON file (adjust the file path as needed)
    const filePath = path.join(__dirname, 'data', 'mls_listings.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const listings = JSON.parse(data);
    console.log(`Processing ${listings.length} listings`);

    // Iterate over each listing and insert or update it.
    for (const listing of listings) {
      const query = `
        INSERT INTO listings (
          listingkey, listingid, listprice, bedroomstotal, bathroomstotalinteger, 
          city, streetname, livingarea, lotsizearea, raw_data, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, CURRENT_TIMESTAMP
        )
        ON CONFLICT (listingkey) DO UPDATE SET 
          listingid = EXCLUDED.listingid,
          listprice = EXCLUDED.listprice,
          bedroomstotal = EXCLUDED.bedroomstotal,
          bathroomstotalinteger = EXCLUDED.bathroomstotalinteger,
          city = EXCLUDED.city,
          streetname = EXCLUDED.streetname,
          livingarea = EXCLUDED.livingarea,
          lotsizearea = EXCLUDED.lotsizearea,
          raw_data = EXCLUDED.raw_data,
          updated_at = CURRENT_TIMESTAMP;
      `;
      const values = [
        listing.ListingKey,
        listing.ListingId,
        listing.ListPrice,
        listing.BedroomsTotal,
        listing.BathroomsTotalInteger,
        listing.City,
        listing.StreetName,
        listing.LivingArea,
        listing.LotSizeArea,
        listing, // Store the entire listing as JSON in the raw_data column
      ];

      await pool.query(query, values);
    }
    console.log('Data ingestion complete.');
  } catch (error) {
    console.error('Error during ingestion:', error);
  } finally {
    await pool.end();
  }
}

ingestListings();