"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangePickerProps {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  className?: string;
  placeholder?: string;
  align?: "left" | "right";
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const formatDateShort = (d: Date | null): string => {
  if (!d) return "";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export function DateRangePicker({
  range,
  onRangeChange,
  className = "",
  placeholder = "Rentang kustom",
  align = "right",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFrom, setTempFrom] = useState<Date | null>(range.from);
  const [tempTo, setTempTo] = useState<Date | null>(range.to);

  // Active viewing month
  const [viewDate, setViewDate] = useState<Date>(() => range.from || new Date());
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync internal state when external range changes
  useEffect(() => {
    setTempFrom(range.from);
    setTempTo(range.to);
    if (range.from) {
      setViewDate(range.from);
    }
  }, [range.from, range.to]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const prevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (dayDate: Date) => {
    if (!tempFrom || (tempFrom && tempTo)) {
      // First click: reset and pick start
      setTempFrom(dayDate);
      setTempTo(null);
    } else if (tempFrom && !tempTo) {
      // Second click: pick end
      if (dayDate.getTime() < tempFrom.getTime()) {
        setTempTo(tempFrom);
        setTempFrom(dayDate);
      } else {
        setTempTo(dayDate);
      }
    }
  };

  const applyPreset = (daysBack: number) => {
    const now = new Date();
    const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (daysBack - 1), 0, 0, 0);
    setTempFrom(from);
    setTempTo(to);
    setViewDate(from);
  };

  const applyYesterday = () => {
    const now = new Date();
    const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const from = new Date(yest.getFullYear(), yest.getMonth(), yest.getDate(), 0, 0, 0);
    const to = new Date(yest.getFullYear(), yest.getMonth(), yest.getDate(), 23, 59, 59);
    setTempFrom(from);
    setTempTo(to);
    setViewDate(from);
  };

  const applyThisMonth = () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    setTempFrom(from);
    setTempTo(to);
    setViewDate(from);
  };

  const handleApply = () => {
    onRangeChange({ from: tempFrom, to: tempTo });
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempFrom(null);
    setTempTo(null);
    onRangeChange({ from: null, to: null });
    setIsOpen(false);
  };

  // Generate days matrix for the active month view
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  // Leading days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }
  // Trailing days for 42-cell calendar grid
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
    });
  }

  const hasRange = range.from !== null;
  const labelText = hasRange
    ? `${formatDateShort(range.from)}${
        range.to && !isSameDay(range.from, range.to)
          ? ` - ${formatDateShort(range.to)}`
          : ""
      }`
    : placeholder;

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all border cursor-pointer select-none ${
          hasRange
            ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:border-wise-green/60 dark:bg-wise-green/15 dark:text-wise-green shadow-xs"
            : "border-border/80 bg-muted/60 text-foreground-secondary hover:text-foreground"
        }`}
      >
        <CalendarIcon className="size-3.5" />
        <span>{labelText}</span>
        {hasRange && (
          <X
            className="size-3 hover:text-foreground ml-0.5 opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          />
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          className={`absolute top-full z-50 mt-2 w-85 sm:w-135 rounded-2xl border border-border bg-surface p-4 shadow-xl dark:bg-[#151614] animate-in fade-in-50 zoom-in-95 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Presets Sidebar */}
            <div className="flex flex-row sm:flex-col gap-1.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 sm:w-36 border-b sm:border-b-0 sm:border-r border-border pr-0 sm:pr-3">
              <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-1 hidden sm:block">
                Pintasan
              </span>
              <button
                type="button"
                onClick={() => applyPreset(1)}
                className="rounded-lg px-2.5 py-1.5 text-xs text-left font-medium text-foreground-secondary hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
              >
                Hari ini
              </button>
              <button
                type="button"
                onClick={applyYesterday}
                className="rounded-lg px-2.5 py-1.5 text-xs text-left font-medium text-foreground-secondary hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
              >
                Kemarin
              </button>
              <button
                type="button"
                onClick={() => applyPreset(7)}
                className="rounded-lg px-2.5 py-1.5 text-xs text-left font-medium text-foreground-secondary hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
              >
                7 hari terakhir
              </button>
              <button
                type="button"
                onClick={() => applyPreset(30)}
                className="rounded-lg px-2.5 py-1.5 text-xs text-left font-medium text-foreground-secondary hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
              >
                30 hari terakhir
              </button>
              <button
                type="button"
                onClick={applyThisMonth}
                className="rounded-lg px-2.5 py-1.5 text-xs text-left font-medium text-foreground-secondary hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
              >
                Bulan ini
              </button>
            </div>

            {/* Calendar View */}
            <div className="flex-1 space-y-3">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="rounded-lg p-1 text-foreground-muted hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-xs font-bold text-foreground">
                  {MONTH_NAMES[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="rounded-lg p-1 text-foreground-muted hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {DAY_NAMES.map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-semibold text-foreground-muted"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((item, idx) => {
                  const dTime = item.date.getTime();
                  const isFrom = isSameDay(item.date, tempFrom);
                  const isTo = isSameDay(item.date, tempTo);
                  const inBetween =
                    tempFrom &&
                    tempTo &&
                    dTime > tempFrom.getTime() &&
                    dTime < tempTo.getTime();

                  let dayStyle = "text-foreground-secondary hover:bg-muted/60";
                  if (!item.isCurrentMonth) {
                    dayStyle = "text-foreground-muted/40 opacity-50";
                  }
                  if (isFrom || isTo) {
                    dayStyle =
                      "bg-emerald-600 text-white dark:bg-wise-green dark:text-dark-green font-bold shadow-xs";
                  } else if (inBetween) {
                    dayStyle =
                      "bg-emerald-500/15 text-emerald-700 dark:bg-wise-green/15 dark:text-wise-green font-medium rounded-none";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDateClick(item.date)}
                      className={`h-7 w-full rounded-md text-xs transition-colors flex items-center justify-center cursor-pointer ${dayStyle}`}
                    >
                      {item.date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Summary & Manual Inputs */}
              <div className="border-t border-border pt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-foreground-muted">
                  {tempFrom ? (
                    <span>
                      {formatDateShort(tempFrom)}
                      {tempTo && ` - ${formatDateShort(tempTo)}`}
                    </span>
                  ) : (
                    <span>Pilih tanggal mulai & akhir</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-foreground-muted hover:text-foreground"
                  >
                    <RotateCcw className="size-3 mr-1" />
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="primaryPill"
                    size="sm"
                    onClick={handleApply}
                    disabled={!tempFrom}
                    className="h-7 px-3 text-xs font-bold gap-1"
                  >
                    <Check className="size-3" />
                    Terapkan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
