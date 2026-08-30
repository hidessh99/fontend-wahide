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
  footerNote?: string;
}

export function AuthLayout({
  children,
  bannerBadge,
  bannerHeadline,
  bannerSubheadline,
  footerNote,
}: AuthLayoutProps) {
  const { t } = useI18n();

  const displayFooterNote = footerNote || t("auth.layout.footerNote");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Kolom Kiri: Visual Banner */}
      <AuthBanner
        badgeText={bannerBadge}
        headline={bannerHeadline}
        subheadline={bannerSubheadline}
      />

      {/* Kolom Kanan: Form Content Container */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="lg:hidden">
          <AuthHeader />
        </div>

        <div className="my-auto py-8 max-w-md w-full mx-auto">
          {children}
        </div>

        <div className="text-center text-xs font-semibold text-foreground-muted pt-4">
          {displayFooterNote}
        </div>
      </div>
    </div>
  );
}
