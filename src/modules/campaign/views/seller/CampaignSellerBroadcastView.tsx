"use client";

import React from "react";
import Link from "next/link";
import { CampaignList } from "@/modules/campaign/components/seller/CampaignList";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { Megaphone, ScrollText } from "lucide-react";

export function CampaignSellerBroadcastView() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
              <Megaphone className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl flex items-center gap-2">
              <span>{t("campaign.title")}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold py-0.5 px-2 rounded-full bg-wise-green/20 text-dark-green dark:text-wise-green">
                Mass Campaigns
              </span>
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("campaign.subtitle")}
          </p>
        </div>

        {/* Quick Link to Channel Logs */}
        <div className="flex items-center gap-2">
          <Link
            href="/wa/logs"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors dark:bg-[#161715]"
          >
            <ScrollText className="size-3.5 text-foreground-muted" />
            <span>Log Saluran</span>
          </Link>
        </div>
      </div>

      {/* Main Campaign Operations Hub with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal memuat daftar kampanye broadcast">
        <CampaignList />
      </ErrorBoundary>
    </div>
  );
}

export default CampaignSellerBroadcastView;
