import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Layers, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";

export interface NotificationMetrics {
  totalCount: number;
  completedCount: number;
  processingCount: number;
  pendingCount: number;
  failedCount: number;
}

interface NotificationMetricsCardsProps {
  metrics: NotificationMetrics;
}

export function NotificationMetricsCards({ metrics }: NotificationMetricsCardsProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.notifications.totalQueues")}
          </span>
          <Layers className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground font-mono text-lg font-black sm:text-xl">
          {metrics.totalCount} {t("admin.notifications.taskUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.notifications.totalQueuesDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.notifications.completedQueues")}
          </span>
          <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
        </div>
        <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
          {metrics.completedCount} {t("admin.notifications.emailUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.notifications.completedQueuesDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.notifications.processingQueues")}
          </span>
          <RotateCcw className="size-4 text-blue-500" />
        </div>
        <div className="font-mono text-lg font-black text-blue-600 sm:text-xl dark:text-blue-400">
          {metrics.processingCount + metrics.pendingCount} {t("admin.notifications.taskUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.notifications.processingQueuesDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.notifications.failedQueues")}
          </span>
          <AlertCircle className="size-4 text-rose-500" />
        </div>
        <div className="font-mono text-lg font-black text-rose-600 sm:text-xl dark:text-rose-400">
          {metrics.failedCount} {t("admin.notifications.taskUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.notifications.failedQueuesDesc")}
        </span>
      </div>
    </div>
  );
}
