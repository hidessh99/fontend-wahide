"use client";

import React, { useState } from "react";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { useClipboard } from "@/hooks/useClipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import { formatPhoneNumber } from "./DeviceCard";
import { toast } from "sonner";
import {
  Smartphone,
  Phone,
  QrCode,
  Power,
  Moon,
  Sun,
  ShieldCheck,
  Calendar,
  Copy,
  Check,
  Activity,
  Cpu,
  Loader2,
} from "lucide-react";

interface DeviceDetailModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onScanQR?: (device: Device) => void;
  onDisconnect?: (id: string) => Promise<void>;
  onHibernate?: (id: string) => Promise<void>;
  onWake?: (id: string) => Promise<void>;
}

export function DeviceDetailModal({
  device,
  isOpen,
  onClose,
  onScanQR,
  onDisconnect,
  onHibernate,
  onWake,
}: DeviceDetailModalProps) {
  const { t, locale } = useI18n();
  const { copied: copiedField, copy } = useClipboard<string>();
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (!device) return null;

  const handleCopy = async (text: string, fieldName: string) => {
    const success = await copy(text, fieldName);
    if (success) {
      toast.success(`${fieldName} ${t("whatsapp.deviceIdCopied") || "berhasil disalin!"}`);
    }
  };

  const handleAction = async (actionFn: (id: string) => Promise<void>) => {
    setIsActionLoading(true);
    try {
      await actionFn(device.id);
    } catch (err) {
      console.warn("Device action error:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDateTime = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "-";
      return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    } catch {
      return "-";
    }
  };

  const renderStatusBadge = () => {
    switch (device.status) {
      case "CONNECTED":
        return (
          <Badge variant="success" className="gap-1.5 py-1 text-xs font-bold">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            {t("whatsapp.statusConnected")}
          </Badge>
        );
      case "PAIRING":
        return (
          <Badge variant="warning" className="gap-1.5 py-1 text-xs font-bold">
            <span className="size-2 animate-ping rounded-full bg-amber-500" />
            {t("whatsapp.statusPairing")}
          </Badge>
        );
      case "HIBERNATED":
        return (
          <Badge variant="info" className="gap-1.5 py-1 text-xs font-bold">
            <Moon className="size-3" />
            {t("whatsapp.statusHibernated")}
          </Badge>
        );
      case "DISCONNECTED":
      default:
        return (
          <Badge variant="neutral" className="gap-1.5 py-1 text-xs font-bold">
            <span className="size-2 rounded-full bg-zinc-400" />
            {t("whatsapp.statusDisconnected")}
          </Badge>
        );
    }
  };

  const trustScore = device.trustScore ?? 10;
  const warmupDay = device.warmupDay ?? 1;
  const dailySent = device.dailySentCount ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl dark:bg-[#161715]">
        {/* Sticky Header */}
        <DialogHeader className="border-border/80 shrink-0 space-y-2 border-b p-5 pr-12 text-left sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
              <Smartphone className="size-6" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <DialogTitle className="text-foreground truncate text-lg font-extrabold tracking-tight sm:text-xl">
                  {device.push_name || device.pushName || device.name || "WhatsApp Device"}
                </DialogTitle>
                {renderStatusBadge()}
              </div>
              <div className="text-foreground-secondary flex items-center gap-2 text-xs font-semibold">
                {device.phone ? (
                  <>
                    <Phone className="text-foreground-muted size-3.5" />
                    <span className="font-mono">{formatPhoneNumber(device.phone)}</span>
                  </>
                ) : (
                  <span className="text-foreground-muted italic">Nomor belum terhubung</span>
                )}
              </div>
              <DialogDescription className="text-foreground-secondary line-clamp-1 text-[11px] font-medium">
                {t("whatsapp.detailModalSubtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs font-semibold sm:p-6">
          {/* Identitas Perangkat */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="text-foreground flex items-center gap-2 text-xs font-black tracking-wider uppercase">
              <Cpu className="dark:text-wise-green size-4 text-emerald-700" />
              <span>Identitas & Parameter Sesi</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Device ID */}
              <div className="border-border/60 bg-surface rounded-lg border p-3 dark:bg-[#161715]">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.deviceId") || "Device ID"}
                </span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-foreground font-mono text-xs font-bold select-all">
                    {device.id}
                  </span>
                  <button
                    onClick={() => handleCopy(device.id, "Device ID")}
                    className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-6 shrink-0 cursor-pointer items-center justify-center rounded transition"
                    title={t("whatsapp.copyDeviceId") || "Salin Device ID"}
                  >
                    {copiedField === "Device ID" ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* JID */}
              <div className="border-border/60 bg-surface rounded-lg border p-3 dark:bg-[#161715]">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.jidLabel") || "WhatsApp JID"}
                </span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-foreground truncate font-mono text-xs font-bold select-all">
                    {device.jid || "-"}
                  </span>
                  {device.jid && (
                    <button
                      onClick={() => handleCopy(device.jid || "", "WhatsApp JID")}
                      className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-6 shrink-0 cursor-pointer items-center justify-center rounded transition"
                      title="Salin JID"
                    >
                      {copiedField === "WhatsApp JID" ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Telemetri Anti-Ban & Performa Slot */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="text-foreground flex items-center gap-2 text-xs font-black tracking-wider uppercase">
              <ShieldCheck className="dark:text-wise-green size-4 text-emerald-700" />
              <span>Kesehatan Slot & Anti-Ban Telemetry</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Trust Score */}
              <div className="border-border/60 bg-surface rounded-lg border p-3 dark:bg-[#161715]">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.trustScoreLabel") || "Skor Reputasi"}
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="dark:text-wise-green font-mono text-lg font-extrabold text-emerald-700">
                    {trustScore}
                  </span>
                  <span className="text-foreground-muted text-xs">/ 10</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(100, (trustScore / 10) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Warmup Day */}
              <div className="border-border/60 bg-surface rounded-lg border p-3 dark:bg-[#161715]">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.warmupDayLabel") || "Fase Pemanasan"}
                </span>
                <div className="text-foreground mt-1 text-sm font-extrabold">
                  {t("whatsapp.dayUnit", { day: String(warmupDay) }) || `Hari ke-${warmupDay}`}
                </div>
                <span className="text-foreground-muted mt-1 block text-[10px] font-normal">
                  Anti-ban cooldown aktif
                </span>
              </div>

              {/* Messages Sent Today */}
              <div className="border-border/60 bg-surface rounded-lg border p-3 dark:bg-[#161715]">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.dailySentCountLabel") || "Pesan Hari Ini"}
                </span>
                <div className="text-foreground mt-1 flex items-baseline gap-1">
                  <span className="font-mono text-lg font-extrabold">{dailySent}</span>
                  <span className="text-foreground-muted text-xs">pesan</span>
                </div>
                <span className="text-foreground-muted mt-1 block text-[10px] font-normal">
                  Reset otomatis jam 00:00
                </span>
              </div>
            </div>
          </div>

          {/* Riwayat Waktu Koneksi */}
          <div className="border-border/60 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Last Active */}
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3.5 dark:bg-[#10110e]">
              <Activity className="dark:text-wise-green size-4 shrink-0 text-emerald-700" />
              <div>
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.lastSeenLabel") || "Terakhir Aktif"}
                </span>
                <span className="text-foreground font-mono font-bold">
                  {formatDateTime(device.lastSeenAt)}
                </span>
              </div>
            </div>

            {/* Created At */}
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3.5 dark:bg-[#10110e]">
              <Calendar className="text-foreground-muted size-4 shrink-0" />
              <div>
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.connectedAtLabel") || "Tanggal Ditautkan"}
                </span>
                <span className="text-foreground font-mono font-bold">
                  {formatDateTime(device.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <DialogFooter className="border-border/70 bg-muted/20 flex shrink-0 items-center justify-between border-t p-4 sm:justify-between sm:p-5 dark:bg-[#10110e]">
          <div className="flex items-center gap-2">
            {device.status === "HIBERNATED" && onWake && (
              <Button
                variant="primaryPill"
                size="sm"
                disabled={isActionLoading}
                onClick={() => handleAction(onWake)}
                className="gap-2 text-xs font-bold"
              >
                {isActionLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sun className="size-3.5" />
                )}
                <span>{t("whatsapp.wake")}</span>
              </Button>
            )}

            {device.status === "CONNECTED" && onHibernate && (
              <Button
                variant="outline"
                size="sm"
                disabled={isActionLoading}
                onClick={() => handleAction(onHibernate)}
                className="border-border gap-2 rounded-full text-xs font-bold"
              >
                {isActionLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Moon className="size-3.5" />
                )}
                <span>{t("whatsapp.hibernate")}</span>
              </Button>
            )}

            {device.status === "CONNECTED" && onDisconnect && (
              <Button
                variant="outline"
                size="sm"
                disabled={isActionLoading}
                onClick={() => handleAction(onDisconnect)}
                className="border-border gap-2 rounded-full text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                <Power className="size-3.5" />
                <span>{t("whatsapp.disconnect")}</span>
              </Button>
            )}

            {(device.status === "DISCONNECTED" || device.status === "PAIRING") && onScanQR && (
              <Button
                variant="primaryPill"
                size="sm"
                onClick={() => {
                  onClose();
                  onScanQR(device);
                }}
                className="gap-2 text-xs font-bold"
              >
                <QrCode className="size-3.5" />
                <span>{t("whatsapp.scanQr")}</span>
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border text-xs font-bold"
          >
            {t("whatsapp.btnClose") || "Tutup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
