"use client";

import React, { useState } from "react";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

  const handleAction = async (actionFn: (id: string) => Promise<void>) => {
    setIsActionLoading(true);
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
          <Badge variant="success" className="gap-1.5 py-1">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            {t("whatsapp.statusConnected")}
          </Badge>
        );
      case "PAIRING":
        return (
          <Badge variant="warning" className="gap-1.5 py-1">
            <span className="size-2 animate-ping rounded-full bg-amber-500" />
            {t("whatsapp.statusPairing")}
          </Badge>
        );
      case "HIBERNATED":
        return (
          <Badge variant="info" className="gap-1.5 py-1">
            <Moon className="size-3" />
            {t("whatsapp.statusHibernated")}
          </Badge>
        );
      case "DISCONNECTED":
      default:
        return (
          <Badge variant="neutral" className="gap-1.5 py-1">
            <span className="size-2 rounded-full bg-zinc-400" />
            {t("whatsapp.statusDisconnected")}
          </Badge>
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

          <DropdownMenu>
            <DropdownMenuTrigger
              className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full transition outline-none"
              aria-label="Opsi Perangkat"
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {device.status === "CONNECTED" && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleAction(onHibernate)}
                    className="cursor-pointer gap-2"
                  >
                    <Moon className="size-3.5" />
                    <span>{t("whatsapp.hibernate")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleAction(onDisconnect)}
                    className="cursor-pointer gap-2"
                  >
                    <Power className="size-3.5" />
                    <span>{t("whatsapp.disconnect")}</span>
                  </DropdownMenuItem>
                </>
              )}

              {device.status === "HIBERNATED" && (
                <DropdownMenuItem
                  onClick={() => handleAction(onWake)}
                  className="dark:text-wise-green cursor-pointer gap-2 font-bold text-emerald-700"
                >
                  <Sun className="size-3.5" />
                  <span>{t("whatsapp.wake")}</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleAction(onDelete)}
                className="cursor-pointer gap-2"
              >
                <Trash2 className="size-3.5" />
                <span>{t("whatsapp.delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
