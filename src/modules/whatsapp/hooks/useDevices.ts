"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Device, DeviceStatus, DeviceStats } from "../types/whatsapp.types";
import { whatsappApi } from "../api/whatsapp.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useDevices() {
  const { t } = useI18n();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "ALL">("ALL");

  const fetchDevices = useCallback(async (signalOrEvent?: AbortSignal | unknown) => {
    const signal = signalOrEvent instanceof AbortSignal ? signalOrEvent : undefined;
    setIsLoading(true);
    setError(null);
    try {
      const data = await whatsappApi.getDevices(signal);
      setDevices(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Gagal memuat daftar perangkat";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadInitialDevices = async () => {
      try {
        const data = await whatsappApi.getDevices(controller.signal);
        if (isMounted) {
          setDevices(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Gagal memuat daftar perangkat");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialDevices();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const createDevice = async (name: string): Promise<Device> => {
    try {
      const newDevice = await whatsappApi.createDevice({ push_name: name });
      setDevices((prev) => [newDevice, ...prev]);
      toast.success(t("whatsapp.toastCreated"));
      return newDevice;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat slot perangkat";
      toast.error(msg);
      throw err;
    }
  };

  const deleteDevice = async (id: string): Promise<void> => {
    try {
      await whatsappApi.deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
      toast.success(t("whatsapp.toastDeleted"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus perangkat";
      toast.error(msg);
      throw err;
    }
  };

  const disconnectDevice = async (id: string): Promise<void> => {
    try {
      await whatsappApi.disconnectDevice(id);
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: "DISCONNECTED" } : d)));
      toast.success(t("whatsapp.toastDisconnected"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memutuskan koneksi";
      toast.error(msg);
      throw err;
    }
  };

  const hibernateDevice = async (id: string): Promise<void> => {
    try {
      await whatsappApi.hibernateDevice(id);
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: "HIBERNATED" } : d)));
      toast.success(t("whatsapp.toastHibernated"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghibernasi sesi";
      toast.error(msg);
      throw err;
    }
  };

  const wakeDevice = async (id: string): Promise<void> => {
    try {
      await whatsappApi.wakeDevice(id);
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: "CONNECTED" } : d)));
      toast.success(t("whatsapp.toastWoken"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membangunkan sesi";
      toast.error(msg);
      throw err;
    }
  };

  const updateDeviceStatus = useCallback(
    (id: string, status: DeviceStatus, extra?: Partial<Device>) => {
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status, ...extra } : d)));
    },
    []
  );

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const devName = device.push_name || device.pushName || device.name || "";
      const matchesSearch =
        searchQuery === "" ||
        devName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Boolean(device.phone && device.phone.includes(searchQuery));

      const matchesStatus = statusFilter === "ALL" || device.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [devices, searchQuery, statusFilter]);

  const stats: DeviceStats = useMemo(() => {
    return {
      total: devices.length,
      connected: devices.filter((d) => d.status === "CONNECTED").length,
      pairing: devices.filter((d) => d.status === "PAIRING").length,
      disconnected: devices.filter((d) => d.status === "DISCONNECTED").length,
      hibernated: devices.filter((d) => d.status === "HIBERNATED").length,
    };
  }, [devices]);

  return {
    devices,
    filteredDevices,
    isLoading,
    error,
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
  };
}
