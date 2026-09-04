"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard, PlusCircle, MinusCircle, Loader2, Save, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface AdjustBalanceModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustBalanceInput) => Promise<unknown>;
}

export function AdjustBalanceModal({ user, isOpen, onClose, onSubmit }: AdjustBalanceModalProps) {
  const { t, locale } = useI18n();
  const [mode, setMode] = useState<"ADD" | "REDUCE">("ADD");
  const [amount, setAmount] = useState<number>(50000);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
        {/* Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
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
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("admin.users.adjustBalanceModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("admin.users.adjustBalanceModalSubtitle", { name: user.name })}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
            {/* Mode Tabs: Tambah Saldo vs Kurang Saldo */}
            <div className="bg-muted/40 border-border grid grid-cols-2 gap-2 rounded-full border p-1">
              <button
                type="button"
                onClick={() => setMode("ADD")}
                className={`flex h-8.5 cursor-pointer items-center justify-center gap-1.5 rounded-full text-xs font-extrabold transition ${
                  mode === "ADD"
                    ? "border-emerald-500/30 bg-emerald-600 text-white shadow-sm"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <PlusCircle className="size-3.5" />
                <span>{t("admin.users.modeAdd")}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("REDUCE")}
                className={`flex h-8.5 cursor-pointer items-center justify-center gap-1.5 rounded-full text-xs font-extrabold transition ${
                  mode === "REDUCE"
                    ? "border-rose-500/30 bg-rose-600 text-white shadow-sm"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <MinusCircle className="size-3.5" />
                <span>{t("admin.users.modeReduce")}</span>
              </button>
            </div>

            {/* Current Balance and Preview Box */}
            <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">{t("admin.users.currentBalanceLabel")}</span>
                <span className="text-foreground font-mono font-bold">
                  Rp {currentBalance.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                </span>
              </div>

              <div className="border-border/50 flex items-center justify-between border-t pt-2">
                <span className="text-foreground font-bold">{t("admin.users.projectedBalanceLabel")}</span>
                <span
                  className={`font-mono font-black ${
                    mode === "ADD"
                      ? "dark:text-wise-green text-emerald-600"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  Rp {projectedBalance.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                </span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-foreground-secondary mb-1.5 block font-bold">
                {t("admin.users.quickPresetLabel")}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`cursor-pointer rounded-lg border px-2 py-1.5 font-mono text-[11px] font-bold transition ${
                      amount === preset
                        ? "bg-foreground text-background border-foreground font-black shadow-xs"
                        : "border-border bg-surface text-foreground-secondary hover:text-foreground hover:bg-muted dark:bg-[#10110e]"
                    }`}
                  >
                    Rp {(preset / 1000).toLocaleString(locale === "en" ? "en-US" : "id-ID")}k
                  </button>
                ))}
              </div>
            </div>

            {/* Input Nominal Manual */}
            <div>
              <label
                htmlFor="nominal-penyesuaian-input"
                className="text-foreground-secondary mb-1 block font-bold"
              >
                {t("admin.users.manualAmountLabel")}
              </label>
              <div className="relative">
                <span className="text-foreground-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono font-bold">
                  Rp
                </span>
                <input
                  id="nominal-penyesuaian-input"
                  type="number"
                  min={1000}
                  step={1000}
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0"
                  required
                  className="bg-surface border-border text-foreground focus:border-foreground h-10 w-full rounded-lg border pr-3 pl-10 font-mono text-sm font-black outline-none dark:bg-[#10110e]"
                />
              </div>
            </div>

            {/* Warning when Reducing Balance */}
            {mode === "REDUCE" && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span className="text-[11px] leading-relaxed">
                  {t("admin.users.reduceWarning")}
                </span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-3 rounded-none border-t p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="border-border hover:bg-muted rounded-full text-xs font-bold"
            >
              {t("cancel")}
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
                  <span>{t("admin.users.submitting")}</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>{mode === "ADD" ? t("admin.users.submitAdd") : t("admin.users.submitReduce")}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
