"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {

  // Basic search state
  const [searchQuery, setSearchQuery] = useState("");
  // Advanced search states
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  // Listings and feedback
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings from backend and filter based on criteria
  const handleSearch = async () => {
    // Only search if at least one criterion is provided
    if (
      !searchQuery.trim() &&
      !priceMin.trim() &&
      !priceMax.trim() &&
      !bedrooms.trim() &&
      !bathrooms.trim()
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/listings");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
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
          // Assuming "BedroomsTotal" is the JSON field for bedroom count
          matchesAdvanced = matchesAdvanced && listing.BedroomsTotal >= Number(bedrooms);
        }
        if (bathrooms.trim()) {
          // Assuming "BathroomsTotalInteger" is the JSON field for bathroom count
          matchesAdvanced = matchesAdvanced && listing.BathroomsTotalInteger >= Number(bathrooms);
        }
        return matchesBasic && matchesAdvanced;
      });
      setListings(filtered);
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
      {/* Hero Section */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to Home Search</h1>
        <p className="mt-2 text-lg">Find your next home quickly and easily.</p>
        <form onSubmit={handleSubmit} className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Enter city or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 w-72 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-3 px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
        <button
          onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}
          className={`mt-4 px-4 py-2 rounded border ${
            advancedSearchVisible
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          } transition`}
        >
          {advancedSearchVisible ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
        {advancedSearchVisible && (
          <div className="mt-4 flex flex-col items-center space-y-3">
            <div className="flex space-x-3">
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
            </div>
            <div className="flex space-x-3">
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
          </div>
        )}
      </header>

      {/* Search Results */}
      {loading && <p>Loading listings...</p>}
      {error && <p>Error: {error}</p>}
      {listings.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing, index) => {
            const address = `${listing.StreetNumber || ""} ${listing.StreetName || ""} ${listing.StreetSuffix || ""}`.trim();
            const price = listing.ListPrice || "N/A";
            const city = listing.City || "Unknown City";
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
                          alt={address}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <p className="text-sm text-center">No image available</p>
                      )}
                    </div>
                    <h3 className="text-base font-semibold mb-1">
                      {address || "No Address Provided"}
                    </h3>
                    <p className="text-sm mb-1">{city} — ${price}</p>
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
            {searchQuery.trim() ||
            priceMin ||
            priceMax ||
            bedrooms ||
            bathrooms
              ? "No listings found. Please adjust your search criteria."
              : "Please enter your search criteria above."}
          </p>
        )
      )}
    </div>
  );
}