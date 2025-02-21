"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Simple component to display the brokerage name
function BrokerInfo({ brokerageName }: { brokerageName: string }) {
  return (
    <div className="mt-2 font-bold text-lg text-gray-800">
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
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching listing details");
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Error fetching listing:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading listing details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listing) return <p>Listing not found</p>;

  // Construct the full address string
  const address = `${listing.StreetNumber || ""} ${listing.StreetName || ""} ${listing.StreetSuffix || ""}`.trim();
  const price = listing.ListPrice || "N/A";
  const city = listing.City || "Unknown City";
  const photos = listing.Media || [];

  return (
    <div className="p-5 font-sans">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">
        &larr; Back to listings
      </button>
      <h1 className="text-2xl font-bold">{address || "No Address Provided"}</h1>
      <p className="text-lg">{city} — ${price}</p>
      {listing.ListOfficeName && <BrokerInfo brokerageName={listing.ListOfficeName} />}

      {/* Photo Carousel */}
      {photos.length > 0 ? (
        <>
          <Swiper
            modules={[Thumbs, Navigation, Pagination]}
            thumbs={{ swiper: thumbsSwiper }}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            className="mt-4"
          >
            {photos.map((photo: any, index: number) => (
              <SwiperSlide key={photo.MediaKey || index}>
                <img
                  src={photo.MediaURL}
                  alt={`Photo ${index + 1} of ${address}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Thumbnails (only if more than one photo exists) */}
          {photos.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              className="mt-2"
            >
              {photos.map((photo: any, index: number) => (
                <SwiperSlide key={`thumb-${photo.MediaKey || index}`}>
                  <img
                    src={photo.MediaURL}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      ) : (
        <p className="mt-4">No photos available</p>
      )}

      {/* Additional Property Details */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Property Details</h2>
        <ul className="list-disc pl-5">
          {listing.BedroomsTotal && <li>{listing.BedroomsTotal} Bedrooms</li>}
          {listing.BathroomsTotalInteger && <li>{listing.BathroomsTotalInteger} Bathrooms</li>}
          {listing.LivingArea && <li>{listing.LivingArea} sq ft living area</li>}
          {listing.LotSizeArea && <li>Lot Size: {listing.LotSizeArea} acres</li>}
          {/* Add any additional fields as needed */}
        </ul>
      </div>

      <p className="mt-4">{listing.PublicRemarks || "No description available"}</p>
    </div>
  );
}