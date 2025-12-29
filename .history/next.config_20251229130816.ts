import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*", // Cuando el frontend pida /api/v1...
        destination: "https://inmobiliaria-web3.onrender.com/api/v1/:path*", // Next.js lo manda aquí
      },
    ];
  },
};

export default nextConfig;
