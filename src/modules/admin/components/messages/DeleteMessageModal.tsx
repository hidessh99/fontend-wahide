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
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="border-border bg-surface animate-in fade-in zoom-in-95 relative z-10 w-full max-w-md space-y-5 rounded-2xl border p-6 shadow-2xl dark:bg-[#161715]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Trash2 className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-base font-black tracking-tight">
                Hapus Log Pesan WhatsApp
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                Konfirmasi penghapusan riwayat pengiriman pesan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Message Summary Box */}
        <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold">ID Pesan:</span>
            <span className="text-foreground font-mono font-bold">
              {message.id.slice(0, 16)}...
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
              <MessageSquare className="text-foreground-muted size-3" />
              <span>Penerima:</span>
            </span>
            <span className="text-foreground font-mono font-bold">{message.recipientJid}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
              <Smartphone className="text-foreground-muted size-3" />
              <span>Arah &amp; Status:</span>
            </span>
            <span className="text-foreground font-bold">
              {message.direction} ({message.status})
            </span>
          </div>

          <div className="border-border/50 border-t pt-1.5">
            <span className="text-foreground-muted mb-1 block text-[11px]">Cuplikan Pesan:</span>
            <p className="text-foreground bg-surface border-border/60 line-clamp-2 rounded border p-2 text-[11px] font-semibold italic dark:bg-[#10110e]">
              &quot;{message.messageBody}&quot;
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span className="leading-relaxed font-semibold">
            Tindakan ini bersifat permanen. Catatan log pengiriman pesan ini akan dihapus dari basis
            data audit trail.
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
            className="border-border hover:bg-muted h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            Batal
          </Button>

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
