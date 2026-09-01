"use client";

import React, { useState } from "react";
import { CampaignList } from "@/modules/campaign/components/broadcast/CampaignList";
import { MessageLogsTable } from "@/modules/campaign/components/logs/MessageLogsTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { Send, Layers, ListChecks } from "lucide-react";

export function CampaignsView() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"campaigns" | "logs">("campaigns");

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
              <Send className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {t("campaign.title")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("campaign.subtitle")}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-full bg-muted border border-border text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("campaigns")}
            className={`px-4 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "campaigns"
                ? "bg-surface dark:bg-[#161715] text-foreground shadow-sm font-extrabold"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>{t("campaign.tabCampaigns")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "logs"
                ? "bg-surface dark:bg-[#161715] text-foreground shadow-sm font-extrabold"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <ListChecks className="size-3.5" />
            <span>{t("campaign.tabLogs")}</span>
          </button>
        </div>
      </div>

      {/* Main Content Tab with Error Boundary */}
      {activeTab === "campaigns" ? (
        <ErrorBoundary fallbackTitle="Gagal Memuat Daftar Kampanye Siaran">
          <CampaignList />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary fallbackTitle="Gagal Memuat Log Audit Pesan">
          <MessageLogsTable />
        </ErrorBoundary>
      )}
    </div>
  );
}
