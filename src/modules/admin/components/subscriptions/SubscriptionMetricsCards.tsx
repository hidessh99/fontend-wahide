"use client";

import React from "react";
import { Receipt, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface SubscriptionMetrics {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  trialCount: number;
  suspendedCount: number;
}

interface SubscriptionMetricsCardsProps {
  metrics: SubscriptionMetrics;
}

export function SubscriptionMetricsCards({ metrics }: SubscriptionMetricsCardsProps) {
  const { t, locale } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.subscriptions.totalCount")}
          </span>
          <Receipt className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground font-mono text-lg font-black sm:text-xl">
          {metrics.totalCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")}{" "}
          {t("admin.subscriptions.accountUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.subscriptions.totalDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.subscriptions.activeSubscriptions")}
          </span>
          <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
        </div>
        <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
          {metrics.activeCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")}{" "}
          {t("admin.subscriptions.accountUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.subscriptions.activeSubscriptionsDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.subscriptions.expiredSubscriptions")}
          </span>
          <Clock className="size-4 text-rose-500" />
        </div>
        <div className="font-mono text-lg font-black text-rose-600 sm:text-xl dark:text-rose-400">
          {metrics.expiredCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")}{" "}
          {t("admin.subscriptions.accountUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.subscriptions.expiredSubscriptionsDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.subscriptions.trialSuspended")}
          </span>
          <Sparkles className="size-4 text-amber-500" />
        </div>
        <div className="font-mono text-lg font-black text-amber-600 sm:text-xl dark:text-amber-400">
          {(metrics.trialCount + metrics.suspendedCount).toLocaleString(
            locale === "en" ? "en-US" : "id-ID"
          )}{" "}
          {t("admin.subscriptions.accountUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.subscriptions.trialSuspendedDesc", {
            trial: metrics.trialCount,
            suspended: metrics.suspendedCount,
          })}
        </span>
      </div>
    </div>
  );
}
