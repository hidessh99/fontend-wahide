"use client";

import React, { useState } from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X, Loader2, MessageSquare, Smartphone } from "lucide-react";

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
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !message) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface dark:bg-[#161715] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground tracking-tight">
                Hapus Log Pesan WhatsApp
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Konfirmasi penghapusan riwayat pengiriman pesan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Message Summary Box */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold">ID Pesan:</span>
            <span className="font-mono font-bold text-foreground">{message.id.slice(0, 16)}...</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold flex items-center gap-1">
              <MessageSquare className="size-3 text-foreground-muted" />
              <span>Penerima:</span>
            </span>
            <span className="font-mono font-bold text-foreground">{message.recipientJid}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold flex items-center gap-1">
              <Smartphone className="size-3 text-foreground-muted" />
              <span>Arah &amp; Status:</span>
            </span>
            <span className="font-bold text-foreground">
              {message.direction} ({message.status})
            </span>
          </div>

          <div className="pt-1.5 border-t border-border/50">
            <span className="text-foreground-muted text-[11px] block mb-1">Cuplikan Pesan:</span>
            <p className="font-semibold text-foreground italic bg-surface dark:bg-[#10110e] p-2 rounded border border-border/60 text-[11px] line-clamp-2">
              &quot;{message.messageBody}&quot;
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-semibold">
            Tindakan ini bersifat permanen. Catatan log pengiriman pesan ini akan dihapus dari basis data audit trail.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="h-9 px-4 text-xs font-bold rounded-full border-border hover:bg-muted cursor-pointer"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-9 px-4 text-xs font-bold rounded-full gap-1.5 cursor-pointer shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Hapus Log Pesan</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
