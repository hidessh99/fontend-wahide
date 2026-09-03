"use client";

import React, { useState } from "react";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  Smartphone,
  QrCode,
  Power,
  Moon,
  Sun,
  Trash2,
  Battery,
  BatteryCharging,
  BatteryLow,
  MoreVertical,
  Loader2,
  Clock,
} from "lucide-react";

interface DeviceCardProps {
  device: Device;
  onScanQR: (device: Device) => void;
  onDisconnect: (id: string) => Promise<void>;
  onHibernate: (id: string) => Promise<void>;
  onWake: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function DeviceCard({
  device,
  onScanQR,
  onDisconnect,
  onHibernate,
  onWake,
  onDelete,
}: DeviceCardProps) {
  const { t } = useI18n();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = async (actionFn: (id: string) => Promise<void>) => {
    setIsActionLoading(true);
    setShowMenu(false);
    try {
      await actionFn(device.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const renderStatusBadge = () => {
    switch (device.status) {
      case "CONNECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            {t("whatsapp.statusConnected")}
          </span>
        );
      case "PAIRING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span className="size-2 animate-ping rounded-full bg-amber-500" />
            {t("whatsapp.statusPairing")}
          </span>
        );
      case "HIBERNATED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-600 dark:text-sky-400">
            <Moon className="size-3" />
            {t("whatsapp.statusHibernated")}
          </span>
        );
      case "DISCONNECTED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-3 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <span className="size-2 rounded-full bg-zinc-400" />
            {t("whatsapp.statusDisconnected")}
          </span>
        );
    }
  };

  const renderBattery = () => {
    if (device.batteryLevel === null || device.batteryLevel === undefined) return null;

    const isLow = device.batteryLevel < 20;

    return (
      <div className="text-foreground-secondary flex items-center gap-1.5 text-xs font-semibold">
        {device.isCharging ? (
          <BatteryCharging className="text-dark-green dark:text-wise-green size-4" />
        ) : isLow ? (
          <BatteryLow className="size-4 text-rose-500" />
        ) : (
          <Battery className="text-foreground-muted size-4" />
        )}
        <span>{device.batteryLevel}%</span>
        {device.isCharging && (
          <span className="text-dark-green dark:text-wise-green text-[10px] font-bold">
            ({t("whatsapp.charging")})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="border-border bg-surface hover:border-foreground-muted/40 relative flex flex-col justify-between space-y-5 rounded-md border p-5 transition-all hover:shadow-lg sm:p-6 dark:bg-[#161715]">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted text-foreground-secondary flex size-11 items-center justify-center rounded-full">
            <Smartphone className="size-5" />
          </div>
          <div>
            <h2 className="text-foreground line-clamp-1 text-base font-extrabold tracking-tight sm:text-lg">
              {device.push_name || device.pushName || device.name || "WhatsApp Device"}
            </h2>
            <p className="text-foreground-secondary text-xs font-semibold">
              {device.phone || device.push_name || device.pushName || "Nomor Belum Tertaut"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderStatusBadge()}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="Opsi Perangkat"
            >
              <MoreVertical className="size-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="border-border bg-surface animate-in fade-in zoom-in-95 absolute top-9 right-0 z-50 w-44 rounded-md border py-1 text-xs font-semibold shadow-xl dark:bg-[#1b1d1a]">
                  {device.status === "CONNECTED" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(onHibernate)}
                        className="hover:bg-muted text-foreground flex w-full items-center gap-2 px-3.5 py-2 text-left"
                      >
                        <Moon className="size-3.5" />
                        <span>{t("whatsapp.hibernate")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(onDisconnect)}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                      >
                        <Power className="size-3.5" />
                        <span>{t("whatsapp.disconnect")}</span>
                      </button>
                    </>
                  )}

                  {device.status === "HIBERNATED" && (
                    <button
                      type="button"
                      onClick={() => handleAction(onWake)}
                      className="hover:bg-muted dark:text-wise-green flex w-full items-center gap-2 px-3.5 py-2 text-left font-bold text-emerald-700"
                    >
                      <Sun className="size-3.5" />
                      <span>{t("whatsapp.wake")}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAction(onDelete)}
                    className="border-border mt-1 flex w-full items-center gap-2 border-t px-3.5 py-2 text-left text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                  >
                    <Trash2 className="size-3.5" />
                    <span>{t("whatsapp.delete")}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Device Info & Status Row */}
      <div className="border-border/60 grid grid-cols-2 gap-3 border-y py-3 text-xs font-semibold">
        <div>
          <span className="text-foreground-muted mb-0.5 block text-[11px] tracking-wider uppercase">
            {t("whatsapp.battery")}
          </span>
          {renderBattery() || <span className="text-foreground-secondary">-</span>}
        </div>
        <div>
          <span className="text-foreground-muted mb-0.5 block text-[11px] tracking-wider uppercase">
            {t("whatsapp.lastActive")}
          </span>
          <div className="text-foreground-secondary flex items-center gap-1.5">
            <Clock className="text-foreground-muted size-3.5" />
            <span>
              {device.lastSeenAt
                ? new Date(device.lastSeenAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Baru saja"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div>
        {device.status === "CONNECTED" ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isActionLoading}
              onClick={() => handleAction(onHibernate)}
              className="border-border hover:border-foreground-muted flex-1 gap-1.5 rounded-full text-xs font-bold"
            >
              <Moon className="size-3.5" />
              <span>{t("whatsapp.hibernate")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isActionLoading}
              onClick={() => handleAction(onDisconnect)}
              className="flex-1 gap-1.5 rounded-full border-rose-500/20 text-xs font-bold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
            >
              <Power className="size-3.5" />
              <span>{t("whatsapp.disconnect")}</span>
            </Button>
          </div>
        ) : device.status === "HIBERNATED" ? (
          <Button
            variant="primaryPill"
            size="sm"
            disabled={isActionLoading}
            onClick={() => handleAction(onWake)}
            className="w-full gap-2 text-xs font-bold"
          >
            {isActionLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sun className="size-3.5" />
            )}
            <span>{t("whatsapp.wake")}</span>
          </Button>
        ) : (
          <Button
            variant="primaryPill"
            size="sm"
            disabled={isActionLoading}
            onClick={() => onScanQR(device)}
            className="w-full gap-2 text-xs font-bold"
          >
            <QrCode className="size-4" />
            <span>{t("whatsapp.scanQr")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
