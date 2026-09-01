"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Device, DeviceStatus } from "@/services/whatsapp/types/whatsapp.types";
import { DeviceCard } from "./DeviceCard";
import { useDevices } from "@/services/whatsapp/hooks/useDevices";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

const LiveQRModal = dynamic(
  () => import("./LiveQRModal").then((m) => m.LiveQRModal),
  { ssr: false }
);
const AddDeviceModal = dynamic(
  () => import("./AddDeviceModal").then((m) => m.AddDeviceModal),
  { ssr: false }
);
const SendMessageModal = dynamic(
  () => import("../messages/SendMessageModal").then((m) => m.SendMessageModal),
  { ssr: false }
);
import {
  Smartphone,
  Plus,
  Search,
  RefreshCw,
  Server,
  CheckCircle2,
  XCircle,
  Moon,
  Send,
  X,
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

  const handleOpenQR = (device: Device) => {
    setSelectedDeviceForQR(device);
    setIsQRModalOpen(true);
  };

  const handleCloseQR = () => {
    setIsQRModalOpen(false);
    setSelectedDeviceForQR(null);
  };

  const handlePairingSuccess = (device: Device) => {
    updateDeviceStatus(device.id, "CONNECTED", {
      phone: device.phone,
      pushName: device.pushName,
      lastSeenAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="size-8.5 sm:size-10 rounded-full bg-muted flex items-center justify-center text-foreground-secondary shrink-0">
            <Server className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block truncate">
              Total Slot
            </span>
            <span className="text-lg sm:text-xl font-black text-foreground">{stats.total}</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="size-8.5 sm:size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block truncate">
              {t("whatsapp.statusConnected")}
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.connected}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="size-8.5 sm:size-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
            <XCircle className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block truncate">
              {t("whatsapp.statusDisconnected")}
            </span>
            <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400">
              {stats.disconnected}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-2.5 sm:gap-3 shadow-xs">
          <div className="size-8.5 sm:size-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
            <Moon className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block truncate">
              {t("whatsapp.statusHibernated")}
            </span>
            <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">
              {stats.hibernated}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Top Row: Search Bar & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("whatsapp.searchPlaceholder")}
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                title="Hapus Pencarian"
                aria-label="Hapus Pencarian"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSendModalOpen(true)}
              className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted h-10 px-3.5 sm:px-4 cursor-pointer flex-1 sm:flex-initial justify-center"
            >
              <Send className="size-3.5 text-wise-green" />
              <span className="hidden sm:inline">Kirim Pesan Instan</span>
              <span className="sm:hidden">Pesan Cepat</span>
            </Button>

            <Button
              variant="primaryPill"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 text-xs font-bold shadow-sm h-10 px-4 cursor-pointer flex-1 sm:flex-initial justify-center"
            >
              <Plus className="size-4" />
              <span>{t("whatsapp.addDevice")}</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: Horizontal Scrollable Filter Chips + Refresh Action */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          {/* Scrollable Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth flex-1 min-w-0">
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
                    className={`px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-dark-green dark:bg-wise-green text-white dark:text-black font-extrabold shadow-xs"
                        : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground font-semibold border border-border/60"
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
            onClick={fetchDevices}
            disabled={isLoading}
            className="rounded-full size-8.5 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
            aria-label="Refresh Daftar"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Grid of Devices */}
      {isLoading && devices.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-full bg-muted" />
                <div className="w-24 h-6 rounded-full bg-muted" />
              </div>
              <div className="w-3/4 h-5 rounded bg-muted" />
              <div className="w-1/2 h-4 rounded bg-muted" />
              <div className="h-10 rounded-full bg-muted mt-6" />
            </div>
          ))}
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center rounded-md border border-dashed border-border bg-surface dark:bg-[#161715]/50 space-y-3">
          <div className="size-12 rounded-full bg-wise-green/10 text-wise-green flex items-center justify-center">
            <Smartphone className="size-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {searchQuery || statusFilter !== "ALL"
                ? t("whatsapp.noSearchResults")
                : t("whatsapp.noDevices")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary">
              {searchQuery || statusFilter !== "ALL"
                ? "Coba ubah kata kunci pencarian atau reset filter status perangkat."
                : t("whatsapp.noDevicesDesc")}
            </p>
          </div>
          {(!searchQuery && statusFilter === "ALL") && (
            <Button
              variant="primaryPill"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 text-xs font-bold mt-2 shadow-sm cursor-pointer"
            >
              <Plus className="size-4" />
              <span>{t("whatsapp.addDevice")}</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onScanQR={handleOpenQR}
              onDisconnect={disconnectDevice}
              onHibernate={hibernateDevice}
              onWake={wakeDevice}
              onDelete={deleteDevice}
            />
          ))}
        </div>
      )}

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
