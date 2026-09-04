"use client";

import { useState, useEffect, useCallback } from "react";
import { Campaign, CreateCampaignInput } from "../types/campaign.types";
import { campaignApi } from "../api/campaign.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useCampaigns() {
  const { t } = useI18n();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await campaignApi.getCampaigns();
      setCampaigns(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat kampanye";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadCampaigns = async () => {
      try {
        const data = await campaignApi.getCampaigns();
        if (isMounted) {
          setCampaigns(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat kampanye";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadCampaigns();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-polling: automatically refresh campaigns with Tab Visibility awareness while any campaign is RUNNING
  const hasRunning = campaigns.some((c) => c.status === "RUNNING");

  useEffect(() => {
    if (!hasRunning) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let isCancelled = false;
    let inFlight = false;

    const poll = async () => {
      if (isCancelled) return;

      // Tab visibility check: pause network calls when browser tab is inactive
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        timeoutId = setTimeout(poll, 4000);
        return;
      }

      if (!inFlight) {
        inFlight = true;
        try {
          const data = await campaignApi.getCampaigns();
          if (!isCancelled) {
            setCampaigns(data);
          }
        } catch {
          // silent polling error
        } finally {
          inFlight = false;
        }
      }

      if (!isCancelled) {
        timeoutId = setTimeout(poll, 3000);
      }
    };

    timeoutId = setTimeout(poll, 3000);

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible" && !inFlight) {
        if (timeoutId) clearTimeout(timeoutId);
        poll();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [hasRunning]);

  const startCampaign = async (id: string): Promise<void> => {
    try {
      await campaignApi.startCampaign(id);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: "RUNNING" } : c)));
      toast.success(t("campaign.toastStarted"));
      await fetchCampaigns();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memulai kampanye";
      if (msg.toLowerCase().includes("already active") || msg.toLowerCase().includes("completed")) {
        toast.info("Kampanye sudah aktif atau sudah selesai.");
        await fetchCampaigns();
        return;
      }
      toast.error(msg);
    }
  };

  const createCampaign = async (data: CreateCampaignInput): Promise<Campaign | null> => {
    try {
      const newCampaign = await campaignApi.createCampaign(data);
      if (!data.scheduledAt && newCampaign.id) {
        try {
          await campaignApi.startCampaign(newCampaign.id);
          newCampaign.status = "RUNNING";
          toast.success(t("campaign.toastStarted"));
        } catch (startErr) {
          const msg = startErr instanceof Error ? startErr.message : "Audiens kosong";
          toast.warning(t("campaign.toastNoAudienceWarning") || msg);
        }
      } else {
        toast.success(t("campaign.toastCreated"));
      }
      await fetchCampaigns();
      return newCampaign;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat kampanye";
      toast.error(msg);
      return null;
    }
  };

  const pauseCampaign = async (id: string): Promise<void> => {
    try {
      await campaignApi.pauseCampaign(id);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: "PAUSED" } : c)));
      toast.success(t("campaign.toastPaused"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menjeda kampanye";
      toast.error(msg);
      throw err;
    }
  };

  const resumeCampaign = async (id: string): Promise<void> => {
    try {
      await campaignApi.resumeCampaign(id);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: "RUNNING" } : c)));
      toast.success(t("campaign.toastResumed"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal melanjutkan kampanye";
      toast.error(msg);
      throw err;
    }
  };

  const cancelCampaign = async (id: string): Promise<void> => {
    try {
      await campaignApi.cancelCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success(t("campaign.toastDeleted") || t("campaign.toastCancelled"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membatalkan kampanye";
      toast.error(msg);
      throw err;
    }
  };

  return {
    campaigns,
    isLoading,
    error,
    fetchCampaigns,
    createCampaign,
    startCampaign,
    pauseCampaign,
    resumeCampaign,
    cancelCampaign,
  };
}
