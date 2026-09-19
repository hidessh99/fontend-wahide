"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Layers,
  Inbox,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  useWhatsAppStats,
  WhatsAppStatsTimeRange,
  WhatsAppStatsCategory,
} from "@/modules/whatsapp/hooks/useWhatsAppStats";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MessageCategoryTabs, MessageCategory } from "@/components/ui/message-category-tabs";

export function WhatsAppStatsView() {
  const { t } = useI18n();
  const {
    timeRange,
    setTimeRange,
    categoryFilter,
    setCategoryFilter,
    customRange,
    setCustomRange,
    stats,
    isLoading,
    refetch,
  } = useWhatsAppStats();

  const timeRanges: {
    id: WhatsAppStatsTimeRange;
    label: string;
    badgeLabel: string;
  }[] = [
    { id: "today", label: t("whatsapp.stats.periodToday"), badgeLabel: t("whatsapp.stats.badgeToday") },
    { id: "7d", label: t("whatsapp.stats.period7d"), badgeLabel: t("whatsapp.stats.badge7d") },
    { id: "30d", label: t("whatsapp.stats.period30d"), badgeLabel: t("whatsapp.stats.badge30d") },
  ];

  const activePeriodLabel =
    timeRange === "custom" && customRange.from
      ? `${customRange.from.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}${
          customRange.to
            ? ` - ${customRange.to.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`
            : ""
        }`
      : timeRanges.find((r) => r.id === timeRange)?.badgeLabel || t("whatsapp.stats.badgeToday");

  // Calculate maximum total volume for normalized bar scaling in Daily Activity
  const maxDayTotal = Math.max(
    ...stats.dailyActivity.map((d) => d.total),
    1,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header with Title & Period Filter Switcher */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("whatsapp.stats.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("whatsapp.stats.subtitle")}
          </p>
        </div>

        {/* Action Bar: Time Range Selector, DateRangePicker & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <div className="bg-muted/60 border-border/80 flex items-center rounded-full border p-1">
            {timeRanges.map((range) => {
              const isActive = timeRange === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setTimeRange(range.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-dark-green shadow-xs dark:bg-wise-green dark:text-dark-green"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          <DateRangePicker
            range={customRange}
            onRangeChange={(r) => {
              setCustomRange(r);
              if (r.from) {
                setTimeRange("custom");
              }
            }}
            placeholder={t("common.customRange")}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="border-border/80 text-xs font-semibold rounded-full h-9 px-3"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("whatsapp.stats.reload")}</span>
          </Button>
        </div>
      </div>

      {/* Row 2: Category Segmented Navigation: [ Semua ] [ Pesan ] [ OTP ] [ Broadcast ] */}
      <div className="flex items-center justify-between gap-3">
        <MessageCategoryTabs
          activeCategory={categoryFilter as MessageCategory}
          onCategoryChange={(cat) => setCategoryFilter(cat as WhatsAppStatsCategory)}
        />
      </div>

      {/* Top 3 KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 1. Total Sends */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("whatsapp.stats.kpiTotalSends")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-muted/60 text-foreground-secondary">
              <Send className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p className="font-mono text-3xl font-black text-foreground">
                {stats.totalSends.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-foreground-muted text-[11px] lowercase">
            {activePeriodLabel}
          </p>
        </div>

        {/* 2. Delivered */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("whatsapp.stats.kpiDelivered")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p className="font-mono text-3xl font-black text-foreground">
                {stats.deliveredCount.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
            {t("whatsapp.stats.kpiDeliveryRate", { rate: stats.deliveryRate.toString() })}
          </p>
        </div>

        {/* 3. Failed */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("whatsapp.stats.kpiFailed")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p
                className={`font-mono text-3xl font-black ${
                  stats.failedCount > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-foreground"
                }`}
              >
                {stats.failedCount.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-rose-600/90 dark:text-rose-400/90 text-[11px] font-semibold">
            {t("whatsapp.stats.kpiFailureRate", { rate: stats.failureRate.toString() })}
          </p>
        </div>
      </div>

      {/* Row 2: Daily Activity Chart & Histogram */}
      <div className="bg-surface border-border rounded-2xl border p-6 space-y-5 shadow-xs dark:bg-[#151614]">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-foreground text-sm font-bold">
              {t("whatsapp.stats.dailyActivityTitle")}
            </h3>
            <p className="text-foreground-secondary text-xs">
              {t("whatsapp.stats.dailyActivitySub", { period: activePeriodLabel })}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-foreground-secondary">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 dark:bg-wise-green" />
              <span>{t("whatsapp.stats.legendDelivered")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>{t("whatsapp.stats.legendFailed")}</span>
            </div>
          </div>
        </div>

        {/* Activity Container / Empty State */}
        {isLoading ? (
          <div className="space-y-3 py-8">
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : !stats.hasActivity ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-14 text-center">
            <div className="mb-2.5 flex size-10 items-center justify-center rounded-full bg-muted/50 text-foreground-muted">
              <BarChart3 className="size-5" />
            </div>
            <p className="text-foreground-secondary text-xs font-medium">
              {t("whatsapp.stats.noActivity")}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Visual Bars Container */}
            <div className="flex items-end gap-2 sm:gap-4 overflow-x-auto pb-2 min-h-[160px] pt-4">
              {stats.dailyActivity.map((day) => {
                const deliveredPercent =
                  day.total > 0
                    ? Math.round((day.delivered / maxDayTotal) * 100)
                    : 0;
                const failedPercent =
                  day.total > 0
                    ? Math.round((day.failed / maxDayTotal) * 100)
                    : 0;

                return (
                  <div
                    key={day.dateKey}
                    className="flex flex-1 min-w-[32px] flex-col items-center gap-2 group"
                  >
                    {/* Bar Visualizer */}
                    <div className="relative flex h-32 w-full max-w-[42px] flex-col justify-end overflow-hidden rounded-md bg-muted/30">
                      {/* Delivered Stack */}
                      <div
                        style={{ height: `${deliveredPercent}%` }}
                        className="w-full bg-emerald-500 dark:bg-wise-green transition-all duration-300"
                        title={`${day.label}: ${day.delivered} ${t("whatsapp.stats.legendDelivered")}`}
                      />
                      {/* Failed Stack */}
                      <div
                        style={{ height: `${failedPercent}%` }}
                        className="w-full bg-rose-500 transition-all duration-300"
                        title={`${day.label}: ${day.failed} ${t("whatsapp.stats.legendFailed")}`}
                      />
                    </div>

                    {/* Date Label */}
                    <span className="text-[10px] sm:text-[11px] font-medium text-foreground-muted group-hover:text-foreground transition-colors whitespace-nowrap">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: 2 Breakdown Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card 1: Top Send Types */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="space-y-0.5">
            <h3 className="text-foreground text-sm font-bold">
              {t("whatsapp.stats.topSendTypes")}
            </h3>
            <p className="text-foreground-secondary text-xs">
              {t("whatsapp.stats.topSendTypesSub")}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : stats.topSendTypes.total === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-10 text-center">
              <Inbox className="size-6 text-foreground-muted mb-2" />
              <p className="text-foreground-secondary text-xs font-medium">
                {t("whatsapp.stats.noSends")}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Direct Sends */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Send className="size-3.5 text-muted-foreground" />
                    {t("whatsapp.stats.directSends")}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {stats.topSendTypes.directCount.toLocaleString()}{" "}
                    <span className="text-foreground-muted font-normal">
                      ({stats.topSendTypes.directPercent}%)
                    </span>
                  </span>
                </div>
                <Progress
                  value={stats.topSendTypes.directPercent}
                  className="h-2"
                />
              </div>

              {/* Named Campaigns */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="size-3.5 text-muted-foreground" />
                    {t("whatsapp.stats.namedCampaigns")}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {stats.topSendTypes.campaignCount.toLocaleString()}{" "}
                    <span className="text-foreground-muted font-normal">
                      ({stats.topSendTypes.campaignPercent}%)
                    </span>
                  </span>
                </div>
                <Progress
                  value={stats.topSendTypes.campaignPercent}
                  className="h-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 2: By Number */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="space-y-0.5">
            <h3 className="text-foreground text-sm font-bold">
              {t("whatsapp.stats.byNumber")}
            </h3>
            <p className="text-foreground-secondary text-xs">
              {t("whatsapp.stats.byNumberSub")}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : stats.byNumber.length === 0 || stats.totalSends === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-10 text-center">
              <Smartphone className="size-6 text-foreground-muted mb-2" />
              <p className="text-foreground-secondary text-xs font-medium">
                {t("whatsapp.stats.noSends")}
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {stats.byNumber.map((device, idx) => (
                <div
                  key={device.id}
                  className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground-muted">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-foreground leading-none">
                          {device.pushName}
                        </p>
                        {device.phone && (
                          <p className="text-[11px] font-mono text-foreground-muted mt-0.5">
                            +{device.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {device.count.toLocaleString()} {t("whatsapp.stats.messagesCount")}
                      </span>
                      <span className="text-[10px] text-foreground-muted ml-1">
                        ({device.percent}%)
                      </span>
                    </div>
                  </div>

                  <Progress value={device.percent} className="h-1.5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WhatsAppStatsView;
