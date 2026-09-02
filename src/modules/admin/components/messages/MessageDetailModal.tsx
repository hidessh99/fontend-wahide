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

export function MessageDetailModal({
  message,
  isOpen,
  onClose,
}: MessageDetailModalProps) {
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
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface dark:bg-[#161715] shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <MessageSquare className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground tracking-tight">
                Detail Log Pesan WhatsApp
              </h2>
              <span className="font-mono text-[11px] text-foreground-muted block">
                ID: {message.id}
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
          {/* Status & Direction Bar */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg border border-border bg-muted/20">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block mb-0.5">
                Arah Pesan
              </span>
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                {message.direction === "OUTBOUND" ? (
                  <>
                    <Send className="size-3 text-emerald-600 dark:text-wise-green" />
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

            <div className="p-2.5 rounded-lg border border-border bg-muted/20">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block mb-0.5">
                Status Pengiriman
              </span>
              <span className="font-black font-mono text-emerald-700 dark:text-wise-green">
                {message.status}
              </span>
            </div>
          </div>

          {/* Full Message Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-secondary">
                Isi Teks Pesan:
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-wise-green hover:underline cursor-pointer"
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

            <div className="p-3 rounded-xl border border-border bg-surface dark:bg-[#10110e] text-foreground font-sans font-medium text-xs whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-y-auto select-text">
              {message.messageBody || "(Pesan kosong)"}
            </div>
          </div>

          {/* Media Attachment if exists */}
          {message.mediaUrl && (
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                <ExternalLink className="size-3.5 text-blue-500" />
                <span>Lampiran Media:</span>
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-foreground-muted truncate max-w-70">
                  {message.mediaUrl}
                </span>
                <a
                  href={message.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] hover:bg-blue-500/20 transition shrink-0"
                >
                  Buka Media
                </a>
              </div>
            </div>
          )}

          {/* Error Message Callout if failed */}
          {message.errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="size-4 shrink-0" />
                <span>Detail Pesan Error:</span>
              </div>
              <p className="font-mono text-[11px] break-all leading-relaxed pl-5.5">
                {message.errorMessage}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-foreground-muted" />
                <span>Target Nomor / JID:</span>
              </span>
              <span className="font-mono font-bold text-foreground select-text">
                {message.recipientJid}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Building2 className="size-3.5 text-foreground-muted" />
                <span>Tenant ID:</span>
              </span>
              <span className="font-mono text-[11px] text-foreground-muted truncate max-w-40 select-text">
                {message.tenantId}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold">Device ID:</span>
              <span className="font-mono text-[11px] text-foreground-muted truncate max-w-40 select-text">
                {message.deviceId}
              </span>
            </div>

            {message.campaignId && (
              <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
                <span className="text-foreground-secondary font-semibold">Campaign ID:</span>
                <span className="font-mono text-[11px] text-foreground-muted truncate max-w-40 select-text">
                  {message.campaignId}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Clock className="size-3.5 text-foreground-muted" />
                <span>Waktu Dibuat:</span>
              </span>
              <span className="font-mono text-[11px] text-foreground font-semibold">
                {formatDateTime(message.createdAt)}
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
