import type { Metadata } from "next";
import { BlogPostView } from "@/components/public/BlogPostView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "Artikel dan panduan teknis resmi Wahide Enterprise WhatsApp Gateway.",
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostView slug={slug} />;
}
