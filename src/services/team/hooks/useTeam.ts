"use client";

import { useState, useEffect, useCallback } from "react";
import { TeamAgent, CreateAgentInput } from "../types/team.types";
import { teamApi } from "../api/team.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useTeam() {
  const { t } = useI18n();
  const [agents, setAgents] = useState<TeamAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await teamApi.getAgents();
      setAgents(data);
    } catch {
      // Fallback in API
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const data = await teamApi.getAgents();
        if (isMounted) {
          setAgents(data);
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

  const createAgent = async (input: CreateAgentInput) => {
    try {
      const newAgent = await teamApi.createAgent(input);
      setAgents((prev) => [newAgent, ...prev]);
      toast.success(t("team.toastAgentCreated"));
      return newAgent;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambah agen";
      toast.error(msg);
      throw err;
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      await teamApi.deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
      toast.success(t("team.toastAgentDeleted"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus agen";
      toast.error(msg);
      throw err;
    }
  };

  return {
    agents,
    isLoading,
    fetchAgents,
    createAgent,
    deleteAgent,
  };
}
