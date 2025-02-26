"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../../../components/Footer";
import { Listing, MediaItem } from "../../../types/Listing";

function BrokerInfo({ brokerageName }: { brokerageName: string }) {
  return (
    <div className="mt-2 font-bold text-lg text-gray-800">{brokerageName}</div>
  );
}

const lastDataUploadTimestamp = "2025-02-21 12:00 PM";

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Contact Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactMessage, setContactMessage] = useState<string>("");

  const [showAllDetails, setShowAllDetails] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("No listing id provided.");
      setLoading(false);
      return;
    }
    // Use environment variable for API URL; defaults to localhost if not set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const url = `${apiUrl}/api/listings/${id}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching listing details");
        }
        return res.json();
      })
      .then((data: Listing) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    const propertyDetails = {
      listingId: listing.ListingId || listing.ListingKey,
      address: `${listing.StreetNumber || ""} ${listing.StreetName || ""} ${listing.StreetSuffix || ""}`.trim(),
      city: listing.City || "Unknown City",
      price: listing.ListPrice || "N/A",
    };
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          property: propertyDetails,
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
  const price = listing.ListPrice ? `${Number(listing.ListPrice).toLocaleString()}` : "N/A";
  const city = listing.City || "Unknown City";
  const status = listing.StandardStatus || "Unknown Status";
  const rawMLS = listing.ListingId || listing.ListingKey || "N/A";
  const mlsNumber = rawMLS !== "N/A" ? rawMLS.replace(/^NST/i, "") : "N/A";
  const beds = listing.BedroomsTotal || "N/A";
  const baths = listing.BathroomsTotalInteger || "N/A";
  const sqFt = listing.LivingArea || "N/A";
  const style = listing.PropertySubType || "N/A";
  const remarks = listing.PublicRemarks || "No description available.";
  const photos: MediaItem[] = listing.Media || [];

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
            {photos.map((photo, index) => (
              <SwiperSlide key={photo.MediaKey || index}>
                <Image
                  src={photo.MediaURL}
                  alt={`Photo ${index + 1} of ${address}`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority={index === 0}
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
              {photos.map((photo, index) => (
                <SwiperSlide key={`thumb-${photo.MediaKey || index}`}>
                  <Image
                    src={photo.MediaURL}
                    alt={`Thumbnail ${index + 1}`}
                    width={150}
                    height={80}
                    className="w-full h-20 object-cover"
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
        <p className="text-xl text-blue-600 font-semibold">${price}</p>
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

      {/* Description / Remarks with "See all details"  */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Description / Remarks</h2>
        <p>{remarks}</p>
        <button
          onClick={() => setShowAllDetails(!showAllDetails)}
          className="text-blue-600 underline cursor-pointer mt-2 block"
        >
          See all details
        </button>
      </div>

      {/* Additional Listing Details (Expanded Section) */}
      {showAllDetails && (
        <div className="mb-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Additional Listing Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold">Lot Size</p>
              <p>{listing.LotSizeArea ? `${listing.LotSizeArea} ${listing.LotSizeUnits || "acres"}` : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Agent Owner</p>
              <p>{listing.NST_AgentOwner || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Amenities</p>
              <p>{listing.NST_AmenitiesUnit || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Appliances</p>
              <p>{listing.Appliances ? listing.Appliances.join(", ") : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Association</p>
              <p>{listing.AssociationYN ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="font-bold">Association Fee</p>
              <p>{listing.AssociationFee ? `$${listing.AssociationFee} ${listing.AssociationFeeFrequency ? `(${listing.AssociationFeeFrequency})` : ""}` : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Cooling</p>
              <p>{listing.Cooling ? listing.Cooling.join(", ") : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Fireplace</p>
              <p>{listing.FireplaceYN ? `Yes (${listing.FireplaceFeatures ? listing.FireplaceFeatures.join(", ") : "N/A"})` : "No"}</p>
            </div>
            <div>
              <p className="font-bold">Bedrooms</p>
              <p>{listing.BedroomsTotal || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Bathrooms</p>
              <p>{listing.BathroomsTotalInteger || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Property Type</p>
              <p>{listing.PropertyType || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Construction Materials</p>
              <p>{listing.ConstructionMaterials ? listing.ConstructionMaterials.join(", ") : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Foundation Area</p>
              <p>{listing.FoundationArea ? `${listing.FoundationArea} sqft` : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Heating</p>
              <p>{listing.Heating ? listing.Heating.join(", ") : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Days on Market</p>
              <p>{listing.DaysOnMarket || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Directions</p>
              <p>{listing.Directions || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Garage Spaces</p>
              <p>{listing.GarageSpaces || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Postal Code</p>
              <p>{listing.PostalCode || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Year Built</p>
              <p>{listing.YearBuilt || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Tax Annual Amount</p>
              <p>{listing.TaxAnnualAmount ? `$${listing.TaxAnnualAmount}` : "N/A"}</p>
            </div>
            <div>
              <p className="font-bold">Roof</p>
              <p>{listing.Roof ? listing.Roof.join(", ") : "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Broker Reciprocity Statement */}
      <div className="mb-6 flex items-center">
        <Image
          src="/images/broker-reciprocity-logo.png"
          alt="Broker Reciprocity Logo"
          width={24}
          height={24}
          className="mr-2"
        />
        <p className="text-sm">
          This listing courtesy of {listing.ListOfficeName || "Unknown Broker"}.
        </p>
      </div>

      {/* Contact Me Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="mt-2 mb-10 px-8 py-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Contact Mark
      </button>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full z-10">
            <h2 className="text-xl font-bold mb-4">Contact Mark</h2>
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

      {/* Disclaimer Block with Timestamp */}
      <div className="mt-8 p-4 border-t border-gray-300 text-sm">
        <div className="flex items-center mb-2">
          <Image
            src="/images/northstar-logo.png"
            alt="NorthstarMLS Logo"
            width={24}
            height={24}
            className="mr-2"
          />
          <span>
            Based on information submitted to the MLS GRID as of {lastDataUploadTimestamp}.
          </span>
        </div>
        <p>
          All data is obtained from various sources and may not have been verified by broker or MLS GRID. Supplied Open House Information is subject to change without notice. All information should be independently reviewed and verified for accuracy. Properties may or may not be listed by the office/agent presenting the information. Some IDX listings have been excluded from this website.
        </p>
      </div>

      <Footer />
    </div>
  );
}