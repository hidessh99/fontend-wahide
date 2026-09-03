"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { RefreshCw, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpintaxVisualizerProps {
  previewText: string;
  onRandomize: () => void;
}

export function SpintaxVisualizer({ previewText, onRandomize }: SpintaxVisualizerProps) {
  const { t } = useI18n();

  return (
    <div className="border-border space-y-3 rounded-md border bg-zinc-100 p-4 dark:bg-[#10110e]">
      <div className="flex items-center justify-between">
        <div className="text-foreground flex items-center gap-2 text-xs font-bold">
          <Sparkles className="dark:text-wise-green size-4 text-emerald-700" />
          <span>{t("campaign.spintaxPreviewTitle")}</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRandomize()}
          className="border-border hover:border-foreground-muted h-7 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold"
        >
          <RefreshCw className="dark:text-wise-green size-3 text-emerald-700" />
          <span>{t("campaign.randomizeVariation")}</span>
        </Button>
      </div>

      {/* WhatsApp Styled Message Bubble */}
      <div className="text-foreground relative rounded-lg border border-[#c4e8a5] bg-[#e2f7cb] p-4 shadow-sm dark:border-[#005c4b] dark:bg-[#005c4b]/40">
        <div className="flex items-start gap-2.5">
          <MessageSquare className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs leading-relaxed font-semibold whitespace-pre-wrap">
            {previewText ||
              "Tulis template pesan di atas untuk melihat simulasi hasil Spintax acak di sini."}
          </p>
        </div>
        <span className="text-foreground-muted mt-2 block text-right font-mono text-[10px]">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
