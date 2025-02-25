"use client";

import { useState } from "react";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import SearchForm, { SearchCriteria } from "../components/SearchForm";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all listings from the backend and filter by search criteria
  const handleSearch = async (criteria: SearchCriteria) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/listings");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      // Filter the data based on criteria provided
      const filtered = data.filter((listing: any) => {
        let matches = true;

        // 1. Search query filtering (checks City or StreetName)
        if (criteria.searchQuery) {
          const query = criteria.searchQuery.toLowerCase();
          matches =
            matches &&
            ((listing.City && listing.City.toLowerCase().includes(query)) ||
              (listing.StreetName &&
                listing.StreetName.toLowerCase().includes(query)));
        }

        // 2. Price filtering
        if (criteria.priceMin) {
          matches = matches && listing.ListPrice >= Number(criteria.priceMin);
        }
        if (criteria.priceMax) {
          matches = matches && listing.ListPrice <= Number(criteria.priceMax);
        }

        // 3. Bedrooms range filtering
        if (criteria.bedroomsMin) {
          matches =
            matches && listing.BedroomsTotal >= Number(criteria.bedroomsMin);
        }
        if (criteria.bedroomsMax) {
          matches =
            matches && listing.BedroomsTotal <= Number(criteria.bedroomsMax);
        }

        // 4. Bathrooms range filtering
        if (criteria.bathroomsMin) {
          matches =
            matches &&
            listing.BathroomsTotalInteger >= Number(criteria.bathroomsMin);
        }
        if (criteria.bathroomsMax) {
          matches =
            matches &&
            listing.BathroomsTotalInteger <= Number(criteria.bathroomsMax);
        }

        // 5. Year Built (min)
        if (criteria.yearBuilt) {
          // If your data has a YearBuilt field, ensure it’s numeric
          matches =
            matches &&
            listing.YearBuilt &&
            listing.YearBuilt >= Number(criteria.yearBuilt);
        }

        // 6. Property Type
        if (criteria.propertyType) {
          // Compare in lowercase to allow partial matches
          const propType = criteria.propertyType.toLowerCase();
          matches =
            matches &&
            listing.PropertySubType &&
            listing.PropertySubType.toLowerCase().includes(propType);
        }

        return matches;
      });

      setListings(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <div
        className="relative w-full h-[60vh] bg-center bg-cover flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 text-center text-white p-4 max-w-2xl">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
          >
            Discover Your Next Home — No Sign-Ups, No Spam
          </h1>
          <p
            className="mt-4 text-lg md:text-xl"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
          >
            Transparent MLS data, real-time listings, and honest property info.
          </p>
          {/* SearchForm Component */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content: Search Results */}
      <div className="flex-1 p-5">
        {loading && <p className="text-center">Loading listings...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {listings.length > 0 ? (
          <ul className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(325px,1fr))]">
            {listings.map((listing, index) => {
              const key = `${listing.ListingKey || listing.ListingId}-${index}`;
              return (
                <li key={key} className="bg-white border rounded p-4">
                  <ListingCard listing={listing} />
                </li>
              );
            })}
          </ul>
        ) : (
          !loading && (
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