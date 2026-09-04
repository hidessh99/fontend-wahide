"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CampaignList } from "@/modules/campaign/components/broadcast/CampaignList";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/context";
import { Send, Layers, ListChecks } from "lucide-react";

const MessageLogsTable = dynamic(
  () =>
    import("@/modules/campaign/components/logs/MessageLogsTable").then(
      (m) => m.MessageLogsTable
    ),
  { ssr: false }
);

export function CampaignsView() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<string>("campaigns");

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
          <TabsList className="bg-muted border-border h-auto rounded-full border p-1">
            <TabsTrigger
              value="campaigns"
              className="data-active:bg-surface data-active:text-foreground cursor-pointer gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition data-active:shadow-sm dark:data-active:bg-[#161715]"
            >
              <Layers className="size-3.5" />
              <span>{t("campaign.tabCampaigns")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-active:bg-surface data-active:text-foreground cursor-pointer gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition data-active:shadow-sm dark:data-active:bg-[#161715]"
            >
              <ListChecks className="size-3.5" />
              <span>{t("campaign.tabLogs")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content Tab with Error Boundary */}
        <TabsContent value="campaigns">
          <ErrorBoundary fallbackTitle="Gagal Memuat Daftar Kampanye Siaran">
            <CampaignList />
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="logs">
          <ErrorBoundary fallbackTitle="Gagal Memuat Log Audit Pesan">
            {activeTab === "logs" && <MessageLogsTable />}
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
