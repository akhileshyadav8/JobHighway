import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR: "1",
  },
  async redirects() {
    return [
      {
        source: '/jobs',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
