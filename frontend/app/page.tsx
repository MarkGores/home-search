"use client";

import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[125vh] font-sans">
      {/* Hero Section */}
      <div
        className="relative w-full min-h-[90vh] overflow-y-auto bg-center bg-cover flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 text-center text-white p-4 max-w-6xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
          >
            Discover Your Next Home — No Sign-Ups, No Spam
          </h1>
          <p
            className="mt-4 text-lg md:text-xl"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
          >
            Transparent MLS data, real-time listings, and honest property info.
          </p>
          {/* SearchForm Component */}
          <SearchForm />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}