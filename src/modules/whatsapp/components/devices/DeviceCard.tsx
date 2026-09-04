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
import { toast } from "sonner";
import {
  Smartphone,
  Phone,
  QrCode,
  Power,
  Moon,
  Sun,
  Trash2,
  MoreVertical,
  Loader2,
  Clock,
  Copy,
  Check,
  Info,
  ExternalLink,
} from "lucide-react";

export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  const clean = phone.replace(/[^0-9]/g, "");
  if (!clean) return phone;
  if (clean.startsWith("62") && clean.length >= 10) {
    return `+62 ${clean.slice(2, 5)}-${clean.slice(5, 9)}-${clean.slice(9)}`;
  }
  return `+${clean}`;
}

interface DeviceCardProps {
  device: Device;
  onScanQR: (device: Device) => void;
  onDisconnect: (id: string) => Promise<void>;
  onHibernate: (id: string) => Promise<void>;
  onWake: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onViewDetail?: (device: Device) => void;
}

export function DeviceCard({
  device,
  onScanQR,
  onDisconnect,
  onHibernate,
  onWake,
  onDelete,
  onViewDetail,
}: DeviceCardProps) {
  const { t } = useI18n();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleAction = async (e: React.MouseEvent, actionFn: (id: string) => Promise<void>) => {
    e.stopPropagation();
    setIsActionLoading(true);
    try {
      await actionFn(device.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(device.id);
    setCopiedId(true);
    toast.success(t("whatsapp.deviceIdCopied") || "Device ID berhasil disalin!");
    setTimeout(() => setCopiedId(false), 2000);
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

  return (
    <div
      onClick={() => onViewDetail?.(device)}
      className="border-border bg-surface hover:border-wise-green/60 group relative flex cursor-pointer flex-col justify-between space-y-5 rounded-xl border p-5 transition-all hover:shadow-lg sm:p-6 dark:bg-[#161715]"
      title={t("whatsapp.viewDetail") || "Klik untuk melihat detail perangkat"}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted text-foreground-secondary group-hover:bg-wise-green/15 group-hover:text-wise-green flex size-11 items-center justify-center rounded-full transition">
            <Smartphone className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green line-clamp-1 text-base font-extrabold tracking-tight transition sm:text-lg">
                {device.push_name || device.pushName || device.name || "WhatsApp Device"}
              </h2>
              <ExternalLink className="text-foreground-muted size-3.5 opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="text-foreground-secondary mt-0.5 flex items-center gap-1.5 text-xs font-semibold">
              {device.phone ? (
                <>
                  <Phone className="text-foreground-muted size-3 shrink-0" />
                  <span className="font-mono">{formatPhoneNumber(device.phone)}</span>
                </>
              ) : (
                <span className="text-foreground-muted font-sans text-[11px] italic">
                  {device.status === "PAIRING" ? "Menunggu Scan QR..." : "Nomor Belum Tertaut"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {renderStatusBadge()}

          <DropdownMenu>
            <DropdownMenuTrigger
              className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full transition outline-none"
              aria-label="Opsi Perangkat"
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail?.(device);
                }}
                className="cursor-pointer gap-2"
              >
                <Info className="size-3.5" />
                <span>{t("whatsapp.viewDetail") || "Lihat Detail"}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {device.status === "CONNECTED" && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => handleAction(e, onHibernate)}
                    className="cursor-pointer gap-2"
                  >
                    <Moon className="size-3.5" />
                    <span>{t("whatsapp.hibernate")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => handleAction(e, onDisconnect)}
                    className="cursor-pointer gap-2"
                  >
                    <Power className="size-3.5" />
                    <span>{t("whatsapp.disconnect")}</span>
                  </DropdownMenuItem>
                </>
              )}

              {device.status === "HIBERNATED" && (
                <DropdownMenuItem
                  onClick={(e) => handleAction(e, onWake)}
                  className="dark:text-wise-green cursor-pointer gap-2 font-bold text-emerald-700"
                >
                  <Sun className="size-3.5" />
                  <span>{t("whatsapp.wake")}</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => handleAction(e, onDelete)}
                className="cursor-pointer gap-2"
              >
                <Trash2 className="size-3.5" />
                <span>{t("whatsapp.delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Device Info & Status Row (Replacing Battery with Device ID & Last Active) */}
      <div className="border-border/60 grid grid-cols-2 gap-3 border-y py-3 text-xs font-semibold">
        {/* Device ID */}
        <div className="min-w-0">
          <span className="text-foreground-muted mb-0.5 block text-[11px] tracking-wider uppercase">
            {t("whatsapp.deviceId") || "Device ID"}
          </span>
          <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
            <span className="max-w-[120px] truncate select-all" title={device.id}>
              {device.id}
            </span>
            <button
              onClick={handleCopyId}
              className="hover:text-dark-green dark:hover:text-wise-green text-foreground-muted shrink-0 cursor-pointer p-0.5 transition"
              title={t("whatsapp.copyDeviceId") || "Salin Device ID"}
            >
              {copiedId ? (
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        </div>

        {/* Last Active */}
        <div>
          <span className="text-foreground-muted mb-0.5 block text-[11px] tracking-wider uppercase">
            {t("whatsapp.lastActive")}
          </span>
          <div className="text-foreground-secondary flex items-center gap-1.5">
            <Clock className="text-foreground-muted size-3.5 shrink-0" />
            <span className="truncate">
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
      <div onClick={(e) => e.stopPropagation()}>
        {device.status === "CONNECTED" ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isActionLoading}
              onClick={(e) => handleAction(e, onHibernate)}
              className="border-border hover:border-foreground-muted flex-1 gap-1.5 rounded-full text-xs font-bold"
            >
              <Moon className="size-3.5" />
              <span>{t("whatsapp.hibernate")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isActionLoading}
              onClick={(e) => handleAction(e, onDisconnect)}
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
            onClick={(e) => handleAction(e, onWake)}
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
