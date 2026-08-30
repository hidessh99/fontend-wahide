"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SubscriptionPlan,
  TenantSubscription,
  WebhookConfig,
} from "../types/subscription.types";
import { subscriptionApi } from "../api/subscription.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useSubscription() {
  const { t } = useI18n();
  const [subscription, setSubscription] = useState<TenantSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptionData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subData, plansData, webhookData] = await Promise.all([
        subscriptionApi.getSubscription(),
        subscriptionApi.getPlans(),
        subscriptionApi.getWebhookConfig(),
      ]);
      setSubscription(subData);
      setPlans(plansData);
      setWebhookConfig(webhookData);
    } catch {
      // Fallbacks already in API client
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [subData, plansData, webhookData] = await Promise.all([
          subscriptionApi.getSubscription(),
          subscriptionApi.getPlans(),
          subscriptionApi.getWebhookConfig(),
        ]);
        if (isMounted) {
          setSubscription(subData);
          setPlans(plansData);
          setWebhookConfig(webhookData);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const upgradePlan = async (planId: string) => {
    try {
      const res = await subscriptionApi.upgradePlan(planId);
      toast.success("Permintaan upgrade paket berhasil diajukan.");
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal upgrade paket";
      toast.error(msg);
      throw err;
    }
  };

  const saveWebhook = async (url: string, isEnabled: boolean) => {
    try {
      const updated = await subscriptionApi.updateWebhookConfig({ url, isEnabled });
      setWebhookConfig(updated);
      toast.success(t("subscription.toastWebhookSaved"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan webhook";
      toast.error(msg);
      throw err;
    }
  };

  const regenerateSecret = async () => {
    try {
      const { secret } = await subscriptionApi.regenerateWebhookSecret();
      setWebhookConfig((prev) => (prev ? { ...prev, secret } : null));
      toast.success(t("subscription.toastSecretRegenerated"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat ulang kunci";
      toast.error(msg);
      throw err;
    }
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast.success(t("subscription.toastSecretCopied"));
  };

  return {
    subscription,
    plans,
    webhookConfig,
    isLoading,
    fetchSubscriptionData,
    upgradePlan,
    saveWebhook,
    regenerateSecret,
    copySecret,
  };
}
