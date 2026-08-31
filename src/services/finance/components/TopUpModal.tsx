"use client";

import React, { useState, useEffect } from "react";
import { PaymentMethod } from "../types/finance.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  X,
  QrCode,
  Loader2,
  CheckCircle2,
  Wallet,
  Zap,
} from "lucide-react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, paymentMethod: PaymentMethod) => Promise<unknown>;
}

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000];

export function TopUpModal({ isOpen, onClose, onSubmit }: TopUpModalProps) {
  const { t } = useI18n();
  const [selectedAmount, setSelectedAmount] = useState<number>(20000);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount
      ? parseInt(customAmount.replace(/[^0-9]/g, ""), 10)
      : selectedAmount;

    if (!finalAmount || finalAmount < 10000) {
      setError("Nominal top-up minimum Rp 10.000.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Pembayaran Instan Murni QRIS
      await onSubmit(finalAmount, "QRIS");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses top-up";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
              <Wallet className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {t("billing.topUpModalTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("billing.topUpModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4.5 flex-1">
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Preset Nominal Grid */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2">
                {t("billing.selectAmountLabel")}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                        setError(null);
                      }}
                      className={`p-3 rounded-md border text-center transition cursor-pointer font-bold text-xs ${
                        isSelected
                          ? "border-wise-green bg-wise-green/15 text-foreground ring-1 ring-wise-green"
                          : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary hover:border-foreground-muted"
                      }`}
                    >
                      Rp {amt.toLocaleString("id-ID")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("billing.customAmountLabel")}
              </label>
              <input
                type="number"
                min={10000}
                step={5000}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setError(null);
                }}
                placeholder={t("billing.customAmountPlaceholder")}
                className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
              />
            </div>

            {/* Voucher Code */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("billing.voucherLabel")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("billing.voucherPlaceholder")}
                  className="flex-1 h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(t("billing.voucherSuccess"))}
                  className="rounded-full text-xs font-bold px-4 border-border"
                >
                  {t("billing.voucherApplyBtn")}
                </Button>
              </div>
            </div>

            {/* Pembayaran Instan Murni QRIS */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2">
                {t("billing.selectPaymentMethod")}
              </label>
              <div className="p-3.5 rounded-md border border-wise-green/30 bg-wise-green/10 dark:bg-wise-green/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-wise-green/20 text-wise-green flex items-center justify-center shrink-0">
                    <QrCode className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground block">
                        QRIS Instan (Auto-Settlement)
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 text-[10px] font-bold rounded-full bg-wise-green text-[#0e1708]">
                        <Zap className="size-2.5" />
                        <span>0 Detik</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-foreground-secondary font-semibold block leading-tight mt-0.5">
                      Scan via BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="size-5 text-wise-green shrink-0" />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-4 sm:p-5 border-t border-border flex items-center justify-end gap-2.5 shrink-0 bg-surface/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-full text-xs font-bold px-5 border-border hover:border-foreground-muted cursor-pointer"
            >
              {t("billing.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="rounded-full text-xs font-bold gap-1.5 px-6 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("billing.submittingTopUp")}</span>
                </>
              ) : (
                <span>{t("billing.submitTopUp")}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
