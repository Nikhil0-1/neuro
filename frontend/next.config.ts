import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/neuro",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
