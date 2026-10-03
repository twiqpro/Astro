import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    NEXT_PUBLIC_CASHFREE_ENV: process.env.CASHFREE_ENV || "sandbox",
  },
};

export default nextConfig;
