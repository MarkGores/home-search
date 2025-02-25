// backend/controllers/listingsController.js
const listingsData = require('../data/mls_listings.json');

exports.getAllListings = (req, res) => {
  res.json(listingsData);
};

exports.getListingById = (req, res) => {
  const id = req.params.id.trim(); // Ensure no extra spaces
  const listing = listingsData.find((item) => {
    // Trim values in case there is extra whitespace in the JSON
    const key = item.ListingKey ? item.ListingKey.trim() : "";
    const listingId = item.ListingId ? item.ListingId.trim() : "";
    return key === id || listingId === id;
  });
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).json({ message: 'Listing not found' });
  }
};