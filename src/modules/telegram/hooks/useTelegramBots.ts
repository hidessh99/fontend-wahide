"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { telegramApi } from "../api/telegram.api";
import { TelegramBot, ConnectTelegramBotInput } from "../types/telegram.types";

export function useTelegramBots() {
  const [bots, setBots] = useState<TelegramBot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await telegramApi.getBots(signal);
      setBots(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Gagal memuat bot Telegram";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBots(controller.signal);
    return () => controller.abort();
  }, [fetchBots]);

  const connectBot = async (input: ConnectTelegramBotInput): Promise<boolean> => {
    setIsActionLoading(true);
    try {
      const res = await telegramApi.connectBot(input);
      if (res.success) {
        toast.success(res.message || "Bot Telegram berhasil didaftarkan!");
        await fetchBots();
        return true;
      }
      toast.error(res.message || "Gagal menghubungkan bot");
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mendaftarkan bot Telegram";
      toast.error(msg);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const syncWebhook = async (id: string): Promise<boolean> => {
    setIsActionLoading(true);
    try {
      const res = await telegramApi.syncWebhook(id);
      if (res.success) {
        toast.success(res.message);
        await fetchBots();
        return true;
      }
      toast.error(res.message);
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyinkronkan webhook";
      toast.error(msg);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteBot = async (id: string): Promise<boolean> => {
    setIsActionLoading(true);
    try {
      const res = await telegramApi.deleteBot(id);
      if (res.success) {
        toast.success(res.message);
        setBots((prev) => prev.filter((b) => b.id !== id));
        return true;
      }
      toast.error(res.message);
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus bot Telegram";
      toast.error(msg);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    bots,
    isLoading,
    isActionLoading,
    error,
    reload: fetchBots,
    connectBot,
    syncWebhook,
    deleteBot,
  };
}
