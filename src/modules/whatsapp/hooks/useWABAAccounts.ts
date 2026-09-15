"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  WABAAccount,
  ConnectWABAInput,
  ConnectWABAResponse,
} from "../types/waba.types";
import { wabaApi } from "../api/waba.api";
import { toast } from "sonner";

export interface WABAStats {
  total: number;
  active: number;
  highQuality: number; // GREEN
}

export function useWABAAccounts() {
  const [accounts, setAccounts] = useState<WABAAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAccounts = useCallback(
    async (signalOrEvent?: AbortSignal | unknown) => {
      const signal =
        signalOrEvent instanceof AbortSignal ? signalOrEvent : undefined;
      setIsLoading(true);
      setError(null);
      try {
        const data = await wabaApi.getAccounts(signal);
        setAccounts(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error ? err.message : "Gagal memuat daftar akun WABA";
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

    const loadInitial = async () => {
      try {
        const data = await wabaApi.getAccounts(controller.signal);
        if (isMounted) {
          setAccounts(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat daftar akun WABA",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitial();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const connectAccount = async (
    payload: ConnectWABAInput,
  ): Promise<ConnectWABAResponse> => {
    try {
      const res = await wabaApi.connectAccount(payload);
      toast.success("Akun WhatsApp Official (WABA) berhasil diverifikasi dan terhubung!");
      await fetchAccounts();
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menghubungkan nomor Meta WABA. Pastikan Phone ID & Token valid.";
      toast.error(msg);
      throw err;
    }
  };

  const disconnectAccount = async (id: string): Promise<boolean> => {
    try {
      const res = await wabaApi.disconnectAccount(id);
      if (res.success) {
        toast.success(res.message || "Nomor Meta WABA berhasil dinonaktifkan.");
        await fetchAccounts();
        return true;
      }
      toast.error(res.message || "Gagal memutuskan nomor Meta WABA.");
      return false;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memutuskan koneksi WABA";
      toast.error(msg);
      return false;
    }
  };

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts;
    const q = searchQuery.toLowerCase();
    return accounts.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.phone_number_id?.toLowerCase().includes(q) ||
        a.waba_account_id?.toLowerCase().includes(q) ||
        a.verified_name?.toLowerCase().includes(q) ||
        a.phone_number?.toLowerCase().includes(q),
    );
  }, [accounts, searchQuery]);

  const stats: WABAStats = useMemo(() => {
    return {
      total: accounts.length,
      active: accounts.filter((a) => a.is_active).length,
      highQuality: accounts.filter(
        (a) => a.meta_quality_rating?.toUpperCase() === "GREEN",
      ).length,
    };
  }, [accounts]);

  return {
    accounts,
    filteredAccounts,
    stats,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchAccounts,
    connectAccount,
    disconnectAccount,
  };
}
