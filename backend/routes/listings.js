// backend/routes/listings.js
const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController');

// Make sure these functions actually exist in listingsController
router.get('/', listingsController.getAllListings);
router.get('/:id', listingsController.getListingById);

module.exports = router;