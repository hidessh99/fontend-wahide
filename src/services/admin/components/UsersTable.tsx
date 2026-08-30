"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput } from "../types/admin.types";
import { AdjustBalanceModal } from "./AdjustBalanceModal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Search, RefreshCw, Sliders, CheckCircle2, ShieldAlert } from "lucide-react";

interface UsersTableProps {
  users: UserItem[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  planFilter: string;
  onPlanFilterChange: (val: string) => void;
  onRefresh: () => void;
  onAdjustBalance: (data: AdjustBalanceInput) => Promise<unknown>;
}

export function UsersTable({
  users,
  isLoading,
  searchQuery,
  onSearchChange,
  planFilter,
  onPlanFilterChange,
  onRefresh,
  onAdjustBalance,
}: UsersTableProps) {
  const { t } = useI18n();
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdjust = (user: UserItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("admin.searchUsers")}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
          />
        </div>

        {/* Plan Filter & Refresh */}
        <div className="flex items-center gap-2">
          <select
            value={planFilter}
            onChange={(e) => onPlanFilterChange(e.target.value)}
            className="h-10 px-3 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
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
            className="rounded-full size-9 p-0 border-border hover:border-foreground-muted"
            aria-label="Refresh Users"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground-muted select-none">
          <div className="col-span-4 sm:col-span-3">{t("admin.tableHeaderUser")}</div>
          <div className="hidden sm:block sm:col-span-2">{t("admin.tableHeaderPlan")}</div>
          <div className="col-span-3 sm:col-span-2">{t("admin.tableHeaderQuota")}</div>
          <div className="col-span-3 sm:col-span-2">{t("admin.tableHeaderBalance")}</div>
          <div className="hidden sm:block sm:col-span-1 text-center">{t("admin.tableHeaderStatus")}</div>
          <div className="col-span-2 text-right">{t("admin.tableHeaderAction")}</div>
        </div>

        {/* Users Rows */}
        {users.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-foreground-secondary">
            Tidak ada pengguna yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="divide-y divide-border/50 text-xs font-semibold">
            {users.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-muted/40 transition-colors"
              >
                {/* Name & Email */}
                <div className="col-span-4 sm:col-span-3 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground truncate">{u.name}</span>
                    {u.role === "SUPER_ADMIN" && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-foreground-muted block truncate font-mono">
                    {u.email}
                  </span>
                </div>

                {/* Plan */}
                <div className="hidden sm:block sm:col-span-2 text-foreground-secondary">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted border border-border">
                    {u.planName}
                  </span>
                </div>

                {/* Quota */}
                <div className="col-span-3 sm:col-span-2 font-mono font-bold text-foreground truncate">
                  {u.quotaRemaining.toLocaleString("id-ID")} Pesan
                </div>

                {/* Balance */}
                <div className="col-span-3 sm:col-span-2 font-mono font-bold text-foreground-secondary truncate">
                  Rp {u.depositBalance.toLocaleString("id-ID")}
                </div>

                {/* Status */}
                <div className="hidden sm:flex sm:col-span-1 justify-center">
                  {u.status === "ACTIVE" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      <span>{t("admin.statusActive")}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <ShieldAlert className="size-3" />
                      <span>{t("admin.statusSuspended")}</span>
                    </span>
                  )}
                </div>

                {/* Action */}
                <div className="col-span-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAdjust(u)}
                    className="rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted"
                  >
                    <Sliders className="size-3.5 text-rose-600 dark:text-rose-400" />
                    <span className="hidden lg:inline">Sesuaikan</span>
                  </Button>
                </div>
              </div>
            ))}
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
