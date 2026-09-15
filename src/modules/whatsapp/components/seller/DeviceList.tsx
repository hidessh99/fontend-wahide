"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Device, DeviceStatus } from "@/modules/whatsapp/types/whatsapp.types";
import { DeviceCard } from "./DeviceCard";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";

const LiveQRModal = dynamic(
  () => import("./LiveQRModal").then((m) => m.LiveQRModal),
  {
    ssr: false,
  },
);
const AddDeviceModal = dynamic(
  () => import("./AddDeviceModal").then((m) => m.AddDeviceModal),
  {
    ssr: false,
  },
);
const SendMessageModal = dynamic(
  () => import("../user/SendMessageModal").then((m) => m.SendMessageModal),
  { ssr: false },
);
const DeviceDetailModal = dynamic(
  () => import("./DeviceDetailModal").then((m) => m.DeviceDetailModal),
  { ssr: false },
);
import Link from "next/link";
import { useSubscription } from "@/modules/subscription/hooks/useSubscription";
import {
  Smartphone,
  Plus,
  Server,
  CheckCircle2,
  XCircle,
  Moon,
  Send,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export interface DeviceListProps {
  deviceState?: ReturnType<typeof useDevices>;
}

export function DeviceList({ deviceState }: DeviceListProps = {}) {
  if (deviceState) {
    return <DeviceListContent deviceState={deviceState} />;
  }
  return <DeviceListWithSelfState />;
}

function DeviceListWithSelfState() {
  const state = useDevices();
  return <DeviceListContent deviceState={state} />;
}

function DeviceListContent({
  deviceState,
}: {
  deviceState: ReturnType<typeof useDevices>;
}) {
  const { t } = useI18n();
  const {
    devices,
    filteredDevices,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    fetchDevices,
    createDevice,
    deleteDevice,
    disconnectDevice,
    hibernateDevice,
    wakeDevice,
    updateDeviceStatus,
    updateDeviceSettings,
  } = deviceState;
  const { subscription } = useSubscription();

  const overlimitDevices = devices.filter((d) =>
    Boolean(d.is_over_limit || d.isOverLimit),
  );
  const hasOverlimit = overlimitDevices.length > 0;
  const planName = subscription?.planName || "FREE";
  const totalSlots = devices.length;
  const maxAllowedSlots =
    subscription?.deviceSlotsMax ||
    Math.max(1, totalSlots - overlimitDevices.length);

  const [selectedDeviceForQR, setSelectedDeviceForQR] = useState<Device | null>(
    null,
  );
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedDeviceForDetail, setSelectedDeviceForDetail] =
    useState<Device | null>(null);

  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val.trim());
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (!val.trim() && searchQuery) {
      setSearchQuery("");
    }
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const handleOpenQR = (device: Device) => {
    setSelectedDeviceForQR(device);
    setIsQRModalOpen(true);
  };

  const handleCloseQR = () => {
    setIsQRModalOpen(false);
    setSelectedDeviceForQR(null);
  };

  const handlePairingSuccess = async (device: Device) => {
    updateDeviceStatus(device.id, "CONNECTED", {
      phone: device.phone,
      pushName: device.pushName,
      lastSeenAt: new Date().toISOString(),
    });
    await fetchDevices();
  };

  const handleUpdateSettings = async (
    id: string,
    data: {
      push_name?: string;
      webhook_url?: string | null;
      webhook_secret?: string | null;
    },
  ) => {
    const updated = await updateDeviceSettings(id, data);
    if (selectedDeviceForDetail && selectedDeviceForDetail.id === id) {
      setSelectedDeviceForDetail(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3 shadow-xs sm:p-4 transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground-muted text-[10px] font-semibold tracking-wider uppercase sm:text-[11px] leading-tight line-clamp-2 min-h-[2.2em] sm:min-h-0">
              {t("whatsapp.totalSlot")}
            </span>
            <div className="bg-muted text-foreground-secondary flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl">
              <Server className="size-3.5 sm:size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-foreground text-lg font-black sm:text-2xl">
              {stats.total}
            </span>
          </div>
        </div>

        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3 shadow-xs sm:p-4 transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground-muted text-[10px] font-semibold tracking-wider uppercase sm:text-[11px] leading-tight line-clamp-2 min-h-[2.2em] sm:min-h-0">
              {t("whatsapp.statusConnected")}
            </span>
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-3.5 sm:size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-lg font-black text-emerald-800 sm:text-2xl dark:text-emerald-400">
              {stats.connected}
            </span>
          </div>
        </div>

        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3 shadow-xs sm:p-4 transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground-muted text-[10px] font-semibold tracking-wider uppercase sm:text-[11px] leading-tight line-clamp-2 min-h-[2.2em] sm:min-h-0">
              {t("whatsapp.statusDisconnected")}
            </span>
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-500">
              <XCircle className="size-3.5 sm:size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-lg font-black text-rose-600 sm:text-2xl dark:text-rose-400">
              {stats.disconnected}
            </span>
          </div>
        </div>

        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3 shadow-xs sm:p-4 transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground-muted text-[10px] font-semibold tracking-wider uppercase sm:text-[11px] leading-tight line-clamp-2 min-h-[2.2em] sm:min-h-0">
              {t("whatsapp.statusHibernated")}
            </span>
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-sky-500/10 text-sky-500">
              <Moon className="size-3.5 sm:size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-lg font-black text-sky-600 sm:text-2xl dark:text-sky-400">
              {stats.hibernated}
            </span>
          </div>
        </div>
      </div>

      {/* Over-Limit Warning Banner */}
      {hasOverlimit && (
        <div className="flex flex-col gap-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-400">
              <AlertTriangle className="size-5.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black tracking-tight text-amber-950 sm:text-base dark:text-amber-100">
                {t("whatsapp.overlimitBannerTitle", {
                  planName,
                  totalSlots: String(totalSlots),
                  maxAllowedSlots: String(maxAllowedSlots),
                })}
              </h4>
              <p className="max-w-3xl text-xs font-semibold leading-relaxed text-amber-800/90 sm:text-sm dark:text-amber-300/90">
                {t("whatsapp.overlimitBannerDesc", {
                  planName,
                  maxAllowedSlots: String(maxAllowedSlots),
                  overlimitCount: String(overlimitDevices.length),
                })}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
            <Link href="/subscription" className="w-full sm:w-auto">
              <Button
                variant="primaryPill"
                size="sm"
                className="w-full gap-2 text-xs font-bold shadow-xs sm:w-auto"
              >
                <span>{t("whatsapp.upgradePlanBtn")}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Filter Toolbar & Actions */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:space-y-4 sm:p-4">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              onSearch={handleSearchSubmit}
              onClear={handleSearchClear}
              placeholder={t("whatsapp.searchPlaceholder")}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSendModalOpen(true)}
              className="border-border hover:border-foreground-muted h-10 flex-1 cursor-pointer justify-center gap-1.5 rounded-full px-3 text-xs font-bold sm:flex-initial sm:px-4"
            >
              <Send className="dark:text-wise-green size-3.5 text-emerald-700" />
              <span className="hidden sm:inline">
                {t("whatsapp.instantMessageBtn")}
              </span>
              <span className="sm:hidden">
                {t("whatsapp.instantMessageShort")}
              </span>
            </Button>

            <Button
              variant="primaryPill"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 flex-1 cursor-pointer justify-center gap-1.5 px-3 text-xs font-bold shadow-sm sm:flex-initial sm:gap-2 sm:px-4"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">
                {t("whatsapp.addDevice")}
              </span>
              <span className="sm:hidden">{t("whatsapp.addDeviceShort")}</span>
            </Button>
          </div>
        </div>

        <div className="border-border/50 border-t pt-1">
          <div className="no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto scroll-smooth py-1">
            {(
              ["ALL", "CONNECTED", "DISCONNECTED", "HIBERNATED"] as (
                DeviceStatus | "ALL"
              )[]
            ).map((status) => {
              const label =
                status === "ALL"
                  ? t("whatsapp.filterAll")
                  : status === "CONNECTED"
                    ? t("whatsapp.filterConnected")
                    : status === "DISCONNECTED"
                      ? t("whatsapp.filterDisconnected")
                      : t("whatsapp.filterHibernated");

              const isActive = statusFilter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition active:scale-95 ${
                    isActive
                      ? "bg-dark-green dark:bg-wise-green font-extrabold text-white shadow-xs dark:text-black"
                      : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground border-border/60 border font-semibold"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Devices */}
      {isLoading && devices.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border bg-surface h-56 space-y-4 rounded-xl border p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="mt-6 h-10 w-full rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredDevices.length === 0 ? (
        <EmptyState
          icon={<Smartphone className="size-6" />}
          title={
            searchQuery || statusFilter !== "ALL"
              ? t("whatsapp.noSearchResults")
              : t("whatsapp.noDevices")
          }
          description={
            searchQuery || statusFilter !== "ALL"
              ? "Coba ubah kata kunci pencarian atau reset filter status perangkat."
              : t("whatsapp.noDevicesDesc")
          }
          action={
            !searchQuery && statusFilter === "ALL" ? (
              <Button
                variant="primaryPill"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 cursor-pointer gap-2 text-xs font-bold shadow-sm"
              >
                <Plus className="size-4" />
                <span>{t("whatsapp.addDevice")}</span>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onScanQR={handleOpenQR}
              onDisconnect={disconnectDevice}
              onHibernate={hibernateDevice}
              onWake={wakeDevice}
              onDelete={deleteDevice}
              onViewDetail={setSelectedDeviceForDetail}
            />
          ))}
        </div>
      )}

      {/* Device Detail Modal */}
      <DeviceDetailModal
        device={selectedDeviceForDetail}
        isOpen={Boolean(selectedDeviceForDetail)}
        onClose={() => setSelectedDeviceForDetail(null)}
        onScanQR={handleOpenQR}
        onDisconnect={disconnectDevice}
        onHibernate={hibernateDevice}
        onWake={wakeDevice}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Live QR Modal */}
      <LiveQRModal
        device={selectedDeviceForQR}
        isOpen={isQRModalOpen}
        onClose={handleCloseQR}
        onSuccess={handlePairingSuccess}
      />

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (name) => {
          await createDevice(name);
        }}
      />

      {/* Send Instant Message Modal */}
      <SendMessageModal
        devices={devices}
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      />
    </div>
  );
}
