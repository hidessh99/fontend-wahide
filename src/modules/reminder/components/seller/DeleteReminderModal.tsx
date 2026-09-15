"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

interface DeleteReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  recipientName: string;
}

export function DeleteReminderModal({
  isOpen,
  onClose,
  onConfirm,
  recipientName,
}: DeleteReminderModalProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    const success = await onConfirm();
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-base font-bold text-foreground">
                {t("reminder.table.deleteSchedule")}
              </AlertDialogTitle>
              <p className="text-xs text-foreground-muted">
                {t("reminder.deleteIrreversible")}
              </p>
            </div>
          </div>
          <AlertDialogDescription className="mt-2 text-xs leading-relaxed text-foreground-secondary">
            {t("reminder.deleteConfirmPrompt")}{" "}
            <strong className="font-semibold text-foreground">
              &ldquo;{recipientName}&rdquo;
            </strong>
            ? {t("reminder.deleteWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            size="sm"
            className="rounded-xl cursor-pointer"
          >
            {t("cancel")}
          </AlertDialogCancel>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-xl cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                {t("delete")}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
