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
};

export default nextConfig;
