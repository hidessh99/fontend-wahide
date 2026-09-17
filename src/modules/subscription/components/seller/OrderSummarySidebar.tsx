"use client";

import React, { useState, useMemo } from "react";
import { OrderCartItem } from "../../types/subscription.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  Calendar,
  Ticket,
  CheckCircle2,
  Trash2,
  Wallet,
  Smartphone,
  ShieldCheck,
  Bot,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n/context";
import { couponApi } from "@/modules/finance/api/coupon.api";
import { Voucher } from "@/modules/finance/types/coupon.types";

interface OrderSummarySidebarProps {
  cartItems: OrderCartItem[];
  onRemoveItem: (id: string) => void;
  userBalance?: number | null;
  onCheckout: (planId: string) => Promise<void>;
  isSubmitting: boolean;
}

export function OrderSummarySidebar({
  cartItems,
  onRemoveItem,
  userBalance,
  onCheckout,
  isSubmitting,
}: OrderSummarySidebarProps) {
  const { t, locale } = useI18n();
  const [couponCode, setCouponCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [serverDiscountAmount, setServerDiscountAmount] = useState<number>(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.priceMonthly, 0);

  // Dynamically compute discount amount based on applied voucher and subtotal
  const discountAmount = useMemo(() => {
    if (!appliedVoucher || subtotal <= 0) return 0;
    if (serverDiscountAmount > 0 && appliedVoucher.discountType === "FIXED") {
      return Math.min(subtotal, serverDiscountAmount);
    }
    if (appliedVoucher.discountType === "PERCENTAGE") {
      const calc = Math.round((subtotal * appliedVoucher.discountValue) / 100);
      if (appliedVoucher.maxDiscountAmount > 0) {
        return Math.min(calc, appliedVoucher.maxDiscountAmount);
      }
      return calc;
    }
    // FIXED discount
    return Math.min(subtotal, appliedVoucher.discountValue);
  }, [appliedVoucher, subtotal, serverDiscountAmount]);

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (subtotal === 0) {
      toast.warning(t("subscription.orderSummary.selectPlanFirst"));
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const res = await couponApi.validate({
        code,
        purchase_amount: subtotal,
        applicable_product: "SUBSCRIPTION",
      });

      setAppliedVoucher(res.voucher);
      setServerDiscountAmount(res.discount_amount);
      toast.success(
        t("subscription.toasts.couponAppliedDesc", {
          code: res.voucher.code,
          name: res.voucher.name,
        }) || `Kupon "${res.voucher.name}" (${res.voucher.code}) berhasil diterapkan!`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("not found") || msg.includes("active voucher")) {
        toast.error(t("subscription.toasts.couponNotFound") || "Kode kupon tidak ditemukan atau tidak aktif.");
      } else if (msg.includes("expired")) {
        toast.error(t("subscription.toasts.couponExpired") || "Masa berlaku kupon telah berakhir.");
      } else if (msg.includes("limit reached")) {
        toast.error(t("subscription.toasts.couponLimitReached") || "Kuota penggunaan kupon ini telah habis.");
      } else if (msg.includes("minimum purchase") || msg.includes("min_amount")) {
        toast.error(t("subscription.toasts.couponMinPurchaseNotMet") || "Total pembelian belum memenuhi syarat minimal kupon.");
      } else if (msg.includes("already used")) {
        toast.error(t("subscription.toasts.couponAlreadyUsed") || "Anda sudah pernah menggunakan kupon promo ini.");
      } else if (msg.includes("not applicable")) {
        toast.error(t("subscription.toasts.couponNotApplicable") || "Kupon tidak berlaku untuk paket langganan.");
      } else {
        toast.error(msg || t("subscription.toasts.couponInvalid"));
      }
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedVoucher(null);
    setServerDiscountAmount(0);
    setCouponCode("");
    toast.info(t("subscription.toasts.couponRemoved"));
  };

  const handleOrderClick = async () => {
    if (cartItems.length === 0) return;
    const primaryPlan = cartItems[0];
    await onCheckout(primaryPlan.planId);
  };

  const balance = Number(userBalance ?? 0);
  const isBalanceSufficient = balance >= total || total === 0;

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "TELEGRAM_BOT":
        return Bot;
      case "META_WABA_OFFICIAL":
        return ShieldCheck;
      case "WHATSMEOW_UNOFFICIAL":
      default:
        return Smartphone;
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-5 shadow-xs sticky top-6">
      {/* Header */}
      <div className="border-b border-border/60 pb-3.5">
        <h3 className="text-base font-bold text-foreground">
          {t("subscription.orderSummary.title")}
        </h3>
        <p className="text-xs text-foreground-muted mt-0.5">
          {t("subscription.orderSummary.subtitle")}
        </p>
      </div>

      {/* Fixed Monthly Billing Badge */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-primary">
          <Calendar className="size-3.5" />
          <span>{t("subscription.orderSummary.billingPeriodBadge")}</span>
        </div>
        <p className="text-[11px] text-foreground-muted leading-relaxed">
          {t("subscription.orderSummary.billingPeriodDesc")}
        </p>
      </div>

      {/* Cart Items List */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">
          {t("subscription.orderSummary.selectedPlansTitle", {
            count: cartItems.length,
          })}
        </span>

        {cartItems.length === 0 ? (
          <div className="py-6 text-center px-3 rounded-xl border border-dashed border-border/70 bg-muted/20">
            <p className="text-xs text-foreground-muted">
              {t("subscription.orderSummary.emptyCartTitle")}
            </p>
            <p className="text-[11px] text-foreground-muted mt-0.5">
              {t("subscription.orderSummary.emptyCartDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const Icon = getChannelIcon(item.channelType);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border/60 bg-background text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground-secondary">
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {item.planName}
                      </p>
                      <p className="text-[10px] text-foreground-muted truncate">
                        {item.channelType === "WHATSMEOW_UNOFFICIAL"
                          ? t("subscription.channels.whatsmeow")
                          : item.channelType === "META_WABA_OFFICIAL"
                            ? t("subscription.channels.waba")
                            : t("subscription.channels.telegram")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-foreground">
                      {item.priceMonthly === 0
                        ? t("subscription.catalog.free")
                        : `Rp ${item.priceMonthly.toLocaleString("id-ID")}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-foreground-muted hover:text-destructive cursor-pointer transition p-1"
                      title={t("subscription.orderSummary.removeCoupon")}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Coupon Code Section */}
      <form onSubmit={handleApplyCoupon} className="space-y-1.5 pt-1">
        <label className="text-xs font-semibold text-foreground-secondary flex items-center gap-1.5">
          <Ticket className="size-3.5" />
          <span>{t("subscription.orderSummary.couponPrompt")}</span>
        </label>
        <div className="flex gap-1.5">
          <Input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder={t("subscription.orderSummary.couponPlaceholder")}
            disabled={Boolean(appliedVoucher) || isValidatingCoupon}
            className="h-8 text-xs rounded-xl uppercase font-mono tracking-wider"
          />
          {appliedVoucher ? (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleRemoveCoupon}
              className="h-8 text-[11px] rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              {t("subscription.orderSummary.removeCoupon")}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="outline"
              size="xs"
              disabled={!couponCode.trim() || isValidatingCoupon}
              className="h-8 text-[11px] rounded-xl px-3 cursor-pointer gap-1"
            >
              {isValidatingCoupon ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>{t("subscription.orderSummary.validatingCoupon") || "Memeriksa..."}</span>
                </>
              ) : (
                <span>{t("subscription.orderSummary.applyCoupon")}</span>
              )}
            </Button>
          )}
        </div>
        {appliedVoucher && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium space-y-0.5 mt-1">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{appliedVoucher.code}</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded-full">
                {appliedVoucher.discountType === "PERCENTAGE"
                  ? `${appliedVoucher.discountValue}% OFF`
                  : `Rp ${appliedVoucher.discountValue.toLocaleString(locale === "id" ? "id-ID" : "en-US")} OFF`}
              </span>
            </div>
            <p className="text-[10px] opacity-80 truncate">{appliedVoucher.name}</p>
          </div>
        )}
      </form>

      {/* Calculations Breakdown */}
      <div className="border-t border-border/60 pt-3.5 space-y-2 text-xs">
        <div className="flex justify-between text-foreground-secondary">
          <span>{t("subscription.orderSummary.subtotal")}</span>
          <span className="font-mono font-medium">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>{t("subscription.orderSummary.discount")}</span>
            <span className="font-mono">
              -Rp {discountAmount.toLocaleString("id-ID")}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm font-bold text-foreground border-t border-border/60 pt-2">
          <span>{t("subscription.orderSummary.totalPayment")}</span>
          <span className="font-mono text-base font-black text-primary">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Wallet Balance Indicator */}
      {userBalance !== undefined && userBalance !== null && total > 0 && (
        <div
          className={cn(
            "rounded-xl p-2.5 text-xs flex items-center justify-between border",
            isBalanceSufficient
              ? "border-border/60 bg-muted/30 text-foreground-secondary"
              : "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300",
          )}
        >
          <div className="flex items-center gap-1.5">
            <Wallet className="size-3.5" />
            <span className="text-[11px]">
              {t("subscription.orderSummary.walletBalance")}
            </span>
          </div>
          <span className="font-mono font-bold">
            Rp {balance.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {/* Order CTA Button */}
      <Button
        type="button"
        variant="primaryPill"
        size="default"
        disabled={cartItems.length === 0 || isSubmitting}
        onClick={handleOrderClick}
        className="w-full h-10 rounded-full font-bold text-xs gap-2 cursor-pointer shadow-xs"
      >
        <Lock className="size-3.5" />
        <span>
          {isSubmitting
            ? t("subscription.orderSummary.processing")
            : cartItems.length === 0
              ? t("subscription.orderSummary.selectPlanFirst")
              : t("subscription.orderSummary.payAndActivate", {
                  amount:
                    total === 0
                      ? t("subscription.catalog.free")
                      : `Rp ${total.toLocaleString("id-ID")}`,
                })}
        </span>
      </Button>
    </div>
  );
}
