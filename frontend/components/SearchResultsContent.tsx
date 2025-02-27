"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import ListingCard from "./ListingCard";
import { Listing } from "../types/Listing";

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("");

  // Convert URL search parameters to an object
  const criteria = useMemo(
    () => Object.fromEntries(searchParams.entries()) as Record<string, string>,
    [searchParams]
  );

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        // Create a copy of the criteria to send to the API
        const criteriaForAPI = { ...criteria };

        // Map "searchQuery" (from the search form) to "city" (for the backend)
        if (criteriaForAPI.searchQuery) {
          criteriaForAPI.city = criteriaForAPI.searchQuery;
          delete criteriaForAPI.searchQuery;
        }

        // Build the query string from the criteriaForAPI object
        const queryString = new URLSearchParams(criteriaForAPI).toString();

        // Use the online API endpoint (not localhost)
        const res = await fetch(
          "https://uhu9zhimrf.execute-api.us-east-2.amazonaws.com/dev/api/listings?" +
            queryString
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        // Expect the API to return the filtered and paginated data
        const data: Listing[] = await res.json();
        setListings(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [criteria]);

  // Sorting logic (client‑side sorting of the fetched data)
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
        sorted.sort(
          (a, b) => (a.BedroomsTotal ?? 0) - (b.BedroomsTotal ?? 0)
        );
        break;
      case "bedsDesc":
        sorted.sort(
          (a, b) => (b.BedroomsTotal ?? 0) - (a.BedroomsTotal ?? 0)
        );
        break;
      case "daysAsc":
        sorted.sort((a, b) => (a.DaysOnMarket ?? 0) - (b.DaysOnMarket ?? 0));
        break;
      case "daysDesc":
        sorted.sort((a, b) => (b.DaysOnMarket ?? 0) - (a.DaysOnMarket ?? 0));
        break;
      default:
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
    </div>
  );
}