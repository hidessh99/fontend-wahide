"use client";

import React, { useState } from "react";
import { Contact } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react";

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

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen && !isDeleting, onClose);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="bg-surface border-border animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-xl border shadow-2xl dark:bg-[#161715]"
      >
        {/* Header */}
        <div className="border-border/60 flex items-start justify-between border-b p-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3
                id="delete-dialog-title"
                className="text-foreground text-base font-bold tracking-tight sm:text-lg"
              >
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition disabled:opacity-50"
            aria-label={t("contact.cancel")}
          >
            <X className="size-4" />
          </button>
        </div>

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

          <p className="text-foreground-muted text-xs leading-relaxed sm:text-sm">{desc}</p>
        </div>

        {/* Footer Actions */}
        <div className="border-border/60 bg-muted/20 flex items-center justify-end gap-2.5 border-t p-6 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-border h-10 cursor-pointer rounded-full px-4 text-xs font-bold sm:text-sm"
          >
            {t("contact.cancel")}
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="h-10 cursor-pointer gap-2 rounded-full bg-rose-600 px-5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 sm:text-sm"
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
        </div>
      </div>
    </div>
  );
}
