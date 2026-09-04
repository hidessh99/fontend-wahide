"use client";

import React, { useState } from "react";
import { PaymentMethod } from "@/modules/finance/types/finance.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { QrCode, Loader2, CheckCircle2, Wallet, Zap } from "lucide-react";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg dark:bg-[#161715]">
        {/* Sticky Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Wallet className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("billing.topUpModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("billing.topUpModalSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4.5 overflow-y-auto p-5 sm:p-6">
            {error && (
              <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Preset Nominal Grid */}
            <div>
              <label className="text-foreground-secondary mb-2 block text-xs font-bold">
                {t("billing.selectAmountPreset")}
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                        setError(null);
                      }}
                      className={`cursor-pointer rounded-md border p-3 text-center transition ${
                        isSelected
                          ? "bg-light-mint dark:bg-wise-green/15 border-wise-green text-dark-green dark:text-wise-green font-black"
                          : "border-border bg-surface hover:border-foreground-muted text-foreground font-semibold dark:bg-[#10110e]"
                      }`}
                    >
                      <span className="block font-mono text-xs">
                        Rp {amt.toLocaleString("id-ID")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label
                htmlFor="custom-nominal-input"
                className="text-foreground-secondary mb-1.5 block text-xs font-bold"
              >
                {t("billing.customAmountLabel")}
              </label>
              <div className="relative">
                <span className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 font-mono text-xs font-bold">
                  Rp
                </span>
                <Input
                  id="custom-nominal-input"
                  type="text"
                  placeholder="Contoh: 150.000"
                  value={customAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setCustomAmount(raw ? Number(raw).toLocaleString("id-ID") : "");
                    setError(null);
                  }}
                  variant="rounded"
                  className="pr-4 pl-10 font-mono"
                />
              </div>
              <span className="text-foreground-muted mt-1 block text-[11px]">
                {t("billing.minimumTopUpNotice")}
              </span>
            </div>

            {/* Payment Method - Exclusive QRIS Highlight */}
            <div>
              <label className="text-foreground-secondary mb-2 block text-xs font-bold">
                {t("billing.paymentMethod")}
              </label>
              <div className="bg-light-mint/50 dark:bg-wise-green/10 border-wise-green/60 flex items-center justify-between rounded-md border p-3.5 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="bg-wise-green/20 text-dark-green dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-md">
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
          <DialogFooter className="border-border bg-surface/50 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
