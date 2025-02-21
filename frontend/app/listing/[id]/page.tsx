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
  
  // State for Contact Modal
  const [showModal, setShowModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Gather property details to include with the contact submission
    const propertyDetails = {
      listingId: listing.ListingId || listing.ListingKey,
      address: `${listing.StreetNumber || ""} ${listing.StreetName || ""} ${listing.StreetSuffix || ""}`.trim(),
      city: listing.City || "Unknown City",
      price: listing.ListPrice || "N/A",
    };
  
    try {
      const res = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          property: propertyDetails, // <-- Added property details
        }),
      });
      const result = await res.json();
      if (result.success) {
        console.log("Email sent successfully!");
      } else {
        console.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error submitting contact form", error);
    }
    setShowModal(false);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  if (loading) return <p>Loading listing details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listing) return <p>Listing not found</p>;

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
      
      {/* Photo Carousel with Thumbnails */}
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
        </ul>
      </div>

      <p className="mt-4">{listing.PublicRemarks || "No description available"}</p>

      {/* Contact Me Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Contact Mark
      </button>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal backdrop */}
          <div 
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          {/* Modal content */}
          <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full z-10">
            <h2 className="text-xl font-bold mb-4">Contact Me</h2>
            <form onSubmit={handleContactSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1" htmlFor="message">
                  Message
                </label>
                <textarea 
                  id="message" 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}