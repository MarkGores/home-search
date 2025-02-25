"use client";

import React, { useState } from "react";

// Updated to match the final approach with min/max for bedrooms/bathrooms
export type SearchCriteria = {
  searchQuery: string;
  priceMin: string;
  priceMax: string;
  bedroomsMin: string;
  bedroomsMax: string;
  bathroomsMin: string;
  bathroomsMax: string;
  yearBuilt?: string;
  propertyType?: string;
};

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  // Basic fields
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  // Range search fields for bedrooms and bathrooms
  const [bedroomsMin, setBedroomsMin] = useState("");
  const [bedroomsMax, setBedroomsMax] = useState("");
  const [bathroomsMin, setBathroomsMin] = useState("");
  const [bathroomsMax, setBathroomsMax] = useState("");
  // Additional advanced fields
  const [yearBuilt, setYearBuilt] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Toggle for advanced search section
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchQuery,
      priceMin,
      priceMax,
      bedroomsMin,
      bedroomsMax,
      bathroomsMin,
      bathroomsMax,
      yearBuilt,
      propertyType,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-white bg-opacity-90 p-4 rounded shadow-md"
    >
      {/* Basic Search Query */}
      <div className="flex flex-col md:flex-row md:space-x-3 mb-4">
        <input
          type="text"
          placeholder="Enter city or street..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 w-full md:w-72 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-gray-800 !important"
        />
      </div>

      {/* Price Fields */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="p-2 w-36 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-gray-800 !important"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="p-2 w-36 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-gray-800 !important"
        />
      </div>

      {/* Bedrooms & Bathrooms Range Fields */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <input
          type="number"
          placeholder="Bedrooms Min"
          value={bedroomsMin}
          onChange={(e) => setBedroomsMin(e.target.value)}
          className="p-2 w-28 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-gray-800 !important"
        />
        <input
          type="number"
          placeholder="Bedrooms Max"
          value={bedroomsMax}
          onChange={(e) => setBedroomsMax(e.target.value)}
          className="p-2 w-28 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-gray-800 !important"
        />
        <input
          type="number"
          placeholder="Bathrooms Min"
          value={bathroomsMin}
          onChange={(e) => setBathroomsMin(e.target.value)}
          className="p-2 w-28 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-gray-800 !important"
        />
        <input
          type="number"
          placeholder="Bathrooms Max"
          value={bathroomsMax}
          onChange={(e) => setBathroomsMax(e.target.value)}
          className="p-2 w-28 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-gray-800 !important"
        />
      </div>

      {/* Advanced Search Toggle */}
      <div className="text-center mb-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="underline text-blue-600"
        >
          {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
      </div>

      {showAdvanced && (
        <div className="border border-gray-300 rounded p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Advanced Search Options</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <input
              type="number"
              placeholder="Year Built (min)"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              className="p-2 w-36 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                         placeholder-gray-400 text-gray-800 !important"
            />
            <input
              type="text"
              placeholder="Property Type (e.g., Single Family)"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="p-2 w-72 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                         placeholder-gray-400 text-gray-800 !important"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center mt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;