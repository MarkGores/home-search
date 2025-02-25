"use client";

import React, { useState } from "react";

export type SearchCriteria = {
  searchQuery: string;
  priceMin: string;
  priceMax: string;
  bedrooms: string;
  bathrooms: string;
  // You can add more fields (addressForSold, mileageRadius, etc.) as needed.
};

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ searchQuery, priceMin, priceMax, bedrooms, bathrooms });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white bg-opacity-90 p-4 rounded shadow-md">
      <div className="flex flex-col md:flex-row md:space-x-3 mb-4">
        <input
          type="text"
          placeholder="Enter city or street..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 w-full md:w-72 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <select
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="p-2 w-36 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        >
          <option value="">Min Price</option>
          <option value="50000">$50k</option>
          <option value="100000">$100k</option>
          <option value="200000">$200k</option>
          <option value="300000">$300k</option>
          <option value="400000">$400k</option>
          <option value="500000">$500k</option>
          <option value="1000000">$1M+</option>
        </select>

        <select
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="p-2 w-36 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        >
          <option value="">Max Price</option>
          <option value="100000">$100k</option>
          <option value="200000">$200k</option>
          <option value="300000">$300k</option>
          <option value="400000">$400k</option>
          <option value="500000">$500k</option>
          <option value="1000000">$1M+</option>
          <option value="2000000">$2M+</option>
        </select>

        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="p-2 w-28 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        >
          <option value="">Beds</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>

        <select
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className="p-2 w-28 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        >
          <option value="">Baths</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

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