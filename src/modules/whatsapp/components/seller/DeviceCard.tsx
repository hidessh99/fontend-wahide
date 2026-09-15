"use client";

import React, { useState } from "react";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClipboard } from "@/hooks/useClipboard";
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
  Webhook,
} from "lucide-react";
import { formatDisplayPhone } from "@/lib/phone";

export const formatPhoneNumber = formatDisplayPhone;

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
  const { isCopied: copiedId, copy } = useClipboard();

  const handleAction = async (
    e: React.MouseEvent,
    actionFn: (id: string) => Promise<void>,
  ) => {
    e.stopPropagation();
    setIsActionLoading(true);
    try {
      await actionFn(device.id);
    } catch (err: unknown) {
      console.warn("Device action handled:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copy(device.id);
    if (success) {
      toast.success(
        t("whatsapp.deviceIdCopied") || "Device ID berhasil disalin!",
      );
    }
  };

  const isOverLimit = Boolean(device.is_over_limit || device.isOverLimit);

  const renderStatusBadge = () => {
    if (isOverLimit) {
      return (
        <Badge
          variant="destructive"
          className="gap-1.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
        >
          <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
          {t("whatsapp.statusOverLimit") || "Melebihi Kuota"}
        </Badge>
      );
    }

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
    <Card
      onClick={() => onViewDetail?.(device)}
      className={`group relative flex cursor-pointer flex-col justify-between space-y-5 p-5 transition-all hover:shadow-lg sm:p-6 ${
        isOverLimit
          ? "border-rose-500/40 bg-rose-500/2 hover:border-rose-500/60"
          : "hover:border-wise-green/60"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="bg-muted text-foreground-secondary group-hover:bg-wise-green/15 group-hover:text-wise-green flex size-11 shrink-0 items-center justify-center rounded-full transition">
            <Smartphone className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green line-clamp-2 text-sm font-extrabold tracking-tight leading-snug break-words transition sm:line-clamp-1 sm:text-lg">
                {device.push_name ||
                  device.pushName ||
                  device.name ||
                  "WhatsApp Device"}
              </h2>
              <ExternalLink className="text-foreground-muted size-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="text-foreground-secondary mt-0.5 flex items-center gap-1.5 text-xs font-semibold truncate">
              {device.phone ? (
                <>
                  <Phone className="text-foreground-muted size-3 shrink-0" />
                  <span className="truncate font-mono">
                    {formatPhoneNumber(device.phone)}
                  </span>
                </>
              ) : (
                <span className="text-foreground-muted truncate font-sans text-[11px] italic">
                  {device.status === "PAIRING"
                    ? t("whatsapp.waitingScanQR")
                    : t("whatsapp.numberNotLinked")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {Boolean(device.webhook_url || device.webhookUrl) && (
            <Tooltip>
              <TooltipTrigger>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
                  <Webhook className="size-2.5" />
                  <span>Hook</span>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {t("whatsapp.customWebhookActive")}{" "}
                  {device.webhook_url || device.webhookUrl}
                </span>
              </TooltipContent>
            </Tooltip>
          )}
          {renderStatusBadge()}

          <DropdownMenu>
            <DropdownMenuTrigger
              className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full transition outline-none"
              aria-label={t("whatsapp.deviceOptionsAria")}
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

      {/* Device Info & Status Row */}
      <div>
        <Separator className="mb-3" />
        <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
          {/* Device ID */}
          <div className="min-w-0">
            <span className="text-foreground-muted mb-0.5 block text-[11px] tracking-wider uppercase">
              {t("whatsapp.deviceId") || "Device ID"}
            </span>
            <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
              <span className="max-w-30 truncate select-all" title={device.id}>
                {device.id}
              </span>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={handleCopyId}
                      className="hover:text-dark-green dark:hover:text-wise-green text-foreground-muted shrink-0 cursor-pointer p-0.5 transition"
                    />
                  }
                >
                  {copiedId ? (
                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {copiedId
                    ? t("whatsapp.copied")
                    : t("whatsapp.copyDeviceId") || "Salin Device ID"}
                </TooltipContent>
              </Tooltip>
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
        <Separator className="mt-3" />
      </div>

      {/* Card Action Footer */}
      <div onClick={(e) => e.stopPropagation()}>
        {isOverLimit ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isActionLoading}
            onClick={(e) => handleAction(e, onDelete)}
            className="w-full gap-2 rounded-full border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
          >
            {isActionLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            <span>
              {t("whatsapp.deleteOverlimitDevice") || "Hapus Perangkat Ini"}
            </span>
          </Button>
        ) : device.status === "CONNECTED" ? (
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
    </Card>
  );
}
