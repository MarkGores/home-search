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

      const filtered = data.filter((listing: any) => {
        let matches = true;

        // 1. Search query filtering (City or StreetName)
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
          matches = matches && listing.BedroomsTotal >= Number(criteria.bedroomsMin);
        }
        if (criteria.bedroomsMax) {
          matches = matches && listing.BedroomsTotal <= Number(criteria.bedroomsMax);
        }

        // 4. Bathrooms range filtering
        if (criteria.bathroomsMin) {
          matches =
            matches && listing.BathroomsTotalInteger >= Number(criteria.bathroomsMin);
        }
        if (criteria.bathroomsMax) {
          matches =
            matches && listing.BathroomsTotalInteger <= Number(criteria.bathroomsMax);
        }

        // 5. Year Built filtering
        if (criteria.yearBuilt) {
          matches =
            matches &&
            listing.YearBuilt &&
            listing.YearBuilt >= Number(criteria.yearBuilt);
        }

        // 6. Property Type filtering
        if (criteria.propertyType) {
          const typeQuery = criteria.propertyType.toLowerCase();
          matches =
            matches &&
            listing.PropertyType &&
            listing.PropertyType.toLowerCase().includes(typeQuery);
        }

        // 7. Living Area filtering (in square feet)
        if (criteria.livingAreaMin) {
          matches =
            matches &&
            listing.LivingArea &&
            listing.LivingArea >= Number(criteria.livingAreaMin);
        }
        if (criteria.livingAreaMax) {
          matches =
            matches &&
            listing.LivingArea &&
            listing.LivingArea <= Number(criteria.livingAreaMax);
        }

        // 8. Lot Size filtering (unit-based)
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

        // 9. Days on Market filtering
        if (criteria.daysOnMarketMin) {
          matches =
            matches &&
            listing.DaysOnMarket &&
            listing.DaysOnMarket >= Number(criteria.daysOnMarketMin);
        }
        if (criteria.daysOnMarketMax) {
          matches =
            matches &&
            listing.DaysOnMarket &&
            listing.DaysOnMarket <= Number(criteria.daysOnMarketMax);
        }

        // 10. Property Sub-Type filtering
        if (criteria.propertySubType) {
          const subTypeQuery = criteria.propertySubType.toLowerCase();
          matches =
            matches &&
            listing.PropertySubType &&
            listing.PropertySubType.toLowerCase().includes(subTypeQuery);
        }

        // 11. County filtering
        if (criteria.county) {
          const countyQuery = criteria.county.toLowerCase();
          matches =
            matches &&
            listing.CountyOrParish &&
            listing.CountyOrParish.toLowerCase().includes(countyQuery);
        }

        // 12. Postal Code filtering
        if (criteria.postalCode) {
          matches =
            matches &&
            listing.PostalCode &&
            listing.PostalCode.toString().includes(criteria.postalCode);
        }

        // 13. Amenities filtering (from NST_AmenitiesUnit, comma-separated)
        if (criteria.amenities) {
          const desiredAmenities = criteria.amenities
            .split(",")
            .map((s) => s.trim().toLowerCase());
          if (listing.NST_AmenitiesUnit) {
            const listingAmenities = listing.NST_AmenitiesUnit.toLowerCase();
            desiredAmenities.forEach((amenity) => {
              matches = matches && listingAmenities.includes(amenity);
            });
          } else {
            matches = false;
          }
        }

        // 14. Waterfront filtering
        if (criteria.waterfrontOnly) {
          matches = matches && listing.WaterfrontYN === true;
        }

        // 15. Exclude Association (HOA) filtering
        if (criteria.noAssociation) {
          matches = matches && listing.AssociationYN === false;
        }

        // 16. Exclude Land Lease filtering
        if (criteria.noLandLease) {
          matches = matches && listing.LandLeaseYN === false;
        }

        // 17. Appliances filtering
        if (criteria.appliances) {
          const desiredAppliances = criteria.appliances
            .split(",")
            .map((s) => s.trim().toLowerCase());
          if (Array.isArray(listing.Appliances)) {
            desiredAppliances.forEach((app) => {
              matches =
                matches &&
                listing.Appliances.some(
                  (a: string) => a.toLowerCase().includes(app)
                );
            });
          } else {
            matches = false;
          }
        }

        // 18. Cooling filtering
        if (criteria.cooling) {
          const coolQuery = criteria.cooling.toLowerCase();
          if (Array.isArray(listing.Cooling)) {
            matches =
              matches &&
              listing.Cooling.some((c: string) => c.toLowerCase().includes(coolQuery));
          } else {
            matches = false;
          }
        }

        // 19. Heating filtering
        if (criteria.heating) {
          const heatQuery = criteria.heating.toLowerCase();
          if (Array.isArray(listing.Heating)) {
            matches =
              matches &&
              listing.Heating.some((h: string) => h.toLowerCase().includes(heatQuery));
          } else {
            matches = false;
          }
        }

        // 20. Garage Spaces filtering
        if (criteria.garageSpaces) {
          matches =
            matches &&
            listing.GarageSpaces &&
            listing.GarageSpaces >= Number(criteria.garageSpaces);
        }

        // 21. Lot Features filtering
        if (criteria.lotFeatures) {
          const desiredFeatures = criteria.lotFeatures
            .split(",")
            .map((s) => s.trim().toLowerCase());
          if (Array.isArray(listing.LotFeatures)) {
            desiredFeatures.forEach((feat) => {
              matches =
                matches &&
                listing.LotFeatures.some(
                  (f: string) => f.toLowerCase().includes(feat)
                );
            });
          } else {
            matches = false;
          }
        }

        // 22. Public Remarks text search
        if (criteria.remarksQuery) {
          const remarksQuery = criteria.remarksQuery.toLowerCase();
          matches =
            matches &&
            listing.PublicRemarks &&
            listing.PublicRemarks.toLowerCase().includes(remarksQuery);
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
    <div className="flex flex-col min-h-[125vh] font-sans">
      {/* Hero Section */}
      <div
        className="relative w-full min-h-[90vh] overflow-y-auto bg-center bg-cover flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 text-center text-white p-4 max-w-6xl mx-auto">
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