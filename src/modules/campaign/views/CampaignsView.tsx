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
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
              <Send className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("campaign.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("campaign.subtitle")}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-muted border-border flex items-center self-start rounded-full border p-1 text-xs font-bold sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("campaigns")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 transition ${
              activeTab === "campaigns"
                ? "bg-surface text-foreground font-extrabold shadow-sm dark:bg-[#161715]"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>{t("campaign.tabCampaigns")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 transition ${
              activeTab === "logs"
                ? "bg-surface text-foreground font-extrabold shadow-sm dark:bg-[#161715]"
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
