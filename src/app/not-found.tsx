"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { FileQuestion, Home, MessageSquare, Compass } from "lucide-react";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-xl w-full text-center space-y-8 p-8 sm:p-12 rounded-lg border border-border bg-surface dark:bg-[#161715] shadow-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Visual Badge & Icon */}
        <div className="space-y-3">
          <div className="size-16 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <FileQuestion className="size-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-muted text-foreground-secondary border border-border">
            <Compass className="size-3.5 text-wise-green" />
            <span>{t("common.errors.notFound.badge")}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {t("common.errors.notFound.title")}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed max-w-md mx-auto">
            {t("common.errors.notFound.subtitle")}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primaryPill" size="default" className="gap-2 px-6 shadow-sm">
              <Home className="size-4" />
              <span>{t("common.errors.notFound.backHome")}</span>
            </Button>
          </Link>

          <Link href="/contact">
            <Button variant="outline" size="default" className="rounded-full gap-2 px-6 border-border hover:border-foreground-muted">
              <MessageSquare className="size-4" />
              <span>{t("common.errors.notFound.contactSupport")}</span>
            </Button>
          </Link>
        </div>

        {/* Popular Quick Links */}
        <div className="pt-6 border-t border-border/80 space-y-3 text-xs font-semibold text-foreground-muted">
          <span>{t("common.errors.notFound.popularLinks")}</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard" className="text-wise-green hover:underline">
              {t("common.errors.notFound.dashboardBtn")}
            </Link>
            <span>•</span>
            <Link href="/pricing" className="text-wise-green hover:underline">
              {t("common.nav.pricing")}
            </Link>
            <span>•</span>
            <Link href="/blog" className="text-wise-green hover:underline">
              Blog &amp; Panduan
            </Link>
            <span>•</span>
            <Link href="/about" className="text-wise-green hover:underline">
              Tentang Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
