import path from "path";
import type { NextConfig } from "next";

function getAppUrlHostname(): string | null {
  const raw = process.env.APP_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch {
    return null;
  }
}

const appUrlHost = getAppUrlHostname();

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "**.run.app",
    "**.googleusercontent.com",
    "**.google.com",
    "127.0.0.1",
    ...(appUrlHost ? [appUrlHost] : []),
  ],
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
