"use client";

import React, { useState } from "react";
import { AdminQueueItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteQueueModalProps {
  queue: AdminQueueItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeleteQueueModal({ queue, isOpen, onClose, onConfirm }: DeleteQueueModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen && !isLoading, onClose);

  if (!isOpen || !queue) return null;

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
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-xl border shadow-2xl dark:bg-[#161715]">
        {/* Header */}
        <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Trash2 className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black tracking-tight">
                Hapus Tugas Antrean
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                Hapus tugas antrean email dari sistem background worker.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition disabled:opacity-50"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 p-5 text-xs sm:p-6">
          <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <span className="block font-bold">Tindakan ini tidak dapat dibatalkan!</span>
              <p className="text-foreground-secondary text-[11px] leading-relaxed">
                Tugas notifikasi ini akan dihapus permanen dari antrean dan tidak akan diproses oleh
                worker.
              </p>
            </div>
          </div>

          <div className="border-border bg-muted/20 text-foreground-secondary space-y-1.5 rounded-lg border p-3 text-xs font-semibold">
            <div className="flex justify-between">
              <span>ID Antrean:</span>
              <span className="text-foreground font-mono font-bold">{queue.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipe Tugas:</span>
              <strong className="text-foreground">{queue.taskType}</strong>
            </div>
            <div className="flex justify-between">
              <span>Target:</span>
              <span className="text-foreground font-mono font-bold">
                {queue.targetEmail || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-foreground font-bold">{queue.status}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-border bg-muted/20 flex shrink-0 items-center justify-end gap-3 border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            Batalkan
          </Button>

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
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Hapus Antrean</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
