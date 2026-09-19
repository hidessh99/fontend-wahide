"use client";

import React from "react";
import { TemplatePreset } from "../../../data/templatePresets";
import { TemplateChannelType } from "../../../types/template.types";
import { TelegramBubblePreview } from "./TelegramBubblePreview";
import { WhatsAppBubblePreview } from "./WhatsAppBubblePreview";
import { WABAHsmBubblePreview } from "./WABAHsmBubblePreview";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplatePresetCardProps {
  preset: TemplatePreset;
  activeChannel: TemplateChannelType | "ALL";
  onSelect: (preset: TemplatePreset) => void;
}

export function TemplatePresetCard({
  preset,
  activeChannel,
  onSelect,
}: TemplatePresetCardProps) {
  // Determine preview channel
  const effectiveChannel: "TELEGRAM_BOT" | "WHATSMEOW_UNOFFICIAL" | "META_WABA_OFFICIAL" =
    activeChannel === "TELEGRAM_BOT"
      ? "TELEGRAM_BOT"
      : activeChannel === "META_WABA_OFFICIAL"
      ? "META_WABA_OFFICIAL"
      : "WHATSMEOW_UNOFFICIAL";

  return (
    <div
      onClick={() => onSelect(preset)}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-surface dark:bg-[#151715] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/80 hover:shadow-lg dark:hover:border-emerald-400/80 cursor-pointer h-full",
        preset.isBlank && "border-dashed hover:border-sky-500",
      )}
    >
      {/* Visual Chat Bubble Area */}
      <div className="relative flex-1 p-3 sm:p-4 bg-muted/40 dark:bg-zinc-950/60 border-b border-border/60 flex flex-col justify-center min-h-[180px] sm:min-h-[195px] max-h-[225px] overflow-hidden">
        {effectiveChannel === "TELEGRAM_BOT" && (
          <TelegramBubblePreview
            content={preset.content.telegram}
            isBlank={preset.isBlank}
          />
        )}
        {effectiveChannel === "WHATSMEOW_UNOFFICIAL" && (
          <WhatsAppBubblePreview
            content={preset.content.whatsapp}
            isBlank={preset.isBlank}
          />
        )}
        {effectiveChannel === "META_WABA_OFFICIAL" && (
          <WABAHsmBubblePreview
            content={preset.content.waba}
            isBlank={preset.isBlank}
          />
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-3.5 sm:p-4 space-y-1 bg-surface dark:bg-[#151715] shrink-0">
        <div className="flex items-center justify-between gap-1.5">
          <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
            {preset.title}
          </h3>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-emerald-600 dark:text-emerald-400">
            <ArrowRight className="size-3.5" />
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-foreground-muted line-clamp-2 leading-relaxed">
          {preset.description}
        </p>
      </div>
    </div>
  );
}
