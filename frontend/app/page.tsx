"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  // State for basic search
  const [searchQuery, setSearchQuery] = useState('');
  // Advanced search criteria state
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  
  // State for listings and feedback
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all listings and then filter them based on the criteria
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
      const res = await fetch('http://localhost:3001/api/listings');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      // Filter listings based on both basic and advanced criteria
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
          // Assuming the JSON field for bedroom count is "BedroomsTotal"
          matchesAdvanced = matchesAdvanced && listing.BedroomsTotal >= Number(bedrooms);
        }
        if (bathrooms.trim()) {
          // Assuming the JSON field for bathroom count is "BathroomsTotalInteger"
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Hero Section */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Welcome to Home Search</h1>
        <p>Find your next home quickly and easily.</p>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Enter city or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px',
              width: '300px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#0070f3',
              color: '#fff',
            }}
          >
            Search
          </button>
        </form>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}
            style={{
              padding: '8px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: '1px solid #0070f3',
              backgroundColor: advancedSearchVisible ? '#0070f3' : '#fff',
              color: advancedSearchVisible ? '#fff' : '#0070f3',
            }}
          >
            {advancedSearchVisible ? 'Hide Advanced Search' : 'Show Advanced Search'}
          </button>
        </div>
        {advancedSearchVisible && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                placeholder="Min Price"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={{
                  padding: '8px',
                  width: '120px',
                  fontSize: '0.9rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{
                  padding: '8px',
                  width: '120px',
                  fontSize: '0.9rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                style={{
                  padding: '8px',
                  width: '120px',
                  fontSize: '0.9rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              />
              <input
                type="number"
                placeholder="Bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                style={{
                  padding: '8px',
                  width: '120px',
                  fontSize: '0.9rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Search Results */}
      {loading && <p>Loading listings...</p>}
      {error && <p>Error: {error}</p>}
      {listings.length > 0 ? (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {listings.map((listing, index) => {
            const address = `${listing.StreetNumber || ''} ${listing.StreetName || ''} ${listing.StreetSuffix || ''}`.trim();
            const price = listing.ListPrice || 'N/A';
            const city = listing.City || 'Unknown City';
            const imageUrl =
              listing.Media && listing.Media.length > 0
                ? listing.Media[0].MediaURL
                : null;
            const key = `${(listing.ListingId || listing.ListingKey) ?? 'listing'}-${index}`;

            return (
              <li
                key={key}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  padding: '10px',
                  backgroundColor: '#fff'
                }}
              >
                <Link href={`/listing/${listing.ListingKey || listing.ListingId}`}>
                  <div style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                    <div style={{
                      height: '120px',
                      width: '100%',
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={address}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 5px' }}>{address || 'No Address Provided'}</h3>
                    <p style={{ fontSize: '0.9rem', margin: '0' }}>{city} — ${price}</p>
                    {/* Display the listing broker info */}
                    {listing.ListOfficeName && (
                      <p style={{ fontSize: '0.8rem', margin: '5px 0 0', color: '#555' }}>
                        {listing.ListOfficeName}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        !loading && (
          <p style={{ textAlign: 'center' }}>
            {(searchQuery.trim() ||
              priceMin ||
              priceMax ||
              bedrooms ||
              bathrooms)
              ? "No listings found. Please adjust your search criteria."
              : "Please enter your search criteria above."}
          </p>
        )
      )}
    </div>
  );
}