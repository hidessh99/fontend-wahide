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
  if (!plan) return null;

  const price = plan.priceMonthly || 0;
  const currentBalance = balance ?? 0;
  const isSufficient = currentBalance >= price;
  const remainingBalance = Math.max(0, currentBalance - price);
  const deficit = Math.max(0, price - currentBalance);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUpgrading && onClose()}>
      <DialogContent className="sm:max-w-md bg-surface dark:bg-[#161715] border-border text-foreground">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <div className="size-8 rounded-full bg-rose-500/10 flex items-center justify-center">
              <CreditCard className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Konfirmasi Pembayaran Paket
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-foreground-muted">
            Aktifkan paket <strong>{plan.name}</strong> dengan pembayaran otomatis menggunakan Saldo Wallet Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Plan Summary Card */}
          <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-foreground-secondary">Paket Dipilih:</span>
              <span className="text-foreground text-sm font-black">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between text-foreground-secondary font-medium">
              <span>Masa Berlaku:</span>
              <span className="font-semibold text-foreground">30 Hari (1 Bulan)</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border font-bold">
              <span className="text-foreground">Total Tagihan:</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                Rp {price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Wallet Balance Calculation */}
          <div className="p-3.5 rounded-lg border border-border bg-surface dark:bg-[#121310] space-y-2.5">
            <div className="flex items-center justify-between font-medium">
              <div className="flex items-center gap-1.5 text-foreground-secondary">
                <Wallet className="size-3.5 text-foreground-muted" />
                <span>Saldo Wallet Anda:</span>
              </div>
              <span className="font-black text-foreground">
                Rp {currentBalance.toLocaleString("id-ID")}
              </span>
            </div>

            {isSufficient ? (
              <>
                <div className="flex items-center justify-between text-foreground-secondary font-medium pt-2 border-t border-border/80">
                  <span>Sisa Saldo Setelah Upgrade:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {remainingBalance.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-start gap-2 text-[11px] leading-relaxed">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Saldo Cukup.</strong> Saldo Anda akan otomatis dipotong sebesar <strong>Rp {price.toLocaleString("id-ID")}</strong> dan Invoice Lunas akan diterbitkan.
                  </div>
                </div>
              </>
            ) : (
              <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-start gap-2 text-[11px] leading-relaxed">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Saldo Tidak Mencukupi.</strong> Anda membutuhkan tambahan saldo sebesar{" "}
                  <strong>Rp {deficit.toLocaleString("id-ID")}</strong> untuk mengaktifkan paket ini.
                </div>
              </div>
            )}
          </div>

          {/* Official Invoice Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
            <Receipt className="size-3.5 shrink-0 text-foreground-muted" />
            <span>Invoice resmi bertipe <strong>SUBSCRIPTION</strong> akan otomatis dicatat di menu Billing.</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpgrading}
            className="rounded-full text-xs"
          >
            Batal
          </Button>

          {isSufficient ? (
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isUpgrading}
              className="rounded-full text-xs font-bold gap-2 bg-wise-green text-dark-green hover:bg-wise-green/90 cursor-pointer"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Memproses Pembayaran...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5" />
                  <span>Bayar & Aktifkan Paket</span>
                </>
              )}
            </Button>
          ) : (
            <Link href="/billing" onClick={onClose} className="w-full sm:w-auto">
              <Button
                type="button"
                className="w-full rounded-full text-xs font-bold gap-1.5 bg-wise-green text-dark-green hover:bg-wise-green/90 cursor-pointer"
              >
                <span>Top-Up Saldo di Billing</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
