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

export function DeleteDeviceModal({
  device,
  isOpen,
  onClose,
  onConfirm,
}: DeleteDeviceModalProps) {
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
                Hapus Perangkat WhatsApp
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Konfirmasi pemutusan sesi dan penghapusan slot perangkat.
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

        {/* Device Summary Box */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold flex items-center gap-1">
              <Smartphone className="size-3 text-foreground-muted" />
              <span>Nama Perangkat:</span>
            </span>
            <span className="font-bold text-foreground">{device.pushName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold">Nomor / JID:</span>
            <span className="font-mono font-bold text-foreground">
              {device.jid || "(Belum terhubung)"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold flex items-center gap-1">
              <Building2 className="size-3 text-foreground-muted" />
              <span>Tenant ID:</span>
            </span>
            <span className="font-mono text-[11px] text-foreground-muted truncate max-w-40">
              {device.tenantId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold">Status Saat Ini:</span>
            <span className="font-mono font-bold uppercase text-foreground">
              {device.status}
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-semibold">
            Tindakan ini akan secara permanen memutuskan koneksi WhatsApp aktif (*whatsmeow socket session*) dan menghapus data slot perangkat dari akun pengguna.
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
                <span>Hapus Perangkat</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
