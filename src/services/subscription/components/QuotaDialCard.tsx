"use client";

import React from "react";
import { TenantSubscription } from "../types/subscription.types";
import { useI18n } from "@/lib/i18n/context";
import {
  Zap,
  Smartphone,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface QuotaDialCardProps {
  subscription: TenantSubscription | null;
}

export function QuotaDialCard({ subscription }: QuotaDialCardProps) {
  const { t } = useI18n();

  if (!subscription) {
    return (
      <div className="h-64 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-6" />
    );
  }

  const quotaRemaining = Math.max(
    0,
    subscription.quotaTotal - subscription.quotaUsed
  );
  const percentRemaining =
    subscription.quotaTotal > 0
      ? Math.round((quotaRemaining / subscription.quotaTotal) * 100)
      : 0;

  // SVG Gauge calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (percentRemaining / 100) * circumference;

  return (
    <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/15 text-wise-green mb-1">
            <Zap className="size-3.5" />
            <span>Paket Aktif: {subscription.planName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t("subscription.quotaRemaining")}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-foreground-secondary">
          <Calendar className="size-4 text-foreground-muted" />
          <span>
            {t("subscription.planExpires", {
              date: new Date(subscription.expiresAt).toLocaleDateString([], {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            })}
          </span>
        </div>
      </div>

      {/* Main Meter & Metric Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Circular SVG Quota Dial Gauge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-md bg-zinc-100 dark:bg-[#10110e] border border-border/80">
          <div className="relative size-36 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Track Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-muted"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Dynamic Animated Green Quota Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-wise-green transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            {/* Inner Center Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground tracking-tight">
                {percentRemaining}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                Sisa Kuota
              </span>
            </div>
          </div>

          <div className="text-center mt-3 space-y-0.5">
            <span className="text-sm font-black text-foreground">
              {quotaRemaining.toLocaleString("id-ID")} Pesan
            </span>
            <p className="text-[11px] font-semibold text-foreground-muted">
              {t("subscription.quotaDesc", {
                total: subscription.quotaTotal.toLocaleString("id-ID"),
              })}
            </p>
          </div>
        </div>

        {/* Right Info Cards: Device Slots & Watermark */}
        <div className="md:col-span-2 space-y-4">
          {/* Device Slot Usage Card */}
          <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#1b1d1a] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="size-4 text-wise-green" />
                <span className="text-xs font-bold text-foreground">
                  {t("subscription.deviceSlots")}
                </span>
              </div>
              <span className="text-xs font-black text-foreground">
                {subscription.deviceSlotsUsed} / {subscription.deviceSlotsMax} Slot
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-wise-green rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    (subscription.deviceSlotsUsed / subscription.deviceSlotsMax) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-[11px] font-semibold text-foreground-muted">
              {t("subscription.deviceSlotsDesc", {
                used: subscription.deviceSlotsUsed.toString(),
                max: subscription.deviceSlotsMax.toString(),
              })}
            </p>
          </div>

          {/* Watermark Status Card */}
          <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#1b1d1a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">
                  {t("subscription.watermarkStatus")}
                </span>
                <p className="text-[11px] font-semibold text-foreground-muted">
                  {subscription.hasWatermark
                    ? t("subscription.watermarkActive")
                    : t("subscription.watermarkDisabled")}
                </p>
              </div>
            </div>

            {subscription.hasWatermark ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <AlertCircle className="size-3" />
                <span>Aktif</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="size-3" />
                <span>White-Label</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
