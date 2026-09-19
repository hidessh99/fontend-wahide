"use client";

import React from "react";
import { Clock } from "lucide-react";
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker";
import { useI18n } from "@/lib/i18n/context";

export type LogTimeRange = "all" | "today" | "7d" | "30d" | "custom";

export interface LogPeriodFilterProps {
  timeRange: LogTimeRange;
  onTimeRangeChange: (range: LogTimeRange) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
  className?: string;
}

export function resolveDateRangeISO(
  timeRange: LogTimeRange,
  customRange: DateRange,
): { startDate?: string; endDate?: string } {
  const now = new Date();

  if (timeRange === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }

  if (timeRange === "7d") {
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);
    return { startDate: start.toISOString(), endDate: now.toISOString() };
  }

  if (timeRange === "30d") {
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);
    return { startDate: start.toISOString(), endDate: now.toISOString() };
  }

  if (timeRange === "custom") {
    let startDate: string | undefined;
    let endDate: string | undefined;
    if (customRange.from) {
      const start = new Date(customRange.from);
      start.setHours(0, 0, 0, 0);
      startDate = start.toISOString();
    }
    if (customRange.to) {
      const end = new Date(customRange.to);
      end.setHours(23, 59, 59, 999);
      endDate = end.toISOString();
    }
    return { startDate, endDate };
  }

  // "all" - no time boundary
  return {};
}

export function LogPeriodFilter({
  timeRange,
  onTimeRangeChange,
  customRange,
  onCustomRangeChange,
  className = "",
}: LogPeriodFilterProps) {
  const { t, locale } = useI18n();

  const periods: { id: LogTimeRange; label: string }[] = [
    { id: "all", label: t("common.allTime") },
    { id: "today", label: t("whatsapp.stats.periodToday") },
    { id: "7d", label: t("whatsapp.stats.period7d") },
    { id: "30d", label: t("whatsapp.stats.period30d") },
  ];

  const dateLocale = locale === "en" ? "en-US" : "id-ID";

  const customButtonPlaceholder =
    timeRange === "custom" && customRange.from
      ? `${customRange.from.toLocaleDateString(dateLocale, {
          day: "numeric",
          month: "short",
        })}${
          customRange.to
            ? ` - ${customRange.to.toLocaleDateString(dateLocale, {
                day: "numeric",
                month: "short",
              })}`
            : ""
        }`
      : t("common.customRange");

  return (
    <div
      className={`flex flex-wrap items-center gap-2 max-w-full ${className}`}
      role="group"
      aria-label={t("common.filterPeriodAria") || "Filter periode waktu log"}
    >
      {/* Segmented Quick Preset Pills */}
      <div className="border-border/80 bg-muted/60 inline-flex items-center gap-1 rounded-full border p-1 shadow-xs max-w-full overflow-x-auto scrollbar-none">
        {periods.map((item) => {
          const isActive = timeRange === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTimeRangeChange(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-white text-dark-green shadow-xs dark:bg-wise-green dark:text-dark-green"
                  : "text-foreground-secondary hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {item.id === "all" && <Clock className="size-3.5 opacity-70" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Date Range Picker Popover for Custom Interval */}
      <DateRangePicker
        range={customRange}
        onRangeChange={(r) => {
          onCustomRangeChange(r);
          if (r.from) {
            onTimeRangeChange("custom");
          }
        }}
        placeholder={customButtonPlaceholder}
        align="right"
        className={
          timeRange === "custom"
            ? "ring-2 ring-emerald-500/50 dark:ring-wise-green/50 font-bold"
            : ""
        }
      />
    </div>
  );
}

export default LogPeriodFilter;
