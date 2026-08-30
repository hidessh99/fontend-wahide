"use client";

import React, { useState } from "react";
import { Device } from "../types/whatsapp.types";
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {t("whatsapp.statusConnected")}
          </span>
        );
      case "PAIRING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="size-2 rounded-full bg-amber-500 animate-ping" />
            {t("whatsapp.statusPairing")}
          </span>
        );
      case "HIBERNATED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Moon className="size-3" />
            {t("whatsapp.statusHibernated")}
          </span>
        );
      case "DISCONNECTED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
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
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary">
        {device.isCharging ? (
          <BatteryCharging className="size-4 text-wise-green" />
        ) : isLow ? (
          <BatteryLow className="size-4 text-rose-500" />
        ) : (
          <Battery className="size-4 text-foreground-muted" />
        )}
        <span>{device.batteryLevel}%</span>
        {device.isCharging && <span className="text-[10px] text-wise-green font-bold">({t("whatsapp.charging")})</span>}
      </div>
    );
  };

  return (
    <div className="relative rounded-md border border-border bg-surface dark:bg-[#161715] p-5 sm:p-6 transition-all hover:border-foreground-muted/40 hover:shadow-lg flex flex-col justify-between space-y-5">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
            <Smartphone className="size-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight line-clamp-1">
              {device.name}
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              {device.phone || device.pushName || "Nomor Belum Tertaut"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderStatusBadge()}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="size-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground-muted hover:text-foreground transition cursor-pointer"
              aria-label="Opsi Perangkat"
            >
              <MoreVertical className="size-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-9 w-44 rounded-md border border-border bg-surface dark:bg-[#1b1d1a] shadow-xl z-50 py-1 font-semibold text-xs animate-in fade-in zoom-in-95">
                  {device.status === "CONNECTED" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(onHibernate)}
                        className="w-full text-left px-3.5 py-2 hover:bg-muted flex items-center gap-2 text-foreground"
                      >
                        <Moon className="size-3.5" />
                        <span>{t("whatsapp.hibernate")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(onDisconnect)}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2"
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
                      className="w-full text-left px-3.5 py-2 hover:bg-muted flex items-center gap-2 text-wise-green"
                    >
                      <Sun className="size-3.5" />
                      <span>{t("whatsapp.wake")}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAction(onDelete)}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2 border-t border-border mt-1"
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
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/60 text-xs font-semibold">
        <div>
          <span className="text-foreground-muted block text-[11px] uppercase tracking-wider mb-0.5">
            {t("whatsapp.battery")}
          </span>
          {renderBattery() || <span className="text-foreground-secondary">-</span>}
        </div>
        <div>
          <span className="text-foreground-muted block text-[11px] uppercase tracking-wider mb-0.5">
            {t("whatsapp.lastActive")}
          </span>
          <div className="flex items-center gap-1.5 text-foreground-secondary">
            <Clock className="size-3.5 text-foreground-muted" />
            <span>{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Baru saja"}</span>
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
              className="flex-1 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted"
            >
              <Moon className="size-3.5" />
              <span>{t("whatsapp.hibernate")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isActionLoading}
              onClick={() => handleAction(onDisconnect)}
              className="flex-1 rounded-full text-xs font-bold gap-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
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
            className="w-full text-xs font-bold gap-2"
          >
            {isActionLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Sun className="size-3.5" />}
            <span>{t("whatsapp.wake")}</span>
          </Button>
        ) : (
          <Button
            variant="primaryPill"
            size="sm"
            disabled={isActionLoading}
            onClick={() => onScanQR(device)}
            className="w-full text-xs font-bold gap-2"
          >
            <QrCode className="size-4" />
            <span>{t("whatsapp.scanQr")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
