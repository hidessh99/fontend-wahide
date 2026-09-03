"use client";

import React from "react";
import { useAdminMessageLogs } from "@/modules/admin/hooks/useAdminMessageLogs";
import { MessageLogsTable } from "@/modules/admin/components/messages/MessageLogsTable";
import { MessageMetricsCards } from "@/modules/admin/components/messages/MessageMetricsCards";
import { MessageSquare, Send } from "lucide-react";

export function AdminMessagesView() {
  const {
    logs,
    isLoading,
    searchQuery,
    statusFilter,
    directionFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchLogs,
    deleteLog,
    executeSearch,
    clearSearch,
    setStatusFilter,
    setDirectionFilter,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  } = useAdminMessageLogs();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <MessageSquare className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Log Pesan WhatsApp Seluruh Pengguna
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            Pantau dan audit seluruh riwayat pesan keluar (broadcast/direct) dan pesan masuk dari seluruh akun member dan seller.
          </p>
        </div>
      </div>

      {/* Summary Metrics Strip (Modular Component) */}
      <MessageMetricsCards metrics={metrics} />

      {/* Main Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="size-4 text-emerald-600 dark:text-wise-green" />
            <h2 className="text-base font-black text-foreground">
              Daftar Riwayat Pesan WhatsApp
            </h2>
          </div>
        </div>

        <MessageLogsTable
          logs={logs}
          isLoading={isLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          directionFilter={directionFilter}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onRefresh={fetchLogs}
          onDelete={deleteLog}
          onSearch={executeSearch}
          onClearSearch={clearSearch}
          onStatusFilterChange={setStatusFilter}
          onDirectionFilterChange={setDirectionFilter}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      </div>
    </div>
  );
}
