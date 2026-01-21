import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "inmobiliaria-web3.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
