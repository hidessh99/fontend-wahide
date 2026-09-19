"use client";

import React from "react";
import { PresetWhatsAppContent } from "../../../data/templatePresets";
import { CheckCheck, Plus, Sparkles, ExternalLink, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface WhatsAppBubblePreviewProps {
  content: PresetWhatsAppContent;
  isBlank?: boolean;
}

/**
 * Basic WhatsApp formatting parser (*bold*, _italic_, ~strike~, and {spintax})
 */
function renderWhatsAppText(text: string) {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Split by *bold*, _italic_, and {spintax|tags}
    const parts = line.split(/(\*.*?\*|_.*?_|~.*?~|\{.*?\})/g);

    return (
      <div key={lineIdx} className={cn("min-h-[1.15em]", lineIdx > 0 && "mt-1")}>
        {parts.map((part, partIdx) => {
          if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return (
              <strong key={partIdx} className="font-bold text-zinc-900 dark:text-zinc-50">
                {part.slice(1, -1)}
              </strong>
            );
          }
          if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
            return (
              <em key={partIdx} className="italic text-zinc-700 dark:text-zinc-300">
                {part.slice(1, -1)}
              </em>
            );
          }
          if (part.startsWith("~") && part.endsWith("~") && part.length > 2) {
            return (
              <span key={partIdx} className="line-through text-zinc-500 dark:text-zinc-400">
                {part.slice(1, -1)}
              </span>
            );
          }
          if (part.startsWith("{") && part.endsWith("}") && part.includes("|")) {
            return (
              <span
                key={partIdx}
                className="inline-flex items-center px-1 rounded bg-amber-200/60 dark:bg-amber-400/20 text-amber-900 dark:text-amber-200 text-[10.5px] font-mono mx-0.5"
                title="Spintax Anti-Banned"
              >
                {part}
              </span>
            );
          }
          return <span key={partIdx}>{part}</span>;
        })}
      </div>
    );
  });
}

export function WhatsAppBubblePreview({ content, isBlank }: WhatsAppBubblePreviewProps) {
  const { t } = useI18n();

  if (isBlank) {
    return (
      <div className="w-full h-full min-h-[170px] flex flex-col items-center justify-center p-4 text-center rounded-xl border border-dashed border-border/80 bg-surface/50 dark:bg-zinc-900/30">
        <div className="size-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-xs">
          <Plus className="size-5" />
        </div>
        <p className="text-xs font-semibold text-foreground">{t("template.blankTemplate") || "Template Kosong"}</p>
        <p className="text-[11px] text-foreground-muted mt-0.5">{t("template.writeFromScratch")}</p>
      </div>
    );
  }

  const buttons = content.buttons || [];

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-[170px] text-xs">
      {/* WhatsApp Message Bubble */}
      <div className="relative self-end w-full max-w-[95%] rounded-2xl rounded-tr-sm bg-[#E7FFDB] dark:bg-[#005C4B] p-3 text-zinc-900 dark:text-zinc-100 shadow-xs border border-emerald-300/30 dark:border-emerald-700/20">
        {/* Spintax indicator if present */}
        {content.spintaxEnabled && (
          <div className="mb-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 dark:bg-amber-400/15 text-amber-800 dark:text-amber-300 text-[9.5px] font-medium">
            <Sparkles className="size-2.5" />
            <span>{t("template.spintaxActive")}</span>
          </div>
        )}

        {/* Message Body */}
        <div className="text-[11.5px] leading-relaxed break-words font-sans pb-3">
          {renderWhatsAppText(content.text)}
        </div>

        {/* Timestamp and Double Blue Checkmarks */}
        <div className="absolute bottom-1.5 right-2 flex items-center gap-1 text-[9.5px] text-zinc-500 dark:text-emerald-200/70">
          <span>12:00</span>
          <CheckCheck className="size-3 text-[#53BDEB] stroke-[2.5]" />
        </div>
      </div>

      {/* WhatsApp Action Buttons Preview */}
      {buttons.length > 0 && (
        <div className="mt-2 flex flex-col gap-1 w-full max-w-[95%] self-end">
          {buttons.slice(0, 2).map((btn, idx) => (
            <div
              key={idx}
              className="w-full py-1.5 px-2.5 rounded-lg bg-surface hover:bg-muted/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold text-center flex items-center justify-center gap-1 truncate shadow-2xs border border-border/70 transition-colors"
            >
              {btn.type === "URL" ? (
                <ExternalLink className="size-3 shrink-0" />
              ) : (
                <CornerDownLeft className="size-3 shrink-0" />
              )}
              <span className="truncate">{btn.text}</span>
            </div>
          ))}
          {buttons.length > 2 && (
            <span className="text-[9.5px] text-center text-foreground-muted">
              +{buttons.length - 2} {t("template.moreButtons")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
