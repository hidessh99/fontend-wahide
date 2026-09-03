"use client";

import React, { useState } from "react";
import { PaymentMethod } from "@/modules/finance/types/finance.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import { X, QrCode, Loader2, CheckCircle2, Wallet, Zap } from "lucide-react";

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

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

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
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-md border shadow-2xl dark:bg-[#161715]">
        {/* Sticky Header */}
        <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <Wallet className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
                {t("billing.topUpModalTitle")}
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                {t("billing.topUpModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4.5 overflow-y-auto p-5 sm:p-6">
            {error && (
              <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Preset Nominal Grid */}
            <div>
              <label className="text-foreground-secondary mb-2 block text-xs font-semibold tracking-wider uppercase">
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
                      className={`cursor-pointer rounded-md border p-3 text-center text-xs font-bold transition ${
                        isSelected
                          ? "border-wise-green bg-wise-green/15 text-foreground ring-wise-green ring-1"
                          : "border-border bg-surface text-foreground-secondary hover:border-foreground-muted dark:bg-[#10110e]"
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
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
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
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-full border px-4 font-mono text-xs font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
              />
            </div>

            {/* Voucher Code */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("billing.voucherLabel")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("billing.voucherPlaceholder")}
                  className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-10 flex-1 rounded-full border px-4 font-mono text-xs font-semibold uppercase transition outline-none focus:ring-2 dark:bg-[#10110e]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(t("billing.voucherSuccess"))}
                  className="border-border rounded-full px-4 text-xs font-bold"
                >
                  {t("billing.voucherApplyBtn")}
                </Button>
              </div>
            </div>

            {/* Pembayaran Instan Murni QRIS */}
            <div>
              <label className="text-foreground-secondary mb-2 block text-xs font-semibold tracking-wider uppercase">
                {t("billing.selectPaymentMethod")}
              </label>
              <div className="border-wise-green/30 bg-wise-green/10 dark:bg-wise-green/5 flex items-center justify-between gap-3 rounded-md border p-3.5">
                <div className="flex items-center gap-3">
                  <div className="dark:bg-wise-green/20 dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                    <QrCode className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground block text-xs font-bold">
                        QRIS Instan (Auto-Settlement)
                      </span>
                      <span className="py-0.2 bg-wise-green inline-flex items-center gap-1 rounded-full px-2 text-[10px] font-bold text-[#0e1708]">
                        <Zap className="size-2.5" />
                        <span>0 Detik</span>
                      </span>
                    </div>
                    <span className="text-foreground-secondary mt-0.5 block text-[11px] leading-tight font-semibold">
                      Scan via BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="dark:text-wise-green size-5 shrink-0 text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="border-border bg-surface/50 flex shrink-0 items-center justify-end gap-2.5 border-t p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-5 text-xs font-bold"
            >
              {t("billing.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="cursor-pointer gap-1.5 rounded-full px-6 text-xs font-bold shadow-sm"
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
