"use client";

import React, { useState } from "react";
import { AdminQueueItem } from "@/modules/admin/types/admin.types";
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
      <AlertDialogContent className="border-border bg-surface max-w-md gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        {/* Header */}
        <AlertDialogHeader className="border-border flex flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Trash2 className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight">
              Hapus Tugas Antrean
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              Hapus tugas antrean email dari sistem background worker.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

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
        <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-3 rounded-none border-t p-4 sm:p-5">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            Batalkan
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
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Hapus Antrean</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
