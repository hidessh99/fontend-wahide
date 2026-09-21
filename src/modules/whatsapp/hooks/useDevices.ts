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

  const fetchDevices = useCallback(
    async (signalOrEvent?: AbortSignal | unknown) => {
      const signal =
        signalOrEvent instanceof AbortSignal ? signalOrEvent : undefined;
      setIsLoading(true);
      setError(null);
      try {
        const data = await whatsappApi.getDevices(signal);
        setDevices(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error ? err.message : "Gagal memuat daftar perangkat";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

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
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat daftar perangkat",
          );
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

  const createDevice = async (
    name: string,
    proxyUrl?: string,
  ): Promise<Device> => {
    try {
      const newDevice = await whatsappApi.createDevice({
        push_name: name,
        proxy_url: proxyUrl?.trim() || undefined,
      });
      setDevices((prev) => [newDevice, ...prev]);
      toast.success(t("whatsapp.toastCreated"));
      return newDevice;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal membuat slot perangkat";
      toast.error(msg);
      throw err;
    }
  };

  const deleteDevice = async (id: string): Promise<void> => {
    const targetDevice = devices.find((d) => d.id === id);
    // Optimistic update
    setDevices((prev) => prev.filter((d) => d.id !== id));
    try {
      await whatsappApi.deleteDevice(id);
      toast.success(t("whatsapp.toastDeleted"));
    } catch (err: unknown) {
      // Precision rollback: restore only the target device without overwriting other devices' states
      if (targetDevice) {
        setDevices((prev) =>
          prev.some((d) => d.id === id) ? prev : [targetDevice, ...prev],
        );
      }
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus perangkat";
      toast.error(msg);
    }
  };

  const disconnectDevice = async (id: string): Promise<void> => {
    const originalStatus =
      devices.find((d) => d.id === id)?.status || "CONNECTED";
    // Optimistic update
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "DISCONNECTED" } : d)),
    );
    try {
      await whatsappApi.disconnectDevice(id);
      toast.success(t("whatsapp.toastDisconnected"));
    } catch (err: unknown) {
      // Precision rollback: revert status only for target device
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: originalStatus } : d)),
      );
      const msg =
        err instanceof Error ? err.message : "Gagal memutuskan koneksi";
      toast.error(msg);
    }
  };

  const hibernateDevice = async (id: string): Promise<void> => {
    const originalStatus =
      devices.find((d) => d.id === id)?.status || "CONNECTED";
    // Optimistic update
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "HIBERNATED" } : d)),
    );
    try {
      await whatsappApi.hibernateDevice(id);
      toast.success(t("whatsapp.toastHibernated"));
    } catch (err: unknown) {
      // Precision rollback: revert status only for target device
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: originalStatus } : d)),
      );
      const msg =
        err instanceof Error ? err.message : "Gagal menghibernasi sesi";
      toast.error(msg);
    }
  };

  const wakeDevice = async (id: string): Promise<void> => {
    // Optimistic update
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "CONNECTED" } : d)),
    );
    try {
      await whatsappApi.wakeDevice(id);
      toast.success(t("whatsapp.toastWoken"));
    } catch (err: unknown) {
      // Precision rollback: Auto-transition device state in UI to DISCONNECTED and clear JID/phone when wake fails (e.g. session expired)
      setDevices((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: "DISCONNECTED", phone: null, jid: null }
            : d,
        ),
      );
      const msg =
        err instanceof Error ? err.message : "Gagal membangunkan sesi";
      toast.error(msg);
      // Background sync with backend
      void whatsappApi
        .getDevices()
        .then((latest) => {
          if (latest && latest.length > 0) setDevices(latest);
        })
        .catch(() => {});
    }
  };

  const updateDeviceStatus = useCallback(
    (id: string, status: DeviceStatus, extra?: Partial<Device>) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status, ...extra } : d)),
      );
    },
    [],
  );

  const updateDeviceSettings = async (
    id: string,
    data: {
      push_name?: string;
      webhook_url?: string | null;
      webhook_secret?: string | null;
      webhook_events?: string[] | null;
      proxy_url?: string | null;
    },
  ): Promise<Device> => {
    const targetDevice = devices.find((d) => d.id === id);
    // Optimistic update
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d)),
    );
    try {
      const updated = await whatsappApi.updateDevice(id, data);
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updated } : d)),
      );
      toast.success(t("whatsapp.toastSettingsSaved"));
      return updated;
    } catch (err: unknown) {
      // Precision rollback: restore settings only for target device
      if (targetDevice) {
        setDevices((prev) => prev.map((d) => (d.id === id ? targetDevice : d)));
      }
      const msg =
        err instanceof Error ? err.message : "Gagal memperbarui pengaturan";
      toast.error(msg);
      throw err;
    }
  };

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const devName = device.push_name || device.pushName || device.name || "";
      const matchesSearch =
        searchQuery === "" ||
        devName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Boolean(device.phone && device.phone.includes(searchQuery));

      const matchesStatus =
        statusFilter === "ALL" || device.status === statusFilter;

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
    updateDeviceSettings,
  };
}
