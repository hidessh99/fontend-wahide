"use client";

import React, { useState } from "react";
import { AdminBillingItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import {
  X,
  AlertTriangle,
  Loader2,
  Save,
  Clock,
  Ban,
  Receipt,
  User,
} from "lucide-react";

interface UpdateBillingStatusModalProps {
  billing: AdminBillingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, status: "EXPIRED" | "CANCELLED") => Promise<unknown>;
}

export function UpdateBillingStatusModal({
  billing,
  isOpen,
  onClose,
  onSubmit,
}: UpdateBillingStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<"EXPIRED" | "CANCELLED">("CANCELLED");
  const [isLoading, setIsLoading] = useState(false);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen && !isLoading, onClose);

  if (!isOpen || !billing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(billing.id, selectedStatus);
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
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Receipt className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">
                Ubah Status Transaksi
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Tandai transaksi kadaluarsa atau batalkan tagihan.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-5 sm:p-6 space-y-4 flex-1 text-xs">
            {/* Transaction Detail Card */}
            <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                  <User className="size-3.5 text-foreground-muted" />
                  <span>Pengguna:</span>
                </span>
                <span className="font-bold text-foreground truncate max-w-50">
                  {billing.user?.name || `User ${billing.userId.slice(-6)}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                <span className="text-foreground-secondary font-semibold">Nominal Topup:</span>
                <span className="font-mono font-bold text-foreground">
                  Rp {billing.amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                <span className="text-foreground-secondary font-semibold">Status Saat Ini:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  {billing.status}
                </span>
              </div>
            </div>

            {/* Status Selection (EXPIRED vs CANCELLED only) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Pilih Status Baru:
              </label>

              <div className="space-y-2.5">
                {/* Option 1: CANCELLED */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                    selectedStatus === "CANCELLED"
                      ? "border-rose-500/60 bg-rose-500/10 text-foreground"
                      : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary hover:border-foreground-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="CANCELLED"
                    checked={selectedStatus === "CANCELLED"}
                    onChange={() => setSelectedStatus("CANCELLED")}
                    className="mt-0.5 size-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-600 dark:text-rose-400">
                      <Ban className="size-3.5" />
                      <span>🔴 Batalkan Transaksi (CANCELLED)</span>
                    </div>
                    <p className="text-[11px] text-foreground-muted leading-tight">
                      Membatalkan tagihan atas permintaan pengguna atau penolakan administratif.
                    </p>
                  </div>
                </label>

                {/* Option 2: EXPIRED */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                    selectedStatus === "EXPIRED"
                      ? "border-zinc-500/60 bg-zinc-500/10 text-foreground"
                      : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary hover:border-foreground-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="EXPIRED"
                    checked={selectedStatus === "EXPIRED"}
                    onChange={() => setSelectedStatus("EXPIRED")}
                    className="mt-0.5 size-4 text-zinc-600 focus:ring-zinc-500"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-600 dark:text-zinc-400">
                      <Clock className="size-3.5" />
                      <span>⚪ Tandai Kadaluarsa (EXPIRED)</span>
                    </div>
                    <p className="text-[11px] text-foreground-muted leading-tight">
                      Menandai transaksi sudah melewati batas waktu pembayaran (*timeout*).
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Information Alert */}
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-start gap-2 text-[11px]">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>
                Catatan: Status <strong>PAID</strong> (Lunas) hanya diproses otomatis oleh Webhook resmi Payment Gateway agar integritas saldo dompet terjamin.
              </span>
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
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="rounded-full text-xs font-extrabold gap-1.5 px-5 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Simpan Perubahan Status</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
