import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['ufs.sh'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
        port: ''
      }
    ]
  }
};

export default nextConfig;
