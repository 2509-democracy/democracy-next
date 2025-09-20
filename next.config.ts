import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow CI/CD builds to proceed even if ESLint finds issues.
  // This skips the ESLint step during `next build`.
  eslint: {
    ignoreDuringBuilds: true,

  },
};

export default nextConfig;
