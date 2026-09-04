"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { MessageSquare, CheckCircle2, CheckCheck, AlertCircle } from "lucide-react";

export interface MessageMetrics {
  totalCount: number;
  outboundCount: number;
  inboundCount: number;
  deliveredCount: number;
  sentCount: number;
  readCount: number;
  failedCount: number;
}

interface MessageMetricsCardsProps {
  metrics: MessageMetrics;
}

export function MessageMetricsCards({ metrics }: MessageMetricsCardsProps) {
  const { t, locale } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.messages.totalMessages")}
          </span>
          <MessageSquare className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground font-mono text-lg font-black sm:text-xl">
          {metrics.totalCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")}{" "}
          {t("admin.messages.messageUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.messages.metricsTotalDesc", {
            outbound: metrics.outboundCount,
            inbound: metrics.inboundCount,
          })}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.messages.delivered")}
          </span>
          <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
        </div>
        <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
          {(metrics.deliveredCount + metrics.sentCount).toLocaleString(
            locale === "en" ? "en-US" : "id-ID"
          )}{" "}
          {t("admin.messages.messageUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.messages.deliveredDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.messages.readCount")}
          </span>
          <CheckCheck className="size-4 text-blue-500" />
        </div>
        <div className="font-mono text-lg font-black text-blue-600 sm:text-xl dark:text-blue-400">
          {metrics.readCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")}{" "}
          {t("admin.messages.messageUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.messages.readDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.messages.failedCount")}
          </span>
          <AlertCircle className="size-4 text-rose-500" />
        </div>
        <div className="font-mono text-lg font-black text-rose-600 sm:text-xl dark:text-rose-400">
          {metrics.failedCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")}{" "}
          {t("admin.messages.messageUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.messages.failedDesc")}
        </span>
      </div>
    </div>
  );
}
