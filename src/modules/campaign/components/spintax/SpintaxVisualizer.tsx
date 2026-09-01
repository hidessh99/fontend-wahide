"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { RefreshCw, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpintaxVisualizerProps {
  previewText: string;
  onRandomize: () => void;
}

export function SpintaxVisualizer({
  previewText,
  onRandomize,
}: SpintaxVisualizerProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-3 p-4 rounded-md bg-zinc-100 dark:bg-[#10110e] border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Sparkles className="size-4 text-wise-green" />
          <span>{t("campaign.spintaxPreviewTitle")}</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRandomize}
          className="rounded-full text-xs font-bold gap-1.5 h-7 px-3 border-border hover:border-foreground-muted"
        >
          <RefreshCw className="size-3 text-wise-green" />
          <span>{t("campaign.randomizeVariation")}</span>
        </Button>
      </div>

      {/* WhatsApp Styled Message Bubble */}
      <div className="relative p-4 rounded-lg bg-[#e2f7cb] dark:bg-[#005c4b]/40 text-foreground border border-[#c4e8a5] dark:border-[#005c4b] shadow-sm">
        <div className="flex items-start gap-2.5">
          <MessageSquare className="size-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs font-semibold whitespace-pre-wrap leading-relaxed">
            {previewText || "Tulis template pesan di atas untuk melihat simulasi hasil Spintax acak di sini."}
          </p>
        </div>
        <span className="block text-right text-[10px] text-foreground-muted font-mono mt-2">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
