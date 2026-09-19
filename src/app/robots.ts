import { MetadataRoute } from "next";
import { env } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/blog",
          "/blog/*",
          "/docs",
          "/docs/*",
          "/privacy",
          "/terms",
          "/feed.xml",
          "/rss.xml",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/admin",
          "/admin/*",
          "/devices",
          "/devices/*",
          "/campaigns",
          "/campaigns/*",
          "/contacts",
          "/contacts/*",
          "/billing",
          "/billing/*",
          "/activities",
          "/activities/*",
          "/settings",
          "/settings/*",
          "/team",
          "/team/*",
          "/support",
          "/support/*",
          "/subscription",
          "/subscription/*",
          "/api",
          "/api/*",
          "/reset-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
