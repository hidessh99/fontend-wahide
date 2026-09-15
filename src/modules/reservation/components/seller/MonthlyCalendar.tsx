"use client";

import React, { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { CalendarSummary } from "../../types/reservation.types";

interface MonthlyCalendarProps {
  currentMonth: string; // YYYY-MM
  calendarSummary: CalendarSummary | null;
  isLoading?: boolean;
  selectedDate: string; // YYYY-MM-DD
  onMonthChange: (newMonth: string) => void;
  onSelectDate: (dateStr: string) => void;
}

export function MonthlyCalendar({
  currentMonth,
  calendarSummary,
  isLoading,
  selectedDate,
  onMonthChange,
  onSelectDate,
}: MonthlyCalendarProps) {
  const { t, locale } = useI18n();

  // Parse Year & Month
  const [year, month] = useMemo(() => {
    const parts = currentMonth.split("-").map(Number);
    return [parts[0] || new Date().getFullYear(), (parts[1] || 1) - 1];
  }, [currentMonth]);

  const monthName = useMemo(() => {
    const date = new Date(year, month, 1);
    return date.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      month: "long",
      year: "numeric",
    });
  }, [year, month, locale]);

  const weekdays = useMemo(() => {
    return locale === "id"
      ? ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }, [locale]);

  // Generate day matrix
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      count: number;
    }> = [];

    const todayStr = new Date().toISOString().slice(0, 10);

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      const mStr = String(prevMonth).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const dateStr = `${prevYear}-${mStr}-${dStr}`;

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        count:
          (calendarSummary?.summary && calendarSummary.summary[dateStr]) || 0,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const dateStr = `${year}-${mStr}-${dStr}`;

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        count:
          (calendarSummary?.summary && calendarSummary.summary[dateStr]) || 0,
      });
    }

    // Next month padding to fill full grid (multiple of 7)
    const totalFilled = days.length;
    const remaining = 7 - (totalFilled % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const nextMonth = month === 11 ? 1 : month + 2;
        const nextYear = month === 11 ? year + 1 : year;
        const mStr = String(nextMonth).padStart(2, "0");
        const dStr = String(d).padStart(2, "0");
        const dateStr = `${nextYear}-${mStr}-${dStr}`;

        days.push({
          dateStr,
          dayNumber: d,
          isCurrentMonth: false,
          isToday: dateStr === todayStr,
          count:
            (calendarSummary?.summary && calendarSummary.summary[dateStr]) || 0,
        });
      }
    }

    return days;
  }, [year, month, calendarSummary]);

  const handlePrevMonth = () => {
    const prevDate = new Date(year, month - 1, 1);
    const y = prevDate.getFullYear();
    const m = String(prevDate.getMonth() + 1).padStart(2, "0");
    onMonthChange(`${y}-${m}`);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(year, month + 1, 1);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, "0");
    onMonthChange(`${y}-${m}`);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    onMonthChange(`${y}-${m}`);
  };

  return (
    <Card className="p-4 sm:p-5 flex flex-col gap-4">
      {/* Calendar Header Navigation */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100 capitalize">
              {monthName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {calendarSummary?.totalBookings ?? 0}{" "}
              {t("reservation.totalBookingsThisMonth")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCurrentMonth}
            className="text-xs h-8 px-2.5"
            title={t("reservation.thisMonth")}
          >
            {t("reservation.todayBtn")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8"
            aria-label={t("reservation.prevMonth")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
            aria-label={t("reservation.nextMonth")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selected Date Filter Indicator */}
      {selectedDate && (
        <div className="flex items-center justify-between bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
          <span>
            {t("reservation.filteringByDate")} <strong>{selectedDate}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectDate("")}
            className="h-6 px-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {t("reservation.clearFilter")}
          </Button>
        </div>
      )}

      <Separator />

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center font-medium text-xs text-slate-500 dark:text-slate-400 pb-1">
        {weekdays.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Matrix */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {calendarDays.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          const hasBookings = item.count > 0;

          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={cn(
                "min-h-12 sm:min-h-14 p-1 sm:p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-150 relative",
                item.isCurrentMonth
                  ? "bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800"
                  : "bg-slate-100/30 dark:bg-slate-950/30 text-slate-400 dark:text-slate-600 border-transparent hover:border-slate-200 dark:hover:border-slate-800",
                item.isToday && "ring-1 ring-emerald-500 font-semibold",
                isSelected &&
                  "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20",
              )}
            >
              {/* Day number & today dot */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={cn(
                    "text-xs sm:text-sm leading-none",
                    item.isToday
                      ? "text-emerald-800 dark:text-emerald-400 font-bold"
                      : item.isCurrentMonth
                        ? "text-slate-700 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-600",
                    isSelected &&
                      "text-emerald-700 dark:text-emerald-300 font-bold",
                  )}
                >
                  {item.dayNumber}
                </span>
                {item.isToday && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </div>

              {/* Booking count pill badge */}
              {hasBookings && (
                <div className="mt-1 flex items-center justify-end">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] sm:text-xs h-4 px-1.5 font-medium leading-none",
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
                    )}
                  >
                    {item.count}
                  </Badge>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="text-center py-2 text-xs text-slate-400 animate-pulse">
          {t("common.loading")}
        </div>
      )}
    </Card>
  );
}
