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
    const init = async () => {
      try {
        const data = await campaignApi.getCampaigns();
        if (isMounted) {
          setCampaigns(data);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat kampanye";
          setError(msg);
          setIsLoading(false);
        }
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const createCampaign = async (data: CreateCampaignInput): Promise<Campaign> => {
    try {
      const newCampaign = await campaignApi.createCampaign(data);
      setCampaigns((prev) => [newCampaign, ...prev]);
      toast.success(t("campaign.toastCreated"));
      return newCampaign;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat kampanye";
      toast.error(msg);
      throw err;
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
      toast.success(t("campaign.toastCancelled"));
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
    pauseCampaign,
    resumeCampaign,
    cancelCampaign,
  };
}
