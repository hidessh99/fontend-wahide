"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
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
  const { t, locale } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.devices.totalDevices")}
          </span>
          <Smartphone className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground font-mono text-lg font-black sm:text-xl">
          {metrics.totalCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("admin.devices.slotUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.devices.totalDevicesDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.devices.onlineActive")}
          </span>
          <Wifi className="dark:text-wise-green size-4 text-emerald-600" />
        </div>
        <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
          {metrics.onlineCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("admin.devices.deviceUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.devices.onlineActiveDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.devices.offline")}
          </span>
          <WifiOff className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground-secondary font-mono text-lg font-black sm:text-xl">
          {metrics.offlineCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("admin.devices.deviceUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.devices.offlineDesc")}
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {t("admin.devices.pendingHibernated")}
          </span>
          <QrCode className="size-4 text-amber-500" />
        </div>
        <div className="font-mono text-lg font-black text-amber-600 sm:text-xl dark:text-amber-400">
          {(metrics.qrPendingCount + metrics.hibernatedCount).toLocaleString(
            locale === "en" ? "en-US" : "id-ID"
          )}{" "}
          {t("admin.devices.deviceUnit")}
        </div>
        <span className="text-foreground-muted text-[10px]">
          {t("admin.devices.pendingHibernatedDesc", {
            qr: metrics.qrPendingCount,
            hibernated: metrics.hibernatedCount,
          })}
        </span>
      </div>
    </div>
  );
}
