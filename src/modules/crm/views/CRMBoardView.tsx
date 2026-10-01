"use client";

import React, { useState } from "react";
import { useCRM } from "../hooks/useCRM";
import { KanbanColumn } from "../components/KanbanColumn";
import { CreateDealModal } from "../components/CreateDealModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Plus,
  RefreshCw,
  Trophy,
  FolderKanban,
} from "lucide-react";

export function CRMBoardView() {
  const {
    pipeline,
    isLoading,
    moveDeal,
    createDeal,
    deleteDeal,
    refreshBoard,
  } = useCRM();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>("");

  const handleOpenCreateModal = (stageId?: string) => {
    if (stageId) {
      setSelectedStageId(stageId);
    } else if (pipeline?.stages?.[0]) {
      setSelectedStageId(pipeline.stages[0].id);
    }
    setCreateModalOpen(true);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading && !pipeline) {
    return (
      <div className="flex h-96 items-center justify-center text-xs text-muted-foreground animate-pulse">
        Memuat papan pipeline CRM...
      </div>
    );
  }

  const stages = pipeline?.stages || [];
  const wonStage = stages.find((s) => s.is_won);

  const wonDealsCount = wonStage?.deals?.length || 0;
  const wonTotalValue = wonStage?.total_value || 0;

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {pipeline?.name || "Pipeline CRM"}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola prospek prospek penjualan, drag-and-drop antar tahapan, dan pantau closing deal secara otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshBoard(pipeline?.id)}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Segarkan
          </Button>
          <Button
            size="sm"
            onClick={() => handleOpenCreateModal()}
            className="h-8 gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Peluang Baru
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Total Peluang</p>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {pipeline?.total_pipeline_deals || 0}
              </h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Nilai Pipeline</p>
              <h3 className="text-sm sm:text-base font-bold text-primary mt-0.5 truncate">
                {formatRupiah(pipeline?.total_pipeline_value || 0)}
              </h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Deals Closed Won</p>
              <h3 className="text-lg font-bold text-emerald-600 mt-0.5">
                {wonDealsCount}
              </h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Trophy className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Nilai Berhasil Won</p>
              <h3 className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5 truncate">
                {formatRupiah(wonTotalValue)}
              </h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Horizontal Scrolling Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex items-start gap-4 h-full min-w-max">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              onMoveDeal={moveDeal}
              onDeleteDeal={deleteDeal}
              onOpenCreateModal={handleOpenCreateModal}
            />
          ))}
        </div>
      </div>

      {/* Create Deal Modal */}
      {pipeline && (
        <CreateDealModal
          isOpen={createModalOpen}
          pipelineId={pipeline.id}
          defaultStageId={selectedStageId || stages[0]?.id}
          stages={stages}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={createDeal}
        />
      )}
    </div>
  );
}
