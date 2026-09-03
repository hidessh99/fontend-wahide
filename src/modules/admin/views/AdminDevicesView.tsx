"use client";

import React from "react";
import { useAdminDevices } from "@/modules/admin/hooks/useAdminDevices";
import { DevicesManagementTable } from "@/modules/admin/components/devices/DevicesManagementTable";
import { DeviceMetricsCards } from "@/modules/admin/components/devices/DeviceMetricsCards";
import { Smartphone, ShieldCheck } from "lucide-react";

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

      {/* Summary Metrics Strip (Modular Component) */}
      <DeviceMetricsCards metrics={metrics} />

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
