"use client";

import { useState } from "react";
import Link from "next/link";

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
                <div className="flex items-center">
                  <img
                    src="/images/broker-reciprocity-logo.png"
                    alt="Broker Reciprocity Logo"
                    className="h-6 w-6 mr-1"
                  />
                  <span className="text-xs text-gray-600">
                    {listing.ListOfficeName}
                  </span>
                </div>
              )}
            </div>
          </Link>
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
      <footer className="bg-white border-t py-2 px-3 flex flex-col md:flex-row md:justify-between md:items-start text-sm">
        {/* Left: Branding & Agent Info */}
        <div className="md:w-1/5 mb-2 md:mb-0 md:pr-4 flex flex-col items-center md:items-start">
          <img
            src="/images/remax-logo.png"
            alt="RE/MAX Advantage Plus"
            className="mb-2 h-12 object-contain"
          />
          <p className="font-bold">RE/MAX Advantage Plus - Savage</p>
          <p>Mark Gores</p>
          <p>Agent Licensed 20486494</p>
          <p>Phone: 612-201-5447</p>
        </div>

        {/* Right: Scrollable Disclaimer */}
        <div className="md:w-4/5 border rounded py-2 px-3 max-h-32 overflow-y-auto">
          <p className="font-bold">MLS® Disclaimer</p>
          <p className="flex items-center mt-1">
            <img
              src="/images/broker-reciprocity-logo.png"
              alt="Broker Reciprocity Logo"
              className="inline-block h-8 w-8 mr-2"
            />
            The data relating to real estate for sale on this web site comes in part from the Broker Reciprocity Program of the Regional Multiple Listing Service of Minnesota, Inc. Real estate listings held by brokerage firms other than RE/MAX Advantage Plus - Savage are marked with the Broker Reciprocity logo or the Broker Reciprocity thumbnail logo (little black house) and detailed information about them includes the name of the listing brokers.
          </p>
          <p className="mt-2">
            The broker providing these data believes them to be correct, but advises interested parties to confirm them before relying on them in a purchase decision. © 2025 Regional Multiple Listing Service of Minnesota, Inc. All rights reserved.
          </p>
          <p className="mt-2">
            By searching, you agree to the{" "}
            <Link
              href="/license"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              End User License Agreement
            </Link>.
          </p>
          <p className="mt-2 font-bold">
            Digital Millennium Copyright Act (DMCA) Notice
          </p>
          <p className="mt-1">
            The Digital Millennium Copyright Act of 1998, 17 U.S.C. 512 (the "DMCA"), provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law. If you believe in good faith that any content or material made available in connection with our website or services infringes your copyright, you (or your agent) may send us a notice requesting that the content or material be removed, or access to it blocked. Notices and counter-notices should be sent in writing by mail to Michael Bisping, Director, Customer Relations, Regional Multiple Listing Service of Minnesota, Inc, 2550 University Avenue West, Suite 259S Saint Paul, MN 55114 or by email to mbisping@northstarmls.com. Questions can be directed by phone to 651-251-3200.
          </p>
        </div>
      </footer>
    </div>
  );
}