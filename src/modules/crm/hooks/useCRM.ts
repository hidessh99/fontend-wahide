"use client";

import { useState, useEffect, useCallback } from "react";
import { crmApi } from "../api/crm.api";
import {
  CRMPipeline,
  CRMDeal,
  CreateDealInput,
  UpdateDealInput,
} from "../types/crm.types";
import { toast } from "sonner";

export function useCRM() {
  const [pipeline, setPipeline] = useState<CRMPipeline | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchBoard = useCallback(async (pipelineId?: string) => {
    setIsLoading(true);
    try {
      const data = await crmApi.getBoard(pipelineId);
      setPipeline(data);
    } catch {
      toast.error("Gagal memuat papan CRM");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Optimistic Stage Move for 60fps Native Drag & Drop
  const moveDeal = useCallback(
    async (dealId: string, sourceStageId: string, targetStageId: string) => {
      if (sourceStageId === targetStageId || !pipeline) return;

      // 1. Snapshot previous state for rollback
      const previousState = { ...pipeline };

      // 2. Find target deal
      let movedDeal: CRMDeal | null = null;
      for (const stage of pipeline.stages) {
        const found = stage.deals.find((d) => d.id === dealId);
        if (found) {
          movedDeal = { ...found, stage_id: targetStageId };
          break;
        }
      }

      if (!movedDeal) return;

      // 3. Optimistically update local stages
      const newStages = pipeline.stages.map((stage) => {
        if (stage.id === sourceStageId) {
          const updatedDeals = stage.deals.filter((d) => d.id !== dealId);
          return {
            ...stage,
            deals: updatedDeals,
            total_deals: updatedDeals.length,
            total_value: updatedDeals.reduce((sum, d) => sum + d.value_amount, 0),
          };
        }
        if (stage.id === targetStageId) {
          const updatedDeals = [movedDeal!, ...stage.deals];
          return {
            ...stage,
            deals: updatedDeals,
            total_deals: updatedDeals.length,
            total_value: updatedDeals.reduce((sum, d) => sum + d.value_amount, 0),
          };
        }
        return stage;
      });

      setPipeline({ ...pipeline, stages: newStages });

      // 4. Send API update
      try {
        await crmApi.moveDealStage(dealId, targetStageId);
        toast.success("Peluang dipindahkan ke tahapan baru");
      } catch {
        // Rollback on network failure
        setPipeline(previousState);
        toast.error("Gagal memindahkan peluang di server");
      }
    },
    [pipeline],
  );

  const createDeal = useCallback(
    async (input: CreateDealInput) => {
      setIsCreating(true);
      try {
        const created = await crmApi.createDeal(input);
        toast.success("Peluang penjualan berhasil ditambahkan");
        fetchBoard(pipeline?.id);
        return created;
      } catch {
        toast.error("Gagal menambahkan peluang penjualan");
        throw new Error("Gagal membuat deal");
      } finally {
        setIsCreating(false);
      }
    },
    [fetchBoard, pipeline],
  );

  const updateDeal = useCallback(
    async (id: string, input: UpdateDealInput) => {
      try {
        const updated = await crmApi.updateDeal(id, input);
        toast.success("Peluang berhasil diperbarui");
        fetchBoard(pipeline?.id);
        return updated;
      } catch {
        toast.error("Gagal memperbarui peluang");
      }
    },
    [fetchBoard, pipeline],
  );

  const deleteDeal = useCallback(
    async (id: string) => {
      try {
        await crmApi.deleteDeal(id);
        toast.success("Peluang berhasil dihapus");
        fetchBoard(pipeline?.id);
      } catch {
        toast.error("Gagal menghapus peluang");
      }
    },
    [fetchBoard, pipeline],
  );

  return {
    pipeline,
    isLoading,
    isCreating,
    moveDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    refreshBoard: fetchBoard,
  };
}
