import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.buildkind.tech" }],
        destination: "https://buildkind.tech/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.buildkind.tech" }],
        destination: "https://buildkind.tech/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
