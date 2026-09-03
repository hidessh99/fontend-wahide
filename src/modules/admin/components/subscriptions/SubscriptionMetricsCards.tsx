import React from "react";
import { Receipt, CheckCircle2, Clock, Sparkles } from "lucide-react";

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
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Langganan</span>
          <Receipt className="size-4 text-foreground-secondary" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-foreground">
          {metrics.totalCount.toLocaleString("id-ID")} Akun
        </div>
        <span className="text-[10px] text-foreground-muted">Terdaftar di platform</span>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Langganan Aktif</span>
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-wise-green">
          {metrics.activeCount.toLocaleString("id-ID")} Akun
        </div>
        <span className="text-[10px] text-foreground-muted">Memiliki kuota &amp; akses aktif</span>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Kedaluwarsa (Expired)</span>
          <Clock className="size-4 text-rose-500" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-rose-600 dark:text-rose-400">
          {metrics.expiredCount.toLocaleString("id-ID")} Akun
        </div>
        <span className="text-[10px] text-foreground-muted">Masa aktif telah berakhir</span>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Trial / Suspended</span>
          <Sparkles className="size-4 text-amber-500" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-amber-600 dark:text-amber-400">
          {(metrics.trialCount + metrics.suspendedCount).toLocaleString("id-ID")} Akun
        </div>
        <span className="text-[10px] text-foreground-muted">
          {metrics.trialCount} Uji Coba &bull; {metrics.suspendedCount} Ditangguhkan
        </span>
      </div>
    </div>
  );
}
