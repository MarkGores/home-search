// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import modular routes
const listingsRoutes = require('./routes/listings');
const contactRoutes = require('./routes/contact');

app.use('/api/listings', listingsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

// Instead of app.listen(), export the app:
module.exports = app;