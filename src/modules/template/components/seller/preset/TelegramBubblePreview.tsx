"use client";

import React from "react";
import { PresetTelegramContent } from "../../../data/templatePresets";
import { Check, ExternalLink, Bot, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TelegramBubblePreviewProps {
  content: PresetTelegramContent;
  isBlank?: boolean;
}

/**
 * Renders a lightweight HTML representation for telegram chat bubble preview.
 * Converts <b>, <code>, <i>, and \n safely into React elements.
 */
function renderTelegramText(html: string) {
  if (!html) return null;

  // Split by newlines first
  const lines = html.split("\n");

  return lines.map((line, lineIdx) => {
    // Basic parser for <b>, <code>, <i> tags
    const parts = line.split(/(<b>.*?<\/b>|<code>.*?<\/code>|<i>.*?<\/i>)/g);

    return (
      <div key={lineIdx} className={cn("min-h-[1.15em]", lineIdx > 0 && "mt-1")}>
        {parts.map((part, partIdx) => {
          if (part.startsWith("<b>") && part.endsWith("</b>")) {
            return (
              <strong key={partIdx} className="font-bold text-zinc-900 dark:text-zinc-100">
                {part.slice(3, -4)}
              </strong>
            );
          }
          if (part.startsWith("<code>") && part.endsWith("</code>")) {
            return (
              <code
                key={partIdx}
                className="font-mono bg-black/10 dark:bg-white/15 px-1 py-0.5 rounded text-[11px] font-semibold text-emerald-950 dark:text-emerald-200"
              >
                {part.slice(6, -7)}
              </code>
            );
          }
          if (part.startsWith("<i>") && part.endsWith("</i>")) {
            return (
              <em key={partIdx} className="italic text-zinc-600 dark:text-zinc-400 text-[11px]">
                {part.slice(3, -4)}
              </em>
            );
          }
          return <span key={partIdx}>{part}</span>;
        })}
      </div>
    );
  });
}

export function TelegramBubblePreview({ content, isBlank }: TelegramBubblePreviewProps) {
  if (isBlank) {
    return (
      <div className="w-full h-full min-h-[170px] flex flex-col items-center justify-center p-4 text-center rounded-xl border border-dashed border-border/80 bg-surface/50 dark:bg-zinc-900/30">
        <div className="size-10 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 shadow-xs">
          <Plus className="size-5" />
        </div>
        <p className="text-xs font-semibold text-foreground">Template Kosong</p>
        <p className="text-[11px] text-foreground-muted mt-0.5">Tulis pesan dari awal</p>
      </div>
    );
  }

  const buttons = content.inlineButtons?.flat() || [];

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-[170px] text-xs">
      {/* Chat Bubble Container */}
      <div className="relative self-end w-full max-w-[95%] rounded-2xl rounded-tr-sm bg-[#E3FED3] dark:bg-[#1E3B2B] p-3 text-zinc-800 dark:text-zinc-100 shadow-xs border border-emerald-300/40 dark:border-emerald-700/30">
        {/* Message Body */}
        <div className="text-[11.5px] leading-relaxed break-words font-sans pb-3">
          {renderTelegramText(content.text)}
        </div>

        {/* Timestamp and Single Checkmark */}
        <div className="absolute bottom-1.5 right-2 flex items-center gap-1 text-[9.5px] text-zinc-500 dark:text-zinc-400">
          <span>12:00</span>
          <Check className="size-3 text-sky-500 dark:text-sky-400 stroke-[2.5]" />
        </div>
      </div>

      {/* Telegram Inline Keyboard Preview */}
      {buttons.length > 0 && (
        <div className="mt-2 flex flex-col gap-1 w-full max-w-[95%] self-end">
          {buttons.slice(0, 2).map((btn, idx) => (
            <div
              key={idx}
              className="w-full py-1.5 px-2.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/15 dark:bg-sky-400/10 dark:hover:bg-sky-400/15 text-sky-700 dark:text-sky-300 text-[11px] font-semibold text-center flex items-center justify-center gap-1 truncate shadow-2xs border border-sky-500/20 transition-colors"
            >
              {btn.url ? <ExternalLink className="size-3 shrink-0" /> : <Bot className="size-3 shrink-0" />}
              <span className="truncate">{btn.text}</span>
            </div>
          ))}
          {buttons.length > 2 && (
            <span className="text-[9.5px] text-center text-foreground-muted">
              +{buttons.length - 2} tombol lainnya
            </span>
          )}
        </div>
      )}
    </div>
  );
}
