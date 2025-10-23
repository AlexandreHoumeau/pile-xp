const nextConfig = {
  images: { remotePatterns: [{ hostname: "*" }] },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or '20mb' if you expect large photos
    },
  },

};

export default nextConfig;
