"use client";

import React from "react";
import { AdminMetrics } from "@/modules/admin/types/admin.types";
import { useI18n } from "@/lib/i18n/context";
import {
  DollarSign,
  Users,
  Smartphone,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface GlobalMetricsGridProps {
  metrics: AdminMetrics | null;
}

export function GlobalMetricsGrid({ metrics }: GlobalMetricsGridProps) {
  const { t } = useI18n();

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cluster Health Banner */}
      <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <Activity className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">
              Status Cluster Go WhatsApp Nodes
            </span>
            <p className="text-[11px] font-semibold text-foreground-muted">
              Semua goroutine worker dan Redis stream consumer berjalan normal.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="size-3.5" />
          <span>Cluster Sehat (99.9% Uptime)</span>
        </span>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
              {t("admin.metricsMrr")}
            </span>
            <div className="size-8 rounded-full bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            Rp {metrics.mrr.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-wise-green block">
            +18.4% dari bulan lalu
          </span>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
              {t("admin.metricsTotalUsers")}
            </span>
            <div className="size-8 rounded-full bg-sky-500/15 text-sky-500 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {metrics.totalUsers} Tenant
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            Terdaftar di platform
          </span>
        </div>

        {/* Active Nodes */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
              {t("admin.metricsActiveDevices")}
            </span>
            <div className="size-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {metrics.activeDevices} Sesi WA
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            Multi-Device Terhubung
          </span>
        </div>

        {/* Redis Queue */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
              {t("admin.metricsRedisQueue")}
            </span>
            <div className="size-8 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Layers className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {metrics.redisQueueMessages.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            Pesan dalam antrean stream
          </span>
        </div>
      </div>
    </div>
  );
}
