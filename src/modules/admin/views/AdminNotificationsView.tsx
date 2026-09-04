"use client";

import React from "react";
import { useAdminNotifications } from "@/modules/admin/hooks/useAdminNotifications";
import { BroadcastComposer } from "@/modules/admin/components/notifications/BroadcastComposer";
import { QueueMonitorTable } from "@/modules/admin/components/notifications/QueueMonitorTable";
import { NotificationMetricsCards } from "@/modules/admin/components/notifications/NotificationMetricsCards";
import { Bell } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function AdminNotificationsView() {
  const { t } = useI18n();
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
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 sm:size-9 dark:text-rose-400">
              <Bell className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("admin.notifications.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("admin.notifications.subtitle")}
          </p>
        </div>
      </div>

      {/* Summary Metrics Strip (Modular Component) */}
      <NotificationMetricsCards metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Left: Broadcast Form */}
        <div className="lg:col-span-1">
          <BroadcastComposer
            isSending={isSending}
            onSendAll={sendBroadcastAll}
            onSendDirect={sendDirectEmail}
            onSendBatch={sendDirectEmailsBatch}
          />
        </div>

        {/* Right: Notification Queues Table */}
        <div className="lg:col-span-2">
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
