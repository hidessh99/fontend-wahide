"use client";

import React, { useState } from "react";
import { Device, DeviceStatus } from "../types/whatsapp.types";
import { DeviceCard } from "./DeviceCard";
import { LiveQRModal } from "./LiveQRModal";
import { AddDeviceModal } from "./AddDeviceModal";
import { useDevices } from "../hooks/useDevices";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  Smartphone,
  Plus,
  Search,
  RefreshCw,
  Server,
  CheckCircle2,
  XCircle,
  Moon,
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-3">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
            <Server className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
              Total Slot
            </span>
            <span className="text-xl font-black text-foreground">{stats.total}</span>
          </div>
        </div>

        <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
              {t("whatsapp.statusConnected")}
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.connected}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-3">
          <div className="size-10 rounded-full bg-zinc-500/10 flex items-center justify-center text-zinc-500">
            <XCircle className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
              {t("whatsapp.statusDisconnected")}
            </span>
            <span className="text-xl font-black text-zinc-600 dark:text-zinc-400">
              {stats.disconnected}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#161715] flex items-center gap-3">
          <div className="size-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
            <Moon className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
              {t("whatsapp.statusHibernated")}
            </span>
            <span className="text-xl font-black text-sky-600 dark:text-sky-400">
              {stats.hibernated}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("whatsapp.searchPlaceholder")}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
          />
        </div>

        {/* Status Filter Tabs & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-full bg-muted border border-border text-xs font-bold">
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
                    className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                      isActive
                        ? "bg-surface dark:bg-[#161715] text-foreground shadow-sm font-extrabold"
                        : "text-foreground-secondary hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchDevices}
            disabled={isLoading}
            className="rounded-full size-9 p-0 border-border hover:border-foreground-muted"
            aria-label="Refresh Daftar"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 text-xs font-bold shadow-sm"
          >
            <Plus className="size-4" />
            <span>{t("whatsapp.addDevice")}</span>
          </Button>
        </div>
      </div>

      {/* Grid of Devices */}
      {isLoading && devices.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-6 space-y-4"
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
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-md border border-dashed border-border bg-surface dark:bg-[#161715]/50 space-y-4">
          <div className="size-14 rounded-full bg-wise-green/10 text-wise-green flex items-center justify-center">
            <Smartphone className="size-7" />
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
              className="gap-2 text-xs font-bold mt-2 shadow-sm"
            >
              <Plus className="size-4" />
              <span>{t("whatsapp.addDevice")}</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </div>
  );
}
