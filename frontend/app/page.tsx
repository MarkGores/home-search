"use client";

import { useState } from "react";
import Link from "next/link";

type SearchType = "listings" | "solds";

export default function Home() {
  // Track whether user has agreed to the license
  const [licenseAgreed, setLicenseAgreed] = useState(false);

  // Search type state: Listings vs. Solds
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

  const handleSearch = async () => {
    // Only search if at least one criterion is provided.
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

        // Filter local listings
        const filtered = data.filter((listing: any) => {
          // Basic search: by city or street name
          let matchesBasic = true;
          if (searchQuery.trim()) {
            matchesBasic =
              (listing.City &&
                listing.City.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (listing.StreetName &&
                listing.StreetName.toLowerCase().includes(searchQuery.toLowerCase()));
          }

          // Advanced filters
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
        // For solds, since we don't have live data, return an empty array (or a placeholder)
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
    <div className="p-5 font-sans">
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
          {/* Basic and Sold-Specific Fields */}
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

          {/* Checkbox for License Agreement */}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="licenseAgree"
              checked={licenseAgreed}
              onChange={(e) => setLicenseAgreed(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="licenseAgree" className="text-sm">
              I have read and agree to the{" "}
              <Link 
                href="/license" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 underline"
              >
                terms of the license agreement
              </Link>
              .
            </label>          
            </div>

          <button
            type="submit"
            disabled={!licenseAgreed}
            className={`mt-4 px-4 py-3 rounded transition ${
              licenseAgreed
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
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
            const addr = `${listing.StreetNumber || ""} ${listing.StreetName || ""} ${listing.StreetSuffix || ""}`.trim();
            const priceVal = listing.ListPrice || "N/A";
            const cityVal = listing.City || "Unknown City";
            const imageUrl =
              listing.Media && listing.Media.length > 0
                ? listing.Media[0].MediaURL
                : null;
            const key = `${(listing.ListingId || listing.ListingKey) ?? "listing"}-${index}`;

            return (
              <li key={key} className="border rounded overflow-hidden bg-white p-4">
                <Link href={`/listing/${listing.ListingKey || listing.ListingId}`}>
                  <div className="cursor-pointer">
                    <div className="h-32 w-full overflow-hidden flex justify-center items-center mb-2">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={addr}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <p className="text-sm text-center">No image available</p>
                      )}
                    </div>
                    <h3 className="text-base font-semibold mb-1">
                      {addr || "No Address Provided"}
                    </h3>
                    <p className="text-sm mb-1">
                      {cityVal} — ${priceVal}
                    </p>
                    {listing.ListOfficeName && (
                      <p className="text-xs text-gray-600">{listing.ListOfficeName}</p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        !loading && (
          <p className="text-center">
            {(searchQuery.trim() ||
              priceMin ||
              priceMax ||
              bedrooms ||
              bathrooms ||
              (searchType === "solds" && (addressForSold || mileageRadius)))
              ? "No listings found. Please adjust your search criteria."
              : "Please enter your search criteria above."}
          </p>
        )
      )}
    </div>
  );
}