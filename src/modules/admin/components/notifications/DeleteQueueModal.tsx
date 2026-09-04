"use client";

import React, { useState } from "react";
import { AdminQueueItem } from "@/modules/admin/types/admin.types";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteQueueModalProps {
  queue: AdminQueueItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeleteQueueModal({ queue, isOpen, onClose, onConfirm }: DeleteQueueModalProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  if (!queue) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
        {/* Header */}
        <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Trash2 className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight">
              {t("admin.notifications.deleteModalTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("admin.notifications.deleteModalSubtitle")}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Content Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <span className="block font-bold">{t("admin.notifications.deleteWarningTitle")}</span>
              <p className="text-foreground-secondary text-[11px] leading-relaxed">
                {t("admin.notifications.deleteWarningDesc")}
              </p>
            </div>
          </div>

          <div className="border-border bg-muted/20 text-foreground-secondary space-y-1.5 rounded-lg border p-3 text-xs font-semibold">
            <div className="flex justify-between">
              <span>{t("admin.notifications.queueIdLabel")}</span>
              <span className="text-foreground font-mono font-bold">{queue.id}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("admin.notifications.taskTypeLabel")}</span>
              <strong className="text-foreground">{queue.taskType}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t("admin.notifications.targetLabel")}</span>
              <span className="text-foreground font-mono font-bold">
                {queue.targetEmail || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("admin.notifications.statusLabel")}</span>
              <span className="text-foreground font-bold">{queue.status}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-3 rounded-none border-t p-4 sm:p-5">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            {t("common.cancel")}
          </AlertDialogCancel>

          <Button
            type="button"
            variant="dangerPill"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("admin.notifications.deletingBtn")}</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>{t("admin.notifications.deleteConfirmBtn")}</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
