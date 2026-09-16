import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR: "1",
  },
};

export default nextConfig;
