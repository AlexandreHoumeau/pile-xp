import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ hostname: "*" }] },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
