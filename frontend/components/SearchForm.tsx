"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "../types/Listing";

export type SearchCriteria = {
  // Basic
  searchQuery: string;
  priceMin: string;
  priceMax: string;
  bedroomsMin: string;
  bedroomsMax: string;
  bathroomsMin: string;
  bathroomsMax: string;
  // Group: Property Info
  propertyType?: string;
  propertySubType?: string;
  yearBuilt?: string;
  livingAreaMin?: string;
  livingAreaMax?: string;
  lotSizeMin?: string;
  lotSizeMax?: string;
  lotSizeUnit?: "acres" | "sqft";
  daysOnMarketMin?: string;
  daysOnMarketMax?: string;
  // Group: Location
  county?: string;
  postalCode?: string;
  waterfrontOnly?: boolean;
  // Group: Features
  amenities?: string;
  noAssociation?: boolean;
  noLandLease?: boolean;
  appliances?: string;
  cooling?: string;
  heating?: string;
  garageSpaces?: string;
  lotFeatures?: string;
  remarksQuery?: string;
};

const SearchForm: React.FC = () => {
  // BASIC
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedroomsMin, setBedroomsMin] = useState("");
  const [bedroomsMax, setBedroomsMax] = useState("");
  const [bathroomsMin, setBathroomsMin] = useState("");
  const [bathroomsMax, setBathroomsMax] = useState("");

  // PROPERTY INFO
  const [propertyType, setPropertyType] = useState("");
  const [propertySubType, setPropertySubType] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [livingAreaMin, setLivingAreaMin] = useState("");
  const [livingAreaMax, setLivingAreaMax] = useState("");
  const [lotSizeMin, setLotSizeMin] = useState("");
  const [lotSizeMax, setLotSizeMax] = useState("");
  const [lotSizeUnit, setLotSizeUnit] = useState<"acres" | "sqft">("acres");
  const [daysOnMarketMin, setDaysOnMarketMin] = useState("");
  const [daysOnMarketMax, setDaysOnMarketMax] = useState("");

  // LOCATION
  const [county, setCounty] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [waterfrontOnly, setWaterfrontOnly] = useState(false);

  // FEATURES
  const [amenities, setAmenities] = useState("");
  const [noAssociation, setNoAssociation] = useState(false);
  const [noLandLease, setNoLandLease] = useState(false);
  const [appliances, setAppliances] = useState("");
  const [cooling, setCooling] = useState("");
  const [heating, setHeating] = useState("");
  const [garageSpaces, setGarageSpaces] = useState("");
  const [lotFeatures, setLotFeatures] = useState("");
  const [remarksQuery, setRemarksQuery] = useState("");

  // Collapsible sections
  const [showPropertyInfo, setShowPropertyInfo] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchQuery) params.set("searchQuery", searchQuery);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    if (bedroomsMin) params.set("bedroomsMin", bedroomsMin);
    if (bedroomsMax) params.set("bedroomsMax", bedroomsMax);
    if (bathroomsMin) params.set("bathroomsMin", bathroomsMin);
    if (bathroomsMax) params.set("bathroomsMax", bathroomsMax);

    if (propertyType) params.set("propertyType", propertyType);
    if (propertySubType) params.set("propertySubType", propertySubType);
    if (yearBuilt) params.set("yearBuilt", yearBuilt);
    if (livingAreaMin) params.set("livingAreaMin", livingAreaMin);
    if (livingAreaMax) params.set("livingAreaMax", livingAreaMax);
    if (lotSizeMin) params.set("lotSizeMin", lotSizeMin);
    if (lotSizeMax) params.set("lotSizeMax", lotSizeMax);
    params.set("lotSizeUnit", lotSizeUnit);
    if (daysOnMarketMin) params.set("daysOnMarketMin", daysOnMarketMin);
    if (daysOnMarketMax) params.set("daysOnMarketMax", daysOnMarketMax);

    if (county) params.set("county", county);
    if (postalCode) params.set("postalCode", postalCode);
    if (waterfrontOnly) params.set("waterfrontOnly", "true");

    if (amenities) params.set("amenities", amenities);
    if (noAssociation) params.set("noAssociation", "true");
    if (noLandLease) params.set("noLandLease", "true");
    if (appliances) params.set("appliances", appliances);
    if (cooling) params.set("cooling", cooling);
    if (heating) params.set("heating", heating);
    if (garageSpaces) params.set("garageSpaces", garageSpaces);
    if (lotFeatures) params.set("lotFeatures", lotFeatures);
    if (remarksQuery) params.set("remarksQuery", remarksQuery);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-white bg-opacity-90 p-4 rounded shadow-md w-full max-w-6xl mx-auto"
    >
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-center mb-4">
        Find Your Perfect Home
      </h2>

      {/* BASIC SEARCH ROW */}
      <div className="flex flex-col md:flex-row md:space-x-3 mb-4">
        <input
          type="text"
          placeholder="City or Street (e.g., Minneapolis, 123 Main St)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800 mb-3 md:mb-0"
        />
      </div>

      {/* PRICE, BEDS & BATHS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <input
          type="number"
          placeholder="Min Price (e.g., 100000)"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
        />
        <input
          type="number"
          placeholder="Max Price (e.g., 500000)"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
        />
        <input
          type="number"
          placeholder="Min Beds"
          value={bedroomsMin}
          onChange={(e) => setBedroomsMin(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
        />
        <input
          type="number"
          placeholder="Max Beds"
          value={bedroomsMax}
          onChange={(e) => setBedroomsMax(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
        />
        <input
          type="number"
          placeholder="Min Baths"
          value={bathroomsMin}
          onChange={(e) => setBathroomsMin(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
        />
        <input
          type="number"
          placeholder="Max Baths"
          value={bathroomsMax}
          onChange={(e) => setBathroomsMax(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
        />
      </div>

      {/* COLLAPSIBLE SECTION TOGGLES */}
      <div className="space-x-4 text-center mb-4">
        <button
          type="button"
          onClick={() => setShowPropertyInfo(!showPropertyInfo)}
          className="underline text-blue-600"
        >
          {showPropertyInfo ? "Hide Property Info" : "Show Property Info"}
        </button>
        <button
          type="button"
          onClick={() => setShowLocation(!showLocation)}
          className="underline text-blue-600"
        >
          {showLocation ? "Hide Location" : "Show Location"}
        </button>
        <button
          type="button"
          onClick={() => setShowFeatures(!showFeatures)}
          className="underline text-blue-600"
        >
          {showFeatures ? "Hide Features" : "Show Features"}
        </button>
      </div>

      {/* PROPERTY INFO SECTION */}
      {showPropertyInfo && (
        <div className="border border-gray-300 rounded p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Property Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="">Any</option>
                <option value="single family">Single Family</option>
                <option value="townhouse">Townhouse</option>
                <option value="condo">Condo</option>
                <option value="multi-family">Multi-Family</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Property Sub-Type
              </label>
              <input
                type="text"
                placeholder="e.g., Acreage, Cabin"
                value={propertySubType}
                onChange={(e) => setPropertySubType(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Min Year Built
              </label>
              <input
                type="number"
                placeholder="e.g., 1990"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Living Area (sq ft) - Min
              </label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={livingAreaMin}
                onChange={(e) => setLivingAreaMin(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Living Area (sq ft) - Max
              </label>
              <input
                type="number"
                placeholder="e.g., 3000"
                value={livingAreaMax}
                onChange={(e) => setLivingAreaMax(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Lot Size (Min)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="e.g., 0.25"
                  value={lotSizeMin}
                  onChange={(e) => setLotSizeMin(e.target.value)}
                  className="p-2 w-24 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
                />
                <select
                  value={lotSizeUnit}
                  onChange={(e) =>
                    setLotSizeUnit(e.target.value as "acres" | "sqft")
                  }
                  className="p-2 w-24 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="acres">Acres</option>
                  <option value="sqft">Sq Ft</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Lot Size (Max)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="e.g., 1"
                  value={lotSizeMax}
                  onChange={(e) => setLotSizeMax(e.target.value)}
                  className="p-2 w-24 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
                />
                <select
                  value={lotSizeUnit}
                  onChange={(e) =>
                    setLotSizeUnit(e.target.value as "acres" | "sqft")
                  }
                  className="p-2 w-24 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="acres">Acres</option>
                  <option value="sqft">Sq Ft</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Days on Market (Min)
              </label>
              <input
                type="number"
                placeholder="e.g., 7"
                value={daysOnMarketMin}
                onChange={(e) => setDaysOnMarketMin(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Days on Market (Max)
              </label>
              <input
                type="number"
                placeholder="e.g., 30"
                value={daysOnMarketMax}
                onChange={(e) => setDaysOnMarketMax(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* LOCATION SECTION */}
      {showLocation && (
        <div className="border border-gray-300 rounded p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                County
              </label>
              <input
                type="text"
                placeholder="e.g., Hennepin"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="e.g., 55401"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="waterfrontOnly"
                checked={waterfrontOnly}
                onChange={(e) => setWaterfrontOnly(e.target.checked)}
                className="h-4 w-4"
              />
              <label
                htmlFor="waterfrontOnly"
                className="ml-2 text-gray-800 font-medium"
              >
                Waterfront Only
              </label>
            </div>
          </div>
        </div>
      )}

      {/* FEATURES SECTION */}
      {showFeatures && (
        <div className="border border-gray-300 rounded p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Features & Additional Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Hardwood Floors, Kitchen Island"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="noAssociation"
                checked={noAssociation}
                onChange={(e) => setNoAssociation(e.target.checked)}
                className="h-4 w-4"
              />
              <label
                htmlFor="noAssociation"
                className="ml-2 text-gray-800 font-medium"
              >
                Exclude HOA
              </label>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="noLandLease"
                checked={noLandLease}
                onChange={(e) => setNoLandLease(e.target.checked)}
                className="h-4 w-4"
              />
              <label
                htmlFor="noLandLease"
                className="ml-2 text-gray-800 font-medium"
              >
                Exclude Land Lease
              </label>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Appliances (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Dishwasher, Microwave"
                value={appliances}
                onChange={(e) => setAppliances(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Cooling
              </label>
              <select
                value={cooling}
                onChange={(e) => setCooling(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="">Any</option>
                <option value="central air">Central Air</option>
                <option value="window unit">Window Unit</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Heating
              </label>
              <select
                value={heating}
                onChange={(e) => setHeating(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="">Any</option>
                <option value="forced air">Forced Air</option>
                <option value="boiler">Boiler</option>
                <option value="radiant">Radiant</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Min Garage Spaces
              </label>
              <input
                type="number"
                placeholder="e.g., 2"
                value={garageSpaces}
                onChange={(e) => setGarageSpaces(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Lot Features (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Tree Coverage, Corner Lot"
                value={lotFeatures}
                onChange={(e) => setLotFeatures(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-gray-700 font-medium">
                Search in Remarks (keyword)
              </label>
              <input
                type="text"
                placeholder="e.g., 'Newly renovated' or 'Riverfront'"
                value={remarksQuery}
                onChange={(e) => setRemarksQuery(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="text-center mt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;