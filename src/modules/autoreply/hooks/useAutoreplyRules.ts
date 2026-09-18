"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import {
  AutoreplyRule,
  CreateRuleInput,
  UpdateRuleInput,
} from "../types/autoreply.types";
import { autoreplyApi } from "../api/autoreply.api";

export function useAutoreplyRules() {
  const { t } = useI18n();
  const [rules, setRules] = useState<AutoreplyRule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [deviceId, setDeviceId] = useState<string>("");
  const [channelType, setChannelType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await autoreplyApi.getRules({
        device_id: deviceId || undefined,
        channel_type: channelType || undefined,
        page,
        limit,
      });
      setRules(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.rules.createFailed");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, channelType, page, limit, t]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = async (input: CreateRuleInput): Promise<boolean> => {
    try {
      const newRule = await autoreplyApi.createRule(input);
      setRules((prev) => [newRule, ...prev]);
      setTotal((prev) => prev + 1);
      toast.success(t("autoreply.rules.createdSuccess"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.rules.createFailed");
      toast.error(msg);
      return false;
    }
  };

  const updateRule = async (
    id: string,
    input: UpdateRuleInput,
  ): Promise<boolean> => {
    try {
      const updated = await autoreplyApi.updateRule(id, input);
      setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success(t("autoreply.rules.updatedSuccess"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.rules.updateFailed");
      toast.error(msg);
      return false;
    }
  };

  const deleteRule = async (id: string): Promise<boolean> => {
    try {
      await autoreplyApi.deleteRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(t("autoreply.rules.deletedSuccess"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.rules.deleteFailed");
      toast.error(msg);
      return false;
    }
  };

  const toggleRule = async (id: string, currentActive: boolean): Promise<boolean> => {
    const nextActive = !currentActive;
    // Optimistic UI update
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_active: nextActive } : r)),
    );
    try {
      await autoreplyApi.toggleRule(id, nextActive);
      toast.success(t("autoreply.rules.toggleSuccess"));
      return true;
    } catch {
      // Rollback
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_active: currentActive } : r)),
      );
      toast.error(t("autoreply.rules.toggleFailed"));
      return false;
    }
  };

  // Client-side search filtering
  const filteredRules = rules.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const nameMatch = r.name?.toLowerCase().includes(q);
    const keywordMatch = r.keywords?.some((k) => k.toLowerCase().includes(q));
    return nameMatch || keywordMatch;
  });

  return {
    rules: filteredRules,
    rawRules: rules,
    total,
    page,
    setPage,
    limit,
    isLoading,
    error,
    search,
    setSearch,
    deviceId,
    setDeviceId,
    channelType,
    setChannelType,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
  };
}
