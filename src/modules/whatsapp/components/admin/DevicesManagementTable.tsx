"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AdminDeviceItem } from "@/modules/whatsapp/types/admin.types";
import { useI18n } from "@/lib/i18n/context";

const DeleteDeviceModal = dynamic(
  () => import("./DeleteDeviceModal").then((m) => m.DeleteDeviceModal),
  { ssr: false },
);
const DeviceDetailModal = dynamic(
  () => import("./DeviceDetailModal").then((m) => m.DeviceDetailModal),
  { ssr: false },
);
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

interface DevicesManagementTableProps {
  devices: AdminDeviceItem[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onRefresh: () => void;
  onDeleteDevice: (id: string) => Promise<unknown>;
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
  onSearch,
  onClearSearch,
  onStatusFilterChange,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPrevPage,
  onRefresh,
  onDeleteDevice,
}: DevicesManagementTableProps) {
  const { t, locale } = useI18n();

  const [selectedDeviceForDelete, setSelectedDeviceForDelete] =
    useState<AdminDeviceItem | null>(null);
  const [selectedDeviceForDetail, setSelectedDeviceForDetail] =
    useState<AdminDeviceItem | null>(null);

  const getStatusBadge = (status: string) => {
    const upper = (status || "").toUpperCase();
    switch (upper) {
      case "ONLINE":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 font-bold text-emerald-700 dark:text-wise-green flex items-center gap-1.5"
          >
            <Wifi className="size-3" />
            <span>{t("admin.devices.statusOnline")}</span>
          </Badge>
        );
      case "OFFLINE":
        return (
          <Badge
            variant="outline"
            className="border-border text-foreground-secondary bg-muted font-bold flex items-center gap-1.5"
          >
            <WifiOff className="size-3" />
            <span>{t("admin.devices.statusOffline")}</span>
          </Badge>
        );
      case "QR_PENDING":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5"
          >
            <QrCode className="size-3" />
            <span>{t("admin.devices.statusQrPending")}</span>
          </Badge>
        );
      case "HIBERNATED":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
          >
            <Moon className="size-3" />
            <span>{t("admin.devices.statusHibernated")}</span>
          </Badge>
        );
      case "BANNED":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/20 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
          >
            <Ban className="size-3" />
            <span>{t("admin.devices.statusBanned")}</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-bold">
            {status}
          </Badge>
        );
    }
  };

  const formatLocalizedDate = (dateInput?: string): string => {
    if (!dateInput) return "-";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Status Filter, Refresh */}
      <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onSearch={onSearch}
              onClear={onClearSearch}
              placeholder={t("admin.devices.searchPlaceholder")}
            />
          </div>

          <div className="w-full sm:w-48">
            <NativeSelect
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-9 rounded-full text-xs font-bold"
            >
              <option value="ALL">{t("admin.devices.filterAllStatus")}</option>
              <option value="ONLINE">{t("admin.devices.filterOnline")}</option>
              <option value="OFFLINE">
                {t("admin.devices.filterOffline")}
              </option>
              <option value="QR_PENDING">
                {t("admin.devices.filterQrPending")}
              </option>
              <option value="HIBERNATED">
                {t("admin.devices.filterHibernated")}
              </option>
              <option value="BANNED">{t("admin.devices.filterBanned")}</option>
            </NativeSelect>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="border-border hover:bg-muted h-9 shrink-0 gap-1.5 rounded-full text-xs font-bold"
        >
          <RefreshCw
            className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{t("common.refresh")}</span>
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-border border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-foreground-secondary py-3 text-xs font-black tracking-wider uppercase">
                  {t("admin.devices.colDevice")}
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-xs font-black tracking-wider uppercase">
                  {t("admin.devices.colTenant")}
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-xs font-black tracking-wider uppercase">
                  {t("admin.devices.colStatus")}
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-center text-xs font-black tracking-wider uppercase">
                  {t("admin.devices.colTrustScore")}
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-center text-xs font-black tracking-wider uppercase">
                  {t("admin.devices.colWarmup")}
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-right text-xs font-black tracking-wider uppercase">
                  {t("admin.devices.colSentToday")}
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-right text-xs font-black tracking-wider uppercase">
                  {t("admin.devices.colLastSeen")}
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-right text-xs font-black tracking-wider uppercase">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-border divide-y">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="dark:text-wise-green size-6 animate-spin text-emerald-600" />
                      <span className="text-foreground-secondary text-xs font-semibold">
                        {t("admin.devices.loadingDevices")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : devices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-8">
                    <EmptyState
                      icon={<Smartphone className="size-10" />}
                      title={t("admin.devices.emptyTitle")}
                      description={
                        searchQuery || statusFilter !== "ALL"
                          ? t("admin.devices.emptyFilterDesc")
                          : t("admin.devices.emptyDesc")
                      }
                      action={
                        searchQuery || statusFilter !== "ALL" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onClearSearch();
                              onStatusFilterChange("ALL");
                            }}
                            className="rounded-full text-xs font-bold"
                          >
                            {t("admin.devices.resetFiltersBtn")}
                          </Button>
                        ) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device) => (
                  <TableRow
                    key={device.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Device PushName & JID */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                          <Smartphone className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-foreground block truncate text-xs font-bold">
                            {device.pushName}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[11px]">
                            {device.jid || t("admin.devices.notConnected")}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Tenant ID */}
                    <TableCell className="py-3">
                      <span className="text-foreground-secondary max-w-28 block truncate font-mono text-[11px] font-semibold">
                        {device.tenantId}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3">
                      {getStatusBadge(device.status)}
                    </TableCell>

                    {/* Trust Score */}
                    <TableCell className="py-3 text-center">
                      <span
                        className={`font-mono text-xs font-bold ${
                          device.trustScore >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : device.trustScore >= 50
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {device.trustScore} / 100
                      </span>
                    </TableCell>

                    {/* Warmup Day */}
                    <TableCell className="py-3 text-center font-mono text-xs font-bold">
                      {t("admin.devices.warmupDay", { day: device.warmupDay })}
                    </TableCell>

                    {/* Daily Sent Count */}
                    <TableCell className="py-3 text-right font-mono text-xs font-bold">
                      {device.dailySentCount.toLocaleString(
                        locale === "en" ? "en-US" : "id-ID",
                      )}
                    </TableCell>

                    {/* Last Seen At */}
                    <TableCell className="text-foreground-secondary py-3 text-right font-mono text-[11px]">
                      {formatLocalizedDate(device.lastSeenAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDeviceForDetail(device)}
                          className="hover:bg-muted text-foreground-secondary hover:text-foreground size-8 rounded-full"
                          title={t("admin.devices.viewDetailTooltip")}
                        >
                          <Eye className="size-3.5" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDeviceForDelete(device)}
                          className="text-foreground-muted hover:bg-rose-500/10 hover:text-rose-600 size-8 rounded-full"
                          title={t("admin.devices.deleteDeviceTooltip")}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar */}
        {devices.length > 0 && (
          <div className="border-border border-t p-3 sm:p-4">
            <DataTablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <DeviceDetailModal
        device={selectedDeviceForDetail}
        isOpen={Boolean(selectedDeviceForDetail)}
        onClose={() => setSelectedDeviceForDetail(null)}
      />

      <DeleteDeviceModal
        device={selectedDeviceForDelete}
        isOpen={Boolean(selectedDeviceForDelete)}
        onClose={() => setSelectedDeviceForDelete(null)}
        onConfirm={async () => {
          if (selectedDeviceForDelete) {
            await onDeleteDevice(selectedDeviceForDelete.id);
          }
        }}
      />
    </div>
  );
}
