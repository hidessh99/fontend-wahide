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
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 sm:size-9">
              <MessageSquare className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              Log Pesan WhatsApp Seluruh Pengguna
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            Pantau dan audit seluruh riwayat pesan keluar (broadcast/direct) dan pesan masuk dari
            seluruh akun member dan seller.
          </p>
        </div>
      </div>

      {/* Summary Metrics Strip (Modular Component) */}
      <MessageMetricsCards metrics={metrics} />

      {/* Main Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="dark:text-wise-green size-4 text-emerald-600" />
            <h2 className="text-foreground text-base font-black">Daftar Riwayat Pesan WhatsApp</h2>
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
