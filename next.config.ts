import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/storybook/:path*',
        destination: 'https://tu-storybook-url.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
