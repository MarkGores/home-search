// frontend/pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/listings')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Property Listings</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {listings.map((listing) => (
          <li key={listing.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h2>{listing.address}</h2>
            <p>
              {listing.city} — ${listing.price}
            </p>
            <img src={listing.image} alt={listing.address} style={{ maxWidth: '100%', height: 'auto' }} />
          </li>
        ))}
      </ul>
    </div>
  );
}