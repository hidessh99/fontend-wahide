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

export function DeviceDetailModal({
  device,
  isOpen,
  onClose,
}: DeviceDetailModalProps) {
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
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface dark:bg-[#161715] shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <Smartphone className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground tracking-tight">
                {device.pushName}
              </h2>
              <span className="font-mono text-[11px] text-foreground-muted block">
                ID: {device.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
          {/* Status Badge */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wider">
              Status Koneksi Live:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusVisual.color}`}
            >
              {statusVisual.icon}
              <span>{statusVisual.label}</span>
            </span>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl border border-border bg-muted/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-wise-green">
                <ShieldCheck className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">Trust Score</span>
              </div>
              <div className="text-base font-black font-mono text-foreground">
                {device.trustScore} / 100
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border bg-muted/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">Warmup</span>
              </div>
              <div className="text-base font-black font-mono text-foreground">
                Hari {device.warmupDay}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border bg-muted/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400">
                <Send className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">Kirim Hari Ini</span>
              </div>
              <div className="text-base font-black font-mono text-foreground">
                {device.dailySentCount}
              </div>
            </div>
          </div>

          {/* Technical Metadata Grid */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2.5 text-xs">
            {/* WhatsApp JID */}
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-foreground-muted" />
                <span>Nomor WhatsApp / JID:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-foreground select-text">
                  {device.jid || "(Belum terhubung)"}
                </span>
                {device.jid && (
                  <button
                    type="button"
                    onClick={() => handleCopy(device.jid, "Nomor JID")}
                    className="p-1 hover:bg-muted rounded text-foreground-muted hover:text-foreground cursor-pointer"
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
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Building2 className="size-3.5 text-foreground-muted" />
                <span>Tenant ID:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-foreground font-bold select-text">
                  {device.tenantId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(device.tenantId, "Tenant ID")}
                  className="p-1 hover:bg-muted rounded text-foreground-muted hover:text-foreground cursor-pointer"
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
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold">Device ID (ULID):</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-foreground-muted select-text">
                  {device.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(device.id, "Device ID")}
                  className="p-1 hover:bg-muted rounded text-foreground-muted hover:text-foreground cursor-pointer"
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
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Clock className="size-3.5 text-foreground-muted" />
                <span>Terakhir Aktif (Last Seen):</span>
              </span>
              <span className="font-mono text-[11px] text-foreground font-semibold">
                {device.lastSeenAt ? formatDateTime(device.lastSeenAt) : "(Belum pernah online)"}
              </span>
            </div>

            {/* Created At */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold">Dibuat Pada:</span>
              <span className="font-mono text-[11px] text-foreground-secondary">
                {formatDateTime(device.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-border flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8.5 px-4 text-xs font-bold rounded-full border-border hover:bg-muted cursor-pointer"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
