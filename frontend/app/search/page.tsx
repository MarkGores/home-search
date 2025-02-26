"use client";

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import SearchResultsContent from "../../components/SearchResultsContent";
import Footer from "../../components/Footer";

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsContent />
      <Footer />
    </Suspense>
  );
}