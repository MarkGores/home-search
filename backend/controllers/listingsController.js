// backend/controllers/listingsController.js
const listingsData = require('../data/mls_listings.json');

exports.getAllListings = (req, res) => {
  res.json(listingsData);
};

exports.getListingById = (req, res) => {
  const id = req.params.id;
  const listing = listingsData.find((item) => item.ListingKey === id);
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).json({ message: 'Listing not found' });
  }
};