import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const canela = localFont({
  src: "../fonts/Canela-Medium-Trial.otf",
  weight: "500",
  style: "normal",
  variable: "--font-canela",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#f7f3ea",
};

export const metadata: Metadata = {
  title: "moolank — Handwritten kundli by a qualified astrologer",
  description:
    "Your kundli is drawn by hand and answered by hand. 100% of the work is done by a qualified, experienced astrologer. No AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${canela.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
