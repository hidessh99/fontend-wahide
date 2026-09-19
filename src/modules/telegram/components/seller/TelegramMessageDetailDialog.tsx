"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TelegramMessage } from "../../types/telegram.types";
import { useClipboard } from "@/hooks/useClipboard";
import { useI18n } from "@/lib/i18n/context";
import { Button, buttonVariants } from "@/components/ui/button";
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
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Bot,
  Send,
  Radio,
} from "lucide-react";

interface TelegramMessageDetailDialogProps {
  log: TelegramMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

const idDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const formatDetailTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "-" : idDateFormatter.format(d);
};

export function TelegramMessageDetailDialog({
  log,
  isOpen,
  onClose,
}: TelegramMessageDetailDialogProps) {
  const { t } = useI18n();
  const { isCopied: copiedText, copy: copyText } = useClipboard();
  const { isCopied: copiedChatId, copy: copyChatId } = useClipboard();
  const { isCopied: copiedId, copy: copyId } = useClipboard();

  if (!log) return null;

  const isOutbound = log.direction === "OUTBOUND";

  const handleCopyBody = async () => {
    if (!log.text) return;
    const ok = await copyText(log.text);
    if (ok) {
      toast.success(t("telegram.logs.detail.toastCopyText"), {
        id: "copy-tele-text",
      });
    }
  };

  const handleCopyChatId = async () => {
    if (!log.chat_id) return;
    const ok = await copyChatId(String(log.chat_id));
    if (ok) {
      toast.success(t("telegram.logs.detail.toastCopyChatId"), {
        id: "copy-tele-chatid",
      });
    }
  };

  const handleCopyId = async () => {
    if (!log.id) return;
    const ok = await copyId(log.id);
    if (ok) {
      toast.success(t("telegram.logs.detail.toastCopyLogId"), {
        id: "copy-tele-logid",
      });
    }
  };

  const renderStatusBadge = (status?: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "DELIVERED":
      case "SENT":
        return (
          <Badge
            variant="success"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <CheckCircle2 className="size-3.5" />
            <span>{t("telegram.logs.statusDeliveredBadge")}</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="danger"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <XCircle className="size-3.5" />
            <span>{t("telegram.logs.statusFailedBadge")}</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="warning"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <Clock className="size-3.5" />
            <span>{s || t("telegram.logs.statusQueuedBadge")}</span>
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                <Send className="size-4.5" />
              </div>
              <DialogTitle className="text-base font-bold sm:text-lg">
                {t("telegram.logs.detail.title")}
              </DialogTitle>
            </div>
            {renderStatusBadge(log.status)}
          </div>
          <p className="text-foreground-secondary text-xs">
            {t("telegram.logs.detail.subtitle")}
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Diagnostic Error Banner if FAILED */}
          {log.status === "FAILED" && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400">
              <AlertCircle className="size-4.5 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-bold text-xs">{t("telegram.logs.detail.errorBannerTitle")}</p>
                <p className="font-mono text-[11px] break-all">
                  {log.error_reason || "Unknown API delivery failure"}
                </p>
              </div>
            </div>
          )}

          {/* Chat ID & Direction Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                {t("telegram.logs.detail.recipientChatId")}
              </span>
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono font-bold text-foreground text-sm truncate">
                  {log.chat_id}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyChatId}
                  className="size-7 p-0 text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  {copiedChatId ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1 rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                {t("telegram.logs.detail.directionAndType")}
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Badge
                  variant={isOutbound ? "info" : "success"}
                  className="gap-1 px-2 text-[10px] font-bold"
                >
                  {isOutbound ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownLeft className="size-3" />
                  )}
                  <span>{isOutbound ? t("telegram.logs.directionOutBot") : t("telegram.logs.directionInUser")}</span>
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {log.message_type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Bot ID & Message ID */}
          <div className="space-y-1.5 rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground-secondary font-medium flex items-center gap-1.5">
                <Bot className="size-3.5" /> {t("telegram.logs.detail.botId")}
              </span>
              <span className="font-mono font-semibold text-foreground truncate max-w-[200px]">
                {log.bot_id || "-"}
              </span>
            </div>

            {log.message_id && (
              <>
                <Separator className="bg-border/60" />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-foreground-secondary font-medium flex items-center gap-1.5">
                    <Radio className="size-3.5" /> {t("telegram.logs.detail.messageId")}
                  </span>
                  <span className="font-mono font-semibold text-foreground">
                    #{log.message_id}
                  </span>
                </div>
              </>
            )}

            {log.idempotency_key && (
              <>
                <Separator className="bg-border/60" />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-foreground-secondary font-medium truncate">
                    {t("telegram.logs.detail.idempotencyKey")}
                  </span>
                  <span className="font-mono text-[10px] text-foreground-muted truncate max-w-[200px]">
                    {log.idempotency_key}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Full Message Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                {t("telegram.logs.detail.messageContent")}
              </span>
              {log.text && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyBody}
                  className="h-6 gap-1 px-1.5 text-[10px] text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  {copiedText ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  <span>{t("telegram.logs.detail.copyMessage")}</span>
                </Button>
              )}
            </div>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-border bg-muted/40 p-3 font-sans text-xs leading-relaxed text-foreground whitespace-pre-wrap select-text">
              {log.text || (
                <span className="italic text-foreground-muted">
                  {t("telegram.logs.detail.noContent")}
                </span>
              )}
            </div>
          </div>

          {/* Media Attachment if available */}
          {log.media_url && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-4 shrink-0 text-sky-500" />
                <span className="truncate text-xs font-mono text-foreground">
                  {log.media_url}
                </span>
              </div>
              <a
                href={log.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "h-7 text-[11px] gap-1 shrink-0 ml-2",
                )}
              >
                <ExternalLink className="size-3" />
                <span>{t("telegram.logs.detail.openMedia")}</span>
              </a>
            </div>
          )}

          {/* Timestamps & Log ID */}
          <div className="rounded-xl border border-border bg-surface p-3 space-y-2 dark:bg-muted/20">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground-secondary font-medium flex items-center gap-1.5">
                <Calendar className="size-3.5" /> {t("telegram.logs.detail.created")}
              </span>
              <span className="font-mono text-foreground">
                {formatDetailTime(log.created_at)}
              </span>
            </div>

            {log.sent_at && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-foreground-secondary font-medium flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {t("telegram.logs.detail.sent")}
                </span>
                <span className="font-mono text-foreground">
                  {formatDetailTime(log.sent_at)}
                </span>
              </div>
            )}

            <Separator className="bg-border/60" />

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground-secondary font-medium">
                {t("telegram.logs.detail.logUuid")}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[10px] text-foreground-muted truncate max-w-[170px] sm:max-w-xs">
                  {log.id}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyId}
                  className="size-6 p-0 text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  {copiedId ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs font-semibold cursor-pointer"
          >
            {t("telegram.logs.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
