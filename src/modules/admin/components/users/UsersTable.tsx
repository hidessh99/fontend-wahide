"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput, UpdateUserInput } from "@/modules/admin/types/admin.types";
import { AdjustBalanceModal } from "./AdjustBalanceModal";
import { EditUserModal } from "./EditUserModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import {
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useTableSort } from "@/hooks/useTableSort";

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
    return <Badge variant="danger">Super Admin</Badge>;
  }
  if (upper === "SELLER") {
    return <Badge variant="success">Seller</Badge>;
  }
  if (upper === "AGENT") {
    return <Badge variant="info">CS Agent</Badge>;
  }
  return <Badge variant="neutral">{role || "User"}</Badge>;
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

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<UserItem>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedUsers = sortData(users);

  const handleOpenAdjust = (user: UserItem) => {
    setSelectedUserForAdjust(user);
    setIsAdjustModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setSelectedUserForEdit(user);
    setIsEditModalOpen(true);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    onClearSearch();
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
          {/* Search Form */}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => onSearch(searchInput.trim())}
            onClear={handleResetSearch}
            placeholder="Cari berdasarkan nama, email, atau nomor WhatsApp..."
          />

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
              className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
              aria-label="Refresh Data Pengguna"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
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
          <EmptyState
            icon={<User />}
            title="Tidak Ada Pengguna Ditemukan"
            description={
              activeSearch
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${activeSearch}". Coba kata kunci lain.`
                : "Belum ada data pengguna yang terdaftar pada sistem."
            }
          />
        ) : (
          <div>
            {/* Mobile View: Card-based list for screen < 1024px */}
            <div className="divide-border/60 divide-y lg:hidden">
              {sortedUsers.map((u) => {
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

            {/* Desktop View: shadcn/ui Table for screen >= 1024px */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[25%] px-5 py-3.5">
                      <DataTableColumnHeader
                        title="Nama Lengkap"
                        columnKey="name"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[20%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title="Email"
                        columnKey="email"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[18%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Nomor Telepon / WhatsApp
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <div className="text-foreground-muted text-center text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Role / Peran
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <div className="text-foreground-muted text-center text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Status Akun
                      </div>
                    </TableHead>
                    <TableHead className="w-[12%] px-4 py-3.5 text-right">
                      <DataTableColumnHeader
                        title="Saldo Dompet"
                        columnKey="depositBalance"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Aksi
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((u) => {
                    const balance = u.balance ?? u.depositBalance ?? 0;
                    const isActive = u.status === "ACTIVE" || u.isActive === true;
                    const phone = u.phoneNumber || u.phone || "-";

                    return (
                      <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                        {/* 1. Nama Lengkap with Avatar */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-muted text-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-black uppercase">
                              {u.name ? u.name.charAt(0) : "U"}
                            </div>
                            <span className="text-foreground max-w-45 truncate text-sm font-bold">
                              {u.name}
                            </span>
                          </div>
                        </TableCell>

                        {/* 2. Email */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="text-foreground-secondary flex max-w-50 items-center gap-1.5 truncate font-mono text-xs">
                            <Mail className="text-foreground-muted size-3 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </div>
                        </TableCell>

                        {/* 3. Nomor Telepon / WhatsApp */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="text-foreground flex max-w-40 items-center gap-1.5 truncate font-mono text-xs">
                            <Phone className="text-foreground-muted size-3 shrink-0" />
                            <span>{phone}</span>
                          </div>
                        </TableCell>

                        {/* 4. Role / Peran */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {getRoleBadge(u.role || u.roleName || "USER")}
                          </div>
                        </TableCell>

                        {/* 5. Status Akun */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
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
                          </div>
                        </TableCell>

                        {/* 6. Saldo Dompet */}
                        <TableCell className="text-foreground px-4 py-3.5 text-right align-middle font-mono font-bold">
                          <span className="dark:text-wise-green text-emerald-700">
                            Rp {balance.toLocaleString("id-ID")}
                          </span>
                        </TableCell>

                        {/* 7. Aksi (Ubah & Sesuaikan Saldo) */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Responsive Pagination Footer */}
        {total > 0 && (
          <DataTablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 25, 50]}
            entityName="pengguna"
          />
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
