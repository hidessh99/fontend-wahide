"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import {
  FlowDefinition,
  CreateFlowInput,
  UpdateFlowInput,
  TestFlowSimulationInput,
  TestFlowSimulationResult,
} from "../types/flow.types";
import { flowApi } from "../api/flow.api";

export function useFlows() {
  const { t } = useI18n();
  const [flows, setFlows] = useState<FlowDefinition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchFlows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await flowApi.getFlows(page, limit);
      setFlows(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.flows.createFailed");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, t]);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  const createFlow = async (input: CreateFlowInput): Promise<FlowDefinition | null> => {
    try {
      const created = await flowApi.createFlow(input);
      setFlows((prev) => [created, ...prev]);
      setTotal((prev) => prev + 1);
      toast.success(t("autoreply.flows.createdSuccess"));
      return created;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.flows.createFailed");
      toast.error(msg);
      return null;
    }
  };

  const updateFlow = async (
    id: string,
    input: UpdateFlowInput,
  ): Promise<FlowDefinition | null> => {
    try {
      const updated = await flowApi.updateFlow(id, input);
      setFlows((prev) => prev.map((f) => (f.id === id ? updated : f)));
      toast.success(t("autoreply.flows.updatedSuccess"));
      return updated;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.flows.updateFailed");
      toast.error(msg);
      return null;
    }
  };

  const deleteFlow = async (id: string): Promise<boolean> => {
    try {
      await flowApi.deleteFlow(id);
      setFlows((prev) => prev.filter((f) => f.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(t("autoreply.flows.deletedSuccess"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.flows.deleteFailed");
      toast.error(msg);
      return false;
    }
  };

  const simulateStep = async (
    input: TestFlowSimulationInput,
  ): Promise<TestFlowSimulationResult | null> => {
    try {
      return await flowApi.simulateStep(input);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Simulation step evaluation error";
      toast.error(msg);
      return null;
    }
  };

  const filteredFlows = flows.filter((f) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const nameMatch = f.name?.toLowerCase().includes(q);
    const kwMatch = f.trigger_keywords?.some((k) => k.toLowerCase().includes(q));
    return nameMatch || kwMatch;
  });

  return {
    flows: filteredFlows,
    rawFlows: flows,
    total,
    page,
    setPage,
    limit,
    isLoading,
    error,
    search,
    setSearch,
    fetchFlows,
    createFlow,
    updateFlow,
    deleteFlow,
    simulateStep,
  };
}
