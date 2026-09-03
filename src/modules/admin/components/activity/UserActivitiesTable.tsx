"use client";

import React, { useState } from "react";
import { UserActivityItem } from "@/modules/admin/types/admin.types";
import { DeleteActivityConfirmModal } from "./DeleteActivityConfirmModal";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  Search,
  X,
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

export function formatHumanActivityDate(rawDate?: string): {
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

  const day = dateObj.getDate();
  const months = [
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
  const monthName = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  const formattedDate = `${day} ${monthName} ${year}`;
  const formattedTime = `${hours}:${minutes} WIB`;
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
  const [searchInput, setSearchInput] = useState("");
  const [activityToDelete, setActivityToDelete] = useState<UserActivityItem | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    onClearSearch();
  };

  const filterChips = [
    { value: "ALL", label: "Semua Aktivitas" },
    { value: "FINANCE", label: "Transaksi & Top-Up" },
    { value: "AUTH", label: "Autentikasi (Login/Logout)" },
    { value: "SECURITY", label: "Keamanan & Password" },
    { value: "WHATSAPP", label: "WhatsApp & Broadcast" },
    { value: "PROFILE", label: "Profil & Akun" },
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

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Toolbar Section: Search Bar & Filter Chips */}
      <div className="border-border bg-surface w-full min-w-0 space-y-3 overflow-hidden rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex w-full min-w-0 flex-col justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-lg min-w-0 flex-1 items-center gap-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari nama, email, atau deskripsi aktivitas..."
                className="bg-surface text-foreground border-border hover:border-foreground-muted h-9.5 w-full rounded-full border pr-9 pl-10 text-xs font-semibold transition outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:bg-[#10110e]"
              />
              {(searchInput || activeSearch) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-foreground-muted hover:text-foreground hover:bg-muted absolute top-1/2 right-3 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition"
                  title="Hapus Pencarian"
                  aria-label="Hapus Pencarian"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-border hover:border-foreground-muted h-9.5 shrink-0 cursor-pointer rounded-full px-3.5 text-xs font-bold sm:px-4"
            >
              <Search className="size-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Cari</span>
            </Button>
            {/* Refresh Button on Mobile (Inline inside form container row) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-9.5 shrink-0 cursor-pointer gap-1 rounded-full px-3 text-xs font-bold sm:hidden"
              title="Muat Ulang Data"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin text-rose-500" : ""}`} />
            </Button>
          </form>

          {/* Refresh Button on Desktop */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted hidden h-9.5 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold sm:flex"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin text-rose-500" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Filter Category Chips (Horizontal Scrollable with Touch Support) */}
        <div className="border-border/50 w-full min-w-0 space-y-1.5 border-t pt-2">
          <div className="flex items-center justify-between px-0.5">
            <div className="text-foreground-muted flex items-center gap-1.5 text-[11px] font-bold">
              <Filter className="size-3 text-rose-500" />
              <span>Kategori Aktivitas:</span>
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
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="space-y-3 p-12 text-center">
            <div className="mx-auto flex size-9 animate-spin items-center justify-center rounded-full bg-rose-500/15 text-rose-600">
              <RefreshCw className="size-4.5" />
            </div>
            <p className="text-foreground text-xs font-bold">Memuat rekaman log aktivitas...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="space-y-2.5 p-10 text-center sm:p-14">
            <Activity className="text-foreground-muted mx-auto size-10" />
            <h3 className="text-foreground text-sm font-bold">
              Tidak Ada Aktivitas Pengguna Ditemukan
            </h3>
            <p className="text-foreground-secondary mx-auto max-w-sm text-xs">
              {activeSearch
                ? `Tidak ada hasil yang sesuai dengan kata kunci "${activeSearch}". Silakan periksa kembali filter Anda.`
                : "Belum ada rekaman aktivitas pengguna yang tercatat pada sistem."}
            </p>
            {activeSearch && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="mt-2 cursor-pointer rounded-full text-xs font-bold"
              >
                Reset Pencarian
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Mobile View: Card List (Visible on < 768px) */}
            <div className="divide-border/50 w-full min-w-0 divide-y md:hidden">
              {activities.map((act) => {
                const { fullHuman } = formatHumanActivityDate(act.createdAt);
                return (
                  <div
                    key={act.id}
                    className="bg-surface w-full min-w-0 space-y-2.5 p-4 dark:bg-[#161715]"
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
                      {act.description || "Tidak ada deskripsi rinci aktivitas."}
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
                        title="Hapus Rekaman Aktivitas"
                        aria-label="Hapus Rekaman Aktivitas"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Tabular Grid (Visible on >= 768px) */}
            <div className="hidden md:block">
              {/* Header */}
              <div className="bg-muted/60 border-border text-foreground-muted grid grid-cols-12 gap-3 border-b px-5 py-3.5 text-xs font-extrabold tracking-wider uppercase select-none">
                <div className="col-span-3">Pengguna / Akun</div>
                <div className="col-span-2 text-center">Tipe Aktivitas</div>
                <div className="col-span-4">Deskripsi Kejadian</div>
                <div className="col-span-2 text-right">Waktu Aktivitas</div>
                <div className="col-span-1 text-right">Aksi</div>
              </div>

              {/* Rows */}
              <div className="divide-border/50 divide-y text-xs font-semibold">
                {activities.map((act) => {
                  const { formattedDate, formattedTime } = formatHumanActivityDate(act.createdAt);
                  return (
                    <div
                      key={act.id}
                      className="hover:bg-muted/40 grid min-h-14 grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors"
                    >
                      {/* Col 1: Pengguna */}
                      <div className="col-span-3 flex min-w-0 items-center gap-2.5">
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

                      {/* Col 2: Tipe */}
                      <div className="col-span-2 flex justify-center">
                        {renderTypeBadge(act.activityType || act.type)}
                      </div>

                      {/* Col 3: Deskripsi */}
                      <div className="text-foreground-secondary col-span-4 pr-2 text-xs font-medium">
                        <span className="line-clamp-2 leading-relaxed">
                          {act.description || "Aktivitas tercatat pada sistem."}
                        </span>
                      </div>

                      {/* Col 4: Waktu */}
                      <div className="col-span-2 space-y-0.5 text-right">
                        <div className="text-foreground text-xs leading-tight font-bold">
                          {formattedDate}
                        </div>
                        <div className="text-foreground-muted flex items-center justify-end gap-1 font-mono text-[11px]">
                          <Clock className="text-foreground-muted size-3" />
                          <span>{formattedTime}</span>
                        </div>
                      </div>

                      {/* Col 5: Aksi Hapus */}
                      <div className="col-span-1 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setActivityToDelete(act)}
                          className="text-foreground-muted flex size-8 cursor-pointer items-center justify-center rounded-full border border-transparent transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600"
                          title="Hapus Rekaman Aktivitas"
                          aria-label="Hapus Rekaman Aktivitas"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
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
          <div className="border-border bg-muted/20 text-foreground-secondary flex flex-col justify-between gap-3 border-t px-5 py-3.5 text-xs font-semibold select-none sm:flex-row sm:items-center">
            <div>
              Menampilkan <span className="text-foreground font-bold">{startItem}</span> -{" "}
              <span className="text-foreground font-bold">{endItem}</span> dari{" "}
              <span className="text-foreground font-bold">{total}</span> rekaman aktivitas
            </div>

            <DataTablePagination
              page={page}
              totalPages={totalPages}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              className="mx-0 w-auto"
            />
          </div>
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
