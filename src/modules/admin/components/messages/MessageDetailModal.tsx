"use client";

import React, { useState } from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  MessageSquare,
  X,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  AlertCircle,
  Clock,
  Send,
  Download,
  Building2,
} from "lucide-react";

interface MessageDetailModalProps {
  message: AdminMessageLogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageDetailModal({ message, isOpen, onClose }: MessageDetailModalProps) {
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen || !message) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.messageBody);
      setHasCopied(true);
      toast.success("Isi pesan disalin ke clipboard");
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin teks");
    }
  };

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
              <MessageSquare className="size-4.5" />
            </div>
            <div>
              <h2 className="text-foreground text-base font-black tracking-tight">
                Detail Log Pesan WhatsApp
              </h2>
              <span className="text-foreground-muted block font-mono text-[11px]">
                ID: {message.id}
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
          {/* Status & Direction Bar */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-border bg-muted/20 rounded-lg border p-2.5">
              <span className="text-foreground-muted mb-0.5 block text-[10px] font-bold uppercase">
                Arah Pesan
              </span>
              <div className="text-foreground flex items-center gap-1.5 font-bold">
                {message.direction === "OUTBOUND" ? (
                  <>
                    <Send className="dark:text-wise-green size-3 text-emerald-600" />
                    <span>Keluar (OUTBOUND)</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3 text-blue-500" />
                    <span>Masuk (INBOUND)</span>
                  </>
                )}
              </div>
            </div>

            <div className="border-border bg-muted/20 rounded-lg border p-2.5">
              <span className="text-foreground-muted mb-0.5 block text-[10px] font-bold uppercase">
                Status Pengiriman
              </span>
              <span className="dark:text-wise-green font-mono font-black text-emerald-700">
                {message.status}
              </span>
            </div>
          </div>

          {/* Full Message Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold tracking-wider uppercase">
                Isi Teks Pesan:
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="dark:text-wise-green flex cursor-pointer items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
              >
                {hasCopied ? (
                  <>
                    <Check className="size-3" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>

            <div className="border-border bg-surface text-foreground max-h-48 overflow-y-auto rounded-xl border p-3 font-sans text-xs leading-relaxed font-medium break-words whitespace-pre-wrap select-text dark:bg-[#10110e]">
              {message.messageBody || "(Pesan kosong)"}
            </div>
          </div>

          {/* Media Attachment if exists */}
          {message.mediaUrl && (
            <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3">
              <span className="text-foreground flex items-center gap-1.5 text-[11px] font-bold">
                <ExternalLink className="size-3.5 text-blue-500" />
                <span>Lampiran Media:</span>
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground-muted max-w-70 truncate font-mono text-[11px]">
                  {message.mediaUrl}
                </span>
                <a
                  href={message.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 transition hover:bg-blue-500/20 dark:text-blue-400"
                >
                  Buka Media
                </a>
              </div>
            </div>
          )}

          {/* Error Message Callout if failed */}
          {message.errorMessage && (
            <div className="space-y-1 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="size-4 shrink-0" />
                <span>Detail Pesan Error:</span>
              </div>
              <p className="pl-5.5 font-mono text-[11px] leading-relaxed break-all">
                {message.errorMessage}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Smartphone className="text-foreground-muted size-3.5" />
                <span>Target Nomor / JID:</span>
              </span>
              <span className="text-foreground font-mono font-bold select-text">
                {message.recipientJid}
              </span>
            </div>

            <div className="border-border/50 flex items-center justify-between border-t pt-1.5">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Building2 className="text-foreground-muted size-3.5" />
                <span>Tenant ID:</span>
              </span>
              <span className="text-foreground-muted max-w-40 truncate font-mono text-[11px] select-text">
                {message.tenantId}
              </span>
            </div>

            <div className="border-border/50 flex items-center justify-between border-t pt-1.5">
              <span className="text-foreground-secondary font-semibold">Device ID:</span>
              <span className="text-foreground-muted max-w-40 truncate font-mono text-[11px] select-text">
                {message.deviceId}
              </span>
            </div>

            {message.campaignId && (
              <div className="border-border/50 flex items-center justify-between border-t pt-1.5">
                <span className="text-foreground-secondary font-semibold">Campaign ID:</span>
                <span className="text-foreground-muted max-w-40 truncate font-mono text-[11px] select-text">
                  {message.campaignId}
                </span>
              </div>
            )}

            <div className="border-border/50 flex items-center justify-between border-t pt-1.5">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Clock className="text-foreground-muted size-3.5" />
                <span>Waktu Dibuat:</span>
              </span>
              <span className="text-foreground font-mono text-[11px] font-semibold">
                {formatDateTime(message.createdAt)}
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
