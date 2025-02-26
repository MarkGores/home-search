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

  // Cast criteria as Record<string, string>
  const criteria = useMemo(
    () => Object.fromEntries(searchParams.entries()) as Record<string, string>,
    [searchParams]
  );

  useEffect(() => {
    async function fetchAndFilter() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3001/api/listings");
        if (!res.ok) throw new Error("Network response was not ok");
        const data: Listing[] = await res.json();

        const filtered = data.filter((listing: Listing) => {
          let matches = true;

          // Search Query filtering
          if (criteria.searchQuery) {
            const query = criteria.searchQuery.toLowerCase();
            const cityMatch = listing.City
              ? listing.City.toLowerCase().includes(query)
              : false;
            const streetMatch = listing.StreetName
              ? listing.StreetName.toLowerCase().includes(query)
              : false;
            matches = matches && (cityMatch || streetMatch);
          }
          // Price filtering
          if (criteria.priceMin) {
            matches = matches && listing.ListPrice >= Number(criteria.priceMin);
          }
          if (criteria.priceMax) {
            matches = matches && listing.ListPrice <= Number(criteria.priceMax);
          }
          // Bedrooms filtering
          if (criteria.bedroomsMin) {
            matches = matches && ((listing.BedroomsTotal ?? 0) >= Number(criteria.bedroomsMin));
          }
          if (criteria.bedroomsMax) {
            matches = matches && ((listing.BedroomsTotal ?? 0) <= Number(criteria.bedroomsMax));
          }
          // Bathrooms filtering
          if (criteria.bathroomsMin) {
            matches = matches && ((listing.BathroomsTotalInteger ?? 0) >= Number(criteria.bathroomsMin));
          }
          if (criteria.bathroomsMax) {
            matches = matches && ((listing.BathroomsTotalInteger ?? 0) <= Number(criteria.bathroomsMax));
          }
          // Lot size filtering
          if (criteria.lotSizeMin) {
            if (criteria.lotSizeUnit === "sqft") {
              matches =
                matches &&
                (listing.LotSizeSquareFeet !== undefined
                  ? Number(listing.LotSizeSquareFeet) >= Number(criteria.lotSizeMin)
                  : false);
            } else {
              matches =
                matches &&
                (listing.LotSizeArea !== undefined
                  ? Number(listing.LotSizeArea) >= Number(criteria.lotSizeMin)
                  : false);
            }
          }
          if (criteria.lotSizeMax) {
            if (criteria.lotSizeUnit === "sqft") {
              matches =
                matches &&
                (listing.LotSizeSquareFeet !== undefined
                  ? Number(listing.LotSizeSquareFeet) <= Number(criteria.lotSizeMax)
                  : false);
            } else {
              matches =
                matches &&
                (listing.LotSizeArea !== undefined
                  ? Number(listing.LotSizeArea) <= Number(criteria.lotSizeMax)
                  : false);
            }
          }
          // Waterfront filtering
          if (criteria.waterfrontOnly === "true") {
            matches = matches && (listing.WaterfrontYN === true);
          }

          return matches;
        });

        setListings(filtered);
      } catch (err) {
        const errorObj = err as Error;
        setError(errorObj.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFilter();
  }, [criteria]);

  // Sorting logic
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
        sorted.sort((a, b) => (a.BedroomsTotal ?? 0) - (b.BedroomsTotal ?? 0));
        break;
      case "bedsDesc":
        sorted.sort((a, b) => (b.BedroomsTotal ?? 0) - (a.BedroomsTotal ?? 0));
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