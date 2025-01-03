import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.moralis.io",
        port: "", // Leave empty if no port is used
        pathname: "/eth/**", // Adjust the path based on the pattern you need
      },
      {
        protocol: "https",
        hostname: "logo.moralis.io",
        port: "", // Leave empty if no port is used
        pathname: "/**", // Adjust the path based on the pattern you need
      },
    ],
  },
};

export default nextConfig;
