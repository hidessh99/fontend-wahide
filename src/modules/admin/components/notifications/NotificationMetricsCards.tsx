import React from "react";
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
  return (
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
  );
}
