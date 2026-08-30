"use client";

import React, { useState } from "react";
import { PaymentMethod } from "../types/finance.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  X,
  CreditCard,
  QrCode,
  Building,
  Loader2,
  CheckCircle2,
  Wallet,
} from "lucide-react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, paymentMethod: PaymentMethod) => Promise<unknown>;
}

const PRESET_AMOUNTS = [100000, 250000, 500000, 1000000];

export function TopUpModal({ isOpen, onClose, onSubmit }: TopUpModalProps) {
  const { t } = useI18n();
  const [selectedAmount, setSelectedAmount] = useState<number>(250000);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount
      ? parseInt(customAmount.replace(/[^0-9]/g, ""), 10)
      : selectedAmount;

    if (!finalAmount || finalAmount < 50000) {
      setError("Nominal top-up minimum Rp 50.000.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(finalAmount, paymentMethod);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses top-up";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
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
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
              min={50000}
              step={10000}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setError(null);
              }}
              placeholder={t("billing.customAmountPlaceholder")}
              className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2">
              {t("billing.selectPaymentMethod")}
            </label>
            <div className="space-y-2">
              {[
                {
                  id: "QRIS" as PaymentMethod,
                  label: t("billing.payWithQris"),
                  icon: QrCode,
                },
                {
                  id: "VIRTUAL_ACCOUNT" as PaymentMethod,
                  label: t("billing.payWithVa"),
                  icon: Building,
                },
                {
                  id: "CREDIT_CARD" as PaymentMethod,
                  label: t("billing.payWithCard"),
                  icon: CreditCard,
                },
              ].map(({ id, label, icon: Icon }) => {
                const isSelected = paymentMethod === id;
                return (
                  <div
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`p-3 rounded-md border flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 text-foreground"
                        : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary hover:border-foreground-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 text-wise-green shrink-0" />
                      <span className="text-xs font-bold">{label}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="size-4 text-wise-green shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted"
            >
              {t("billing.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="text-xs font-bold gap-1.5 px-6 shadow-sm"
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
