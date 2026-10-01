"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  Crown,
  Smartphone,
  Building2,
  Send,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { PlanUsageViewModel } from "../../utils/subscriptionUsage";

interface DashboardPlanUsageCardProps {
  data: PlanUsageViewModel;
  className?: string;
}

export function DashboardPlanUsageCard({
  data,
  className = "",
}: DashboardPlanUsageCardProps) {
  const { t, locale } = useI18n();

  const isId = locale !== "en";
  const numFmt = (n: number) =>
    n.toLocaleString(isId ? "id-ID" : "en-US");

  const getStatusColor = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "critical":
        return {
          bar: "bg-rose-500",
          text: "text-rose-600 dark:text-rose-400",
          bg: "bg-rose-500/10",
        };
      case "warning":
        return {
          bar: "bg-amber-500",
          text: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-500/10",
        };
      default:
        return {
          bar: "bg-emerald-500",
          text: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-500/10",
        };
    }
  };

  const globalStatus = getStatusColor(data.totalQuota.status);

  return (
    <Card
      className={`border-border bg-surface relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all sm:p-6 ${className}`}
    >
      {/* Decorative subtle ambient accent glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-emerald-500/5 blur-2xl" />

      {/* ========================================================================= */}
      {/* 1. HEADER: NAMA PAKET, BADGE TIER, & MASA BERLAKU                         */}
      {/* ========================================================================= */}
      <div className="border-border/60 flex items-start justify-between border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Crown className="size-3.5" />
            </span>
            <span className="text-foreground text-sm font-extrabold sm:text-base">
              {data.planName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
            <Clock className="text-foreground-muted size-3.5 shrink-0" />
            {data.isLifetime ? (
              <span className="text-foreground-secondary font-medium">
                {t("overview.planLifetime") || "Masa Aktif: Selamanya (Lifetime)"}
              </span>
            ) : data.expiryInfo.isExpired ? (
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {t("overview.planExpired") || "Masa Aktif Berakhir"}
              </span>
            ) : (
              <span className="text-foreground-secondary font-medium">
                {t("overview.planExpiresIn", {
                  days: data.expiryInfo.daysRemaining,
                }) || `Sisa ${data.expiryInfo.daysRemaining} Hari`}
                <span className="text-foreground-muted ml-1 font-normal">
                  ({data.expiryInfo.formattedDate})
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Tier & Status Badge */}
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            <Sparkles className="size-2.5" />
            {data.tierBadge}
          </span>
          {data.expiryInfo.isExpiringSoon && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
              <AlertTriangle className="size-2.5" />
              {t("overview.expiringSoon") || "Segera Berakhir"}
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. AGGREGATE TOTAL MESSAGE QUOTA (GLOBAL PROGRESS)                        */}
      {/* ========================================================================= */}
      <div className="border-border/60 space-y-2 border-b py-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-foreground-secondary">
            {t("overview.totalQuotaTitle") || "Total Kuota Pesan Bulanan"}
          </span>
          <span className="font-mono font-bold text-foreground">
            {numFmt(data.totalQuota.used)} / {numFmt(data.totalQuota.max)}
            <span className={`ml-1.5 font-sans font-bold ${globalStatus.text}`}>
              ({data.totalQuota.percentage}%)
            </span>
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-muted/60 relative h-2.5 w-full overflow-hidden rounded-full">
          <div
            style={{ width: `${Math.min(100, data.totalQuota.percentage)}%` }}
            className={`h-full rounded-full transition-all duration-700 ${globalStatus.bar}`}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RINCIAN PENGGUNAAN PER CHANNEL (WhatsApp Web, Meta WABA, Telegram)     */}
      {/* ========================================================================= */}
      <div className="space-y-3.5 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            {t("overview.channelUsageTitle") || "Penggunaan Per Channel"}
          </span>
          <span className="text-foreground-muted text-[11px] font-medium">
            {t("overview.hardwareAndVolume") || "Kapasitas & Volume"}
          </span>
        </div>

        <div className="divide-border/40 space-y-3 divide-y">
          {data.channels.map((ch) => {
            const chStatus = getStatusColor(ch.status);

            let Icon = Smartphone;
            let iconBg = "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
            if (ch.channelType === "WABA") {
              Icon = Building2;
              iconBg = "bg-teal-500/15 text-teal-600 dark:text-teal-400";
            } else if (ch.channelType === "TELEGRAM") {
              Icon = Send;
              iconBg = "bg-sky-500/15 text-sky-600 dark:text-sky-400";
            }

            return (
              <div key={ch.channelType} className="pt-2.5 first:pt-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`flex size-6 items-center justify-center rounded-md ${iconBg}`}>
                      <Icon className="size-3.5" />
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      {ch.label}
                    </span>
                  </div>

                  <Link
                    href={ch.connectUrl}
                    className="text-foreground-muted hover:text-foreground inline-flex items-center gap-0.5 text-[11px] font-semibold transition-colors"
                  >
                    <span>{ch.actionLabel}</span>
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  {/* Metric A: Senders / Hardware Slots */}
                  <div className="bg-muted/30 flex items-center justify-between rounded-lg px-2.5 py-1.5 border border-border/40">
                    <span className="text-foreground-muted">
                      {ch.sendersUnit}
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {ch.sendersUsed} / {ch.sendersMax}
                    </span>
                  </div>

                  {/* Metric B: Message Quota Usage */}
                  <div className="bg-muted/30 flex items-center justify-between rounded-lg px-2.5 py-1.5 border border-border/40">
                    <span className="text-foreground-muted">
                      {t("overview.quotaUnit") || "Pesan"}
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {numFmt(ch.messagesUsed)} / {numFmt(ch.messagesMax)}
                    </span>
                  </div>
                </div>

                {/* Mini Progress Bar for Channel Quota */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="bg-muted/50 relative h-1.5 flex-1 overflow-hidden rounded-full">
                    <div
                      style={{ width: `${Math.min(100, ch.percentage)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${chStatus.bar}`}
                    />
                  </div>
                  <span className={`font-mono text-[10px] font-bold shrink-0 ${chStatus.text}`}>
                    {ch.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER: CTA BUTTONS UNTUK UPGRADE / PERPANJANG                         */}
      {/* ========================================================================= */}
      <div className="border-border/60 mt-5 grid grid-cols-1 gap-2 border-t pt-4 sm:grid-cols-2">
        <Link href="/subscription" className="w-full">
          <Button
            variant="default"
            size="sm"
            className="w-full justify-center gap-1.5 rounded-full text-xs font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xs"
          >
            <Sparkles className="size-3.5" />
            <span>{t("overview.upgradePlanBtn") || "Tingkatkan Paket"}</span>
          </Button>
        </Link>

        <Link href="/subscription" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:border-foreground-muted w-full justify-center gap-1.5 rounded-full text-xs font-bold"
          >
            <CheckCircle2 className="size-3.5" />
            <span>{t("overview.manageSubscriptionBtn") || "Kelola Langganan"}</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
