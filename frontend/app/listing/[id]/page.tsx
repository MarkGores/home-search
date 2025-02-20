"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

function BrokerInfo({ brokerageName }: { brokerageName: string; }) {
  return (
    <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
      {brokerageName}
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching listing details');
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching listing:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading listing details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listing) return <p>Listing not found</p>;

  const address = `${listing.StreetNumber || ''} ${listing.StreetName || ''} ${listing.StreetSuffix || ''}`.trim();
  const price = listing.ListPrice || 'N/A';
  const city = listing.City || 'Unknown City';
  const photos = listing.Media || [];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px' }}>
        &larr; Back to listings
      </button>
      <h1>{address || 'No Address Provided'}</h1>
      <p>
        {city} — ${price}
      </p>
      {listing.ListOfficeName && <BrokerInfo brokerageName={listing.ListOfficeName} />}
      <div style={{ marginTop: '20px' }}>
        {photos.length > 0 ? (
          photos.map((photo: any, index: number) => (
            <img
              key={`${photo.MediaKey || index}`}
              src={photo.MediaURL}
              alt={`Photo ${index + 1} of ${address}`}
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
            />
          ))
        ) : (
          <p>No photos available</p>
        )}
      </div>
      <p>{listing.PublicRemarks || 'No description available'}</p>
      {/* Additional property details can be added here */}
    </div>
  );
}