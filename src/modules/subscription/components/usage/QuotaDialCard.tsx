"use client";

import React from "react";
import { TenantSubscription } from "@/modules/subscription/types/subscription.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import { Zap, Smartphone, ShieldCheck, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

interface QuotaDialCardProps {
  subscription: TenantSubscription | null;
}

export function QuotaDialCard({ subscription }: QuotaDialCardProps) {
  const { t } = useI18n();

  if (!subscription) {
    return <Skeleton className="h-64 w-full rounded-md" />;
  }

  const quotaTotal = Number(subscription.quotaTotal ?? 0);
  const quotaUsed = Number(subscription.quotaUsed ?? 0);
  const deviceSlotsUsed = Number(subscription.deviceSlotsUsed ?? 0);
  const deviceSlotsMax = Math.max(1, Number(subscription.deviceSlotsMax ?? 1));

  const quotaRemaining = Math.max(0, quotaTotal - quotaUsed);
  const percentRemaining = quotaTotal > 0 ? Math.round((quotaRemaining / quotaTotal) * 100) : 0;

  // SVG Gauge calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentRemaining / 100) * circumference;

  const expiresDateStr = subscription.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div className="border-border bg-surface space-y-6 rounded-md border p-6 shadow-sm sm:p-8 dark:bg-[#161715]">
      {/* Header Row */}
      <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 mb-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
            <Zap className="size-3.5" />
            <span>Paket Aktif: {subscription.planName || "Free Trial"}</span>
          </div>
          <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
            {t("subscription.quotaRemaining")}
          </h2>
        </div>

        <div className="text-foreground-secondary flex items-center gap-2 text-xs font-semibold">
          <Calendar className="text-foreground-muted size-4" />
          <span>
            {t("subscription.planExpires", {
              date: expiresDateStr,
            })}
          </span>
        </div>
      </div>

      {/* Main Meter & Metric Indicators */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
        {/* Circular SVG Quota Dial Gauge */}
        <div className="border-border/80 flex flex-col items-center justify-center rounded-md border bg-zinc-100 p-4 dark:bg-[#10110e]">
          <div className="relative flex size-36 items-center justify-center">
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
              <span className="text-foreground text-2xl font-black tracking-tight">
                {percentRemaining}%
              </span>
              <span className="text-foreground-muted text-[10px] font-bold tracking-wider uppercase">
                Sisa Kuota
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-0.5 text-center">
            <span className="text-foreground text-sm font-black">
              {quotaRemaining.toLocaleString("id-ID")} Pesan
            </span>
            <p className="text-foreground-muted text-[11px] font-semibold">
              {t("subscription.quotaDesc", {
                total: quotaTotal.toLocaleString("id-ID"),
              })}
            </p>
          </div>
        </div>

        {/* Right Info Cards: Device Slots & Watermark */}
        <div className="space-y-4 md:col-span-2">
          {/* Device Slot Usage Card */}
          <div className="border-border bg-surface space-y-2 rounded-md border p-4 dark:bg-[#1b1d1a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="dark:text-wise-green size-4 text-emerald-700" />
                <span className="text-foreground text-xs font-bold">
                  {t("subscription.deviceSlots")}
                </span>
              </div>
              <span className="text-foreground text-xs font-black">
                {deviceSlotsUsed} / {deviceSlotsMax} Slot
              </span>
            </div>
            {/* Progress Bar */}
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-wise-green h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (deviceSlotsUsed / deviceSlotsMax) * 100)}%`,
                }}
              />
            </div>
            <p className="text-foreground-muted text-[11px] font-semibold">
              {t("subscription.deviceSlotsDesc", {
                used: deviceSlotsUsed.toString(),
                max: deviceSlotsMax.toString(),
              })}
            </p>
          </div>

          {/* Watermark Status Card */}
          <div className="border-border bg-surface flex items-center justify-between rounded-md border p-4 dark:bg-[#1b1d1a]">
            <div className="flex items-center gap-3">
              <div className="bg-muted text-foreground-secondary flex size-9 items-center justify-center rounded-full">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <span className="text-foreground block text-xs font-bold">
                  {t("subscription.watermarkStatus")}
                </span>
                <p className="text-foreground-muted text-[11px] font-semibold">
                  {subscription.hasWatermark
                    ? t("subscription.watermarkActive")
                    : t("subscription.watermarkDisabled")}
                </p>
              </div>
            </div>

            {subscription.hasWatermark ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <AlertCircle className="size-3" />
                <span>Aktif</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
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
