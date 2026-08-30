"use client";

import React, { useState } from "react";
import { CampaignList } from "@/services/campaign/components/CampaignList";
import { MessageLogsTable } from "@/services/campaign/components/MessageLogsTable";
import { useI18n } from "@/lib/i18n/context";
import { Send, Layers, ListChecks } from "lucide-react";

export function CampaignsView() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"campaigns" | "logs">("campaigns");

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Send className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("campaign.title")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
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
            <span>Daftar Kampanye</span>
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
            <span>Log Pesan Terkirim</span>
          </button>
        </div>
      </div>

      {/* Main Content Tab */}
      {activeTab === "campaigns" ? <CampaignList /> : <MessageLogsTable />}
    </div>
  );
}
