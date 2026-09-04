"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { UserItem, AdjustBalanceInput, UpdateUserInput } from "@/modules/admin/types/admin.types";

const AdjustBalanceModal = dynamic(
  () => import("./AdjustBalanceModal").then((m) => m.AdjustBalanceModal),
  { ssr: false }
);
const EditUserModal = dynamic(
  () => import("./EditUserModal").then((m) => m.EditUserModal),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { NativeSelect } from "@/components/ui/native-select";
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
import { useI18n } from "@/lib/i18n/context";

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

function getRoleBadge(
  role: string,
  t: (key: string, params?: Record<string, string | number>) => string
) {
  const upper = (role || "").toUpperCase();
  if (upper === "SUPER_ADMIN" || upper === "ADMIN") {
    return <Badge variant="danger">{t("admin.users.badgeSuperAdmin")}</Badge>;
  }
  if (upper === "SELLER") {
    return <Badge variant="success">{t("admin.users.badgeSeller")}</Badge>;
  }
  if (upper === "AGENT") {
    return <Badge variant="info">{t("admin.users.badgeAgent")}</Badge>;
  }
  return <Badge variant="neutral">{role || t("admin.users.filterUser")}</Badge>;
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
  const { t, locale } = useI18n();
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
            placeholder={t("admin.users.searchPlaceholder")}
          />

          {/* Filters & Refresh */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
            {/* Role Filter */}
            <NativeSelect
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              variant="pill"
              wrapperClassName="flex-1 sm:flex-initial"
            >
              <option value="ALL">{t("admin.users.filterAllRoles")}</option>
              <option value="SELLER">{t("admin.users.filterSeller")}</option>
              <option value="SUPER_ADMIN">{t("admin.users.filterSuperAdmin")}</option>
              <option value="AGENT">{t("admin.users.filterAgent")}</option>
              <option value="USER">{t("admin.users.filterUser")}</option>
            </NativeSelect>

            {/* Status Filter */}
            <NativeSelect
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              variant="pill"
              wrapperClassName="flex-1 sm:flex-initial"
            >
              <option value="ALL">{t("admin.users.filterAllStatus")}</option>
              <option value="ACTIVE">{t("admin.users.filterActive")}</option>
              <option value="SUSPENDED">{t("admin.users.filterSuspended")}</option>
            </NativeSelect>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
              aria-label={t("admin.users.refreshAria")}
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{t("refresh")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Users Data Display (6 Columns: Nama, Email, No. HP, Role, Status, Saldo Dompet + Aksi) */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">{t("admin.users.loadingText")}</span>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<User />}
            title={t("admin.users.emptyTitle")}
            description={
              activeSearch
                ? t("admin.users.emptySearchDesc", { query: activeSearch })
                : t("admin.users.emptyDesc")
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
                        {getRoleBadge(u.role || u.roleName || "USER", t)}
                        {isActive ? (
                          <span className="dark:text-wise-green inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 className="size-3" />
                            <span>{t("admin.users.badgeActive")}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            <ShieldAlert className="size-3" />
                            <span>{t("admin.users.badgeSuspended")}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phone & Balance Grid */}
                    <div className="border-border/40 grid grid-cols-2 gap-2 border-t pt-2 text-xs">
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          {t("admin.users.phoneColLabel")}
                        </span>
                        <span className="text-foreground block truncate font-mono text-[11px] font-semibold">
                          {phone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          {t("admin.users.walletBalanceLabel")}
                        </span>
                        <span className="dark:text-wise-green block truncate font-mono text-xs font-bold text-emerald-700">
                          Rp {balance.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
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
                        <span>{t("admin.users.editBtn")}</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAdjust(u)}
                        className="border-border hover:bg-muted h-8.5 justify-center gap-1.5 rounded-full text-xs font-bold"
                      >
                        <Sliders className="size-3.5 text-rose-600 dark:text-rose-400" />
                        <span>{t("admin.users.balanceBtn")}</span>
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
                        title={t("admin.users.colName")}
                        columnKey="name"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[20%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title={t("admin.users.colEmail")}
                        columnKey="email"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[18%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.users.colPhone")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <div className="text-foreground-muted text-center text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.users.colRole")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <div className="text-foreground-muted text-center text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.users.colStatus")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[12%] px-4 py-3.5 text-right">
                      <DataTableColumnHeader
                        title={t("admin.users.colBalance")}
                        columnKey="depositBalance"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.users.colActions")}
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
                            {getRoleBadge(u.role || u.roleName || "USER", t)}
                          </div>
                        </TableCell>

                        {/* 5. Status Akun */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {isActive ? (
                              <span className="dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <CheckCircle2 className="size-3.5" />
                                <span>{t("admin.users.badgeActive")}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                                <ShieldAlert className="size-3.5" />
                                <span>{t("admin.users.badgeSuspended")}</span>
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* 6. Saldo Dompet */}
                        <TableCell className="text-foreground px-4 py-3.5 text-right align-middle font-mono font-bold">
                          <span className="dark:text-wise-green text-emerald-700">
                            Rp {balance.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
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
                              title={t("admin.users.editTooltip")}
                            >
                              <Edit className="dark:text-wise-green size-3.5 text-emerald-600" />
                              <span>{t("admin.users.editBtn")}</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAdjust(u)}
                              className="border-border hover:border-foreground-muted hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                              title={t("admin.users.adjustTooltip")}
                            >
                              <Sliders className="size-3.5 text-rose-600 dark:text-rose-400" />
                              <span>{t("admin.users.balanceBtn")}</span>
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
            entityName={t("admin.users.entityName")}
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
