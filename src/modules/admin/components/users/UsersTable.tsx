"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput, UpdateUserInput } from "@/modules/admin/types/admin.types";
import { AdjustBalanceModal } from "./AdjustBalanceModal";
import { EditUserModal } from "./EditUserModal";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  Search,
  X,
  RefreshCw,
  Sliders,
  Edit,
  CheckCircle2,
  ShieldAlert,
  Phone,
  Mail,
  User,
  Loader2,
} from "lucide-react";

interface UsersTableProps {
  users: UserItem[];
  isLoading: boolean;
  activeSearch: string;
  onSearch: (val: string) => void;
  onClearSearch: () => void;
  roleFilter: string;
  onRoleFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onRefresh: () => void;
  onAdjustBalance: (data: AdjustBalanceInput) => Promise<unknown>;
  onUpdateUser: (userId: string, data: UpdateUserInput) => Promise<unknown>;
}

function getRoleBadge(role: string) {
  const upper = (role || "").toUpperCase();
  if (upper === "SUPER_ADMIN" || upper === "ADMIN") {
    return (
      <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-rose-600 uppercase dark:text-rose-400">
        Super Admin
      </span>
    );
  }
  if (upper === "SELLER") {
    return (
      <span className="dark:text-wise-green dark:border-wise-green/20 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
        Seller
      </span>
    );
  }
  if (upper === "AGENT") {
    return (
      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-blue-600 uppercase dark:text-blue-400">
        CS Agent
      </span>
    );
  }
  return (
    <span className="bg-muted text-foreground-secondary border-border rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
      {role || "User"}
    </span>
  );
}

export function UsersTable({
  users,
  isLoading,
  activeSearch,
  onSearch,
  onClearSearch,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  page = 1,
  pageSize = 10,
  total = 0,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  onPrevPage,
  onNextPage,
  onRefresh,
  onAdjustBalance,
  onUpdateUser,
}: UsersTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedUserForAdjust, setSelectedUserForAdjust] = useState<UserItem | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserItem | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenAdjust = (user: UserItem) => {
    setSelectedUserForAdjust(user);
    setIsAdjustModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setSelectedUserForEdit(user);
    setIsEditModalOpen(true);
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
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan nama, email, atau nomor WhatsApp..."
                className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-9 pl-10 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
              />
              {(searchInput || activeSearch) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
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
              variant="primaryPill"
              size="sm"
              className="h-10 shrink-0 cursor-pointer px-4 text-xs font-bold shadow-xs"
            >
              <Search className="mr-1 size-3.5" />
              <span>Cari</span>
            </Button>
          </form>

          {/* Filters & Refresh */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="bg-surface text-foreground border-border dark:focus:border-wise-green h-10 flex-1 cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none focus:border-emerald-600 sm:flex-initial dark:bg-[#10110e]"
            >
              <option value="ALL">Semua Peran</option>
              <option value="SELLER">Seller</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="AGENT">CS Agent</option>
              <option value="USER">User</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-surface text-foreground border-border dark:focus:border-wise-green h-10 flex-1 cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none focus:border-emerald-600 sm:flex-initial dark:bg-[#10110e]"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">🟢 Aktif</option>
              <option value="SUSPENDED">🔴 Ditangguhkan</option>
            </select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted size-10 shrink-0 cursor-pointer rounded-full p-0"
              aria-label="Refresh Data Pengguna"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Users Data Display (6 Columns: Nama, Email, No. HP, Role, Status, Saldo Dompet + Aksi) */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">Memuat daftar pengguna platform...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="space-y-2 p-10 text-center">
            <User className="text-foreground-muted mx-auto size-8" />
            <div className="text-foreground text-xs font-bold">Tidak Ada Pengguna Ditemukan</div>
            <p className="text-foreground-muted mx-auto max-w-sm text-[11px]">
              {activeSearch
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${activeSearch}". Coba kata kunci lain.`
                : "Belum ada data pengguna yang terdaftar pada sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Card-based list for screen < 1024px */}
            <div className="divide-border/60 divide-y lg:hidden">
              {users.map((u) => {
                const balance = u.balance ?? u.depositBalance ?? 0;
                const isActive = u.status === "ACTIVE" || u.isActive === true;
                const phone = u.phoneNumber || u.phone || "-";

                return (
                  <div key={u.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                    {/* Header: Name, Avatar, Status & Role */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="bg-muted text-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-black uppercase">
                          {u.name ? u.name.charAt(0) : "U"}
                        </div>
                        <div className="min-w-0">
                          <span className="text-foreground block truncate text-sm font-bold">
                            {u.name}
                          </span>
                          <span className="text-foreground-muted block truncate font-mono text-[11px]">
                            {u.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {getRoleBadge(u.role || u.roleName || "USER")}
                        {isActive ? (
                          <span className="dark:text-wise-green inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 className="size-3" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            <ShieldAlert className="size-3" />
                            <span>Ditangguhkan</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phone & Balance Grid */}
                    <div className="border-border/40 grid grid-cols-2 gap-2 border-t pt-2 text-xs">
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          No. Telepon / WA
                        </span>
                        <span className="text-foreground block truncate font-mono text-[11px] font-semibold">
                          {phone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          Saldo Dompet
                        </span>
                        <span className="dark:text-wise-green block truncate font-mono text-xs font-bold text-emerald-700">
                          Rp {balance.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-border/40 grid grid-cols-2 gap-2 border-t pt-2.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(u)}
                        className="border-border hover:bg-muted h-8.5 justify-center gap-1.5 rounded-full text-xs font-bold"
                      >
                        <Edit className="dark:text-wise-green size-3.5 text-emerald-600" />
                        <span>Ubah</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAdjust(u)}
                        className="border-border hover:bg-muted h-8.5 justify-center gap-1.5 rounded-full text-xs font-bold"
                      >
                        <Sliders className="size-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Saldo</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Tabular Grid for screen >= 1024px */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border bg-muted/50 text-foreground-muted border-b text-[11px] font-extrabold tracking-wider uppercase select-none">
                    <th className="px-5 py-3.5 font-extrabold">Nama Lengkap</th>
                    <th className="px-4 py-3.5 font-extrabold">Email</th>
                    <th className="px-4 py-3.5 font-extrabold">Nomor Telepon / WhatsApp</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Role / Peran</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Status Akun</th>
                    <th className="px-4 py-3.5 text-right font-extrabold">Saldo Dompet</th>
                    <th className="px-5 py-3.5 text-right font-extrabold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-xs font-semibold">
                  {users.map((u) => {
                    const balance = u.balance ?? u.depositBalance ?? 0;
                    const isActive = u.status === "ACTIVE" || u.isActive === true;
                    const phone = u.phoneNumber || u.phone || "-";

                    return (
                      <tr key={u.id} className="hover:bg-muted/30 group transition-colors">
                        {/* 1. Nama Lengkap with Avatar */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-muted text-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-black uppercase">
                              {u.name ? u.name.charAt(0) : "U"}
                            </div>
                            <span className="text-foreground max-w-45 truncate text-sm font-bold">
                              {u.name}
                            </span>
                          </div>
                        </td>

                        {/* 2. Email */}
                        <td className="px-4 py-3.5">
                          <div className="text-foreground-secondary flex max-w-50 items-center gap-1.5 truncate font-mono text-xs">
                            <Mail className="text-foreground-muted size-3 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </div>
                        </td>

                        {/* 3. Nomor Telepon / WhatsApp */}
                        <td className="px-4 py-3.5">
                          <div className="text-foreground flex max-w-40 items-center gap-1.5 truncate font-mono text-xs">
                            <Phone className="text-foreground-muted size-3 shrink-0" />
                            <span>{phone}</span>
                          </div>
                        </td>

                        {/* 4. Role / Peran */}
                        <td className="px-3 py-3.5 text-center">
                          {getRoleBadge(u.role || u.roleName || "USER")}
                        </td>

                        {/* 5. Status Akun */}
                        <td className="px-3 py-3.5 text-center">
                          {isActive ? (
                            <span className="dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                              <CheckCircle2 className="size-3.5" />
                              <span>Aktif</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                              <ShieldAlert className="size-3.5" />
                              <span>Ditangguhkan</span>
                            </span>
                          )}
                        </td>

                        {/* 6. Saldo Dompet */}
                        <td className="text-foreground px-4 py-3.5 text-right font-mono font-bold">
                          <span className="dark:text-wise-green text-emerald-700">
                            Rp {balance.toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* 7. Aksi (Ubah & Sesuaikan Saldo) */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(u)}
                              className="border-border hover:border-foreground-muted hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                              title="Ubah Data & Password"
                            >
                              <Edit className="dark:text-wise-green size-3.5 text-emerald-600" />
                              <span>Ubah</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAdjust(u)}
                              className="border-border hover:border-foreground-muted hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                              title="Sesuaikan Saldo Dompet"
                            >
                              <Sliders className="size-3.5 text-rose-600 dark:text-rose-400" />
                              <span>Saldo</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Responsive Pagination Footer */}
        {total > 0 && (
          <div className="border-border bg-muted/20 flex flex-col items-center justify-between gap-3 border-t p-3.5 sm:flex-row sm:px-5 sm:py-3.5">
            {/* Item count summary & Page size selector */}
            <div className="text-foreground-secondary flex items-center gap-3 text-xs font-semibold">
              <span>
                Menampilkan{" "}
                <strong className="text-foreground">
                  {startItem} - {endItem}
                </strong>{" "}
                dari <strong className="text-foreground">{total}</strong> pengguna
              </span>

              {onPageSizeChange && (
                <div className="text-foreground-muted flex items-center gap-1.5 text-xs">
                  <span>| Baris:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="bg-surface border-border text-foreground h-7 cursor-pointer rounded-md border px-2 text-xs font-bold outline-none dark:bg-[#10110e]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              )}
            </div>

            <DataTablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              className="mx-0 w-auto"
            />
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        user={selectedUserForEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={onUpdateUser}
      />

      {/* Adjust Balance Modal */}
      <AdjustBalanceModal
        user={selectedUserForAdjust}
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSubmit={onAdjustBalance}
      />
    </div>
  );
}
