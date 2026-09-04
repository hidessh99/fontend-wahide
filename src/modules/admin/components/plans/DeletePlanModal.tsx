"use client";

import React, { useState } from "react";
import { AdminPlanItem } from "@/modules/admin/types/admin.types";
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

interface DeletePlanModalProps {
  plan: AdminPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeletePlanModal({ plan, isOpen, onClose, onConfirm }: DeletePlanModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  if (!plan) return null;

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
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md dark:bg-[#161715]">
        {/* Header */}
        <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Trash2 className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight">
              Hapus Paket Langganan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              Konfirmasi penghapusan paket tier platform.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Content Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <span className="block font-bold">Tindakan ini tidak dapat dibatalkan!</span>
              <p className="text-foreground-secondary text-[11px] leading-relaxed">
                Anda akan menghapus paket tier <strong>&ldquo;{plan.name}&rdquo;</strong> dari
                katalog langganan platform.
              </p>
            </div>
          </div>

          <div className="border-border bg-muted/20 text-foreground-secondary space-y-1.5 rounded-lg border p-3 text-xs font-semibold">
            <div className="flex justify-between">
              <span>Nama Paket:</span>
              <strong className="text-foreground">{plan.name}</strong>
            </div>
            <div className="flex justify-between">
              <span>Harga / Bulan:</span>
              <span className="text-foreground font-mono font-bold">
                Rp {plan.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Batas Kuota Pesan:</span>
              <span className="text-foreground font-mono">
                {plan.monthly_message_limit.toLocaleString("id-ID")} Pesan
              </span>
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
                <span>Hapus Paket Sekarang</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
