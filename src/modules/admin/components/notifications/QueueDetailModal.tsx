"use client";

import { AdminQueueItem } from "@/modules/admin/types/admin.types";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Layers, AlertCircle, Clock, CheckCircle2, User, Mail } from "lucide-react";

interface QueueDetailModalProps {
  queue: AdminQueueItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QueueDetailModal({ queue, isOpen, onClose }: QueueDetailModalProps) {
  const { t, locale } = useI18n();

  if (!queue) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg dark:bg-[#161715]">
        {/* Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <Layers className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight">
              {t("admin.notifications.detailModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary font-mono text-xs font-semibold">
              ID: {queue.id}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Status & Task Type Card */}
          <div className="border-border bg-muted/20 grid grid-cols-2 gap-3 rounded-lg border p-3">
            <div>
              <span className="text-foreground-muted mb-1 block text-[10px] font-bold uppercase">
                {t("admin.notifications.detailTaskType")}
              </span>
              <span className="dark:text-wise-green inline-block rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-xs font-black text-emerald-700">
                {queue.taskType}
              </span>
            </div>

            <div>
              <span className="text-foreground-muted mb-1 block text-[10px] font-bold uppercase">
                {t("admin.notifications.detailExecutionStatus")}
              </span>
              <span className="text-foreground inline-flex items-center gap-1 font-bold">
                {queue.status === "COMPLETED" && (
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                )}
                {queue.status === "PENDING" && <Clock className="size-3.5 text-amber-500" />}
                {queue.status === "FAILED" && <AlertCircle className="size-3.5 text-rose-500" />}
                <span>{queue.status}</span>
              </span>
            </div>
          </div>

          {/* Target Recipient Card */}
          <div className="border-border bg-surface space-y-1.5 rounded-lg border p-3 text-xs font-semibold dark:bg-[#10110e]">
            <div className="text-foreground flex items-center gap-2">
              <Mail className="text-foreground-muted size-3.5" />
              <span className="text-foreground-secondary font-bold">
                {t("admin.notifications.detailTargetEmail")}
              </span>
              <span className="font-mono">{queue.targetEmail || "-"}</span>
            </div>
            {queue.targetName && (
              <div className="text-foreground flex items-center gap-2">
                <User className="text-foreground-muted size-3.5" />
                <span className="text-foreground-secondary font-bold">
                  {t("admin.notifications.detailTargetName")}
                </span>
                <span>{queue.targetName}</span>
              </div>
            )}
            <div className="text-foreground flex items-center gap-2">
              <span className="text-foreground-secondary font-bold">
                {t("admin.notifications.attemptsLabel")}
              </span>
              <span className="font-mono">
                {queue.attempts} / {queue.maxAttempts} ({t("admin.notifications.priorityLabel")} {queue.priority})
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-foreground-secondary border-border/60 bg-muted/10 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-[11px]">
            <div>
              <span className="text-foreground-muted block text-[10px] uppercase">
                {t("admin.notifications.detailCreatedAt")}
              </span>
              <span>{formatDate(queue.createdAt)}</span>
            </div>
            <div>
              <span className="text-foreground-muted block text-[10px] uppercase">
                {t("admin.notifications.detailScheduledFinished")}
              </span>
              <span>
                {queue.finishedAt
                  ? formatDate(queue.finishedAt)
                  : queue.scheduledAt
                    ? formatDate(queue.scheduledAt)
                    : "-"}
              </span>
            </div>
          </div>

          {/* Error Details if any */}
          {queue.lastError && (
            <div className="space-y-1 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-400">
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <AlertCircle className="size-3.5" />
                <span>{t("admin.notifications.detailLastError")}</span>
              </span>
              <pre className="max-h-32 overflow-y-auto rounded border border-rose-500/20 bg-rose-500/5 p-2 font-mono text-[11px] whitespace-pre-wrap">
                {queue.lastError}
              </pre>
            </div>
          )}

          {/* Payload JSON */}
          <div className="space-y-1.5">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              {t("admin.notifications.detailPayload")}
            </span>
            <pre className="bg-muted/40 border-border text-foreground max-h-48 overflow-y-auto rounded-lg border p-3 font-mono text-[11px]">
              {JSON.stringify(queue.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end rounded-none border-t p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            {t("admin.notifications.closeBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
