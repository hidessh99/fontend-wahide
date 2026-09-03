"use client";

import React, { useState } from "react";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X, Loader2, Smartphone, Building2 } from "lucide-react";

interface DeleteDeviceModalProps {
  device: AdminDeviceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeleteDeviceModal({ device, isOpen, onClose, onConfirm }: DeleteDeviceModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !device) return null;

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
                Hapus Perangkat WhatsApp
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                Konfirmasi pemutusan sesi dan penghapusan slot perangkat.
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
            Tindakan ini akan secara permanen memutuskan koneksi WhatsApp aktif (*whatsmeow socket
            session*) dan menghapus data slot perangkat dari akun pengguna.
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
                <span>Hapus Perangkat</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
