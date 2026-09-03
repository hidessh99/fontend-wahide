"use client";

import React, { useState } from "react";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  Smartphone,
  X,
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

function getDeviceStatusVisual(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ONLINE":
      return {
        label: "ONLINE (Tersambung)",
        color: "bg-emerald-500/10 text-emerald-700 dark:text-wise-green border-emerald-500/20",
        icon: <Wifi className="size-3.5" />,
      };
    case "OFFLINE":
      return {
        label: "OFFLINE (Terputus)",
        color: "bg-muted text-foreground-secondary border-border",
        icon: <WifiOff className="size-3.5" />,
      };
    case "QR_PENDING":
      return {
        label: "QR_PENDING (Menunggu Scan)",
        color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        icon: <QrCode className="size-3.5" />,
      };
    case "HIBERNATED":
      return {
        label: "HIBERNATED (Hemat Memori)",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: <Moon className="size-3.5" />,
      };
    case "BANNED":
      return {
        label: "BANNED (Diblokir WhatsApp)",
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !device) return null;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      toast.success(`${label} disalin ke clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Gagal menyalin teks");
    }
  };

  const statusVisual = getDeviceStatusVisual(device.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="border-border bg-surface animate-in fade-in zoom-in-95 relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col space-y-4 rounded-2xl border p-5 shadow-2xl sm:p-6 dark:bg-[#161715]">
        {/* Header */}
        <div className="border-border flex shrink-0 items-start justify-between gap-3 border-b pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Smartphone className="size-4.5" />
            </div>
            <div>
              <h2 className="text-foreground text-base font-black tracking-tight">
                {device.pushName}
              </h2>
              <span className="text-foreground-muted block font-mono text-[11px]">
                ID: {device.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-xs">
          {/* Status Badge */}
          <div className="border-border bg-muted/20 flex items-center justify-between rounded-xl border p-3">
            <span className="text-foreground-secondary text-[11px] font-bold tracking-wider uppercase">
              Status Koneksi Live:
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
                <span className="text-[10px] font-bold uppercase">Trust Score</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {device.trustScore} / 100
              </div>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">Warmup</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                Hari {device.warmupDay}
              </div>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400">
                <Send className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">Kirim Hari Ini</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {device.dailySentCount}
              </div>
            </div>
          </div>

          {/* Technical Metadata Grid */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-xl border p-3.5 text-xs">
            {/* WhatsApp JID */}
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Smartphone className="text-foreground-muted size-3.5" />
                <span>Nomor WhatsApp / JID:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono font-bold select-text">
                  {device.jid || "(Belum terhubung)"}
                </span>
                {device.jid && (
                  <button
                    type="button"
                    onClick={() => handleCopy(device.jid, "Nomor JID")}
                    className="hover:bg-muted text-foreground-muted hover:text-foreground cursor-pointer rounded p-1"
                    title="Salin JID"
                  >
                    {copiedField === "Nomor JID" ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Tenant ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Building2 className="text-foreground-muted size-3.5" />
                <span>Tenant ID:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono text-[11px] font-bold select-text">
                  {device.tenantId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(device.tenantId, "Tenant ID")}
                  className="hover:bg-muted text-foreground-muted hover:text-foreground cursor-pointer rounded p-1"
                  title="Salin Tenant ID"
                >
                  {copiedField === "Tenant ID" ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Device ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">Device ID (ULID):</span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground-muted font-mono text-[11px] select-text">
                  {device.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(device.id, "Device ID")}
                  className="hover:bg-muted text-foreground-muted hover:text-foreground cursor-pointer rounded p-1"
                  title="Salin Device ID"
                >
                  {copiedField === "Device ID" ? (
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
                <span>Terakhir Aktif (Last Seen):</span>
              </span>
              <span className="text-foreground font-mono text-[11px] font-semibold">
                {device.lastSeenAt ? formatDateTime(device.lastSeenAt) : "(Belum pernah online)"}
              </span>
            </div>

            {/* Created At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">Dibuat Pada:</span>
              <span className="text-foreground-secondary font-mono text-[11px]">
                {formatDateTime(device.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border flex shrink-0 justify-end border-t pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted h-8.5 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
