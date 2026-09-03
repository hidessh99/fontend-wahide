import type { Metadata } from "next";
import { BlogPostView } from "@/components/public/BlogPostView";
import { contentApi } from "@/modules/content/api/content.api";
import { env } from "@/lib/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await contentApi.getPostBySlug(slug);

  const title = post
    ? post.title
    : slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const description = post
    ? post.excerpt
    : "Artikel dan panduan teknis resmi Wahide Enterprise WhatsApp Gateway.";

  const siteUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";

  return {
    title,
    description,
    keywords: post?.tags,
    authors: post ? [{ name: post.author }] : undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post?.publishedAt,
      authors: post ? [post.author] : undefined,
      tags: post?.tags,
      images: [
        {
          url: `${siteUrl}/icon.png`,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/icon.png`],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await contentApi.getPostBySlug(slug);
  const siteUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";

  const articleJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          "@type": "Person",
          name: post.author,
        },
        publisher: {
          "@type": "Organization",
          name: "Wahide",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/icon.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteUrl}/blog/${slug}`,
        },
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <BlogPostView slug={slug} />
    </>
  );
}
