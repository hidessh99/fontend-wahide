"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  TemplateCategory,
  TemplateMediaType,
  TemplateButton,
} from "../../types/template.types";
import {
  ExternalLink,
  Phone,
  CornerDownLeft,
  FileText,
  Image as ImageIcon,
  CheckCheck,
  Bell,
  CalendarCheck,
  MessageSquareReply,
  Flame,
  Info,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

/**
 * Strict URL sanitizer for media URLs (img src and document previews).
 * Uses standard WHATWG URL parser to prevent DOM-based XSS (CodeQL js/xss-through-dom)
 * and strictly whitelists only safe protocols (http:, https:, blob:).
 */
export function getSafeMediaUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:" ||
      parsed.protocol === "blob:"
    ) {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}

interface WhatsAppPhoneMockupProps {
  name: string;
  category: TemplateCategory;
  content: string;
  mediaType?: TemplateMediaType;
  mediaUrl?: string;
  buttons?: TemplateButton[];
  sampleData?: Record<string, string>;
  className?: string;
}

export function WhatsAppPhoneMockup({
  name,
  category,
  content,
  mediaType = "NONE",
  mediaUrl,
  buttons = [],
  sampleData = {
    nama: "Budi Santoso",
    nomor: "081234567890",
    email: "budi@example.com",
    tanggal: "06 Sep 2026",
    invoice: "INV-2026-0089",
    link: "https://wahide.id",
  },
  className = "",
}: WhatsAppPhoneMockupProps) {
  const { t } = useI18n();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [mediaUrl]);

  const safeMediaUrl = useMemo(() => getSafeMediaUrl(mediaUrl), [mediaUrl]);

  const docFileName = useMemo(() => {
    if (!safeMediaUrl) return t("template.editor.previewDocName");
    try {
      const pathname = new URL(safeMediaUrl).pathname;
      const name = pathname.split("/").filter(Boolean).pop();
      return name
        ? decodeURIComponent(name)
        : t("template.editor.previewDocName");
    } catch {
      return t("template.editor.previewDocName");
    }
  }, [safeMediaUrl, t]);

  // Render content replacing {{variable}} with colored spans
  const renderedContent = useMemo(() => {
    if (!content) return t("template.editor.contentPlaceholder");

    // Split text by {{variable}}
    const parts = content.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);

    return parts.map((part, idx) => {
      const match = part.match(/^\{\{([a-zA-Z0-9_]+)\}\}$/);
      if (match) {
        const varName = match[1];
        const sampleVal = sampleData[varName];
        return (
          <span
            key={idx}
            className="inline-flex items-center rounded bg-emerald-500/20 px-1 py-0.5 text-xs font-semibold text-emerald-900 dark:text-emerald-100"
            title={`Variable: {{${varName}}}`}
          >
            {sampleVal ? sampleVal : `{{${varName}}}`}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }, [content, sampleData, t]);

  const categoryBadge = useMemo(() => {
    switch (category) {
      case "MARKETING":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-500">
            <Flame className="size-3" /> {t("template.stats.marketing")}
          </span>
        );
      case "REMINDER":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-400">
            <Bell className="size-3" /> {t("template.stats.reminder")}
          </span>
        );
      case "RESERVATION":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-400">
            <CalendarCheck className="size-3" />{" "}
            {t("template.stats.reservation")}
          </span>
        );
      case "QUICK_REPLY":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-cyan-400">
            <MessageSquareReply className="size-3" />{" "}
            {t("template.stats.quickReply")}
          </span>
        );
      case "UTILITY":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500">
            <Info className="size-3" /> {t("template.stats.utility")}
          </span>
        );
    }
  }, [category, t]);

  return (
    <div
      className={`mx-auto flex w-full max-w-85 flex-col overflow-hidden rounded-4xl border-[6px] border-neutral-800 bg-neutral-900 shadow-2xl ${className}`}
    >
      {/* Top Phone Speaker / Camera Notch */}
      <div className="flex h-5 w-full items-center justify-center bg-neutral-900 pt-1">
        <div className="h-1.5 w-16 rounded-full bg-neutral-700" />
      </div>

      {/* WhatsApp Header */}
      <div className="flex items-center gap-3 bg-[#075E54] px-3 py-2 text-white dark:bg-[#1f2c34]">
        <div className="relative flex size-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white shadow-inner">
          W
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#075E54] bg-emerald-400" />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <span className="truncate text-sm font-semibold leading-tight">
            {name || t("template.editor.interactivePreview")}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-200">
              {t("template.editor.previewOnline")}
            </span>
            <span className="text-[10px] text-white/40">•</span>
            {categoryBadge}
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Body Wallpaper */}
      <div className="relative flex min-h-90 flex-1 flex-col justify-end bg-[#EFEAE2] p-3 dark:bg-[#0b141a]">
        {/* Subtle Chat Pattern Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Message Bubble Container */}
        <div className="relative z-10 max-w-[92%] self-end">
          {/* Main Bubble */}
          <div className="rounded-2xl rounded-tr-none bg-[#E7FFDB] p-2.5 text-neutral-900 shadow-sm dark:bg-[#005c4b] dark:text-neutral-100">
            {/* Optional Media Header */}
            {mediaType === "IMAGE" && (
              <div className="mb-2 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                {safeMediaUrl && !imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={safeMediaUrl}
                    alt="Media Header"
                    className="max-h-36 w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-28 flex-col items-center justify-center gap-1 text-neutral-500">
                    <ImageIcon className="size-8 opacity-60" />
                    <span className="text-[11px]">
                      {t("template.mediaTypes.image")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {mediaType === "DOCUMENT" && (
              <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-black/5 p-2 dark:bg-white/10">
                <FileText className="size-7 text-red-500" />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-xs font-semibold">
                    {docFileName}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {t("template.editor.previewDocType")}
                  </span>
                </div>
              </div>
            )}

            {/* Bubble Content Body */}
            <div className="whitespace-pre-wrap wrap-break-word text-[13px] leading-relaxed">
              {renderedContent}
            </div>

            {/* Timestamp & Read Status */}
            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-neutral-500 dark:text-neutral-300">
              <span>12:45</span>
              <CheckCheck className="size-3.5 text-blue-500" />
            </div>
          </div>

          {/* WhatsApp Interactive Action Buttons */}
          {buttons && buttons.length > 0 && (
            <div className="mt-1 flex flex-col gap-1">
              {buttons.map((btn, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#00a884] shadow-sm transition hover:bg-neutral-50 dark:bg-[#1f2c34] dark:text-[#00a884] dark:hover:bg-[#233138]"
                >
                  {btn.type === "URL" && <ExternalLink className="size-3.5" />}
                  {btn.type === "CALL" && <Phone className="size-3.5" />}
                  {btn.type === "QUICK_REPLY" && (
                    <CornerDownLeft className="size-3.5" />
                  )}
                  <span className="truncate">
                    {btn.text || t("template.editor.addButton")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Input Mock Bar */}
      <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-2 text-neutral-500 dark:bg-[#1f2c34]">
        <div className="flex h-7 flex-1 items-center rounded-full bg-white px-3 text-[11px] text-neutral-400 dark:bg-[#2a3942]">
          {t("template.editor.previewTypeMessage")}
        </div>
        <div className="size-7 rounded-full bg-[#00a884]" />
      </div>
    </div>
  );
}
