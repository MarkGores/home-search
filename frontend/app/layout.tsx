import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load the Inter font, which has a modern, clean look
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ListingsAndSolds.com",
  description: "A no-frills real estate search site with real MLS data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}