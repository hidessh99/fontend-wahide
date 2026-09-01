"use client";

import React, { useState, useEffect } from "react";
import { Contact } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

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

  const desc = isBulk
    ? t("contact.deleteBulkDesc")
    : t("contact.deleteConfirmDesc");

  const confirmText = isBulk
    ? t("contact.confirmBulkDelete")
    : t("contact.confirmDelete");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="relative z-10 w-full max-w-md bg-surface dark:bg-[#161715] border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="size-10 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 id="delete-dialog-title" className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
            aria-label={t("contact.cancel")}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-sm text-foreground-secondary">
          {/* Target Identity Highlight */}
          {!isBulk && contact && (
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/80 space-y-1">
              <div className="font-bold text-foreground text-sm sm:text-base">
                {contact.name}
              </div>
              <div className="font-mono text-xs sm:text-sm text-foreground-secondary">
                +{contact.phone}
              </div>
            </div>
          )}

          {isBulk && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-sm">
              {bulkCount} kontak terpilih akan dihapus permanen.
            </div>
          )}

          <p className="leading-relaxed text-xs sm:text-sm text-foreground-muted">
            {desc}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 p-6 pt-4 border-t border-border/60 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 px-4 rounded-full text-xs sm:text-sm font-bold border-border cursor-pointer"
          >
            {t("contact.cancel")}
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="h-10 px-5 rounded-full text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm gap-2 cursor-pointer disabled:opacity-50"
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
