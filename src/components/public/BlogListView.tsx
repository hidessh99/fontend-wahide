"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/modules/content/types/content.types";
import { contentApi } from "@/modules/content/api/content.api";
import { useI18n } from "@/lib/i18n/context";
import { Newspaper, ArrowRight, Tag, Calendar, User } from "lucide-react";

export function BlogListView() {
  const { t, locale } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contentApi.getPosts().then((data) => {
      setPosts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-10 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green border border-emerald-500/20 dark:border-wise-green/20">
          <Newspaper className="size-3.5" />
          <span>{t("content.badge")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          {t("content.title")}
        </h1>
        <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
          {t("content.subtitle")}
        </p>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-64 rounded-md bg-muted" />
          <div className="h-64 rounded-md bg-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="p-6 rounded-md border border-border bg-surface dark:bg-[#161715] flex flex-col justify-between space-y-4 hover:border-foreground-muted transition shadow-sm"
            >
              <div className="space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tg) => (
                    <span
                      key={tg}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-foreground-secondary border border-border"
                    >
                      <Tag className="size-2.5 text-foreground-muted" />
                      <span>{tg}</span>
                    </span>
                  ))}
                </div>

                <Link href={`/blog/${post.slug}`} className="block group">
                  <h2 className="text-lg font-black text-foreground group-hover:text-emerald-700 dark:group-hover:text-wise-green transition leading-snug">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-xs font-semibold text-foreground-secondary leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Footer info & link */}
              <div className="flex items-center justify-between pt-4 border-t border-border/80 text-xs font-semibold text-foreground-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="size-3 text-foreground-muted" />
                    <span>{post.author}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-foreground-muted" />
                    <span>{new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "id-ID")}</span>
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-wise-green hover:underline"
                >
                  <span>{t("content.readArticle")}</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
