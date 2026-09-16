"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
import { wabaApi } from "@/modules/whatsapp/api/waba.api";
import { telegramApi } from "@/modules/telegram/api/telegram.api";
import {
  OmnichannelChannelType,
  UnifiedSender,
  OmnichannelActiveCounts,
} from "../types/omnichannel.types";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { WABAAccount } from "@/modules/whatsapp/types/waba.types";
import { TelegramBot } from "@/modules/telegram/types/telegram.types";

export function useOmnichannelSenders() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [wabaAccounts, setWabaAccounts] = useState<WABAAccount[]>([]);
  const [telegramBots, setTelegramBots] = useState<TelegramBot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSenders = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const [devicesRes, wabaRes, botsRes] = await Promise.allSettled([
        whatsappApi.getDevices(signal),
        wabaApi.getAccounts(signal),
        telegramApi.getBots(signal),
      ]);

      if (devicesRes.status === "fulfilled") {
        setDevices(devicesRes.value);
      }
      if (wabaRes.status === "fulfilled") {
        setWabaAccounts(wabaRes.value);
      }
      if (botsRes.status === "fulfilled") {
        setTelegramBots(botsRes.value);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg =
        err instanceof Error ? err.message : "Gagal memuat saluran pengirim";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchSenders(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchSenders]);

  // Connected Whatsmeow WhatsApp devices
  const activeDevices = useMemo(() => {
    return devices.filter(
      (d) =>
        (d.status === "CONNECTED" || d.status === "ONLINE") &&
        !d.is_over_limit &&
        !d.isOverLimit,
    );
  }, [devices]);

  // Active Meta WABA Phone accounts
  const activeWabaAccounts = useMemo(() => {
    return wabaAccounts.filter((w) => w.is_active);
  }, [wabaAccounts]);

  // Active Telegram Bots
  const activeTelegramBots = useMemo(() => {
    return telegramBots.filter((b) => b.status === "ACTIVE");
  }, [telegramBots]);

  // Unified senders mapping per channel
  const sendersByChannel = useMemo<Record<OmnichannelChannelType, UnifiedSender[]>>(() => {
    const whatsmeowSenders: UnifiedSender[] = activeDevices.map((d) => ({
      id: d.id,
      channelType: "WHATSMEOW_UNOFFICIAL",
      displayName: d.name || d.pushName || "WhatsApp Device",
      identifier: d.phone ? `+${d.phone.replace(/^\+/, "")}` : "Nomor Terhubung",
      status: "ACTIVE",
      badgeText: d.trustScore ? `Trust ${d.trustScore}/100` : "Hardware",
      dailySentCount: d.dailySentCount || 0,
      maxDailyLimit: 1500,
    }));

    const wabaSenders: UnifiedSender[] = activeWabaAccounts.map((w) => ({
      id: w.id,
      channelType: "META_WABA_OFFICIAL",
      displayName: w.verified_name || w.name || "Meta WABA Account",
      identifier: w.phone_number ? `+${w.phone_number.replace(/^\+/, "")}` : w.phone_number_id,
      status: "ACTIVE",
      badgeText: w.meta_messaging_tier || "Tier Official",
      qualityRating: w.meta_quality_rating,
      messagingTier: w.meta_messaging_tier,
    }));

    const telegramSenders: UnifiedSender[] = activeTelegramBots.map((b) => ({
      id: b.id,
      channelType: "TELEGRAM_BOT",
      displayName: b.first_name || b.name || "Telegram Bot",
      identifier: `@${b.username.replace(/^@/, "")}`,
      status: "ACTIVE",
      badgeText: "Online",
      dailySentCount: b.daily_sent_count || 0,
      maxDailyLimit: 100000,
    }));

    return {
      WHATSMEOW_UNOFFICIAL: whatsmeowSenders,
      META_WABA_OFFICIAL: wabaSenders,
      TELEGRAM_BOT: telegramSenders,
    };
  }, [activeDevices, activeWabaAccounts, activeTelegramBots]);

  const activeCounts = useMemo<OmnichannelActiveCounts>(() => {
    const whatsmeow = activeDevices.length;
    const waba = activeWabaAccounts.length;
    const telegram = activeTelegramBots.length;
    return {
      whatsmeow,
      waba,
      telegram,
      total: whatsmeow + waba + telegram,
    };
  }, [activeDevices, activeWabaAccounts, activeTelegramBots]);

  return {
    isLoading,
    error,
    refreshSenders: fetchSenders,
    activeDevices,
    activeWabaAccounts,
    activeTelegramBots,
    sendersByChannel,
    activeCounts,
  };
}
