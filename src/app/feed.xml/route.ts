import { NextResponse } from "next/server";
import { env } from "@/lib/config/env";
import { contentApi, DEFAULT_POSTS } from "@/modules/content/api/content.api";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";
  const buildDate = new Date().toUTCString();

  let posts = DEFAULT_POSTS;
  try {
    const fetched = await contentApi.getPosts();
    if (fetched && fetched.length > 0) {
      posts = fetched;
    }
  } catch {
    posts = DEFAULT_POSTS;
  }

  const itemsXml = posts
    .map((post) => {
      const tagsXml = (post.tags || [])
        .map((tag) => `<category><![CDATA[${tag}]]></category>`)
        .join("");

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.content.slice(0, 200)}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>team@wahide.id (${post.author || "Wahide Core Team"})</author>
      ${tagsXml}
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wahide - Solusi Otomasi Bisnis &amp; WhatsApp Gateway</title>
    <link>${baseUrl}</link>
    <description>Artikel tutorial, keamanan WhatsApp API, panduan broadcast cerdas anti-ban, dan otomasi bisnis.</description>
    <language>id-ID</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
