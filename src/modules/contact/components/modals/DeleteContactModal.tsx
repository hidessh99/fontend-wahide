"use client";

import React, { useState } from "react";
import { Contact } from "@/modules/contact/types/contact.types";
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
import { useI18n } from "@/lib/i18n/context";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteContactModalProps {
  isOpen: boolean;
  contact?: Contact | null;
  bulkCount?: number;
  isBulk?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteContactModal({
  isOpen,
  contact,
  bulkCount = 0,
  isBulk = false,
  onClose,
  onConfirm,
}: DeleteContactModalProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error notification handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  const title = isBulk
    ? t("contact.deleteBulkTitle", { count: String(bulkCount) })
    : t("contact.deleteConfirmTitle");

  const desc = isBulk ? t("contact.deleteBulkDesc") : t("contact.deleteConfirmDesc");
  const confirmText = isBulk ? t("contact.confirmBulkDelete") : t("contact.confirmDelete");

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-surface border-border max-w-md gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        {/* Header */}
        <AlertDialogHeader className="border-border/60 flex flex-row items-center gap-3.5 border-b p-6 pb-4 text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-base font-bold tracking-tight sm:text-lg">
              {title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        {/* Body Content */}
        <div className="text-foreground-secondary space-y-4 p-6 text-sm">
          {/* Target Identity Highlight */}
          {!isBulk && contact && (
            <div className="bg-muted/40 border-border/80 space-y-1 rounded-lg border p-3.5">
              <div className="text-foreground text-sm font-bold sm:text-base">{contact.name}</div>
              <div className="text-foreground-secondary font-mono text-xs sm:text-sm">
                +{contact.phone}
              </div>
            </div>
          )}

          {isBulk && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-sm font-bold text-rose-700 dark:text-rose-300">
              {bulkCount} kontak terpilih akan dihapus permanen.
            </div>
          )}

          <AlertDialogDescription className="text-foreground-muted text-xs leading-relaxed sm:text-sm">
            {desc}
          </AlertDialogDescription>
        </div>

        {/* Footer Actions */}
        <AlertDialogFooter className="border-border/60 bg-muted/20 m-0 flex flex-row items-center justify-end gap-2.5 rounded-none border-t p-6 pt-4">
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-border h-10 cursor-pointer rounded-full px-4 text-xs font-bold sm:text-sm"
          >
            {t("contact.cancel")}
          </AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="h-10 cursor-pointer gap-2 rounded-full px-5 text-xs font-bold shadow-sm disabled:opacity-50 sm:text-sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t("contact.deleting")}</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                <span>{confirmText}</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
