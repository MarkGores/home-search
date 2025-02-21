const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON body parsing middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

// GET all listings endpoint
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
  });
});

// GET single listing by id endpoint
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

// POST /api/contact endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message, property } = req.body;
  console.log("Contact form data received:", req.body);
  // Here you could integrate Nodemailer, SendGrid, or another service to send an email
  // For now, we just return a success response
  res.json({ success: true, message: 'Contact form submitted successfully' });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));