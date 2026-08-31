"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput } from "../types/admin.types";
import { AdjustBalanceModal } from "./AdjustBalanceModal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Search, X, RefreshCw, Sliders, CheckCircle2, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";

interface UsersTableProps {
  users: UserItem[];
  isLoading: boolean;
  activeSearch: string;
  onSearch: (val: string) => void;
  onClearSearch: () => void;
  planFilter: string;
  onPlanFilterChange: (val: string) => void;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onRefresh: () => void;
  onAdjustBalance: (data: AdjustBalanceInput) => Promise<unknown>;
}

export function UsersTable({
  users,
  isLoading,
  activeSearch,
  onSearch,
  onClearSearch,
  planFilter,
  onPlanFilterChange,
  page = 1,
  pageSize = 10,
  total = 0,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  onRefresh,
  onAdjustBalance,
}: UsersTableProps) {
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdjust = (user: UserItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    onClearSearch();
  };

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search Form with Submit Button */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("admin.searchUsers")}
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={handleResetSearch}
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
            variant="primaryPill"
            size="sm"
            className="h-10 px-4 text-xs font-bold shadow-xs shrink-0 cursor-pointer"
          >
            <Search className="size-3.5 mr-1" />
            <span>Cari</span>
          </Button>
        </form>

        {/* Plan Filter & Refresh */}
        <div className="flex items-center gap-2">
          <select
            value={planFilter}
            onChange={(e) => onPlanFilterChange(e.target.value)}
            className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green cursor-pointer"
          >
            <option value="ALL">{t("admin.filterAllPlans")}</option>
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise Cluster">Enterprise Cluster</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded-full size-10 p-0 border-border hover:border-foreground-muted cursor-pointer"
            aria-label="Refresh Users"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
          <div className="col-span-4 sm:col-span-3">{t("admin.tableHeaderUser")}</div>
          <div className="hidden sm:block sm:col-span-2">{t("admin.tableHeaderPlan")}</div>
          <div className="col-span-3 sm:col-span-2">{t("admin.tableHeaderQuota")}</div>
          <div className="col-span-3 sm:col-span-2">{t("admin.tableHeaderBalance")}</div>
          <div className="hidden sm:block sm:col-span-1 text-center">{t("admin.tableHeaderStatus")}</div>
          <div className="col-span-2 sm:col-span-2 text-right">{t("admin.tableHeaderAction")}</div>
        </div>

        {/* Users Rows */}
        {users.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-foreground-secondary">
            {activeSearch
              ? `Tidak ditemukan pengguna dengan kata kunci "${activeSearch}".`
              : "Tidak ada data pengguna."}
          </div>
        ) : (
          <div className="divide-y divide-border/50 text-xs font-semibold">
            {users.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14.5"
              >
                {/* Name & Email (Enlarged Typography) */}
                <div className="col-span-4 sm:col-span-3 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-foreground truncate">{u.name}</span>
                    {u.role === "SUPER_ADMIN" && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-foreground-muted block truncate font-mono">
                    {u.email}
                  </span>
                </div>

                {/* Plan */}
                <div className="hidden sm:block sm:col-span-2 text-foreground-secondary">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted border border-border">
                    {u.planName}
                  </span>
                </div>

                {/* Quota */}
                <div className="col-span-3 sm:col-span-2 font-mono font-bold text-sm text-foreground truncate">
                  {u.quotaRemaining.toLocaleString("id-ID")} Pesan
                </div>

                {/* Balance */}
                <div className="col-span-3 sm:col-span-2 font-mono font-bold text-sm text-foreground-secondary truncate">
                  Rp {u.depositBalance.toLocaleString("id-ID")}
                </div>

                {/* Status */}
                <div className="hidden sm:flex sm:col-span-1 justify-center">
                  {u.status === "ACTIVE" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      <span>{t("admin.statusActive")}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <ShieldAlert className="size-3.5" />
                      <span>{t("admin.statusSuspended")}</span>
                    </span>
                  )}
                </div>

                {/* Action */}
                <div className="col-span-2 sm:col-span-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAdjust(u)}
                    className="h-8 px-3 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer"
                  >
                    <Sliders className="size-3.5 text-rose-600 dark:text-rose-400" />
                    <span className="hidden lg:inline">Sesuaikan</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border bg-muted/30">
            {/* Item count summary */}
            <div className="text-xs sm:text-sm font-semibold text-foreground-secondary">
              Menampilkan {startItem} - {endItem} dari {total} pengguna
            </div>

            {/* Page navigation: Previous, Page Indicator, Next */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                  Halaman {page} dari {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevPage}
                  disabled={page <= 1}
                  className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Sebelumnya</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={page >= totalPages}
                  className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      <AdjustBalanceModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAdjustBalance}
      />
    </div>
  );
}
