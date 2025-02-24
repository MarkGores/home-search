"use client";

import { useState } from "react";
import Link from "next/link";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

type SearchType = "listings" | "solds";

export default function Home() {
  // Track search type state: Listings vs. Solds
  const [searchType, setSearchType] = useState<SearchType>("listings");

  // Main search state and advanced search fields
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  // Additional fields for sold search
  const [addressForSold, setAddressForSold] = useState("");
  const [mileageRadius, setMileageRadius] = useState("");

  // Listings state and UI feedback
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform the search locally (placeholder for now)
  const handleSearch = async () => {
    if (
      !searchQuery.trim() &&
      !priceMin.trim() &&
      !priceMax.trim() &&
      !bedrooms.trim() &&
      !bathrooms.trim() &&
      (searchType === "solds" && !addressForSold.trim() && !mileageRadius.trim())
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (searchType === "listings") {
        const res = await fetch("http://localhost:3001/api/listings");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const filtered = data.filter((listing: any) => {
          let matchesBasic = true;
          if (searchQuery.trim()) {
            matchesBasic =
              (listing.City &&
                listing.City.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (listing.StreetName &&
                listing.StreetName.toLowerCase().includes(searchQuery.toLowerCase()));
          }
          let matchesAdvanced = true;
          if (priceMin.trim()) {
            matchesAdvanced = matchesAdvanced && listing.ListPrice >= Number(priceMin);
          }
          if (priceMax.trim()) {
            matchesAdvanced = matchesAdvanced && listing.ListPrice <= Number(priceMax);
          }
          if (bedrooms.trim()) {
            matchesAdvanced = matchesAdvanced && listing.BedroomsTotal >= Number(bedrooms);
          }
          if (bathrooms.trim()) {
            matchesAdvanced =
              matchesAdvanced && listing.BathroomsTotalInteger >= Number(bathrooms);
          }
          return matchesBasic && matchesAdvanced;
        });
        setListings(filtered);
      } else if (searchType === "solds") {
        // For solds, since we don't have live data, we'll return an empty array (or a placeholder)
        setListings([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Main content wrapper */}
      <div className="p-5 flex-1">
        {/* Search Type Toggle */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setSearchType("listings")}
            className={`px-4 py-2 rounded ${
              searchType === "listings" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setSearchType("solds")}
            className={`px-4 py-2 rounded ${
              searchType === "solds" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            Solds
          </button>
        </div>

        {/* Hero Section and Search Form */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold">Welcome to ListingsAndSolds.com</h1>
          <p className="mt-2 text-lg">Search for properties and comparable solds.</p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center space-y-4">
            <div className="flex flex-col sm:flex-row sm:space-x-3">
              <input
                type="text"
                placeholder="Enter city or street..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-3 w-72 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchType === "solds" && (
                <>
                  <input
                    type="text"
                    placeholder="Address for Sold Search..."
                    value={addressForSold}
                    onChange={(e) => setAddressForSold(e.target.value)}
                    className="p-3 w-72 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 sm:mt-0"
                  />
                  <input
                    type="number"
                    placeholder="Mileage Radius (miles)"
                    value={mileageRadius}
                    onChange={(e) => setMileageRadius(e.target.value)}
                    className="p-3 w-72 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 sm:mt-0"
                  />
                </>
              )}
            </div>

            {/* Advanced Search Options */}
            <div className="flex flex-wrap justify-center gap-3">
              <input
                type="number"
                placeholder="Min Price"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="p-2 w-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="p-2 w-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="p-2 w-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="p-2 w-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </header>

        {/* Search Results */}
        {loading && <p className="text-center">Loading listings...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {listings.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing, index) => {
              const key = listing.ListingKey || listing.ListingId || index;
              return (
                <li key={key} className="bg-white border rounded p-4">
                 
                    <ListingCard listing={listing} />
                  
                </li>
              );
            })}
          </ul>
        ) : (
          !loading &&
          (searchQuery.trim() ||
            priceMin ||
            priceMax ||
            bedrooms ||
            bathrooms ||
            (searchType === "solds" && (addressForSold || mileageRadius))) && (
            <p className="text-center">
              No listings found. Please adjust your search criteria.
            </p>
          )
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}