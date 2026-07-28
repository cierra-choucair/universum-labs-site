import type { NextConfig } from "next";

const wordpressUrl = process.env.WORDPRESS_API_URL;

/**
 * Allow next/image to optimize featured images served by the headless
 * WordPress instance, when one is configured. No other remote images are
 * permitted.
 */
function wordpressImagePatterns() {
  if (!wordpressUrl) return [];
  try {
    const { protocol, hostname } = new URL(wordpressUrl);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: wordpressImagePatterns(),
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
