"use client";

import React from "react";
import { useWABALogs } from "../../hooks/useWABALogs";
import { WABAStatsCards } from "../../components/seller/WABAStatsCards";
import { WABALogsTable } from "../../components/seller/WABALogsTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { MessageCategoryTabs, MessageCategory } from "@/components/ui/message-category-tabs";
import { LogPeriodFilter } from "@/components/ui/log-period-filter";
import { ScrollText, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function WABALogsView() {
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
    reload,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    messageTypeFilter,
    setMessageTypeFilter,
    statusFilter,
    setStatusFilter,
    timeRange,
    setTimeRange,
    customRange,
    setCustomRange,
  } = useWABALogs(1, 10);

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
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ScrollText className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("whatsapp.wabaLogs.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("whatsapp.wabaLogs.subtitle")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => reload()}
          disabled={isLoading}
          className="text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{t("whatsapp.wabaLogs.reload")}</span>
        </Button>
      </div>

      <ErrorBoundary fallbackTitle={t("whatsapp.wabaLogs.fallbackError")}>
        {/* 4 Stats Cards */}
        <WABAStatsCards
          total={total}
          failedCount={failedTotal}
          isLoading={isLoading}
        />

        {/* Logs Table Component */}
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

          <WABALogsTable
            logs={logs}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default WABALogsView;
