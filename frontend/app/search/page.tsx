"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import ListingCard from "../../components/ListingCard";
import Footer from "../../components/Footer";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("");

  // Memoize criteria so it doesn't change on every render
  const criteria = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  useEffect(() => {
    async function fetchAndFilter() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3001/api/listings");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const filtered = data.filter((listing: any) => {
          let matches = true;

          if (criteria.searchQuery) {
            const query = criteria.searchQuery.toLowerCase();
            matches =
              matches &&
              ((listing.City &&
                listing.City.toLowerCase().includes(query)) ||
                (listing.StreetName &&
                  listing.StreetName.toLowerCase().includes(query)));
          }
          if (criteria.priceMin) {
            matches = matches && listing.ListPrice >= Number(criteria.priceMin);
          }
          if (criteria.priceMax) {
            matches = matches && listing.ListPrice <= Number(criteria.priceMax);
          }
          if (criteria.bedroomsMin) {
            matches = matches && listing.BedroomsTotal >= Number(criteria.bedroomsMin);
          }
          if (criteria.bedroomsMax) {
            matches = matches && listing.BedroomsTotal <= Number(criteria.bedroomsMax);
          }
          if (criteria.bathroomsMin) {
            matches = matches && listing.BathroomsTotalInteger >= Number(criteria.bathroomsMin);
          }
          if (criteria.bathroomsMax) {
            matches = matches && listing.BathroomsTotalInteger <= Number(criteria.bathroomsMax);
          }
          // Example for lot size filtering
          if (criteria.lotSizeMin) {
            if (criteria.lotSizeUnit === "sqft") {
              matches =
                matches &&
                listing.LotSizeSquareFeet &&
                Number(listing.LotSizeSquareFeet) >= Number(criteria.lotSizeMin);
            } else {
              matches =
                matches &&
                listing.LotSizeArea &&
                Number(listing.LotSizeArea) >= Number(criteria.lotSizeMin);
            }
          }
          if (criteria.lotSizeMax) {
            if (criteria.lotSizeUnit === "sqft") {
              matches =
                matches &&
                listing.LotSizeSquareFeet &&
                Number(listing.LotSizeSquareFeet) <= Number(criteria.lotSizeMax);
            } else {
              matches =
                matches &&
                listing.LotSizeArea &&
                Number(listing.LotSizeArea) <= Number(criteria.lotSizeMax);
            }
          }
          // Continue with other filtering conditions...
          if (criteria.waterfrontOnly === "true") {
            matches = matches && listing.WaterfrontYN === true;
          }

          return matches;
        });

        setListings(filtered);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFilter();
  }, [criteria]);

  // Sorting: Create a sorted version of listings based on sortOption
  const sortedListings = useMemo(() => {
    const sorted = [...listings];
    switch (sortOption) {
      case "priceAsc":
        sorted.sort((a, b) => a.ListPrice - b.ListPrice);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.ListPrice - a.ListPrice);
        break;
      case "bedsAsc":
        sorted.sort((a, b) => a.BedroomsTotal - b.BedroomsTotal);
        break;
      case "bedsDesc":
        sorted.sort((a, b) => b.BedroomsTotal - a.BedroomsTotal);
        break;
      case "daysAsc":
        sorted.sort((a, b) => a.DaysOnMarket - b.DaysOnMarket);
        break;
      case "daysDesc":
        sorted.sort((a, b) => b.DaysOnMarket - a.DaysOnMarket);
        break;
      default:
        // No sorting
        break;
    }
    return sorted;
  }, [listings, sortOption]);

  return (
    <div className="min-h-screen font-sans">
      <h1 className="text-4xl font-bold text-center mt-4">Search Results</h1>
      
      {/* Sorting Dropdown */}
      <div className="text-center my-4">
        <label htmlFor="sort" className="mr-2 font-semibold">
          Sort By:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">No Sorting</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="bedsAsc">Bedrooms: Few to Many</option>
          <option value="bedsDesc">Bedrooms: Many to Few</option>
          <option value="daysAsc">Days on Market: Low to High</option>
          <option value="daysDesc">Days on Market: High to Low</option>
        </select>
      </div>
      
      {loading && <p className="text-center">Loading listings...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}
      {sortedListings.length > 0 ? (
        <ul className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(325px,1fr))] p-5">
          {sortedListings.map((listing, index) => {
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
      <Footer />
    </div>
  );
}