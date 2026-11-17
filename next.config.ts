import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
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
