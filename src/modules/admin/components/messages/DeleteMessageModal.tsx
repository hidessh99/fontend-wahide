"use client";

import React, { useState } from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
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
import { AlertTriangle, Trash2, Loader2, MessageSquare, Smartphone } from "lucide-react";

interface DeleteMessageModalProps {
  message: AdminMessageLogItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeleteMessageModal({
  message,
  isOpen,
  onClose,
  onConfirm,
}: DeleteMessageModalProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose();
    }
  };

  if (!message) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
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
            <AlertDialogTitle className="text-foreground text-base font-black tracking-tight">
              {t("admin.messages.deleteModalTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("admin.messages.deleteModalSubtitle")}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Message Summary Box */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold">{t("admin.messages.messageIdLabel")}</span>
              <span className="text-foreground font-mono font-bold">
                {message.id.slice(0, 16)}...
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
                <MessageSquare className="text-foreground-muted size-3" />
                <span>{t("admin.messages.recipientLabel")}</span>
              </span>
              <span className="text-foreground font-mono font-bold">{message.recipientJid}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
                <Smartphone className="text-foreground-muted size-3" />
                <span>{t("admin.messages.directionStatusLabel")}</span>
              </span>
              <span className="text-foreground font-bold">
                {message.direction} ({message.status})
              </span>
            </div>

            <div className="border-border/50 border-t pt-1.5">
              <span className="text-foreground-muted mb-1 block text-[11px]">{t("admin.messages.snippetLabel")}</span>
              <p className="text-foreground bg-surface border-border/60 line-clamp-2 rounded border p-2 text-[11px] font-semibold italic dark:bg-[#10110e]">
                &quot;{message.messageBody}&quot;
              </p>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span className="leading-relaxed font-semibold">
              {t("admin.messages.deleteWarning")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-border hover:bg-muted h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            {t("common.cancel")}
          </AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-9 cursor-pointer gap-1.5 rounded-full px-4 text-xs font-bold shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("admin.messages.deletingBtn")}</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>{t("admin.messages.deleteConfirmBtn")}</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
