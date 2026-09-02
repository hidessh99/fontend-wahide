"use client";

import React from "react";
import { useAdminMessageLogs } from "@/modules/admin/hooks/useAdminMessageLogs";
import { MessageLogsTable } from "@/modules/admin/components/messages/MessageLogsTable";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  CheckCheck,
  Send,
} from "lucide-react";

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

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pesan</span>
            <MessageSquare className="size-4 text-foreground-secondary" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-foreground">
            {metrics.totalCount.toLocaleString("id-ID")} Pesan
          </div>
          <span className="text-[10px] text-foreground-muted">
            {metrics.outboundCount} Keluar &bull; {metrics.inboundCount} Masuk
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tersampaikan</span>
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-wise-green">
            {(metrics.deliveredCount + metrics.sentCount).toLocaleString("id-ID")} Pesan
          </div>
          <span className="text-[10px] text-foreground-muted">Berhasil terkirim ke WhatsApp</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Terbaca</span>
            <CheckCheck className="size-4 text-blue-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400">
            {metrics.readCount.toLocaleString("id-ID")} Pesan
          </div>
          <span className="text-[10px] text-foreground-muted">Centang biru (dibaca penerima)</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gagal Terkirim</span>
            <AlertCircle className="size-4 text-rose-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-rose-600 dark:text-rose-400">
            {metrics.failedCount.toLocaleString("id-ID")} Pesan
          </div>
          <span className="text-[10px] text-foreground-muted">Perlu investigasi nomor/koneksi</span>
        </div>
      </div>

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
