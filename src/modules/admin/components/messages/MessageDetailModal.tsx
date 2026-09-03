"use client";

import React, { useState } from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  MessageSquare,
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

  if (!message) return null;

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[90vh] max-w-lg gap-0 space-y-4 overflow-hidden p-5 sm:p-6 dark:bg-[#161715]">
        {/* Header */}
        <DialogHeader className="border-border flex flex-row items-center gap-2.5 border-b pb-3.5 text-left">
          <div className="dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <MessageSquare className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-base font-black tracking-tight">
              Detail Log Pesan WhatsApp
            </DialogTitle>
            <span className="text-foreground-muted block font-mono text-[11px]">
              ID: {message.id}
            </span>
          </div>
        </DialogHeader>

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
              <span className="text-foreground font-mono font-bold uppercase">
                {message.status}
              </span>
            </div>
          </div>

          {/* Recipient & Device Info */}
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Smartphone className="text-foreground-muted size-3.5" />
                <span>Penerima (JID):</span>
              </span>
              <span className="text-foreground font-mono font-bold">{message.recipientJid}</span>
            </div>
          </div>

          {/* Message Body Box */}
          <div className="border-border bg-muted/20 space-y-1.5 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold tracking-wider uppercase">
                Isi Konten Pesan:
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-foreground-muted hover:text-foreground flex cursor-pointer items-center gap-1 text-[11px] font-semibold transition"
                title="Salin Pesan"
              >
                {hasCopied ? (
                  <>
                    <Check className="dark:text-wise-green size-3 text-emerald-600" />
                    <span className="dark:text-wise-green text-emerald-600">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-surface border-border/60 text-foreground max-h-48 overflow-y-auto rounded-lg border p-3 text-xs leading-relaxed whitespace-pre-wrap select-text dark:bg-[#10110e]">
              {message.messageBody || "(Pesan kosong / payload non-teks)"}
            </div>
          </div>

          {/* Media URL if present */}
          {message.mediaUrl && (
            <div className="border-border bg-muted/20 flex items-center justify-between rounded-xl border p-3 text-xs">
              <span className="text-foreground-secondary font-semibold">Lampiran Media:</span>
              <a
                href={message.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-wise-green inline-flex items-center gap-1 font-mono font-bold text-emerald-600 hover:underline"
              >
                <span>Buka Media</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Error Message if Failed */}
          {message.errorMessage && (
            <div className="space-y-1 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-400">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="size-3.5" />
                <span>Penyebab Kegagalan:</span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed select-text">
                {message.errorMessage}
              </p>
            </div>
          )}

          {/* Metadata Footprint */}
          <div className="border-border bg-muted/20 space-y-1.5 rounded-xl border p-3 text-xs">
            <div className="flex items-center justify-between">
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
        <DialogFooter className="border-border m-0 flex shrink-0 flex-row justify-end rounded-none border-t p-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted h-8.5 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
