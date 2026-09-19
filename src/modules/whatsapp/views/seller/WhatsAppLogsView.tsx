"use client";

import React from "react";
import { MessageListTable } from "../../components/user/MessageListTable";
import { MessageStatsCards } from "../../components/user/MessageStatsCards";
import { useMessageLogs } from "@/modules/campaign/hooks/useMessageLogs";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { MessageCategoryTabs, MessageCategory } from "@/components/ui/message-category-tabs";
import { LogPeriodFilter } from "@/components/ui/log-period-filter";
import { ScrollText, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function WhatsAppLogsView() {
  const { t } = useI18n();
  const {
    logs,
    total,
    failedTotal,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    fetchLogs,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    messageTypeFilter,
    setMessageTypeFilter,
    timeRange,
    setTimeRange,
    customRange,
    setCustomRange,
  } = useMessageLogs(1, 10);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <ScrollText className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("whatsapp.logs.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("whatsapp.logs.subtitle")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchLogs()}
          disabled={isLoading}
          className="text-xs font-semibold"
        >
          <RefreshCw className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{t("whatsapp.logs.reload")}</span>
        </Button>
      </div>

      <ErrorBoundary fallbackTitle={t("whatsapp.messagesErrorLoadHistory")}>
        <MessageStatsCards
          total={total}
          failedCount={failedTotal}
          isLoading={isLoading}
        />

        <div className="space-y-3 pt-2">
          {/* Segmented Category & Period Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <MessageCategoryTabs
              activeCategory={messageTypeFilter as MessageCategory}
              onCategoryChange={(cat) => setMessageTypeFilter(cat)}
            />

            <LogPeriodFilter
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              customRange={customRange}
              onCustomRangeChange={setCustomRange}
            />
          </div>

          <MessageListTable
            logs={logs}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}
