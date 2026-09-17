"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderSummarySidebarProps {
  cartItems: OrderCartItem[];
  onRemoveItem: (id: string) => void;
  userBalance?: number | null;
  onCheckout: (planId: string) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function OrderSummarySidebar({
  cartItems,
  onRemoveItem,
  userBalance,
  onCheckout,
  isSubmitting,
}: OrderSummarySidebarProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.priceMonthly, 0);
  const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "SAVE20" || code === "PROMO20") {
      setAppliedDiscountPercent(20);
      setAppliedCoupon(code);
      toast.success(`Kupon ${code} berhasil diterapkan! Diskon 20%`);
    } else if (code === "WAHIDE50") {
      setAppliedDiscountPercent(50);
      setAppliedCoupon(code);
      toast.success(`Kupon spesial ${code} diterapkan! Diskon 50%`);
    } else {
      toast.error("Kode kupon tidak valid atau sudah kedaluwarsa.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setAppliedDiscountPercent(0);
    setCouponCode("");
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
          Ringkasan Pesanan
        </h3>
        <p className="text-xs text-foreground-muted mt-0.5">
          Periksa rincian pesanan dan paket langganan Anda
        </p>
      </div>

      {/* Fixed Monthly Billing Badge */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-primary">
          <Calendar className="size-3.5" />
          <span>Periode Tagihan: 1 Bulan (30 Hari)</span>
        </div>
        <p className="text-[11px] text-foreground-muted leading-relaxed">
          Siklus tagihan bulanan murni. Masa aktif akan otomatis diakumulasikan (+30 hari) jika Anda melakukan perpanjangan.
        </p>
      </div>

      {/* Cart Items List */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">
          Paket Terpilih ({cartItems.length})
        </span>

        {cartItems.length === 0 ? (
          <div className="py-6 text-center px-3 rounded-xl border border-dashed border-border/70 bg-muted/20">
            <p className="text-xs text-foreground-muted">
              Belum ada paket yang dipilih.
            </p>
            <p className="text-[11px] text-foreground-muted mt-0.5">
              Pilih paket pada tab saluran untuk menambahkannya ke pesanan.
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
                          ? "WhatsApp Web"
                          : item.channelType === "META_WABA_OFFICIAL"
                            ? "Meta WABA"
                            : "Telegram Bot"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-foreground">
                      {item.priceMonthly === 0
                        ? "Gratis"
                        : `Rp ${item.priceMonthly.toLocaleString("id-ID")}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-foreground-muted hover:text-destructive cursor-pointer transition p-1"
                      title="Hapus"
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
          <span>Punya Kode Kupon?</span>
        </label>
        <div className="flex gap-1.5">
          <Input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Contoh: SAVE20"
            disabled={Boolean(appliedCoupon)}
            className="h-8 text-xs rounded-xl uppercase font-mono tracking-wider"
          />
          {appliedCoupon ? (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleRemoveCoupon}
              className="h-8 text-[11px] rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              Hapus
            </Button>
          ) : (
            <Button
              type="submit"
              variant="outline"
              size="xs"
              disabled={!couponCode.trim()}
              className="h-8 text-[11px] rounded-xl px-3 cursor-pointer"
            >
              Terapkan
            </Button>
          )}
        </div>
        {appliedCoupon && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="size-3" />
            <span>Diskon {appliedDiscountPercent}% aktif ({appliedCoupon})</span>
          </p>
        )}
      </form>

      {/* Calculations Breakdown */}
      <div className="border-t border-border/60 pt-3.5 space-y-2 text-xs">
        <div className="flex justify-between text-foreground-secondary">
          <span>Subtotal (1 Bulan)</span>
          <span className="font-mono font-medium">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Diskon Kupon ({appliedDiscountPercent}%)</span>
            <span className="font-mono">
              -Rp {discountAmount.toLocaleString("id-ID")}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm font-bold text-foreground border-t border-border/60 pt-2">
          <span>Total Pembayaran</span>
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
            <span className="text-[11px]">Saldo Akun Anda:</span>
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
            ? "Memproses Pesanan..."
            : cartItems.length === 0
              ? "Pilih Paket Terlebih Dahulu"
              : total === 0
                ? "Aktivasi Paket Gratis"
                : "Order & Bayar Sekarang"}
        </span>
      </Button>
    </div>
  );
}
