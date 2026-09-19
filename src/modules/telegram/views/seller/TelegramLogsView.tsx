"use client";

import React from "react";
import { useTelegramLogs } from "../../hooks/useTelegramLogs";
import { TelegramLogsTable } from "../../components/seller/TelegramLogsTable";
import { TelegramLogStatsCards } from "../../components/seller/TelegramLogStatsCards";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { ScrollText, RefreshCw } from "lucide-react";

export function TelegramLogsView() {
  const { t } = useI18n();
  const {
    logs,
    total,
    failedTotal,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    directionFilter,
    setDirectionFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    reload,
  } = useTelegramLogs(1, 10);

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
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <ScrollText className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("telegram.logs.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("telegram.logs.subtitle")}
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
          <span>{t("telegram.logs.reload")}</span>
        </Button>
      </div>

      {/* 4 Stats Cards */}
      <TelegramLogStatsCards
        total={total}
        failedCount={failedTotal}
        isLoading={isLoading}
      />

      {/* Logs Table Component */}
      <div className="pt-2">
        <TelegramLogsTable
          logs={logs}
          total={total}
          page={page}
          pageSize={pageSize}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          directionFilter={directionFilter}
          onDirectionFilterChange={setDirectionFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

export default TelegramLogsView;
