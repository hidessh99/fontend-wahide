"use client";

import React from "react";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Smartphone,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Flame,
  Send,
  Clock,
  Radio,
  Wifi,
  WifiOff,
  QrCode,
  Moon,
  Ban,
} from "lucide-react";

interface DeviceDetailModalProps {
  device: AdminDeviceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function getDeviceStatusVisual(status: string, t: (key: string, params?: Record<string, string | number>) => string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ONLINE":
      return {
        label: t("admin.devices.statusOnline"),
        color: "bg-emerald-500/10 text-emerald-700 dark:text-wise-green border-emerald-500/20",
        icon: <Wifi className="size-3.5" />,
      };
    case "OFFLINE":
      return {
        label: t("admin.devices.statusOffline"),
        color: "bg-muted text-foreground-secondary border-border",
        icon: <WifiOff className="size-3.5" />,
      };
    case "QR_PENDING":
      return {
        label: t("admin.devices.statusQrPending"),
        color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        icon: <QrCode className="size-3.5" />,
      };
    case "HIBERNATED":
      return {
        label: t("admin.devices.statusHibernated"),
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: <Moon className="size-3.5" />,
      };
    case "BANNED":
      return {
        label: t("admin.devices.statusBanned"),
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: <Ban className="size-3.5" />,
      };
    default:
      return {
        label: status,
        color: "bg-muted text-foreground-secondary border-border",
        icon: <Radio className="size-3.5" />,
      };
  }
}

export function DeviceDetailModal({ device, isOpen, onClose }: DeviceDetailModalProps) {
  const { t, locale } = useI18n();
  const { copied: copiedField, copy } = useClipboard<string>();

  if (!device) return null;

  const handleCopy = async (text: string, label: string) => {
    const success = await copy(text, label);
    if (success) {
      toast.success(t("admin.devices.copiedToast", { field: label }), { id: "clipboard-copy" });
    } else {
      toast.error(t("admin.devices.copyFailedToast"), { id: "clipboard-copy" });
    }
  };

  const statusVisual = getDeviceStatusVisual(device.status, t);

  const formatLocalizedDateTime = (dateInput: string | Date | number): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-2.5 border-b p-5 pb-3.5 text-left sm:p-6">
          <div className="dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <Smartphone className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-base font-black tracking-tight">
              {device.pushName}
            </DialogTitle>
            <span className="text-foreground-muted block font-mono text-[11px]">
              ID: {device.id}
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Status Badge */}
          <div className="border-border bg-muted/20 flex items-center justify-between rounded-xl border p-3">
            <span className="text-foreground-secondary text-[11px] font-bold tracking-wider uppercase">
              {t("admin.devices.liveConnectionStatus")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black tracking-wider uppercase ${statusVisual.color}`}
            >
              {statusVisual.icon}
              <span>{statusVisual.label}</span>
            </span>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3 text-center">
              <div className="dark:text-wise-green flex items-center justify-center gap-1 text-emerald-600">
                <ShieldCheck className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">{t("admin.devices.colTrustScore")}</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {device.trustScore} / 100
              </div>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">{t("admin.devices.warmupLabel")}</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {t("admin.devices.warmupDay", { day: device.warmupDay })}
              </div>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400">
                <Send className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">{t("admin.devices.dailySent")}</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {device.dailySentCount}
              </div>
            </div>
          </div>

          {/* Identity & Technical Detail Card */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-xl border p-4">
            <span className="text-foreground-secondary block text-[11px] font-bold tracking-wider uppercase">
              {t("admin.devices.technicalDetailsTitle")}
            </span>

            {/* JID */}
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold">{t("admin.devices.colJid")}:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono text-[11px] font-bold">
                  {device.jid || t("admin.devices.notConnected")}
                </span>
                {device.jid && (
                  <button
                    type="button"
                    onClick={() => handleCopy(device.jid, "WhatsApp JID")}
                    className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5"
                    title={t("admin.devices.copyJid")}
                  >
                    {copiedField === "WhatsApp JID" ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Push Name */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">
                {t("admin.devices.profileName")}
              </span>
              <span className="text-foreground font-bold">{device.pushName}</span>
            </div>

            {/* Tenant ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
                <Building2 className="text-foreground-muted size-3" />
                <span>{t("admin.devices.ownerTenant")}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono text-[11px] font-semibold">
                  {device.tenantId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(device.tenantId, "Tenant ID")}
                  className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5"
                  title={t("admin.devices.copyTenantId")}
                >
                  {copiedField === "Tenant ID" ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Last Seen At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Clock className="text-foreground-muted size-3.5" />
                <span>{t("admin.devices.lastSeen")}</span>
              </span>
              <span className="text-foreground font-mono text-[11px] font-semibold">
                {device.lastSeenAt ? formatLocalizedDateTime(device.lastSeenAt) : t("admin.devices.neverOnline")}
              </span>
            </div>

            {/* Created At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">{t("admin.devices.createdAt")}</span>
              <span className="text-foreground-secondary font-mono text-[11px]">
                {formatLocalizedDateTime(device.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row justify-end rounded-none border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted h-8.5 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            {t("admin.devices.closeBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
