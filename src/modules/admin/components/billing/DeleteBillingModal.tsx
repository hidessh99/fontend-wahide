"use client";

import React, { useState, useEffect } from "react";
import { AdminBillingItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteBillingModalProps {
  billing: AdminBillingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeleteBillingModal({
  billing,
  isOpen,
  onClose,
  onConfirm,
}: DeleteBillingModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !billing) return null;

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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-md rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">
                Hapus Data Transaksi
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Konfirmasi penghapusan catatan billing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0 disabled:opacity-50"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-start gap-2.5">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Tindakan ini tidak dapat dibatalkan!</span>
              <p className="text-[11px] leading-relaxed text-foreground-secondary">
                Catatan sesi transaksi billing akan dihapus dari sistem. (Arsip invoice faktur tetap tersimpan untuk pembukuan).
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1.5 font-semibold text-foreground-secondary text-xs">
            <div className="flex justify-between">
              <span>ID Transaksi:</span>
              <span className="font-mono text-foreground font-bold">{billing.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Pengguna:</span>
              <strong className="text-foreground">
                {billing.user?.name || `User ${billing.userId.slice(-6)}`}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Nominal:</span>
              <span className="font-mono text-emerald-700 dark:text-wise-green font-bold">
                Rp {billing.amount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-bold text-foreground">{billing.status}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full text-xs font-bold border-border hover:bg-muted"
          >
            Batalkan
          </Button>

          <Button
            type="button"
            variant="dangerPill"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-full text-xs font-extrabold gap-1.5 px-5 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Hapus Transaksi</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
