"use client";

import React from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
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
  const { t, locale } = useI18n();
  const { isCopied: hasCopied, copy } = useClipboard();

  if (!message) return null;

  const handleCopyText = async () => {
    const success = await copy(message.messageBody);
    if (success) {
      toast.success(t("admin.messages.copiedToast"), { id: "clipboard-copy" });
    } else {
      toast.error(t("admin.messages.copyFailedToast"), { id: "clipboard-copy" });
    }
  };

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
            <MessageSquare className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-base font-black tracking-tight">
              {t("admin.messages.detailModalTitle")}
            </DialogTitle>
            <span className="text-foreground-muted block font-mono text-[11px]">
              ID: {message.id}
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Status & Direction Bar */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-border bg-muted/20 rounded-lg border p-2.5">
              <span className="text-foreground-muted mb-0.5 block text-[10px] font-bold uppercase">
                {t("admin.messages.colDirection")}
              </span>
              <div className="text-foreground flex items-center gap-1.5 font-bold">
                {message.direction === "OUTBOUND" ? (
                  <>
                    <Send className="dark:text-wise-green size-3 text-emerald-600" />
                    <span>{t("admin.messages.directionOutbound")}</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3 text-blue-500" />
                    <span>{t("admin.messages.directionInbound")}</span>
                  </>
                )}
              </div>
            </div>

            <div className="border-border bg-muted/20 rounded-lg border p-2.5">
              <span className="text-foreground-muted mb-0.5 block text-[10px] font-bold uppercase">
                {t("admin.messages.colStatus")}
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
                <span>{t("admin.messages.recipientJidLabel")}</span>
              </span>
              <span className="text-foreground font-mono font-bold">{message.recipientJid}</span>
            </div>
          </div>

          {/* Message Body Box */}
          <div className="border-border bg-muted/20 space-y-1.5 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold tracking-wider uppercase">
                {t("admin.messages.messageContentLabel")}
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-foreground-muted hover:text-foreground flex cursor-pointer items-center gap-1 text-[11px] font-semibold transition"
                title={t("admin.messages.copy")}
              >
                {hasCopied ? (
                  <>
                    <Check className="dark:text-wise-green size-3 text-emerald-600" />
                    <span className="dark:text-wise-green text-emerald-600">{t("admin.messages.copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>{t("admin.messages.copy")}</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-surface border-border/60 text-foreground max-h-48 overflow-y-auto rounded-lg border p-3 text-xs leading-relaxed whitespace-pre-wrap select-text dark:bg-[#10110e]">
              {message.messageBody || t("admin.messages.emptyBody")}
            </div>
          </div>

          {/* Media URL if present */}
          {message.mediaUrl && (
            <div className="border-border bg-muted/20 flex items-center justify-between rounded-xl border p-3 text-xs">
              <span className="text-foreground-secondary font-semibold">{t("admin.messages.mediaAttachment")}</span>
              <a
                href={message.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-wise-green inline-flex items-center gap-1 font-mono font-bold text-emerald-600 hover:underline"
              >
                <span>{t("admin.messages.openMedia")}</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Error Message if Failed */}
          {message.errorMessage && (
            <div className="space-y-1 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-400">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="size-3.5" />
                <span>{t("admin.messages.failureReason")}</span>
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
                <span>{t("admin.messages.createdAtLabel")}</span>
              </span>
              <span className="text-foreground font-mono text-[11px] font-semibold">
                {formatLocalizedDateTime(message.createdAt)}
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
            {t("admin.messages.closeBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
