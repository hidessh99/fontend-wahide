import type { NextConfig } from "next";

// Flexible & Permissive CSP (Mendukung VPS HTTP/HTTPS, WS/WSS, Vercel, & custom domains)
const cspHeader = `
  default-src 'self' https: http: data: blob:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http:;
  style-src 'self' 'unsafe-inline' https: http:;
  font-src 'self' https: http: data:;
  img-src 'self' data: blob: http: https:;
  connect-src 'self' http: https: ws: wss: data: blob:;
  frame-src 'self' https: http:;
  frame-ancestors 'self' *;
  object-src 'none';
  base-uri 'self';
  form-action 'self' http: https:;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "sonner", "date-fns", "zod", "recharts"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
