"use client";

import React, { useMemo } from "react";
import {
  TemplateCategory,
  TemplateMediaType,
  TelegramParseMode,
  TelegramInlineRow,
} from "../../types/template.types";
import {
  Bot,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface TelegramChatPreviewProps {
  name: string;
  category: TemplateCategory;
  content: string;
  parseMode?: TelegramParseMode;
  mediaType?: TemplateMediaType;
  mediaUrl?: string;
  inlineKeyboard?: TelegramInlineRow[];
  sampleData?: Record<string, string>;
  className?: string;
}

const DEFAULT_SAMPLE_DATA: Record<string, string> = {
  nama: "Rafi Ahmad",
  name: "Rafi Ahmad",
  invoice: "INV-2026-0091",
  order_id: "ORD-8821",
  nominal: "250.000",
  tanggal: "18 September 2026",
  jam: "14:00",
  waktu: "18 September 2026 14:00",
  link: "https://wahide.com/orders",
  status: "LUNAS",
};

export function TelegramChatPreview({
  content,
  parseMode = "HTML",
  mediaType = "NONE",
  mediaUrl,
  inlineKeyboard = [],
  sampleData = DEFAULT_SAMPLE_DATA,
  className = "",
}: TelegramChatPreviewProps) {
  const { t } = useI18n();

  // 1. Substitute placeholders with sample data
  const renderedText = useMemo(() => {
    if (!content) return "";
    let text = content;
    const mergedData = { ...DEFAULT_SAMPLE_DATA, ...sampleData };

    for (const [k, v] of Object.entries(mergedData)) {
      text = text
        .replaceAll(`{{${k}}}`, v)
        .replaceAll(`{${k}}`, v);
    }
    return text;
  }, [content, sampleData]);

  // 2. Safe HTML rendering for Telegram HTML parse mode
  const formattedHtml = useMemo(() => {
    if (parseMode === "PLAIN") {
      return renderedText;
    }
    if (parseMode === "MarkdownV2") {
      // Basic simulation of MarkdownV2 for preview
      return renderedText
        .replace(/\*(.*?)\*/g, "<b>$1</b>")
        .replace(/_(.*?)_/g, "<i>$1</i>")
        .replace(/~(.*?)~/g, "<s>$1</s>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/\\([_*\\[\]()~`>#+\-=|{}.!])/g, "$1");
    }
    // HTML mode: strip unauthorized script/iframe, allow safe b, i, code, s, u, a, pre
    return renderedText;
  }, [renderedText, parseMode]);

  return (
    <div
      className={`mx-auto flex h-full max-w-sm flex-col overflow-hidden rounded-3xl border border-sky-500/20 bg-[#0e1621] text-white shadow-xl dark:border-sky-500/30 ${className}`}
    >
      {/* Telegram Chat Header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#17212b] px-4 py-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-sm">
          <Bot className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-bold text-white">
              Wahide Bot
            </span>
            <span className="rounded bg-sky-500/20 px-1 py-0.2 text-[9px] font-bold text-sky-400">
              bot
            </span>
          </div>
          <p className="truncate text-[11px] text-white/50">
            {t("template.telegram.preview.botSubtitle")}
          </p>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3.5 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white/60">
            {t("template.telegram.preview.today")}
          </span>
        </div>

        {/* Message Bubble */}
        <div className="max-w-[92%] space-y-1 self-start">
          <div className="overflow-hidden rounded-2xl rounded-tl-sm bg-[#182533] p-3 text-xs leading-relaxed text-white shadow-sm">
            {/* Media Preview (Photo / Document) */}
            {mediaType === "IMAGE" && (
              <div className="mb-2.5 overflow-hidden rounded-xl bg-black/40">
                {mediaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl}
                    alt="Telegram Media"
                    className="max-h-48 w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center text-white/40">
                    <ImageIcon className="size-8" />
                  </div>
                )}
              </div>
            )}

            {mediaType === "DOCUMENT" && (
              <div className="mb-2.5 flex items-center gap-2.5 rounded-xl bg-black/30 p-2.5 text-sky-400">
                <FileText className="size-6 shrink-0" />
                <div className="min-w-0 flex-1 text-[11px]">
                  <p className="truncate font-semibold text-white">
                    {mediaUrl
                      ? mediaUrl.split("/").pop()
                      : t("template.telegram.preview.defaultDocName")}
                  </p>
                  <p className="text-[10px] text-white/50">
                    {t("template.telegram.preview.pdfDoc")}
                  </p>
                </div>
              </div>
            )}

            {/* Content Text with HTML support */}
            <div
              className="prose prose-invert max-w-none text-xs leading-relaxed font-sans break-words [&>b]:font-black [&>code]:bg-black/30 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sky-300 [&>code]:text-[11px] [&>a]:text-sky-400 [&>a]:underline"
              dangerouslySetInnerHTML={{
                __html:
                  formattedHtml || t("template.telegram.preview.emptyMessage"),
              }}
            />

            {/* Timestamp & Status */}
            <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-white/40">
              <span>21:00</span>
              <Check className="size-3 text-sky-400" />
            </div>
          </div>

          {/* Telegram Inline Keyboards (Attached directly under bubble) */}
          {inlineKeyboard && inlineKeyboard.length > 0 && (
            <div className="space-y-1 pt-1">
              {inlineKeyboard.map((row, rIdx) => (
                <div key={`prev-row-${rIdx}`} className="flex gap-1">
                  {row.map((btn, bIdx) => (
                    <div
                      key={`prev-btn-${rIdx}-${bIdx}`}
                      className="flex-1 truncate rounded-xl bg-[#2b3a4a] px-3 py-2 text-center text-[11px] font-semibold text-sky-300 transition hover:bg-[#344558] active:scale-98 shadow-2xs"
                    >
                      <span className="truncate">
                        {btn.text || t("template.telegram.preview.defaultButton")}
                      </span>
                      {btn.url && (
                        <ExternalLink className="ml-1 inline size-2.5 opacity-60" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#17212b] px-3.5 py-2 text-[10px] text-white/50">
        <span className="font-mono">ParseMode: {parseMode}</span>
        <span>Telegram API Compatible</span>
      </div>
    </div>
  );
}
