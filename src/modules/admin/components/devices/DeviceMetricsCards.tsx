import React from "react";
import { Smartphone, Wifi, WifiOff, QrCode } from "lucide-react";

export interface DeviceMetrics {
  totalCount: number;
  onlineCount: number;
  offlineCount: number;
  qrPendingCount: number;
  hibernatedCount: number;
  bannedCount?: number;
}

interface DeviceMetricsCardsProps {
  metrics: DeviceMetrics;
}

export function DeviceMetricsCards({ metrics }: DeviceMetricsCardsProps) {
  return (
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
  );
}
