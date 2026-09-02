"use client";

import React from "react";
import { useAdminNotifications } from "@/modules/admin/hooks/useAdminNotifications";
import { BroadcastComposer } from "@/modules/admin/components/notifications/BroadcastComposer";
import { QueueMonitorTable } from "@/modules/admin/components/notifications/QueueMonitorTable";
import {
  Bell,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

export function AdminNotificationsView() {
  const {
    queues,
    isLoading,
    isSending,
    searchQuery,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchQueues,
    deleteQueue,
    sendBroadcastAll,
    sendDirectEmail,
    sendDirectEmailsBatch,
    executeSearch,
    clearSearch,
    setStatusFilter,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  } = useAdminNotifications();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Bell className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Siaran &amp; Antrean Notifikasi
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            Kirim pengumuman siaran email massal, kelola pesan ke email tertentu, dan pantau status antrean worker.
          </p>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Antrean</span>
            <Layers className="size-4 text-foreground-secondary" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-foreground">
            {metrics.totalCount} Tugas
          </div>
          <span className="text-[10px] text-foreground-muted">Keseluruhan entri antrean</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Terkirim (Selesai)</span>
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-wise-green">
            {metrics.completedCount} Email
          </div>
          <span className="text-[10px] text-foreground-muted">Berhasil diproses worker</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sedang Diproses</span>
            <RotateCcw className="size-4 text-blue-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400">
            {metrics.processingCount + metrics.pendingCount} Tugas
          </div>
          <span className="text-[10px] text-foreground-muted">Pending &amp; In-Flight</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gagal Terkirim</span>
            <AlertCircle className="size-4 text-rose-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-rose-600 dark:text-rose-400">
            {metrics.failedCount} Tugas
          </div>
          <span className="text-[10px] text-foreground-muted">Perlu investigasi error</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left: Broadcast Form */}
        <div className="lg:col-span-1">
          <BroadcastComposer
            isSending={isSending}
            onSendAll={sendBroadcastAll}
            onSendDirect={sendDirectEmail}
            onSendBatch={sendDirectEmailsBatch}
          />
        </div>

        {/* Right: Worker Queue Monitor */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-emerald-600 dark:text-wise-green" />
              <h2 className="text-base font-black text-foreground">
                Antrean Background Worker
              </h2>
            </div>
          </div>

          <QueueMonitorTable
            queues={queues}
            isLoading={isLoading}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onRefresh={fetchQueues}
            onDelete={deleteQueue}
            onSearch={executeSearch}
            onClearSearch={clearSearch}
            onStatusFilterChange={setStatusFilter}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
}
