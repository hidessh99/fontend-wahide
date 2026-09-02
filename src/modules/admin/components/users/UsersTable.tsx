"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput, UpdateUserInput } from "@/modules/admin/types/admin.types";
import { AdjustBalanceModal } from "./AdjustBalanceModal";
import { EditUserModal } from "./EditUserModal";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  RefreshCw,
  Sliders,
  Edit,
  CheckCircle2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
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
      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        Super Admin
      </span>
    );
  }
  if (upper === "SELLER") {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/25 dark:border-wise-green/20">
        Seller
      </span>
    );
  }
  if (upper === "AGENT") {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
        CS Agent
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground-secondary border border-border">
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

  // Generate pagination page numbers
  const pageNumbers: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan nama, email, atau nomor WhatsApp..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
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

          {/* Filters & Refresh */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-emerald-600 dark:focus:border-wise-green cursor-pointer flex-1 sm:flex-initial"
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
              className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-emerald-600 dark:focus:border-wise-green cursor-pointer flex-1 sm:flex-initial"
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
              className="rounded-full size-10 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
              aria-label="Refresh Data Pengguna"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Users Data Display (6 Columns: Nama, Email, No. HP, Role, Status, Saldo Dompet + Aksi) */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-foreground-muted">
            <Loader2 className="size-7 animate-spin text-emerald-600 dark:text-wise-green" />
            <span className="text-xs font-bold">Memuat daftar pengguna platform...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <User className="size-8 mx-auto text-foreground-muted" />
            <div className="text-xs font-bold text-foreground">Tidak Ada Pengguna Ditemukan</div>
            <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
              {activeSearch
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${activeSearch}". Coba kata kunci lain.`
                : "Belum ada data pengguna yang terdaftar pada sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Card-based list for screen < 1024px */}
            <div className="lg:hidden divide-y divide-border/60">
              {users.map((u) => {
                const balance = u.balance ?? u.depositBalance ?? 0;
                const isActive = u.status === "ACTIVE" || u.isActive === true;
                const phone = u.phoneNumber || u.phone || "-";

                return (
                  <div key={u.id} className="p-4 space-y-3 bg-surface dark:bg-[#161715]">
                    {/* Header: Name, Avatar, Status & Role */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-9 rounded-full bg-muted flex items-center justify-center font-black text-xs text-foreground shrink-0 uppercase border border-border">
                          {u.name ? u.name.charAt(0) : "U"}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-sm text-foreground block truncate">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-foreground-muted font-mono block truncate">
                            {u.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {getRoleBadge(u.role || u.roleName || "USER")}
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-wise-green">
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
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          No. Telepon / WA
                        </span>
                        <span className="font-mono font-semibold text-foreground text-[11px] truncate block">
                          {phone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          Saldo Dompet
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-wise-green text-xs truncate block">
                          Rp {balance.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2.5 border-t border-border/40 grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(u)}
                        className="h-8.5 rounded-full text-xs font-bold gap-1.5 border-border hover:bg-muted justify-center"
                      >
                        <Edit className="size-3.5 text-emerald-600 dark:text-wise-green" />
                        <span>Ubah</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAdjust(u)}
                        className="h-8.5 rounded-full text-xs font-bold gap-1.5 border-border hover:bg-muted justify-center"
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
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-[11px] font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                    <th className="py-3.5 px-5 font-extrabold">Nama Lengkap</th>
                    <th className="py-3.5 px-4 font-extrabold">Email</th>
                    <th className="py-3.5 px-4 font-extrabold">Nomor Telepon / WhatsApp</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Role / Peran</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Status Akun</th>
                    <th className="py-3.5 px-4 font-extrabold text-right">Saldo Dompet</th>
                    <th className="py-3.5 px-5 font-extrabold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs font-semibold">
                  {users.map((u) => {
                    const balance = u.balance ?? u.depositBalance ?? 0;
                    const isActive = u.status === "ACTIVE" || u.isActive === true;
                    const phone = u.phoneNumber || u.phone || "-";

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* 1. Nama Lengkap with Avatar */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full bg-muted flex items-center justify-center font-black text-xs text-foreground shrink-0 uppercase border border-border">
                              {u.name ? u.name.charAt(0) : "U"}
                            </div>
                            <span className="font-bold text-foreground text-sm truncate max-w-45">
                              {u.name}
                            </span>
                          </div>
                        </td>

                        {/* 2. Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-foreground-secondary font-mono text-xs truncate max-w-50">
                            <Mail className="size-3 text-foreground-muted shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </div>
                        </td>

                        {/* 3. Nomor Telepon / WhatsApp */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono text-xs text-foreground truncate max-w-40">
                            <Phone className="size-3 text-foreground-muted shrink-0" />
                            <span>{phone}</span>
                          </div>
                        </td>

                        {/* 4. Role / Peran */}
                        <td className="py-3.5 px-3 text-center">
                          {getRoleBadge(u.role || u.roleName || "USER")}
                        </td>

                        {/* 5. Status Akun */}
                        <td className="py-3.5 px-3 text-center">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-wise-green">
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
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                          <span className="text-emerald-700 dark:text-wise-green">
                            Rp {balance.toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* 7. Aksi (Ubah & Sesuaikan Saldo) */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(u)}
                              className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted hover:bg-muted"
                              title="Ubah Data & Password"
                            >
                              <Edit className="size-3.5 text-emerald-600 dark:text-wise-green" />
                              <span>Ubah</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAdjust(u)}
                              className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted hover:bg-muted"
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:px-5 sm:py-3.5 border-t border-border bg-muted/20">
            {/* Item count summary & Page size selector */}
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground-secondary">
              <span>
                Menampilkan <strong className="text-foreground">{startItem} - {endItem}</strong> dari{" "}
                <strong className="text-foreground">{total}</strong> pengguna
              </span>

              {onPageSizeChange && (
                <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <span>| Baris:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="h-7 px-2 rounded-md bg-surface dark:bg-[#10110e] border border-border text-foreground font-bold text-xs outline-none cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              )}
            </div>

            {/* Page navigation buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={page <= 1}
                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              {/* Numbered Page Buttons */}
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange && onPageChange(p)}
                  className={`size-8 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                    page === p
                      ? "bg-emerald-600 dark:bg-wise-green text-white dark:text-black font-black shadow-xs"
                      : "text-foreground-secondary hover:bg-muted border border-border"
                  }`}
                >
                  {p}
                </button>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={page >= totalPages}
                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
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
