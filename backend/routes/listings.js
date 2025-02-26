// backend/routes/listings.js
const express = require('express');
const router = express.Router();
const { getAllListings, getListingById } = require('../controllers/listingsController');

router.get('/', getAllListings);
router.get('/:id', getListingById);

module.exports = router;