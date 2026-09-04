"use client";

import React, { useState } from "react";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
import { useI18n } from "@/lib/i18n/context";
import { DeleteDeviceModal } from "./DeleteDeviceModal";
import { DeviceDetailModal } from "./DeviceDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { NativeSelect } from "@/components/ui/native-select";
import {
  RefreshCw,
  Smartphone,
  Trash2,
  Eye,
  Loader2,
  Wifi,
  WifiOff,
  QrCode,
  Moon,
  Ban,
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

interface DevicesManagementTableProps {
  devices: AdminDeviceItem[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<unknown>;
  onSearch: (q: string) => void;
  onClearSearch: () => void;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function getDeviceStatusBadge(status: string, t: (key: string, params?: Record<string, string | number>) => string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ONLINE":
      return (
        <Badge variant="success">
          <Wifi className="size-3" />
          <span>{t("admin.devices.statusOnline")}</span>
        </Badge>
      );
    case "OFFLINE":
      return (
        <Badge variant="neutral">
          <WifiOff className="size-3" />
          <span>{t("admin.devices.statusOffline")}</span>
        </Badge>
      );
    case "QR_PENDING":
      return (
        <Badge variant="warning">
          <QrCode className="size-3" />
          <span>{t("admin.devices.statusQrPending")}</span>
        </Badge>
      );
    case "HIBERNATED":
      return (
        <Badge variant="info">
          <Moon className="size-3" />
          <span>{t("admin.devices.statusHibernated")}</span>
        </Badge>
      );
    case "BANNED":
      return (
        <Badge variant="danger">
          <Ban className="size-3" />
          <span>{t("admin.devices.statusBanned")}</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral">
          <span>{status}</span>
        </Badge>
      );
  }
}

export function DevicesManagementTable({
  devices,
  isLoading,
  searchQuery,
  statusFilter,
  page,
  pageSize,
  total,
  totalPages,
  onRefresh,
  onDelete,
  onSearch,
  onClearSearch,
  onStatusFilterChange,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPrevPage,
}: DevicesManagementTableProps) {
  const { t, locale } = useI18n();
  const [searchInput, setSearchInput] = useState("");
  const [selectedDeviceForDelete, setSelectedDeviceForDelete] = useState<AdminDeviceItem | null>(
    null
  );
  const [selectedDeviceForDetail, setSelectedDeviceForDetail] = useState<AdminDeviceItem | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<AdminDeviceItem>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedDevices = sortData(devices);

  const formatLocalizedDateTime = (dateInput: string | Date | number): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    onClearSearch();
  };

  const handleOpenDelete = (d: AdminDeviceItem) => {
    setSelectedDeviceForDelete(d);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (d: AdminDeviceItem) => {
    setSelectedDeviceForDetail(d);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="border-border bg-surface rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => onSearch(searchInput.trim())}
            onClear={handleResetSearch}
            placeholder={t("admin.devices.searchPlaceholder")}
          />

          {/* Filter Status & Refresh */}
          <div className="flex shrink-0 items-center gap-2">
            <NativeSelect
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              variant="pill"
            >
              <option value="ALL">{t("admin.devices.filterAll")}</option>
              <option value="ONLINE">🟢 {t("admin.devices.statusOnline")}</option>
              <option value="OFFLINE">⚪ {t("admin.devices.statusOffline")}</option>
              <option value="QR_PENDING">🟡 {t("admin.devices.statusQrPending")}</option>
              <option value="HIBERNATED">🔵 {t("admin.devices.statusHibernated")}</option>
              <option value="BANNED">🔴 {t("admin.devices.statusBanned")}</option>
            </NativeSelect>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
              aria-label={t("admin.devices.refreshAria")}
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{t("common.refresh")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Devices Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">{t("admin.devices.loadingText")}</span>
          </div>
        ) : devices.length === 0 ? (
          <EmptyState
            icon={<Smartphone />}
            title={t("admin.devices.emptyTitle")}
            description={
              searchQuery
                ? t("admin.devices.emptySearchDesc", { query: searchQuery })
                : t("admin.devices.emptyDesc")
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {sortedDevices.map((d) => (
                <div key={d.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-bold">{d.pushName}</span>
                      </div>
                      <span className="text-foreground-secondary block font-mono text-xs font-bold">
                        {d.jid || t("admin.devices.notConnected")}
                      </span>
                    </div>

                    <div className="shrink-0">{getDeviceStatusBadge(d.status, t)}</div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="border-border bg-muted/20 grid grid-cols-3 gap-2 rounded-lg border p-2.5 text-center text-xs">
                    <div>
                      <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                        {t("admin.devices.trustLabel")}
                      </span>
                      <span className="text-foreground font-mono font-bold">
                        {d.trustScore}/100
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                        {t("admin.devices.warmupLabel")}
                      </span>
                      <span className="text-foreground font-mono font-bold">H-{d.warmupDay}</span>
                    </div>
                    <div>
                      <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                        {t("admin.devices.sentLabel")}
                      </span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                        {d.dailySentCount}
                      </span>
                    </div>
                  </div>

                  <div className="text-foreground-muted flex items-center justify-between pt-1 text-[11px]">
                    <span className="max-w-30 truncate font-mono text-[10px]">
                      Ten: {d.tenantId.slice(0, 10)}...
                    </span>
                    <span>{formatLocalizedDateTime(d.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(d)}
                      className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                    >
                      <Eye className="size-3.5" />
                      <span>{t("admin.devices.detailBtn")}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(d)}
                      className="border-border size-8 h-8 cursor-pointer rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                      title={t("admin.devices.deleteConfirmBtn")}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[22%] px-5 py-3.5">
                      <DataTableColumnHeader
                        title={t("admin.devices.colDevice")}
                        columnKey="pushName"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[20%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.devices.colJid")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[14%] px-3 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.devices.tenantIdLabel")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[14%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("admin.devices.colTrustWarmup")}
                        columnKey="trustScore"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("admin.devices.colDailySent")}
                        columnKey="dailySentCount"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("admin.devices.colStatus")}
                        columnKey="status"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.devices.colActions")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDevices.map((d) => (
                    <TableRow key={d.id} className="hover:bg-muted/30 transition-colors">
                      {/* 1. Nama & ID */}
                      <TableCell className="px-5 py-3.5 align-middle">
                        <div className="space-y-0.5">
                          <span className="text-foreground block text-xs font-bold">
                            {d.pushName}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[10px]">
                            {d.id.slice(0, 16)}...
                          </span>
                        </div>
                      </TableCell>

                      {/* 2. Nomor / WhatsApp JID */}
                      <TableCell className="px-4 py-3.5 align-middle">
                        <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
                          <Smartphone className="text-foreground-muted size-3 shrink-0" />
                          <span className="max-w-45 truncate">{d.jid || t("admin.devices.notConnected")}</span>
                        </div>
                      </TableCell>

                      {/* 3. Tenant ID */}
                      <TableCell className="px-3 py-3.5 align-middle">
                        <span className="text-foreground-secondary block max-w-28 truncate font-mono text-[11px]">
                          {d.tenantId}
                        </span>
                      </TableCell>

                      {/* 4. Trust & Warmup */}
                      <TableCell className="px-3 py-3.5 text-center align-middle">
                        <div className="inline-flex items-center gap-2 font-mono text-[11px]">
                          <span className="dark:text-wise-green rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-700">
                            {d.trustScore}/100
                          </span>
                          <span className="text-foreground-muted font-semibold">
                            H-{d.warmupDay}
                          </span>
                        </div>
                      </TableCell>

                      {/* 5. Kirim Hari Ini */}
                      <TableCell className="px-3 py-3.5 text-center align-middle">
                        <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                          {d.dailySentCount}
                        </span>
                      </TableCell>

                      {/* 6. Status Live */}
                      <TableCell className="px-3 py-3.5 text-center align-middle">
                        <div className="inline-flex items-center justify-center">
                          {getDeviceStatusBadge(d.status, t)}
                        </div>
                      </TableCell>

                      {/* 7. Aksi */}
                      <TableCell className="px-5 py-3.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(d)}
                            className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                            title={t("admin.devices.detailBtn")}
                          >
                            <Eye className="text-foreground-secondary size-3.5" />
                            <span>{t("admin.devices.detailBtn")}</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(d)}
                            className="border-border size-8 h-8 cursor-pointer rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                            title={t("admin.devices.deleteConfirmBtn")}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
            pageSizeOptions={[10, 15, 25, 50, 100]}
            entityName={t("admin.devices.entityName")}
          />
        )}
      </div>

      {/* Delete Device Modal */}
      <DeleteDeviceModal
        device={selectedDeviceForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (selectedDeviceForDelete) {
            await onDelete(selectedDeviceForDelete.id);
          }
        }}
      />

      {/* Device Detail Modal */}
      <DeviceDetailModal
        device={selectedDeviceForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
