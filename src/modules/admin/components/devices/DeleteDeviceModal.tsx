"use client";

import React, { useState } from "react";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
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
import { AlertTriangle, Trash2, Loader2, Smartphone, Building2 } from "lucide-react";

interface DeleteDeviceModalProps {
  device: AdminDeviceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeleteDeviceModal({ device, isOpen, onClose, onConfirm }: DeleteDeviceModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose();
    }
  };

  if (!device) return null;

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
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md dark:bg-[#161715]">
        {/* Header */}
        <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Trash2 className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-base font-black tracking-tight">
              Hapus Perangkat WhatsApp
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              Konfirmasi pemutusan sesi dan penghapusan slot perangkat.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Content Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Device Summary Box */}
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
                <Smartphone className="text-foreground-muted size-3" />
                <span>Nama Perangkat:</span>
              </span>
              <span className="text-foreground font-bold">{device.pushName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold">Nomor / JID:</span>
              <span className="text-foreground font-mono font-bold">
                {device.jid || "(Belum terhubung)"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
                <Building2 className="text-foreground-muted size-3" />
                <span>Tenant ID:</span>
              </span>
              <span className="text-foreground-muted max-w-40 truncate font-mono text-[11px]">
                {device.tenantId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold">Status Saat Ini:</span>
              <span className="text-foreground font-mono font-bold uppercase">{device.status}</span>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span className="leading-relaxed font-semibold">
              Tindakan ini akan secara permanen memutuskan koneksi WhatsApp aktif (*gateway socket
              session*) dan menghapus data slot perangkat dari akun pengguna.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-border hover:bg-muted h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            Batal
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
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Hapus Perangkat</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
