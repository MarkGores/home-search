const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

app.get('/api/listings', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'mls_listings.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading MLS data:', err);
      return res.status(500).json({ error: 'Unable to read listings data' });
    }
    try {
      const listings = JSON.parse(data);
      res.json(listings);
    } catch (parseError) {
      console.error('Error parsing MLS JSON:', parseError);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  // Add this below your existing endpoints in backend/index.js
app.get('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  const dataPath = path.join(__dirname, 'data', 'mls_listings.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading MLS data:', err);
      return res.status(500).json({ error: 'Unable to read listings data' });
    }
    try {
      const listings = JSON.parse(data);
      // Find the listing by matching ListingId or ListingKey
      const listing = listings.find(item => 
        item.ListingId === listingId || item.ListingKey === listingId
      );
      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.json(listing);
    } catch (parseError) {
      console.error('Error parsing MLS JSON:', parseError);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));