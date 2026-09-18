"use client";

import React from "react";
import { MessageLogResponse } from "@/modules/campaign/types/campaign.types";
import { useI18n } from "@/lib/i18n/context";
import { useClipboard } from "@/hooks/useClipboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MessageSquare,
  Copy,
  Check,
  CheckCheck,
  Smartphone,
  Send,
  ExternalLink,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
} from "lucide-react";

interface MessageLogDetailDialogProps {
  log: MessageLogResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageLogDetailDialog({
  log,
  isOpen,
  onClose,
}: MessageLogDetailDialogProps) {
  const { locale } = useI18n();
  const { isCopied: copiedText, copy: copyText } = useClipboard();
  const { isCopied: copiedPhone, copy: copyPhone } = useClipboard();
  const { isCopied: copiedId, copy: copyId } = useClipboard();

  if (!log) return null;

  const phone = log.recipient_jid
    ? log.recipient_jid.split("@")[0].replace(/^\+?/, "+")
    : "-";

  const handleCopyBody = async () => {
    if (!log.message_body) return;
    const ok = await copyText(log.message_body);
    if (ok) {
      toast.success("Teks pesan berhasil disalin!", { id: "copy-log-body" });
    }
  };

  const handleCopyPhone = async () => {
    if (!phone || phone === "-") return;
    const ok = await copyPhone(phone);
    if (ok) {
      toast.success("Nomor penerima berhasil disalin!", { id: "copy-log-phone" });
    }
  };

  const handleCopyId = async () => {
    if (!log.id) return;
    const ok = await copyId(log.id);
    if (ok) {
      toast.success("ID Log berhasil disalin!", { id: "copy-log-id" });
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  };

  const renderStatusBadge = (status?: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "READ":
        return (
          <Badge variant="info" className="gap-1 px-2.5 py-0.5 text-[11px] font-bold">
            <CheckCheck className="size-3.5" />
            <span>READ (Dibaca)</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="success" className="gap-1 px-2.5 py-0.5 text-[11px] font-bold">
            <CheckCheck className="size-3.5" />
            <span>DELIVERED (Diterima)</span>
          </Badge>
        );
      case "SENT":
        return (
          <Badge variant="neutral" className="gap-1 px-2.5 py-0.5 text-[11px] font-bold">
            <Check className="size-3.5" />
            <span>SENT (Terkirim)</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="danger" className="gap-1 px-2.5 py-0.5 text-[11px] font-bold">
            <XCircle className="size-3.5" />
            <span>FAILED (Gagal)</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="gap-1 px-2.5 py-0.5 text-[11px] font-bold">
            <Clock className="size-3.5" />
            <span>{s || "PENDING"}</span>
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <MessageSquare className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-foreground text-base font-black tracking-tight">
              Detail Log Pesan WhatsApp
            </DialogTitle>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-foreground-muted font-mono text-[11px] truncate max-w-[220px] sm:max-w-xs">
                ID: {log.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5 transition"
                title="Salin ID Log"
                aria-label="Salin ID Log"
              >
                {copiedId ? (
                  <Check className="dark:text-wise-green size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Body Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Status & Direction */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border-border bg-muted/20 rounded-xl border p-3">
              <span className="text-foreground-muted mb-1 block text-[10px] font-bold uppercase tracking-wider">
                Status Pengiriman
              </span>
              <div className="pt-0.5">{renderStatusBadge(log.status)}</div>
            </div>

            <div className="border-border bg-muted/20 rounded-xl border p-3">
              <span className="text-foreground-muted mb-1 block text-[10px] font-bold uppercase tracking-wider">
                Arah Transmisi
              </span>
              <div className="flex items-center gap-1.5 pt-0.5 font-bold text-foreground">
                <Send className="dark:text-wise-green size-3.5 text-emerald-600" />
                <span>
                  {log.direction?.toUpperCase() === "INBOUND"
                    ? "Masuk (Inbound)"
                    : "Keluar (Outbound)"}
                </span>
              </div>
            </div>
          </div>

          {/* Recipient & Device */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-xl border p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Smartphone className="text-foreground-muted size-3.5" />
                <span>Nomor Penerima</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono font-bold text-xs">
                  {phone}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5 transition"
                  title="Salin Nomor Penerima"
                  aria-label="Salin Nomor Penerima"
                >
                  {copiedPhone ? (
                    <Check className="dark:text-wise-green size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold">
                ID Perangkat (Device)
              </span>
              <span className="text-foreground-secondary font-mono text-[11px] truncate max-w-[200px] sm:max-w-xs">
                {log.device_id || "Default Device"}
              </span>
            </div>
          </div>

          {/* Message Body */}
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold uppercase tracking-wider">
                Konten Pesan
              </span>
              <button
                type="button"
                onClick={handleCopyBody}
                className="text-foreground-muted hover:text-foreground flex cursor-pointer items-center gap-1 text-[11px] font-semibold transition"
                title="Salin Teks Pesan"
              >
                {copiedText ? (
                  <>
                    <Check className="dark:text-wise-green size-3 text-emerald-600" />
                    <span className="dark:text-wise-green text-emerald-600">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>

            <div className="border-border/60 bg-surface text-foreground max-h-48 overflow-y-auto rounded-lg border p-3 text-xs leading-relaxed whitespace-pre-wrap select-text dark:bg-[#10110e]">
              {log.message_body || (
                <span className="text-foreground-muted italic">
                  Tidak ada pesan teks (Hanya lampiran media)
                </span>
              )}
            </div>
          </div>

          {/* Media Attachment if present */}
          {log.media_url && (
            <div className="border-border bg-muted/20 flex items-center justify-between rounded-xl border p-3 text-xs">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <FileText className="size-3.5 text-blue-500" />
                <span>Lampiran Media</span>
              </span>
              <a
                href={log.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-wise-green inline-flex items-center gap-1 font-mono font-bold text-emerald-600 hover:underline"
              >
                <span>Buka Media</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Error Reason if Failed */}
          {(log.status?.toUpperCase() === "FAILED" || log.error_message) && (
            <div className="space-y-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-400">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="size-4" />
                <span>Penyebab Kegagalan Transmisi</span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed select-text">
                {log.error_message ||
                  "Pesan gagal dikirim oleh gateway socket WhatsApp (Penerima tidak aktif atau sesi terputus)."}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-medium">
                <Calendar className="size-3 text-foreground-muted" />
                <span>Waktu Dibuat</span>
              </span>
              <span className="text-foreground-secondary font-mono text-[11px]">
                {formatDateTime(log.created_at)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-medium">
                <Clock className="size-3 text-foreground-muted" />
                <span>Waktu Terkirim (Socket)</span>
              </span>
              <span className="text-foreground-secondary font-mono text-[11px]">
                {formatDateTime(log.sent_at || log.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-border border-t p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer rounded-full px-5 text-xs font-semibold"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
