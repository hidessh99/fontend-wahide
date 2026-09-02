"use client";

import React from "react";
import { useAdminDevices } from "@/modules/admin/hooks/useAdminDevices";
import { DevicesManagementTable } from "@/modules/admin/components/devices/DevicesManagementTable";
import {
  Smartphone,
  Wifi,
  WifiOff,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export function AdminDevicesView() {
  const {
    devices,
    isLoading,
    searchQuery,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchDevices,
    deleteDevice,
    executeSearch,
    clearSearch,
    setStatusFilter,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  } = useAdminDevices();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <Smartphone className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Manajemen Perangkat WhatsApp Seluruh Pengguna
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            Pantau dan kelola seluruh slot instance nomor WhatsApp yang terhubung di platform, audit trust score, dan kelola pemutusan sesi jika diperlukan.
          </p>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Perangkat</span>
            <Smartphone className="size-4 text-foreground-secondary" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-foreground">
            {metrics.totalCount.toLocaleString("id-ID")} Slot
          </div>
          <span className="text-[10px] text-foreground-muted">Terdaftar di platform</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Online Aktif</span>
            <Wifi className="size-4 text-emerald-600 dark:text-wise-green" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-wise-green">
            {metrics.onlineCount.toLocaleString("id-ID")} Perangkat
          </div>
          <span className="text-[10px] text-foreground-muted">Tersambung via whatsmeow socket</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Offline / Terputus</span>
            <WifiOff className="size-4 text-foreground-secondary" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-foreground-secondary">
            {metrics.offlineCount.toLocaleString("id-ID")} Perangkat
          </div>
          <span className="text-[10px] text-foreground-muted">Perlu re-link / reconnect</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending / Hibernasi</span>
            <QrCode className="size-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-600 dark:text-amber-400">
            {(metrics.qrPendingCount + metrics.hibernatedCount).toLocaleString("id-ID")} Perangkat
          </div>
          <span className="text-[10px] text-foreground-muted">
            {metrics.qrPendingCount} Scan QR &bull; {metrics.hibernatedCount} Hibernasi
          </span>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-wise-green" />
            <h2 className="text-base font-black text-foreground">
              Daftar Seluruh Slot Perangkat WhatsApp
            </h2>
          </div>
        </div>

        <DevicesManagementTable
          devices={devices}
          isLoading={isLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onRefresh={fetchDevices}
          onDelete={deleteDevice}
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
  );
}
