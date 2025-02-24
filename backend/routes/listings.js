// backend/routes/listings.js
const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController');

router.get('/', listingsController.getAllListings);
router.get('/:id', listingsController.getListingById);

module.exports = router;