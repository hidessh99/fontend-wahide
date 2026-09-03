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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">Total Perangkat</span>
          <Smartphone className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground font-mono text-lg font-black sm:text-xl">
          {metrics.totalCount.toLocaleString("id-ID")} Slot
        </div>
        <span className="text-foreground-muted text-[10px]">Terdaftar di platform</span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">Online Aktif</span>
          <Wifi className="dark:text-wise-green size-4 text-emerald-600" />
        </div>
        <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
          {metrics.onlineCount.toLocaleString("id-ID")} Perangkat
        </div>
        <span className="text-foreground-muted text-[10px]">Tersambung via whatsmeow socket</span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">Offline / Terputus</span>
          <WifiOff className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground-secondary font-mono text-lg font-black sm:text-xl">
          {metrics.offlineCount.toLocaleString("id-ID")} Perangkat
        </div>
        <span className="text-foreground-muted text-[10px]">Perlu re-link / reconnect</span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            Pending / Hibernasi
          </span>
          <QrCode className="size-4 text-amber-500" />
        </div>
        <div className="font-mono text-lg font-black text-amber-600 sm:text-xl dark:text-amber-400">
          {(metrics.qrPendingCount + metrics.hibernatedCount).toLocaleString("id-ID")} Perangkat
        </div>
        <span className="text-foreground-muted text-[10px]">
          {metrics.qrPendingCount} Scan QR &bull; {metrics.hibernatedCount} Hibernasi
        </span>
      </div>
    </div>
  );
}
