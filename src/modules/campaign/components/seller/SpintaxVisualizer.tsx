"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { RefreshCw, MessageSquare, Shuffle } from "lucide-react";
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
    <div className="border-border space-y-3 rounded-xl border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div className="text-foreground flex items-center gap-2 text-xs font-bold">
          <Shuffle className="dark:text-wise-green size-4 text-emerald-800" />
          <span>{t("campaign.spintaxPreviewTitle")}</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRandomize()}
          className="border-border hover:border-foreground-muted h-7 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold"
        >
          <RefreshCw className="dark:text-wise-green size-3 text-emerald-800" />
          <span>{t("campaign.randomizeVariation")}</span>
        </Button>
      </div>

      {/* WhatsApp Styled Message Bubble */}
      <div className="text-foreground relative rounded-xl border border-emerald-500/20 bg-emerald-50/80 p-4 shadow-xs dark:border-emerald-500/30 dark:bg-emerald-950/30">
        <div className="flex items-start gap-2.5">
          <MessageSquare className="mt-0.5 size-4 shrink-0 text-emerald-800 dark:text-emerald-300" />
          <p className="text-xs leading-relaxed font-semibold whitespace-pre-wrap">
            {previewText ||
              "Tulis template pesan di atas untuk melihat simulasi hasil Spintax acak di sini."}
          </p>
        </div>
        <span className="text-foreground-muted mt-2 block text-right font-mono text-[10px]">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
