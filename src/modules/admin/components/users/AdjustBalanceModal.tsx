"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import {
  X,
  CreditCard,
  PlusCircle,
  MinusCircle,
  Loader2,
  Save,
  AlertTriangle,
} from "lucide-react";

interface AdjustBalanceModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustBalanceInput) => Promise<unknown>;
}

export function AdjustBalanceModal({
  user,
  isOpen,
  onClose,
  onSubmit,
}: AdjustBalanceModalProps) {
  const [mode, setMode] = useState<"ADD" | "REDUCE">("ADD");
  const [amount, setAmount] = useState<number>(50000);
  const [isLoading, setIsLoading] = useState(false);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen && !isLoading, onClose);

  if (!isOpen || !user) return null;

  const currentBalance = user.balance ?? user.depositBalance ?? 0;
  const projectedBalance =
    mode === "ADD" ? currentBalance + amount : Math.max(0, currentBalance - amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsLoading(true);
    try {
      await onSubmit({
        userId: user.id,
        type: mode,
        amount: Number(amount) || 0,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

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
            <div
              className={`size-10 rounded-full flex items-center justify-center shrink-0 border ${
                mode === "ADD"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-wise-green border-emerald-500/20"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
              }`}
            >
              <CreditCard className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                Penyesuaian Saldo Dompet
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Kelola saldo dompet untuk akun {user.name}.
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-5 sm:p-6 space-y-4 flex-1 text-xs">
            {/* Mode Tabs: Tambah Saldo vs Kurang Saldo */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-muted/40 border border-border">
              <button
                type="button"
                onClick={() => setMode("ADD")}
                className={`h-8.5 rounded-full font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === "ADD"
                    ? "bg-surface dark:bg-[#1f211d] text-emerald-700 dark:text-wise-green shadow-xs border border-border"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <PlusCircle className="size-3.5" />
                <span>Tambah Saldo (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("REDUCE")}
                className={`h-8.5 rounded-full font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === "REDUCE"
                    ? "bg-surface dark:bg-[#1f211d] text-rose-600 dark:text-rose-400 shadow-xs border border-border"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <MinusCircle className="size-3.5" />
                <span>Kurang Saldo (-)</span>
              </button>
            </div>

            {/* Current & Projected Balance Card */}
            <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground-secondary font-semibold">Saldo Saat Ini:</span>
                <span className="font-mono font-bold text-foreground">
                  Rp {currentBalance.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                <span className="text-foreground-secondary font-semibold">
                  Estimasi Saldo Setelah {mode === "ADD" ? "Penambahan" : "Pengurangan"}:
                </span>
                <span
                  className={`font-mono font-black ${
                    mode === "ADD"
                      ? "text-emerald-700 dark:text-wise-green"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  Rp {projectedBalance.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Jumlah Nominal (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xs text-foreground-muted font-mono pointer-events-none">
                  Rp
                </span>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={amount || ""}
                  onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  required
                  placeholder="50000"
                  className="w-full h-11 pl-12 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-bold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition font-mono text-sm"
                />
              </div>
            </div>

            {/* Quick Amount Presets */}
            <div>
              <span className="block text-[11px] font-semibold text-foreground-muted mb-2">
                Pilihan Nominal Cepat:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`h-8 rounded-full border text-[11px] font-bold font-mono transition cursor-pointer ${
                      amount === p
                        ? "border-emerald-600 dark:border-wise-green bg-emerald-500/10 text-emerald-700 dark:text-wise-green"
                        : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary hover:border-foreground-muted"
                    }`}
                  >
                    +{(p / 1000).toLocaleString("id-ID")}rb
                  </button>
                ))}
              </div>
            </div>

            {/* Warning if reducing more than current balance */}
            {mode === "REDUCE" && amount > currentBalance && (
              <div className="p-3 rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center gap-2 text-[11px] font-medium">
                <AlertTriangle className="size-4 shrink-0" />
                <span>
                  Perhatian: Nominal pengurangan lebih besar dari saldo saat ini (Rp{" "}
                  {currentBalance.toLocaleString("id-ID")}).
                </span>
              </div>
            )}
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
              size="sm"
              disabled={isLoading || amount <= 0}
              className={`rounded-full text-xs font-extrabold gap-1.5 px-5 shadow-sm text-white ${
                mode === "ADD"
                  ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                  : "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>
                    {mode === "ADD" ? "Tambah Saldo Sekarang" : "Kurangi Saldo Sekarang"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
