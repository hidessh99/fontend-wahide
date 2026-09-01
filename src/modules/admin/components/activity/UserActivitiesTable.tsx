"use client";

import React, { useState } from "react";
import { UserActivityItem } from "@/modules/admin/types/admin.types";
import { DeleteActivityConfirmModal } from "./DeleteActivityConfirmModal";
import { Button } from "@/components/ui/button";
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
  ChevronLeft,
  ChevronRight,
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CreditCard className="size-3" />
          <span>TOP-UP</span>
        </span>
      );
    }
    if (t.includes("PAYMENT") || t.includes("SUBSCRIPTION")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <Receipt className="size-3" />
          <span>PAYMENT</span>
        </span>
      );
    }
    if (t.includes("WITHDRAWAL")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Wallet className="size-3" />
          <span>WITHDRAWAL</span>
        </span>
      );
    }
    if (t.includes("DEVICE")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Smartphone className="size-3" />
          <span>DEVICE</span>
        </span>
      );
    }
    if (t.includes("CAMPAIGN")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
          <Send className="size-3" />
          <span>CAMPAIGN</span>
        </span>
      );
    }
    if (t.includes("LOGIN")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <LogIn className="size-3" />
          <span>LOGIN</span>
        </span>
      );
    }
    if (t.includes("LOGOUT")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
          <LogOut className="size-3" />
          <span>LOGOUT</span>
        </span>
      );
    }
    if (t.includes("REGISTER") || t.includes("SIGNUP")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <UserPlus className="size-3" />
          <span>REGISTER</span>
        </span>
      );
    }
    if (t.includes("PASSWORD") || t.includes("VERIFY")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <KeyRound className="size-3" />
          <span>SECURITY</span>
        </span>
      );
    }
    if (t.includes("TOKEN") || t.includes("APIKEY")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Shield className="size-3" />
          <span>API TOKEN</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-foreground-secondary border border-border">
        <Activity className="size-3" />
        <span>{t}</span>
      </span>
    );
  };

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="space-y-4">
      {/* Toolbar Section: Search Bar & Filter Chips */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari nama, email, atau deskripsi aktivitas..."
                className="w-full h-9.5 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition text-xs"
              />
              {(searchInput || activeSearch) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
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
              className="h-9.5 px-4 text-xs font-bold rounded-full shrink-0 border-border hover:border-foreground-muted cursor-pointer"
            >
              <Search className="size-3.5 mr-1" />
              <span>Cari</span>
            </Button>
          </form>

          {/* Refresh Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9.5 px-3.5 text-xs font-bold rounded-full border-border hover:border-foreground-muted self-start sm:self-auto shrink-0 gap-1.5 cursor-pointer"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin text-rose-500" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Filter Category Chips (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-border/50 scroll-smooth">
          <div className="flex items-center gap-1 text-[11px] font-bold text-foreground-muted mr-1 shrink-0">
            <Filter className="size-3" />
            <span>Kategori:</span>
          </div>
          {filterChips.map((chip) => {
            const isActive = typeFilter === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => onTypeFilterChange(chip.value)}
                className={`px-3 py-1 rounded-full text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-rose-600 text-white font-extrabold shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground font-semibold border border-border/60"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities Table Container */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="size-9 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="size-4.5" />
            </div>
            <p className="text-xs font-bold text-foreground">Memuat rekaman log aktivitas...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-10 sm:p-14 text-center space-y-2.5">
            <Activity className="size-10 text-foreground-muted mx-auto" />
            <h3 className="font-bold text-sm text-foreground">Tidak Ada Aktivitas Pengguna Ditemukan</h3>
            <p className="text-xs text-foreground-secondary max-w-sm mx-auto">
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
                className="rounded-full text-xs font-bold mt-2 cursor-pointer"
              >
                Reset Pencarian
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Mobile View: Card List (Visible on < 768px) */}
            <div className="md:hidden divide-y divide-border/50">
              {activities.map((act) => {
                const { fullHuman } = formatHumanActivityDate(act.createdAt);
                return (
                  <div key={act.id} className="p-4 space-y-2.5 bg-surface dark:bg-[#161715]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="size-7 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {act.user?.name ? act.user.name.charAt(0).toUpperCase() : <User className="size-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">
                            {act.user?.name || "Pengguna Tanpa Nama"}
                          </div>
                          <div className="text-[10px] text-foreground-muted font-mono truncate max-w-40">
                            {act.user?.email || act.userId}
                          </div>
                        </div>
                      </div>
                      {renderTypeBadge(act.activityType || act.type)}
                    </div>

                    <p className="text-xs font-medium text-foreground-secondary leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      {act.description || "Tidak ada deskripsi rinci aktivitas."}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1 border-t border-border/30">
                      <div className="flex items-center gap-1.5 font-medium text-foreground-secondary">
                        <Clock className="size-3 text-foreground-muted" />
                        <span>{fullHuman}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActivityToDelete(act)}
                        className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-600 hover:bg-rose-500/10 transition cursor-pointer border border-transparent hover:border-rose-500/30"
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
              <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                <div className="col-span-3">Pengguna / Akun</div>
                <div className="col-span-2 text-center">Tipe Aktivitas</div>
                <div className="col-span-4">Deskripsi Kejadian</div>
                <div className="col-span-2 text-right">Waktu Aktivitas</div>
                <div className="col-span-1 text-right">Aksi</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/50 text-xs font-semibold">
                {activities.map((act) => {
                  const { formattedDate, formattedTime } = formatHumanActivityDate(act.createdAt);
                  return (
                    <div
                      key={act.id}
                      className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14"
                    >
                      {/* Col 1: Pengguna */}
                      <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                        <div className="size-7.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {act.user?.name ? act.user.name.charAt(0).toUpperCase() : <User className="size-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-foreground truncate text-xs sm:text-sm">
                            {act.user?.name || "Pengguna Tanpa Nama"}
                          </div>
                          <div className="text-[11px] text-foreground-muted font-mono truncate">
                            {act.user?.email || act.userId}
                          </div>
                        </div>
                      </div>

                      {/* Col 2: Tipe */}
                      <div className="col-span-2 flex justify-center">
                        {renderTypeBadge(act.activityType || act.type)}
                      </div>

                      {/* Col 3: Deskripsi */}
                      <div className="col-span-4 text-xs font-medium text-foreground-secondary pr-2">
                        <span className="line-clamp-2 leading-relaxed">
                          {act.description || "Aktivitas tercatat pada sistem."}
                        </span>
                      </div>

                      {/* Col 4: Waktu */}
                      <div className="col-span-2 text-right space-y-0.5">
                        <div className="font-bold text-foreground text-xs leading-tight">
                          {formattedDate}
                        </div>
                        <div className="flex items-center justify-end gap-1 font-mono text-[11px] text-foreground-muted">
                          <Clock className="size-3 text-foreground-muted" />
                          <span>{formattedTime}</span>
                        </div>
                      </div>

                      {/* Col 5: Aksi Hapus */}
                      <div className="col-span-1 flex justify-end items-center">
                        <button
                          type="button"
                          onClick={() => setActivityToDelete(act)}
                          className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-600 hover:bg-rose-500/10 transition cursor-pointer border border-transparent hover:border-rose-500/30"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-t border-border bg-muted/20 text-xs font-semibold text-foreground-secondary select-none">
            <div>
              Menampilkan <span className="font-bold text-foreground">{startItem}</span> -{" "}
              <span className="font-bold text-foreground">{endItem}</span> dari{" "}
              <span className="font-bold text-foreground">{total}</span> rekaman aktivitas
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-foreground-muted mr-1">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={page <= 1}
                className="h-8 px-3 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span>Sebelumnya</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={page >= totalPages}
                className="h-8 px-3 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <span>Berikutnya</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
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
