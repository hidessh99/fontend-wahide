"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { X, CreditCard, PlusCircle, MinusCircle, Loader2, Save, AlertTriangle } from "lucide-react";

interface AdjustBalanceModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustBalanceInput) => Promise<unknown>;
}

export function AdjustBalanceModal({ user, isOpen, onClose, onSubmit }: AdjustBalanceModalProps) {
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
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-xl border shadow-2xl dark:bg-[#161715]">
        {/* Header */}
        <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full border ${
                mode === "ADD"
                  ? "dark:text-wise-green border-emerald-500/20 bg-emerald-500/15 text-emerald-600"
                  : "border-rose-500/20 bg-rose-500/15 text-rose-600 dark:text-rose-400"
              }`}
            >
              <CreditCard className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
                Penyesuaian Saldo Dompet
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                Kelola saldo dompet untuk akun {user.name}.
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-4 p-5 text-xs sm:p-6">
            {/* Mode Tabs: Tambah Saldo vs Kurang Saldo */}
            <div className="bg-muted/40 border-border grid grid-cols-2 gap-2 rounded-full border p-1">
              <button
                type="button"
                onClick={() => setMode("ADD")}
                className={`flex h-8.5 cursor-pointer items-center justify-center gap-1.5 rounded-full text-xs font-extrabold transition ${
                  mode === "ADD"
                    ? "bg-surface dark:text-wise-green border-border border text-emerald-700 shadow-xs dark:bg-[#1f211d]"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <PlusCircle className="size-3.5" />
                <span>Tambah Saldo (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("REDUCE")}
                className={`flex h-8.5 cursor-pointer items-center justify-center gap-1.5 rounded-full text-xs font-extrabold transition ${
                  mode === "REDUCE"
                    ? "bg-surface border-border border text-rose-600 shadow-xs dark:bg-[#1f211d] dark:text-rose-400"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <MinusCircle className="size-3.5" />
                <span>Kurang Saldo (-)</span>
              </button>
            </div>

            {/* Current & Projected Balance Card */}
            <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground-secondary font-semibold">Saldo Saat Ini:</span>
                <span className="text-foreground font-mono font-bold">
                  Rp {currentBalance.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="border-border/50 flex items-center justify-between border-t pt-1.5 text-xs">
                <span className="text-foreground-secondary font-semibold">
                  Estimasi Saldo Setelah {mode === "ADD" ? "Penambahan" : "Pengurangan"}:
                </span>
                <span
                  className={`font-mono font-black ${
                    mode === "ADD"
                      ? "dark:text-wise-green text-emerald-700"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  Rp {projectedBalance.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Jumlah Nominal (IDR)
              </label>
              <div className="relative">
                <span className="text-foreground-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-mono text-xs font-bold">
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
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-11 w-full rounded-full border pr-4 pl-12 font-mono text-sm font-bold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
                />
              </div>
            </div>

            {/* Quick Amount Presets */}
            <div>
              <span className="text-foreground-muted mb-2 block text-[11px] font-semibold">
                Pilihan Nominal Cepat:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`h-8 cursor-pointer rounded-full border font-mono text-[11px] font-bold transition ${
                      amount === p
                        ? "dark:border-wise-green dark:text-wise-green border-emerald-600 bg-emerald-500/10 text-emerald-700"
                        : "border-border bg-surface text-foreground-secondary hover:border-foreground-muted dark:bg-[#10110e]"
                    }`}
                  >
                    +{(p / 1000).toLocaleString("id-ID")}rb
                  </button>
                ))}
              </div>
            </div>

            {/* Warning if reducing more than current balance */}
            {mode === "REDUCE" && amount > currentBalance && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>
                  Perhatian: Nominal pengurangan lebih besar dari saldo saat ini (Rp{" "}
                  {currentBalance.toLocaleString("id-ID")}).
                </span>
              </div>
            )}
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
              type="submit"
              size="sm"
              disabled={isLoading || amount <= 0}
              className={`gap-1.5 rounded-full px-5 text-xs font-extrabold text-white shadow-sm ${
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
                  <span>{mode === "ADD" ? "Tambah Saldo Sekarang" : "Kurangi Saldo Sekarang"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
