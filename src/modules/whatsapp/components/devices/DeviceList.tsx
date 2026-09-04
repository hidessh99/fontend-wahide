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

const LiveQRModal = dynamic(() => import("./LiveQRModal").then((m) => m.LiveQRModal), {
  ssr: false,
});
const AddDeviceModal = dynamic(() => import("./AddDeviceModal").then((m) => m.AddDeviceModal), {
  ssr: false,
});
const SendMessageModal = dynamic(
  () => import("../messages/SendMessageModal").then((m) => m.SendMessageModal),
  { ssr: false }
);
const DeviceDetailModal = dynamic(
  () => import("./DeviceDetailModal").then((m) => m.DeviceDetailModal),
  { ssr: false }
);
import {
  Smartphone,
  Plus,
  RefreshCw,
  Server,
  CheckCircle2,
  XCircle,
  Moon,
  Send,
} from "lucide-react";

export function DeviceList() {
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
  } = useDevices();

  const [selectedDeviceForQR, setSelectedDeviceForQR] = useState<Device | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedDeviceForDetail, setSelectedDeviceForDetail] = useState<Device | null>(null);

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
    // Immediately synchronize fresh device state from backend to populate extracted phone
    await fetchDevices();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
        <div className="border-border bg-surface flex items-center gap-2.5 rounded-xl border p-3 shadow-xs sm:gap-3 sm:p-4 dark:bg-[#161715]">
          <div className="bg-muted text-foreground-secondary flex size-8.5 shrink-0 items-center justify-center rounded-full sm:size-10">
            <Server className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-foreground-muted block truncate text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
              Total Slot
            </span>
            <span className="text-foreground text-lg font-black sm:text-xl">{stats.total}</span>
          </div>
        </div>

        <div className="border-border bg-surface flex items-center gap-2.5 rounded-xl border p-3 shadow-xs sm:gap-3 sm:p-4 dark:bg-[#161715]">
          <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 sm:size-10">
            <CheckCircle2 className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-foreground-muted block truncate text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
              {t("whatsapp.statusConnected")}
            </span>
            <span className="text-lg font-black text-emerald-600 sm:text-xl dark:text-emerald-400">
              {stats.connected}
            </span>
          </div>
        </div>

        <div className="border-border bg-surface flex items-center gap-2.5 rounded-xl border p-3 shadow-xs sm:gap-3 sm:p-4 dark:bg-[#161715]">
          <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 sm:size-10">
            <XCircle className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-foreground-muted block truncate text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
              {t("whatsapp.statusDisconnected")}
            </span>
            <span className="text-lg font-black text-rose-600 sm:text-xl dark:text-rose-400">
              {stats.disconnected}
            </span>
          </div>
        </div>

        <div className="border-border bg-surface flex items-center gap-2.5 rounded-xl border p-3 shadow-xs sm:gap-3 sm:p-4 dark:bg-[#161715]">
          <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 sm:size-10">
            <Moon className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-foreground-muted block truncate text-[10px] font-semibold tracking-wider uppercase sm:text-[11px]">
              {t("whatsapp.statusHibernated")}
            </span>
            <span className="text-lg font-black text-sky-600 sm:text-xl dark:text-sky-400">
              {stats.hibernated}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:space-y-4 sm:p-4 dark:bg-[#161715]">
        {/* Top Row: Search Bar & Action Buttons */}
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={(val) => setSearchQuery(val)}
              onClear={() => setSearchQuery("")}
              placeholder={t("whatsapp.searchPlaceholder")}
            />
          </div>

          {/* Action CTAs */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSendModalOpen(true)}
              className="border-border hover:border-foreground-muted h-10 flex-1 cursor-pointer justify-center gap-1.5 rounded-full px-3.5 text-xs font-bold sm:flex-initial sm:px-4"
            >
              <Send className="dark:text-wise-green size-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Kirim Pesan Instan</span>
              <span className="sm:hidden">Pesan Cepat</span>
            </Button>

            <Button
              variant="primaryPill"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 flex-1 cursor-pointer justify-center gap-2 px-4 text-xs font-bold shadow-sm sm:flex-initial"
            >
              <Plus className="size-4" />
              <span>{t("whatsapp.addDevice")}</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: Horizontal Scrollable Filter Chips + Refresh Action */}
        <div className="border-border/50 flex items-center justify-between gap-2 border-t pt-1">
          {/* Scrollable Filter Chips */}
          <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth py-1">
            {(["ALL", "CONNECTED", "DISCONNECTED", "HIBERNATED"] as (DeviceStatus | "ALL")[]).map(
              (status) => {
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
                    className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition ${
                      isActive
                        ? "bg-dark-green dark:bg-wise-green font-extrabold text-white shadow-xs dark:text-black"
                        : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground border-border/60 border font-semibold"
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>

          {/* Refresh Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDevices()}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
            aria-label="Refresh Daftar"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Grid of Devices */}
      {isLoading && devices.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border bg-surface h-56 space-y-4 rounded-xl border p-5 sm:p-6 dark:bg-[#161715]"
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
