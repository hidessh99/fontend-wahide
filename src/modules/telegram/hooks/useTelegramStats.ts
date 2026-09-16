"use client";

import { useState, useEffect, useCallback } from "react";
import { telegramApi } from "../api/telegram.api";
import { TelegramStats } from "../types/telegram.types";

export function useTelegramStats() {
  const [stats, setStats] = useState<TelegramStats>({
    total_bots: 0,
    active_bots: 0,
    daily_sent_count: 0,
    daily_limit: 100000,
    webhook_success_rate: 0,
    avg_latency_ms: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await telegramApi.getStats(signal);
      setStats(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Gagal memuat statistik Telegram";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, [fetchStats]);

  return { stats, isLoading, error, reload: fetchStats };
}
