"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { SubscriptionPlan } from "../../types/subscription.types";
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CreditCard,
  Receipt,
} from "lucide-react";

interface ConfirmUpgradeModalProps {
  plan: SubscriptionPlan | null;
  balance: number | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isUpgrading: boolean;
}

export function ConfirmUpgradeModal({
  plan,
  balance,
  isOpen,
  onClose,
  onConfirm,
  isUpgrading,
}: ConfirmUpgradeModalProps) {
  const { t } = useI18n();

  if (!plan) return null;

  const price = plan.priceMonthly || 0;
  const currentBalance = balance ?? 0;
  const isSufficient = currentBalance >= price;
  const remainingBalance = Math.max(0, currentBalance - price);
  const deficit = Math.max(0, price - currentBalance);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUpgrading && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md dark:bg-[#161715]">
        <DialogHeader className="border-border flex shrink-0 flex-col gap-2 border-b p-5 text-left sm:p-6">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <div className="flex size-8 items-center justify-center rounded-full bg-rose-500/10">
              <CreditCard className="size-4" />
            </div>
            <DialogTitle className="text-foreground text-lg font-bold">
              {t("subscription.confirmTitle")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-foreground-muted text-xs">
            {t("subscription.confirmSubtitle", { planName: plan.name })}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Plan Summary Card */}
          <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-foreground-secondary">{t("subscription.selectedPlan")}</span>
              <span className="text-foreground text-sm font-black">{plan.name}</span>
            </div>
            <div className="text-foreground-secondary flex items-center justify-between font-medium">
              <span>{t("subscription.validityPeriod")}</span>
              <span className="text-foreground font-semibold">{t("subscription.validityValue")}</span>
            </div>
            <div className="border-border flex items-center justify-between border-t pt-2 font-bold">
              <span className="text-foreground">{t("subscription.totalBill")}</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                Rp {price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Wallet Balance Calculation */}
          <div className="border-border bg-surface space-y-2.5 rounded-lg border p-3.5 dark:bg-[#121310]">
            <div className="flex items-center justify-between font-medium">
              <div className="text-foreground-secondary flex items-center gap-1.5">
                <Wallet className="text-foreground-muted size-3.5" />
                <span>{t("subscription.walletBalance")}</span>
              </div>
              <span className="text-foreground font-black">
                Rp {currentBalance.toLocaleString("id-ID")}
              </span>
            </div>

            {isSufficient ? (
              <>
                <div className="text-foreground-secondary border-border/80 flex items-center justify-between border-t pt-2 font-medium">
                  <span>{t("subscription.remainingBalance")}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {remainingBalance.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-start gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <strong>{t("subscription.sufficientTitle")}</strong>{" "}
                    {t("subscription.sufficientDesc", {
                      price: `Rp ${price.toLocaleString("id-ID")}`,
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-2 rounded-md border border-rose-500/20 bg-rose-500/10 p-2.5 text-[11px] leading-relaxed text-rose-700 dark:text-rose-400">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div>
                  <strong>{t("subscription.insufficientTitle")}</strong>{" "}
                  {t("subscription.insufficientDesc", {
                    deficit: `Rp ${deficit.toLocaleString("id-ID")}`,
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Official Invoice Assurance */}
          <div className="text-foreground-muted flex items-center gap-2 text-[11px]">
            <Receipt className="text-foreground-muted size-3.5 shrink-0" />
            <span>{t("subscription.invoiceAssurance")}</span>
          </div>
        </div>

        <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpgrading}
            className="rounded-full text-xs"
          >
            {t("subscription.cancel")}
          </Button>

          {isSufficient ? (
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isUpgrading}
              className="bg-wise-green text-dark-green hover:bg-wise-green/90 cursor-pointer gap-2 rounded-full text-xs font-bold"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("subscription.processing")}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5" />
                  <span>{t("subscription.payAndActivate")}</span>
                </>
              )}
            </Button>
          ) : (
            <Link href="/billing" onClick={onClose} className="w-full sm:w-auto">
              <Button
                type="button"
                className="bg-wise-green text-dark-green hover:bg-wise-green/90 w-full cursor-pointer gap-1.5 rounded-full text-xs font-bold"
              >
                <span>{t("subscription.topUpAtBilling")}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
