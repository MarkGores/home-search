"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Listing } from "../types/Listing";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Basic Swiper styles

interface ListingCardProps {
  listing: Listing;
}

// Simple inline Camera Icon for the photo count overlay
function CameraIcon() {
  return (
    <svg
      className="w-4 h-4 inline-block"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.115 7.21C6.303 6.483 6.94 6 7.699 6h.936c.335 0 .648-.167.83-.446l.588-.882A1 1 0 0111.14 4h1.72a1 1 0 01.83.446l.588.882c.182.279.495.446.83.446h.937c.759 0 1.396.483 1.584 1.21l.362 1.377A2 2 0 0118 10v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5c0-.876.58-1.629 1.392-1.89l.362-1.377zM10 12a2 2 0 104 0 2 2 0 00-4 0z"
      />
    </svg>
  );
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use ListingId for routing if it exists; otherwise fall back to ListingKey.
  const routeParam = listing.ListingId || listing.ListingKey;
  // For display, show ListingId (if available) without "NST"; otherwise show "N/A"
  const displayMLS = listing.ListingId ? listing.ListingId.replace(/^NST/i, "") : "N/A";

  // Build the address from available fields.
  const address = [listing.StreetNumber, listing.StreetName, listing.StreetSuffix]
    .filter(Boolean)
    .join(" ");
  const cityStateZip = [listing.City, listing.StateOrProvince, listing.PostalCode]
    .filter(Boolean)
    .join(", ");

  // Parse other listing details.
  const price = listing.ListPrice ? `$${listing.ListPrice.toLocaleString()}` : "N/A";
  const status = listing.StandardStatus || "Active";
  const beds = listing.BedroomsTotal ?? "N/A";
  const baths = listing.BathroomsTotalInteger ?? "N/A";
  const sqFt = listing.LivingArea ?? "N/A";
  const propertyType = listing.PropertySubType || "N/A";
  const brokerName = listing.ListOfficeName || "N/A";
  const photoCount = listing.Media?.length || 0;
  const bedLabel = beds === 1 ? "bed" : "beds";
  const bathLabel = baths === 1 ? "bath" : "baths";

  return (
    <div className="border rounded shadow p-4 relative flex flex-col">
      {/* Swipeable Photo Carousel */}
      {photoCount > 0 ? (
        <div className="relative">
          <Swiper
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            spaceBetween={0}
            slidesPerView={1}
          >
            {listing.Media?.map((mediaItem, idx) => (
              <SwiperSlide key={mediaItem.MediaKey || idx}>
                <img
                  src={mediaItem.MediaURL}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {photoCount > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              <CameraIcon /> {currentSlide + 1} of {photoCount}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No photos available</span>
        </div>
      )}

      {/* Property Information */}
      <div className="mt-3">
        <p className="text-xl font-bold">{price}</p>
        <p className="text-sm text-gray-600">
          {status} | MLS# {displayMLS}
        </p>
        <p className="text-sm mt-1">
          {address}
          {address && cityStateZip ? ", " : ""}
          {cityStateZip}
        </p>
        <p className="text-sm mt-1">
          {beds} {bedLabel}, {baths} {bathLabel}, {sqFt} sq ft | {propertyType}
        </p>

        {/* Full Details Link using the chosen ID */}
        <Link
          href={`/listing/${routeParam}`}
          className="text-blue-600 hover:underline text-sm mt-2 inline-block"
        >
          Full details
        </Link>
      </div>

      {/* Broker Reciprocity Statement */}
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
        <img
          src="/images/broker-reciprocity-logo.png"
          alt="Broker Reciprocity Logo"
          className="w-4 h-4"
        />
        <span>Courtesy of {brokerName}.</span>
      </div>
    </div>
  );
};

export default ListingCard;