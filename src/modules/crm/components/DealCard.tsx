"use client";

import React from "react";
import { CRMDeal } from "../types/crm.types";
import { cn } from "@/lib/utils";
import {
  User,
  Phone,
  Calendar,
  Trash2,
  Smartphone,
  Bot,
  MessageSquare,
} from "lucide-react";

interface DealCardProps {
  deal: CRMDeal;
  onDelete: (id: string) => void;
}

export function DealCard({ deal, onDelete }: DealCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ dealId: deal.id, sourceStageId: deal.stage_id }));
    e.dataTransfer.effectAllowed = "move";
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getChannelBadge = (channel?: string) => {
    if (!channel) return null;
    if (channel.includes("WHATSMEOW")) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
          <Smartphone className="h-2.5 w-2.5" /> WA
        </span>
      );
    }
    if (channel.includes("TELEGRAM")) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-medium text-sky-600 dark:text-sky-400">
          <Bot className="h-2.5 w-2.5" /> TG
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 dark:text-blue-400">
        <MessageSquare className="h-2.5 w-2.5" /> WABA
      </span>
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-primary/50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
          {deal.title}
        </h4>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deal.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-opacity p-0.5"
          title="Hapus Peluang"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="text-xs font-bold text-primary">
        {formatRupiah(deal.value_amount)}
      </div>

      {/* Contact Details */}
      {(deal.contact_name || deal.contact_phone) && (
        <div className="flex flex-col gap-1 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
          {deal.contact_name && (
            <div className="flex items-center gap-1.5 truncate">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{deal.contact_name}</span>
            </div>
          )}
          {deal.contact_phone && (
            <div className="flex items-center gap-1.5 truncate">
              <Phone className="h-3 w-3 shrink-0" />
              <span className="truncate">{deal.contact_phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer info & Channel Origin */}
      <div className="flex items-center justify-between gap-1 pt-1 text-[10px] text-muted-foreground">
        {getChannelBadge(deal.channel_origin)}
        {deal.expected_close_date && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" />
            {new Date(deal.expected_close_date).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
