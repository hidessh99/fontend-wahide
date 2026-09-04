"use client";

import React, { useState } from "react";
import { UserActivityItem } from "@/modules/iam/types/activity.types";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  RefreshCw,
  Activity,
  LogIn,
  LogOut,
  UserPlus,
  KeyRound,
  Shield,
  Clock,
  Filter,
  CreditCard,
  Receipt,
  Wallet,
  Smartphone,
  Send,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function formatHumanActivityDate(
  rawDate?: string,
  locale = "id"
): {
  formattedDate: string;
  formattedTime: string;
  fullHuman: string;
} {
  if (!rawDate || rawDate.trim() === "" || rawDate === "-") {
    return { formattedDate: "-", formattedTime: "", fullHuman: "-" };
  }

  // Handle format "YYYY-MM-DD HH:mm:ss" or ISO string
  const sanitized = rawDate.includes("T") ? rawDate : rawDate.replace(" ", "T");
  const dateObj = new Date(sanitized);

  if (isNaN(dateObj.getTime())) {
    return { formattedDate: rawDate, formattedTime: "", fullHuman: rawDate };
  }

  const formattedDate = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const timeSuffix = locale === "en" ? "UTC+7" : "WIB";
  const formattedTime = `${hours}:${minutes} ${timeSuffix}`;
  const fullHuman = `${formattedDate}, ${formattedTime}`;

  return { formattedDate, formattedTime, fullHuman };
}

export interface UserActivityFormProps {
  activities: UserActivityItem[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  activeSearch: string;
  typeFilter: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onTypeFilterChange: (type: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onRefresh: () => void;
}

export function UserActivityForm({
  activities,
  isLoading,
  page,
  pageSize,
  total,
  totalPages,
  activeSearch,
  typeFilter,
  onSearch,
  onClearSearch,
  onTypeFilterChange,
  onPrevPage,
  onNextPage,
  onRefresh,
}: UserActivityFormProps) {
  const { t, locale } = useI18n();
  const [searchInput, setSearchInput] = useState("");

  const handleClear = () => {
    setSearchInput("");
    onClearSearch();
  };

  const filterChips = [
    { value: "ALL", label: t("activities.filterAll") },
    { value: "FINANCE", label: t("activities.filterFinance") },
    { value: "AUTH", label: t("activities.filterAuth") },
    { value: "SECURITY", label: t("activities.filterSecurity") },
    { value: "WHATSAPP", label: t("activities.filterWhatsapp") },
    { value: "PROFILE", label: t("activities.filterProfile") },
  ];

  const renderTypeBadge = (rawType: string) => {
    const t = (rawType || "UNKNOWN").toUpperCase();

    if (t.includes("TOPUP")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <CreditCard className="size-3" />
          <span>TOP-UP</span>
        </span>
      );
    }
    if (t.includes("PAYMENT") || t.includes("SUBSCRIPTION")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400">
          <Receipt className="size-3" />
          <span>PAYMENT</span>
        </span>
      );
    }
    if (t.includes("WITHDRAWAL")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          <Wallet className="size-3" />
          <span>WITHDRAWAL</span>
        </span>
      );
    }
    if (t.includes("DEVICE")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
          <Smartphone className="size-3" />
          <span>DEVICE</span>
        </span>
      );
    }
    if (t.includes("CAMPAIGN")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
          <Send className="size-3" />
          <span>CAMPAIGN</span>
        </span>
      );
    }
    if (t.includes("LOGIN")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <LogIn className="size-3" />
          <span>LOGIN</span>
        </span>
      );
    }
    if (t.includes("LOGOUT")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2.5 py-0.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
          <LogOut className="size-3" />
          <span>LOGOUT</span>
        </span>
      );
    }
    if (t.includes("REGISTER") || t.includes("SIGNUP")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400">
          <UserPlus className="size-3" />
          <span>REGISTER</span>
        </span>
      );
    }
    if (t.includes("PASSWORD") || t.includes("VERIFY")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          <KeyRound className="size-3" />
          <span>SECURITY</span>
        </span>
      );
    }
    if (t.includes("TOKEN") || t.includes("APIKEY")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
          <Shield className="size-3" />
          <span>API TOKEN</span>
        </span>
      );
    }
    return (
      <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
        <Activity className="size-3" />
        <span>{t}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar Section: Search Bar & Filter Chips */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-4 shadow-xs">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <div className="w-full flex-1 sm:max-w-lg">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onSearch={(val) => onSearch(val.trim())}
              onClear={handleClear}
              placeholder={t("activities.searchPlaceholder")}
              buttonText={t("activities.searchBtn")}
            />
          </div>

          {/* Refresh Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 self-start rounded-full px-3.5 text-xs font-bold transition sm:self-auto"
            aria-label={t("activities.refreshAria")}
            title={t("activities.refreshTitle")}
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "dark:text-wise-green animate-spin text-emerald-700" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Filter Category Chips (Horizontal Scrollable) */}
        <div className="no-scrollbar border-border/50 flex items-center gap-1.5 overflow-x-auto scroll-smooth border-t pt-1">
          <div className="text-foreground-muted mr-1 flex shrink-0 items-center gap-1 text-[11px] font-bold">
            <Filter className="size-3" />
            <span>{t("activities.categoryLabel")}</span>
          </div>
          {filterChips.map((chip) => {
            const isActive = typeFilter === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => onTypeFilterChange(chip.value)}
                className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs whitespace-nowrap transition ${
                  isActive
                    ? "bg-wise-green text-dark-green font-extrabold shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground border-border/60 border font-semibold"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities Table Container */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs">
        {isLoading ? (
          <div className="space-y-3 p-12 text-center">
            <div className="dark:bg-wise-green/15 dark:text-wise-green mx-auto flex size-9 animate-spin items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <RefreshCw className="size-4.5" />
            </div>
            <p className="text-foreground text-xs font-bold">
              {t("activities.loading")}
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div className="space-y-2.5 p-10 text-center sm:p-14">
            <Activity className="text-foreground-muted mx-auto size-10" />
            <h3 className="text-foreground text-sm font-bold">{t("activities.emptyTitle")}</h3>
            <p className="text-foreground-secondary mx-auto max-w-sm text-xs">
              {activeSearch
                ? t("activities.emptySearchDesc", { query: activeSearch })
                : t("activities.emptyDesc")}
            </p>
            {activeSearch && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="mt-2 cursor-pointer rounded-full text-xs font-bold"
              >
                {t("activities.resetSearch")}
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Mobile View: Card List (Visible on < 768px) */}
            <div className="divide-border/50 divide-y md:hidden">
              {activities.map((act) => {
                const { fullHuman } = formatHumanActivityDate(act.createdAt, locale);
                return (
                  <div key={act.id} className="bg-surface space-y-2.5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      {renderTypeBadge(act.activityType || act.type)}
                      <span className="bg-muted text-foreground-muted rounded px-1.5 py-0.5 font-mono text-[9px]">
                        ID: {act.id.slice(-6)}
                      </span>
                    </div>

                    <p className="text-foreground-secondary bg-muted/30 border-border/40 rounded-lg border p-2.5 text-xs leading-relaxed font-medium">
                      {act.description || t("activities.noDescription")}
                    </p>

                    <div className="text-foreground-muted border-border/30 flex items-center justify-between border-t pt-1 text-[11px]">
                      <div className="text-foreground-secondary flex items-center gap-1.5 font-medium">
                        <Clock className="text-foreground-muted size-3" />
                        <span>{fullHuman}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Tabular Grid (Visible on >= 768px) */}
            <div className="hidden md:block">
              {/* Header (No Action Column, Generous Layout) */}
              <div className="bg-muted/60 border-border text-foreground-muted grid grid-cols-12 gap-3 border-b px-5 py-3.5 text-xs font-extrabold tracking-wider uppercase select-none">
                <div className="col-span-3">{t("activities.colType")}</div>
                <div className="col-span-6">{t("activities.colDescription")}</div>
                <div className="col-span-3 text-right">{t("activities.colTime")}</div>
              </div>

              {/* Rows */}
              <div className="divide-border/50 divide-y text-xs font-semibold">
                {activities.map((act) => {
                  const { formattedDate, formattedTime } = formatHumanActivityDate(act.createdAt, locale);
                  return (
                    <div
                      key={act.id}
                      className="hover:bg-muted/40 grid min-h-13 grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors"
                    >
                      {/* Col 1: Tipe */}
                      <div className="col-span-3 flex items-center">
                        {renderTypeBadge(act.activityType || act.type)}
                      </div>

                      {/* Col 2: Deskripsi */}
                      <div className="text-foreground-secondary col-span-6 pr-2 text-xs font-medium">
                        <span className="line-clamp-2 leading-relaxed">
                          {act.description || t("activities.defaultDescription")}
                        </span>
                      </div>

                      {/* Col 3: Waktu */}
                      <div className="col-span-3 space-y-0.5 text-right">
                        <div className="text-foreground text-xs leading-tight font-bold">
                          {formattedDate}
                        </div>
                        <div className="text-foreground-muted flex items-center justify-end gap-1 font-mono text-[11px]">
                          <Clock className="text-foreground-muted size-3" />
                          <span>{formattedTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <DataTablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            entityName={t("activities.entityName")}
          />
        )}
      </div>
    </div>
  );
}
