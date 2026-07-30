import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["10.62.80.207", "172.17.0.4"],
};

export default nextConfig;
