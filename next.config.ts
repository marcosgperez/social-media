import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
