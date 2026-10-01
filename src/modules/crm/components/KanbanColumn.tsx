"use client";

import React, { useState } from "react";
import { CRMStage } from "../types/crm.types";
import { DealCard } from "./DealCard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanColumnProps {
  stage: CRMStage;
  onMoveDeal: (dealId: string, sourceStageId: string, targetStageId: string) => void;
  onDeleteDeal: (dealId: string) => void;
  onOpenCreateModal: (stageId: string) => void;
}

export function KanbanColumn({
  stage,
  onMoveDeal,
  onDeleteDeal,
  onOpenCreateModal,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData("text/plain");
      if (dataStr) {
        const { dealId, sourceStageId } = JSON.parse(dataStr);
        if (dealId && sourceStageId) {
          onMoveDeal(dealId, sourceStageId, stage.id);
        }
      }
    } catch {
      // Ignore invalid drag payload
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex w-72 sm:w-80 shrink-0 flex-col rounded-xl border border-border/80 bg-muted/30 transition-colors max-h-full",
        isDragOver && "bg-primary/5 border-primary/40 ring-1 ring-primary/40",
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-border/60 p-3 bg-card/60 rounded-t-xl">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: stage.color_hex || "#3b82f6" }}
          />
          <h3 className="text-xs font-semibold text-foreground truncate">
            {stage.name}
          </h3>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
            {stage.deals?.length || 0}
          </span>
        </div>

        <div className="text-[11px] font-semibold text-primary truncate">
          {formatRupiah(stage.total_value || 0)}
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[150px]">
        {stage.deals && stage.deals.length > 0 ? (
          stage.deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onDelete={onDeleteDeal}
            />
          ))
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border/60 text-center text-xs text-muted-foreground/60">
            Tarik peluang ke sini
          </div>
        )}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-border/40">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpenCreateModal(stage.id)}
          className="w-full justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah Peluang
        </Button>
      </div>
    </div>
  );
}
