"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { FileQuestion, Home, MessageSquare, Compass } from "lucide-react";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="bg-background text-foreground flex min-h-[80vh] items-center justify-center p-6">
      <div className="border-border bg-surface animate-in fade-in zoom-in-95 w-full max-w-xl space-y-8 rounded-lg border p-8 text-center shadow-lg duration-200 sm:p-12 dark:bg-[#161715]">
        {/* Visual Badge & Icon */}
        <div className="space-y-3">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <FileQuestion className="size-8" />
          </div>

          <div className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold">
            <Compass className="dark:text-wise-green size-3.5 text-emerald-700" />
            <span>{t("common.errors.notFound.badge")}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            {t("common.errors.notFound.title")}
          </h1>
          <p className="text-foreground-secondary mx-auto max-w-md text-xs leading-relaxed font-semibold sm:text-sm">
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
            <Button
              variant="outline"
              size="default"
              className="border-border hover:border-foreground-muted gap-2 rounded-full px-6"
            >
              <MessageSquare className="size-4" />
              <span>{t("common.errors.notFound.contactSupport")}</span>
            </Button>
          </Link>
        </div>

        {/* Popular Quick Links */}
        <div className="border-border/80 text-foreground-muted space-y-3 border-t pt-6 text-xs font-semibold">
          <span>{t("common.errors.notFound.popularLinks")}</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="dark:text-wise-green text-emerald-700 hover:underline"
            >
              {t("common.errors.notFound.dashboardBtn")}
            </Link>
            <span>•</span>
            <Link href="/pricing" className="dark:text-wise-green text-emerald-700 hover:underline">
              {t("common.nav.pricing")}
            </Link>
            <span>•</span>
            <Link href="/blog" className="dark:text-wise-green text-emerald-700 hover:underline">
              Blog &amp; Panduan
            </Link>
            <span>•</span>
            <Link href="/about" className="dark:text-wise-green text-emerald-700 hover:underline">
              Tentang Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
