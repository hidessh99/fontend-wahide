"use client";

import React, { useState } from "react";
import { UserActivityItem } from "@/modules/admin/types/admin.types";
import { DeleteActivityConfirmModal } from "./DeleteActivityConfirmModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
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
  User,
  Filter,
  CreditCard,
  Receipt,
  Wallet,
  Smartphone,
  Send,
  Trash2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useTableSort } from "@/hooks/useTableSort";

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

interface UserActivitiesTableProps {
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
  onDeleteActivity: (id: string) => Promise<void>;
}

export function UserActivitiesTable({
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
  onDeleteActivity,
}: UserActivitiesTableProps) {
  const { t, locale } = useI18n();
  const [searchInput, setSearchInput] = useState("");
  const [activityToDelete, setActivityToDelete] = useState<UserActivityItem | null>(null);

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<UserActivityItem>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedActivities = sortData(activities);

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
        <Badge variant="success">
          <CreditCard className="size-3" />
          <span>TOP-UP</span>
        </Badge>
      );
    }
    if (t.includes("PAYMENT") || t.includes("SUBSCRIPTION")) {
      return (
        <Badge variant="info">
          <Receipt className="size-3" />
          <span>PAYMENT</span>
        </Badge>
      );
    }
    if (t.includes("WITHDRAWAL")) {
      return (
        <Badge variant="warning">
          <Wallet className="size-3" />
          <span>WITHDRAWAL</span>
        </Badge>
      );
    }
    if (t.includes("DEVICE")) {
      return (
        <Badge
          variant="outline"
          className="border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        >
          <Smartphone className="size-3" />
          <span>DEVICE</span>
        </Badge>
      );
    }
    if (t.includes("CAMPAIGN")) {
      return (
        <Badge
          variant="outline"
          className="border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
        >
          <Send className="size-3" />
          <span>CAMPAIGN</span>
        </Badge>
      );
    }
    if (t.includes("LOGIN")) {
      return (
        <Badge variant="success">
          <LogIn className="size-3" />
          <span>LOGIN</span>
        </Badge>
      );
    }
    if (t.includes("LOGOUT")) {
      return (
        <Badge variant="neutral">
          <LogOut className="size-3" />
          <span>LOGOUT</span>
        </Badge>
      );
    }
    if (t.includes("REGISTER") || t.includes("SIGNUP")) {
      return (
        <Badge variant="info">
          <UserPlus className="size-3" />
          <span>REGISTER</span>
        </Badge>
      );
    }
    if (t.includes("PASSWORD") || t.includes("VERIFY")) {
      return (
        <Badge variant="warning">
          <KeyRound className="size-3" />
          <span>SECURITY</span>
        </Badge>
      );
    }
    if (t.includes("TOKEN") || t.includes("APIKEY")) {
      return (
        <Badge
          variant="outline"
          className="border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
        >
          <Shield className="size-3" />
          <span>API TOKEN</span>
        </Badge>
      );
    }
    return (
      <Badge variant="neutral">
        <Activity className="size-3" />
        <span>{t}</span>
      </Badge>
    );
  };

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Toolbar Section: Search Bar & Filter Chips */}
      <div className="border-border bg-surface w-full min-w-0 space-y-3 overflow-hidden rounded-xl border p-3.5 shadow-xs sm:p-4">
        <div className="flex w-full min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <div className="w-full flex-1 sm:max-w-lg">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onSearch={() => onSearch(searchInput.trim())}
              onClear={handleClear}
              placeholder={t("admin.activities.searchPlaceholder")}
            />
          </div>

          {/* Refresh Action */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 self-start rounded-full px-3.5 text-xs font-bold transition sm:self-auto"
            title={t("activities.refreshTitle")}
            aria-label={t("admin.activities.refreshAria")}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin text-rose-500" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Filter Category Chips (Horizontal Scrollable with Touch Support) */}
        <div className="border-border/50 w-full min-w-0 space-y-1.5 border-t pt-2">
          <div className="flex items-center justify-between px-0.5">
            <div className="text-foreground-muted flex items-center gap-1.5 text-[11px] font-bold">
              <Filter className="size-3 text-rose-500" />
              <span>{t("activities.categoryLabel")}</span>
            </div>
            <span className="text-foreground-muted text-[10px] font-semibold tracking-tight sm:hidden">
              Geser ke samping &rarr;
            </span>
          </div>

          <div className="flex w-full min-w-0 touch-pan-x snap-x scrollbar-thin items-center gap-1.5 overflow-x-auto scroll-smooth pt-0.5 pb-1">
            {filterChips.map((chip) => {
              const isActive = typeFilter === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => onTypeFilterChange(chip.value)}
                  className={`shrink-0 cursor-pointer snap-start rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition select-none ${
                    isActive
                      ? "bg-rose-600 font-extrabold text-white shadow-xs ring-2 ring-rose-500/30"
                      : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground border-border/60 border font-semibold"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activities Table Container */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs">
        {isLoading ? (
          <div className="space-y-3 p-12 text-center">
            <div className="mx-auto flex size-9 animate-spin items-center justify-center rounded-full bg-rose-500/15 text-rose-600">
              <RefreshCw className="size-4.5" />
            </div>
            <p className="text-foreground text-xs font-bold">{t("activities.loading")}</p>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={<Activity />}
            title={t("admin.activities.emptyTitle")}
            description={
              activeSearch
                ? t("admin.activities.emptySearchDesc", { query: activeSearch })
                : t("admin.activities.emptyDesc")
            }
            action={
              activeSearch && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="cursor-pointer rounded-full text-xs font-bold"
                >
                  {t("activities.resetSearch")}
                </Button>
              )
            }
          />
        ) : (
          <div>
            {/* Mobile View: Card List (Visible on < 768px) */}
            <div className="divide-border/50 w-full min-w-0 divide-y md:hidden">
              {sortedActivities.map((act) => {
                const { fullHuman } = formatHumanActivityDate(act.createdAt, locale);
                return (
                  <div
                    key={act.id}
                    className="bg-surface w-full min-w-0 space-y-2.5 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-600 dark:text-rose-400">
                          {act.user?.name ? (
                            act.user.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="size-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-foreground truncate text-xs font-bold">
                            {act.user?.name || "Pengguna Tanpa Nama"}
                          </div>
                          <div className="text-foreground-muted max-w-40 truncate font-mono text-[10px] sm:max-w-xs">
                            {act.user?.email || act.userId}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {renderTypeBadge(act.activityType || act.type)}
                      </div>
                    </div>

                    <p className="text-foreground-secondary bg-muted/30 border-border/40 rounded-lg border p-2.5 text-xs leading-relaxed font-medium wrap-break-word">
                      {act.description || t("activities.noDescription")}
                    </p>

                    <div className="text-foreground-muted border-border/30 flex items-center justify-between border-t pt-1 text-[11px]">
                      <div className="text-foreground-secondary flex items-center gap-1.5 font-medium">
                        <Clock className="text-foreground-muted size-3" />
                        <span>{fullHuman}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActivityToDelete(act)}
                        className="text-foreground-muted flex size-7 cursor-pointer items-center justify-center rounded-full border border-transparent transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600"
                        title={t("admin.activities.deleteModalTitle")}
                        aria-label={t("admin.activities.deleteModalTitle")}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: shadcn Table (Visible on >= 768px) */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/60 hover:bg-muted/60">
                    <TableHead className="w-[28%] px-5 py-3.5">
                      <div className="text-foreground-muted text-xs font-extrabold tracking-wider uppercase select-none">
                        {t("admin.activities.colTenant")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[18%] px-4 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("admin.activities.colType")}
                        columnKey="type"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[30%] px-4 py-3.5">
                      <div className="text-foreground-muted text-xs font-extrabold tracking-wider uppercase select-none">
                        {t("admin.activities.colDescription")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[16%] px-4 py-3.5 text-right">
                      <DataTableColumnHeader
                        title={t("admin.activities.colTime")}
                        columnKey="createdAt"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableHead>
                    <TableHead className="w-[8%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-xs font-extrabold tracking-wider uppercase select-none">
                        {t("admin.tableHeaderAction")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map((act) => {
                    const { formattedDate, formattedTime } = formatHumanActivityDate(act.createdAt, locale);
                    return (
                      <TableRow key={act.id} className="hover:bg-muted/40 transition-colors">
                        {/* Col 1: Pengguna */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-600 dark:text-rose-400">
                              {act.user?.name ? (
                                act.user.name.charAt(0).toUpperCase()
                              ) : (
                                <User className="size-3.5" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-foreground truncate text-xs font-bold sm:text-sm">
                                {act.user?.name || "Pengguna Tanpa Nama"}
                              </div>
                              <div className="text-foreground-muted truncate font-mono text-[11px]">
                                {act.user?.email || act.userId}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Col 2: Tipe */}
                        <TableCell className="px-4 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {renderTypeBadge(act.activityType || act.type)}
                          </div>
                        </TableCell>

                        {/* Col 3: Deskripsi */}
                        <TableCell className="text-foreground-secondary px-4 py-3.5 align-middle text-xs font-medium">
                          <span className="line-clamp-2 leading-relaxed">
                            {act.description || t("activities.defaultDescription")}
                          </span>
                        </TableCell>

                        {/* Col 4: Waktu */}
                        <TableCell className="px-4 py-3.5 text-right align-middle">
                          <div className="space-y-0.5">
                            <div className="text-foreground text-xs leading-tight font-bold">
                              {formattedDate}
                            </div>
                            <div className="text-foreground-muted flex items-center justify-end gap-1 font-mono text-[11px]">
                              <Clock className="text-foreground-muted size-3" />
                              <span>{formattedTime}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Col 5: Aksi Hapus */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => setActivityToDelete(act)}
                              className="text-foreground-muted flex size-8 cursor-pointer items-center justify-center rounded-full border border-transparent transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600"
                              title={t("admin.activities.deleteModalTitle")}
                              aria-label={t("admin.activities.deleteModalTitle")}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
            entityName={t("admin.activities.entityName")}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteActivityConfirmModal
        isOpen={Boolean(activityToDelete)}
        activity={activityToDelete}
        onClose={() => setActivityToDelete(null)}
        onConfirm={onDeleteActivity}
      />
    </div>
  );
}
