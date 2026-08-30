"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

interface AuthBannerProps {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
}

export function AuthBanner({
  badgeText,
  headline,
  subheadline,
}: AuthBannerProps) {
  const { t } = useI18n();

  const displayBadge = badgeText || t("auth.banner.defaultBadge");
  const displayHeadline = headline || t("auth.banner.defaultHeadline");
  const displaySubheadline = subheadline || t("auth.banner.defaultSubheadline");

  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-near-black text-foreground relative overflow-hidden">
      {/* Subtle Green Glow Ring */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-wise-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-wise-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-wise-green animate-pulse" />
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Wahide<span className="text-wise-green">.</span>
          </span>
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#868685] bg-[#1b1d1a] px-3 py-1 rounded-full border border-white/10">
          {displayBadge}
        </span>
      </div>

      <div className="space-y-6 z-10 max-w-lg my-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(159,232,112,0.15)] px-4 py-1.5 text-xs font-bold text-wise-green">
          <span className="size-1.5 rounded-full bg-wise-green" />
          <span>{t("auth.banner.scaleTag")}</span>
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white">
          {displayHeadline}
        </h1>
        <p className="text-lg font-semibold text-[#c2c5be] leading-relaxed">
          {displaySubheadline}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-[#868685] z-10 border-t border-white/10 pt-6">
        <span>&copy; {new Date().getFullYear()} {t("auth.banner.rightsNote")}</span>
        <span>{t("auth.banner.antiBanNote")}</span>
      </div>
    </div>
  );
}
