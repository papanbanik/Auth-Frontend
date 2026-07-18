import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        // hostname: "localhost",
        hostname: "auth-backend-rho-self.vercel.app",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
