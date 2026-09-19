"use client";

import React from "react";
import { PresetWABAContent } from "../../../data/templatePresets";
import { Copy, ExternalLink, CornerDownLeft, Plus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WABAHsmBubblePreviewProps {
  content: PresetWABAContent;
  isBlank?: boolean;
}

/**
 * Highlights Meta sequential parameters {{1}}, {{2}} in body text
 */
function renderWABABody(text: string) {
  if (!text) return null;

  const parts = text.split(/(\{\{\d+\}\})/g);

  return parts.map((part, idx) => {
    if (part.startsWith("{{") && part.endsWith("}}")) {
      return (
        <span
          key={idx}
          className="inline-flex items-center px-1 rounded bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold mx-0.5"
        >
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function WABAHsmBubblePreview({ content, isBlank }: WABAHsmBubblePreviewProps) {
  if (isBlank) {
    return (
      <div className="w-full h-full min-h-[170px] flex flex-col items-center justify-center p-4 text-center rounded-xl border border-dashed border-border/80 bg-surface/50 dark:bg-zinc-900/30">
        <div className="size-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-xs">
          <Plus className="size-5" />
        </div>
        <p className="text-xs font-semibold text-foreground">Template Kosong</p>
        <p className="text-[11px] text-foreground-muted mt-0.5">Tulis template HSM baru</p>
      </div>
    );
  }

  const buttons = content.buttons || [];

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-[170px] text-xs">
      {/* Meta HSM Bubble Card */}
      <div className="relative w-full rounded-2xl rounded-tr-sm bg-surface dark:bg-zinc-900 p-3 text-zinc-900 dark:text-zinc-100 shadow-xs border border-border/80 space-y-2">
        {/* Meta Category Tag & Verification Badge */}
        <div className="flex items-center justify-between gap-1">
          <span
            className={cn(
              "text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
              content.category === "AUTHENTICATION" &&
                "bg-purple-500/15 text-purple-700 dark:text-purple-300",
              content.category === "UTILITY" &&
                "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
              content.category === "MARKETING" &&
                "bg-amber-500/15 text-amber-700 dark:text-amber-300",
            )}
          >
            {content.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="size-3" />
            <span>Meta Verified</span>
          </div>
        </div>

        {/* Optional Header */}
        {content.headerText && (
          <div className="font-bold text-xs text-foreground border-b border-border/50 pb-1">
            {content.headerText}
          </div>
        )}

        {/* Body with {{1}} params */}
        <div className="text-[11.5px] leading-relaxed break-words font-sans text-foreground/90">
          {renderWABABody(content.bodyText)}
        </div>

        {/* Optional Footer */}
        {content.footerText && (
          <div className="text-[10px] text-foreground-muted italic pt-1 border-t border-border/40">
            {content.footerText}
          </div>
        )}
      </div>

      {/* Meta HSM Button Preview */}
      {buttons.length > 0 && (
        <div className="mt-2 flex flex-col gap-1 w-full">
          {buttons.slice(0, 2).map((btn, idx) => (
            <div
              key={idx}
              className="w-full py-1.5 px-2.5 rounded-lg bg-surface hover:bg-muted/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-sky-700 dark:text-sky-400 text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 shadow-2xs border border-border/70 transition-colors"
            >
              {btn.type === "QUICK_REPLY" && btn.text.toLowerCase().includes("salin") ? (
                <Copy className="size-3 shrink-0" />
              ) : btn.type === "URL" ? (
                <ExternalLink className="size-3 shrink-0" />
              ) : (
                <CornerDownLeft className="size-3 shrink-0" />
              )}
              <span className="truncate">{btn.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
