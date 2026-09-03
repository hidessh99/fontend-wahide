"use client";

import React from "react";
import { AuthBanner } from "./AuthBanner";
import { AuthHeader } from "./AuthHeader";
import { useI18n } from "@/lib/i18n/context";

interface AuthLayoutProps {
  children: React.ReactNode;
  bannerBadge?: string;
  bannerHeadline?: string;
  bannerSubheadline?: string;
  bannerScaleTag?: string;
  footerNote?: string;
}

export function AuthLayout({
  children,
  bannerBadge,
  bannerHeadline,
  bannerSubheadline,
  bannerScaleTag,
  footerNote,
}: AuthLayoutProps) {
  const { t } = useI18n();

  const displayFooterNote = footerNote || t("auth.layout.footerNote");

  return (
    <div className="bg-background grid min-h-screen lg:grid-cols-2">
      {/* Kolom Kiri: Visual Banner */}
      <AuthBanner
        badgeText={bannerBadge}
        headline={bannerHeadline}
        subheadline={bannerSubheadline}
        scaleTag={bannerScaleTag}
      />

      {/* Kolom Kanan: Main Content Landmark Container */}
      <main className="flex min-h-screen flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="lg:hidden">
          <AuthHeader />
        </div>

        <div className="mx-auto my-auto w-full max-w-md py-8">{children}</div>

        <footer className="text-foreground-muted pt-4 text-center text-xs font-semibold">
          {displayFooterNote}
        </footer>
      </main>
    </div>
  );
}
