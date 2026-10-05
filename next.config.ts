import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "vgpu"],
};

export default nextConfig;
