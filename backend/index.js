// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware: Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Import modular routes
const listingsRoutes = require('./routes/listings');
const contactRoutes = require('./routes/contact');

// Use the routes for the respective endpoints
app.use('/api/listings', listingsRoutes);
app.use('/api/contact', contactRoutes);

// Root endpoint for basic server status check
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});