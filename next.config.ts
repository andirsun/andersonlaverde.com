import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // YouTube serves video thumbnails from both hostnames
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "i2.ytimg.com", pathname: "/vi/**" },
    ],
  },
  async redirects() {
    // One canonical host: www duplicates the apex for Google otherwise.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.andersonlaverde.com" }],
        destination: "https://andersonlaverde.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
