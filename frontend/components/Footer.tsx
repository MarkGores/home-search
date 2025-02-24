// frontend/components/Footer.tsx
import React from 'react';
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    
    <footer className="bg-white border-t py-2 px-3 flex flex-col md:flex-row md:justify-between md:items-start text-sm">
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
        The data relating to real estate for sale on this web site comes in part from the Broker Reciprocity Program of the Regional Multiple Listing Service of Minnesota, Inc. Real estate listings held by brokerage firms other than RE/MAX Advantage Plus - Savage are marked with the Broker Reciprocity logo or the Broker Reciprocity thumbnail logo (little black house) and detailed information about them includes the name of the listing brokers.
      </p>
      <p className="mt-2">
        The broker providing these data believes them to be correct, but advises interested parties to confirm them before relying on them in a purchase decision. © 2025 Regional Multiple Listing Service of Minnesota, Inc. All rights reserved.
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
        The Digital Millennium Copyright Act of 1998, 17 U.S.C. 512 (the "DMCA"), provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law. If you believe in good faith that any content or material made available in connection with our website or services infringes your copyright, you (or your agent) may send us a notice requesting that the content or material be removed, or access to it blocked. Notices and counter-notices should be sent in writing by mail to Michael Bisping, Director, Customer Relations, Regional Multiple Listing Service of Minnesota, Inc, 2550 University Avenue West, Suite 259S Saint Paul, MN 55114 or by email to mbisping@northstarmls.com. Questions can be directed by phone to 651-251-3200.
      </p>
    </div>
  </footer>
  );
};

export default Footer;