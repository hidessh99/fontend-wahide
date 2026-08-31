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
          "/pricing",
          "/privacy",
          "/terms",
          "/tos",
          "/login",
          "/register",
          "/forgot-password",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/overview",
          "/overview/*",
          "/users",
          "/users/*",
          "/plans",
          "/plans/*",
          "/logs",
          "/logs/*",
          "/notifications",
          "/notifications/*",
          "/api/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/*",
          "/overview/*",
          "/users/*",
          "/plans/*",
          "/logs/*",
          "/notifications/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
