import type { NextConfig } from "next";

const staticAssetCacheHeader = {
  key: "Cache-Control",
  value: "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
};

// Alphadoc product illustrations use the product site's public icon registry.
// Every other client-side resource remains self-hosted. Next.js hydration and
// React style props require the two 'unsafe-inline' allowances. React
// additionally requires eval() in development mode only, never in production.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://alphadoc.ai",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [
      {
        source: "/global",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/global/",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/legal",
        destination: "/ko/legal",
        permanent: true,
      },
      {
        source: "/legal/",
        destination: "/ko/legal",
        permanent: true,
      },
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...["assets", "brand", "media"].map((directory) => ({
        source: `/${directory}/:path*`,
        headers: [staticAssetCacheHeader],
      })),
    ];
  },
};

export default nextConfig;
