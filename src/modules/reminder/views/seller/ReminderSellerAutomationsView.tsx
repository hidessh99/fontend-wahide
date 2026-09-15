"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useReminders } from "../../hooks/useReminders";
import { useReminderRules } from "../../hooks/useReminderRules";
import { useReminderLogs } from "../../hooks/useReminderLogs";
import { QuickScheduleCard } from "../../components/seller/QuickScheduleCard";
import { DeliveryRulesCard } from "../../components/seller/DeliveryRulesCard";
import { ReminderTable } from "../../components/seller/ReminderTable";
import { ReminderLogsTable } from "../../components/seller/ReminderLogsTable";
import { Reminder } from "../../types/reminder.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  Calendar,
  Layers,
  History,
  CheckCircle2,
  Clock,
  Pause,
  Send,
} from "lucide-react";

const DeleteReminderModal = dynamic(
  () =>
    import("../../components/seller/DeleteReminderModal").then(
      (m) => m.DeleteReminderModal,
    ),
  { ssr: false },
);

type ActiveTab = "schedules" | "rules" | "logs";

export function ReminderSellerAutomationsView() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ActiveTab>("schedules");

  // Reminders hook
  const {
    reminders,
    isLoading: isRemindersLoading,
    stats,
    search,
    status,
    page: remindersPage,
    totalPages: remindersTotalPages,
    total: remindersTotal,
    handleSearchChange,
    handleStatusChange,
    goToPage: goToRemindersPage,
    createReminder,
    deleteReminder,
    toggleStatus,
    reload: reloadReminders,
  } = useReminders();

  // Reminder rules hook
  const {
    rule,
    isSaving: isSavingRules,
    updateRule,
    reload: reloadRules,
  } = useReminderRules();

  // Reminder logs hook
  const {
    logs,
    isLoading: isLogsLoading,
    isDispatching,
    page: logsPage,
    totalPages: logsTotalPages,
    total: logsTotal,
    goToPage: goToLogsPage,
    dispatchNow,
    reload: reloadLogs,
  } = useReminderLogs();

  // Delete modal state
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(
    null,
  );

  const handleConfirmDelete = async (): Promise<boolean> => {
    if (!deletingReminder) return false;
    return await deleteReminder(
      deletingReminder.id,
      deletingReminder.recipientName,
    );
  };

  const handleGlobalRefresh = () => {
    reloadReminders();
    reloadRules();
    reloadLogs();
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start justify-between gap-3 sm:block">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("reminder.title")}
            </h1>
            <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
              {t("reminder.subtitle")}
            </p>
          </div>

          {/* Mobile-Only Header Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleGlobalRefresh}
            disabled={isRemindersLoading || isLogsLoading}
            className="size-9 shrink-0 rounded-full border-border/70 text-xs cursor-pointer sm:hidden"
            title={t("reminder.actions.refreshTooltip")}
            aria-label="Refresh Data"
          >
            <RefreshCw
              className={`size-3.5 ${
                isRemindersLoading || isLogsLoading ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Desktop-Only Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGlobalRefresh}
            disabled={isRemindersLoading || isLogsLoading}
            className="hidden sm:inline-flex h-9 gap-1.5 rounded-full border-border/70 text-xs cursor-pointer"
            title={t("reminder.actions.refreshTooltip")}
          >
            <RefreshCw
              className={`size-3.5 ${
                isRemindersLoading || isLogsLoading ? "animate-spin" : ""
              }`}
            />
            <span>{t("reminder.actions.refresh")}</span>
          </Button>

          {/* Primary Action Button */}
          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            onClick={dispatchNow}
            disabled={isDispatching}
            className="h-10 sm:h-9 gap-2 px-5 text-xs font-bold shadow-xs w-full sm:w-auto cursor-pointer justify-center rounded-full"
            title={t("reminder.actions.dispatchTooltip")}
          >
            <Send className="size-3.5" />
            <span>{t("reminder.actions.dispatchNow")}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Reminders */}
        <Card className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reminder.stats.total")}
            </span>
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <Calendar className="size-4" />
            </div>
          </div>
          <div>
            <div className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
              {stats.total}
            </div>
            <div className="mt-1 text-[11px] font-medium text-foreground-muted line-clamp-1">
              {t("reminder.stats.totalDesc")}
            </div>
          </div>
        </Card>

        {/* Active Reminders */}
        <Card className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reminder.stats.active")}
            </span>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div>
            <div className="mt-2 text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-400 sm:text-2xl">
              {stats.active}
            </div>
            <div className="mt-1 text-[11px] font-medium text-foreground-muted line-clamp-1">
              {t("reminder.stats.activeDesc")}
            </div>
          </div>
        </Card>

        {/* Paused Reminders */}
        <Card className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reminder.stats.paused")}
            </span>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
              <Pause className="size-4" />
            </div>
          </div>
          <div>
            <div className="mt-2 text-xl font-black tracking-tight text-amber-800 dark:text-amber-400 sm:text-2xl">
              {stats.paused}
            </div>
            <div className="mt-1 text-[11px] font-medium text-foreground-muted line-clamp-1">
              {t("reminder.stats.pausedDesc")}
            </div>
          </div>
        </Card>

        {/* Total Logs Dispatched */}
        <Card className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reminder.stats.dispatched")}
            </span>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div>
            <div className="mt-2 text-xl font-black tracking-tight text-purple-600 dark:text-purple-400 sm:text-2xl">
              {logsTotal}
            </div>
            <div className="mt-1 text-[11px] font-medium text-foreground-muted line-clamp-1">
              {t("reminder.stats.dispatchedDesc")}
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="overflow-x-auto scrollbar-none pb-1 sm:pb-0 w-full sm:w-fit">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActiveTab)}
        >
          <TabsList className="h-12 sm:h-13 p-1.5 rounded-2xl bg-muted/70 dark:bg-muted/40 border border-border/80 shadow-xs flex items-center gap-1.5 w-full sm:w-auto shrink-0">
            <TabsTrigger
              value="schedules"
              className="h-9.5 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold gap-2.5 rounded-xl cursor-pointer transition-all data-active:bg-card data-active:text-foreground data-active:shadow-xs data-active:font-bold border border-transparent data-active:border-border/60 shrink-0"
            >
              <Calendar className="size-4 sm:size-4.5 text-primary shrink-0" />
              <span>{t("reminder.tabs.schedules")}</span>
              <span
                className={cn(
                  "text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full transition-colors",
                  activeTab === "schedules"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-background/80 text-muted-foreground border border-border/50",
                )}
              >
                {stats.total}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="rules"
              className="h-9.5 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold gap-2.5 rounded-xl cursor-pointer transition-all data-active:bg-card data-active:text-foreground data-active:shadow-xs data-active:font-bold border border-transparent data-active:border-border/60 shrink-0"
            >
              <Layers className="size-4 sm:size-4.5 text-amber-500 shrink-0" />
              <span>{t("reminder.tabs.rules")}</span>
            </TabsTrigger>

            <TabsTrigger
              value="logs"
              className="h-9.5 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold gap-2.5 rounded-xl cursor-pointer transition-all data-active:bg-card data-active:text-foreground data-active:shadow-xs data-active:font-bold border border-transparent data-active:border-border/60 shrink-0"
            >
              <History className="size-4 sm:size-4.5 text-purple-500 shrink-0" />
              <span>{t("reminder.tabs.logs")}</span>
              <span
                className={cn(
                  "text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full transition-colors",
                  activeTab === "logs"
                    ? "bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30"
                    : "bg-background/80 text-muted-foreground border border-border/50",
                )}
              >
                {logsTotal}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Panels */}
      {activeTab === "schedules" && (
        <div className="flex flex-col gap-6">
          <QuickScheduleCard
            onSchedule={createReminder}
            hasConfiguredDevice={Boolean(
              rule?.deviceId && rule.deviceId.trim() !== "",
            )}
            onNavigateToRules={() => setActiveTab("rules")}
          />
          <ReminderTable
            reminders={reminders}
            isLoading={isRemindersLoading}
            search={search}
            status={status}
            page={remindersPage}
            totalPages={remindersTotalPages}
            total={remindersTotal}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPageChange={goToRemindersPage}
            onToggleStatus={toggleStatus}
            onDeleteRequest={(rem) => setDeletingReminder(rem)}
          />
        </div>
      )}

      {activeTab === "rules" && (
        <DeliveryRulesCard
          initialRule={rule}
          onSave={updateRule}
          isSaving={isSavingRules}
        />
      )}

      {activeTab === "logs" && (
        <ReminderLogsTable
          logs={logs}
          isLoading={isLogsLoading}
          isDispatching={isDispatching}
          page={logsPage}
          totalPages={logsTotalPages}
          total={logsTotal}
          onPageChange={goToLogsPage}
          onDispatchNow={dispatchNow}
          onReload={reloadLogs}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteReminderModal
        isOpen={Boolean(deletingReminder)}
        onClose={() => setDeletingReminder(null)}
        onConfirm={handleConfirmDelete}
        recipientName={deletingReminder?.recipientName || ""}
      />
    </div>
  );
}

export default ReminderSellerAutomationsView;
