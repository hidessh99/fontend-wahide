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
      toast.success(t("team.toastAgentCreated") || "Anggota tim berhasil ditambahkan");
      return newAgent;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (
        msg.includes("MAX_AGENTS_LIMIT_REACHED") ||
        msg.toLowerCase().includes("maximum agent limit reached") ||
        msg.toLowerCase().includes("quota") ||
        msg.toLowerCase().includes("upgrade")
      ) {
        toast.error(
          "Batas kuota penambahan anggota tim untuk paket langganan Anda telah tercapai. Silakan upgrade ke paket Regular atau Enterprise di menu Subscription.",
          { duration: 6000 }
        );
      } else if (
        msg.toLowerCase().includes("email already registered") ||
        msg.toLowerCase().includes("email already exists")
      ) {
        toast.error("Email tersebut sudah terdaftar di sistem. Gunakan email lain.");
      } else if (msg.toLowerCase().includes("only seller")) {
        toast.error("Hanya akun Seller yang dapat menambah anggota tim.");
      } else {
        toast.error(msg || "Gagal menambah anggota tim");
      }
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
