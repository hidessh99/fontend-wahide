"use client";

import React from "react";
import { MessageLogItem } from "./MessageLogsTable";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import {
  Phone,
  Calendar,
  Send,
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MessageDetailModalProps {
  isOpen: boolean;
  log: MessageLogItem | null;
  onClose: () => void;
}

export function MessageDetailModal({ isOpen, log, onClose }: MessageDetailModalProps) {
  const { t } = useI18n();
  const { isCopied: copied, copy } = useClipboard();

  if (!log) return null;

  const handleCopyMessage = async () => {
    if (!log.messageSnippet) return;
    await copy(log.messageSnippet);
  };

  const renderBadge = (status: MessageLogItem["status"]) => {
    switch (status) {
      case "READ":
        return (
          <Badge className="gap-1 rounded-full border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-500">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusRead")}</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge className="gap-1 rounded-full border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusDelivered")}</span>
          </Badge>
        );
      case "SENT":
        return (
          <Badge className="gap-1 rounded-full border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
            <Send className="size-3" />
            <span>{t("campaign.statusSent")}</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="gap-1 rounded-full border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-500">
            <AlertCircle className="size-3.5" />
            <span>Gagal</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const formattedDateTime = log.sentAt
    ? new Date(log.sentAt).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="border-border shrink-0 border-b p-5 pb-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle className="text-foreground text-lg font-bold">
              {t("campaign.detailModalTitle")}
            </DialogTitle>
            {renderBadge(log.status)}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Metadata Grid */}
          <div className="border-border bg-muted/30 grid grid-cols-2 gap-3 rounded-lg border p-3.5 sm:p-4">
            <div className="space-y-1">
              <span className="text-foreground-muted block text-[11px] font-semibold">
                {t("campaign.detailModalRecipient")}
              </span>
              <div className="text-foreground flex items-center gap-1.5 font-mono text-sm font-bold">
                <Phone className="size-3.5 text-emerald-500" />
                <span>+{log.recipientPhone}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-foreground-muted block text-[11px] font-semibold">
                {t("campaign.detailModalCampaign")}
              </span>
              <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Smartphone className="text-muted-foreground size-3.5" />
                <span className="truncate">{log.campaignName}</span>
              </div>
            </div>

            <div className="border-border/50 col-span-2 space-y-1 border-t pt-2">
              <span className="text-foreground-muted block text-[11px] font-semibold">
                {t("campaign.detailModalSentAt")}
              </span>
              <div className="text-foreground flex items-center gap-1.5 font-mono text-xs">
                <Calendar className="text-muted-foreground size-3.5" />
                <span>{formattedDateTime} WIB</span>
              </div>
            </div>
          </div>

          {/* Full Message Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted text-[11px] font-semibold tracking-wider uppercase">
                {t("campaign.detailModalBody")}
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-foreground-muted hover:text-foreground flex items-center gap-1 text-[11px] font-semibold transition"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span className="text-emerald-500">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>
            <div className="border-border bg-muted/40 text-foreground-secondary max-h-56 overflow-y-auto rounded-lg border p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text">
              {log.messageSnippet}
            </div>
          </div>

          {/* Error message banner if FAILED */}
          {log.errorMessage && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-500">
              <span className="block text-[11px] font-bold tracking-wider uppercase">
                {t("campaign.detailModalError")}
              </span>
              <p className="mt-1 font-mono text-xs">{log.errorMessage}</p>
            </div>
          )}
        </div>

        <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-foreground hover:bg-muted w-full rounded-full text-xs font-semibold sm:w-auto"
          >
            {t("campaign.btnClose")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
