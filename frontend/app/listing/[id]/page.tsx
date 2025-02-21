"use client";

import Link from "next/link";
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

  // Process key details
  const address = `${listing.StreetNumber || ""} ${listing.StreetName || ""} ${listing.StreetSuffix || ""}`.trim();
  const price = listing.ListPrice ? `$${Number(listing.ListPrice).toLocaleString()}` : "N/A";
  const city = listing.City || "Unknown City";
  const status = listing.StandardStatus || "Unknown Status";
  const rawMLS = listing.ListingId || listing.ListingKey || "N/A";
  // Remove the "NST" prefix (case-insensitive)
  const mlsNumber = rawMLS !== "N/A" ? rawMLS.replace(/^NST/i, "") : "N/A";
  const beds = listing.BedroomsTotal || "N/A";
  const baths = listing.BathroomsTotalInteger || "N/A";
  const sqFt = listing.LivingArea || "N/A";
  const style = listing.PropertySubType || "N/A";
  const remarks = listing.PublicRemarks || "No description available.";
  const photos = listing.Media || [];

  // Additional details - add fields as available
  const additionalDetails = [
    { label: "MLS#", value: mlsNumber },
    { label: "Status", value: status },
    { label: "Bedrooms", value: beds },
    { label: "Bathrooms", value: baths },
    { label: "Living Area", value: sqFt },
    { label: "Style", value: style },
    { label: "Lot Size", value: listing.LotSizeArea ? `${listing.LotSizeArea} acres` : "N/A" },
    { label: "Year Built", value: listing.YearBuilt || "N/A" },
  ];


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

      {/* Top Key Listing Details */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{address || "No Address Provided"}</h1>
        <p className="text-xl text-blue-600 font-semibold">{price}</p>
        <p className="text-lg">{status}</p>
      </div>

      {/* Detail Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {additionalDetails.map((detail, index) => (
          <div key={index}>
            <p className="font-bold">{detail.label}:</p>
            <p>{detail.value}</p>
          </div>
        ))}
      </div>

      {/* Description / Remarks */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Description / Remarks</h2>
        <p>{remarks}</p>
      </div>

      {/* Broker Reciprocity Statement */}
      <div className="mb-6 flex items-center">
        <img
          src="/images/broker-reciprocity-logo.png"
          alt="Broker Reciprocity Logo"
          className="h-6 w-6 mr-2"
        />
        <p className="text-sm">
          This listing courtesy of {listing.ListOfficeName || "Unknown Broker"}.
        </p>
      </div>
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
      {/* Footer (Same as Main Page) */}
      <footer className="bg-white border-t py-2 px-3 flex flex-col md:flex-row md:justify-between md:items-start text-sm mt-auto">
        {/* Left: Branding & Agent Info */}
        <div className="md:w-1/5 mb-2 md:mb-0 md:pr-4 flex flex-col items-center md:items-start">
          <img
            src="/images/remax-logo.png"
            alt="RE/MAX Advantage Plus"
            className="mb-2 h-12 object-contain"
          />
          <p className="font-bold">RE/MAX Advantage Plus - Savage</p>
          <p>Mark Gores</p>
          <p>Agent Licensed 20486494</p>
          <p>Phone: 612-201-5447</p>
        </div>
        {/* Right: Scrollable Disclaimer */}
        <div className="md:w-4/5 border rounded py-2 px-3 max-h-32 overflow-y-auto">
          <p className="font-bold">MLS® Disclaimer</p>
          <p className="flex items-center mt-1">
            <img
              src="/images/broker-reciprocity-logo.png"
              alt="Broker Reciprocity Logo"
              className="inline-block h-8 w-8 mr-2"
            />
            The data relating to real estate for sale on this web site comes in part from the
            Broker Reciprocity Program of the Regional Multiple Listing Service of Minnesota, Inc. Real estate listings held by brokerage firms other than RE/MAX Advantage Plus - Savage are marked with the Broker Reciprocity logo or the Broker Reciprocity thumbnail logo (little black house) and detailed information about them includes the name of the listing brokers.
          </p>
          <p className="mt-2">
            The broker providing these data believes them to be correct, but advises interested parties
            to confirm them before relying on them in a purchase decision. © 2025 Regional Multiple Listing Service of Minnesota, Inc. All rights reserved.
          </p>
          <p className="mt-2">
            By searching, you agree to the{" "}
            <Link
              href="/license"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              End User License Agreement
            </Link>.
          </p>
          <p className="mt-2 font-bold">
            Digital Millennium Copyright Act (DMCA) Notice
          </p>
          <p className="mt-1">
            The Digital Millennium Copyright Act of 1998, 17 U.S.C. 512 (the "DMCA"), provides recourse
            for copyright owners who believe that material appearing on the Internet infringes their rights
            under U.S. copyright law. If you believe in good faith that any content or material made available
            in connection with our website or services infringes your copyright, you (or your agent) may send
            us a notice requesting that the content or material be removed, or access to it blocked. Notices
            and counter-notices should be sent in writing by mail to Michael Bisping, Director, Customer
            Relations, Regional Multiple Listing Service of Minnesota, Inc, 2550 University Avenue West,
            Suite 259S Saint Paul, MN 55114 or by email to mbisping@northstarmls.com. Questions can be directed
            by phone to 651-251-3200.
          </p>
        </div>
      </footer>
    </div>
  );
}