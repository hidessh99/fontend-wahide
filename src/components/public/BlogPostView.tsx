"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/services/content/types/content.types";
import { contentApi } from "@/services/content/api/content.api";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogPostViewProps {
  slug: string;
}

export function BlogPostView({ slug }: BlogPostViewProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contentApi.getPostBySlug(slug).then((data) => {
      setPost(data);
      setIsLoading(false);
    });
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link artikel disalin ke clipboard.");
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center space-y-4">
        <h1 className="text-2xl font-black text-foreground">Artikel Tidak Ditemukan</h1>
        <Link href="/blog" className="text-xs font-bold text-wise-green hover:underline">
          &larr; Kembali ke daftar blog
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8 max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Back button & share */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-secondary hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Blog</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="rounded-full text-xs font-bold gap-1.5 border-border"
        >
          <Share2 className="size-3.5" />
          <span>Bagikan</span>
        </Button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-foreground-secondary border border-border"
            >
              <Tag className="size-2.5 text-foreground-muted" />
              <span>{t}</span>
            </span>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs font-semibold text-foreground-muted pt-1">
          <span className="flex items-center gap-1.5">
            <User className="size-3.5 text-wise-green" />
            <span className="text-foreground font-bold">{post.author}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>{new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </span>
        </div>
      </div>

      {/* Article Body */}
      <div className="p-6 sm:p-8 rounded-md border border-border bg-surface dark:bg-[#161715] text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed space-y-4 whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
