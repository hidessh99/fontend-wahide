"use client";

import React from "react";
import {
  User,
  Check,
  CheckCheck,
  FileText,
  MapPin,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  Bot,
  ExternalLink,
  BellOff,
  Sparkles,
} from "lucide-react";
import { formatDisplayPhone } from "@/lib/phone";
import { OmnichannelChannelType } from "../types/omnichannel.types";
import { Badge } from "@/components/ui/badge";

interface OmnichannelChatPreviewProps {
  channelType: OmnichannelChannelType;
  recipient: string;
  senderName?: string;
  senderIdentifier?: string;
  messageText?: string;
  messageType?: "chat" | "image" | "file" | "location" | "photo" | "document";
  mediaUrl?: string;
  fileName?: string;
  locationAddress?: string;
  // WABA specific
  wabaMode?: "session_text" | "template_hsm";
  templateName?: string;
  templateParams?: Record<string, string>;
  // Telegram specific
  parseMode?: "HTML" | "MarkdownV2" | "Markdown";
  disableNotification?: boolean;
}

export function OmnichannelChatPreview({
  channelType,
  recipient,
  senderName = "Wahide Sender",
  senderIdentifier,
  messageText = "",
  messageType = "chat",
  mediaUrl,
  fileName,
  locationAddress,
  wabaMode = "session_text",
  templateName,
  templateParams,
  parseMode = "HTML",
  disableNotification = false,
}: OmnichannelChatPreviewProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const displayRecipient = recipient
    ? channelType === "TELEGRAM_BOT"
      ? recipient.startsWith("@")
        ? recipient
        : `Chat ID: ${recipient}`
      : formatDisplayPhone(recipient)
    : channelType === "TELEGRAM_BOT"
      ? "@pelanggan"
      : "+62 812-3456-7890";

  // --------------------------------------------------------------------------
  // RENDER: WhatsApp Web Preview
  // --------------------------------------------------------------------------
  if (channelType === "WHATSMEOW_UNOFFICIAL") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <span>Live Chat Preview</span>
            <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
              WhatsApp Web
            </Badge>
          </h3>
          <span className="text-[11px] text-foreground-muted">
            Via {senderName || "Device"}
          </span>
        </div>

        <div className="border-border bg-surface overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xs">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#008069] dark:bg-[#1f2c34] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-white line-clamp-1">
                  {displayRecipient}
                </p>
                <p className="text-[11px] text-emerald-100 dark:text-emerald-300">
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Video className="size-4 hover:text-white cursor-pointer" />
              <Phone className="size-4 hover:text-white cursor-pointer" />
              <MoreVertical className="size-4 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Canvas */}
          <div
            className="relative min-h-[260px] p-4 flex flex-col justify-end bg-[#efeae2] dark:bg-[#0b141a] transition-colors"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            <div className="self-end max-w-[85%] sm:max-w-[78%]">
              <div className="relative rounded-2xl rounded-tr-xs bg-[#d9fdd3] dark:bg-[#005c4b] p-3 text-zinc-900 dark:text-zinc-100 shadow-xs">
                {/* Media Image */}
                {messageType === "image" && mediaUrl && (
                  <div className="mb-2 overflow-hidden rounded-xl border border-black/5 bg-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl}
                      alt="Preview Attachment"
                      className="max-h-48 w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Media File */}
                {messageType === "file" && (
                  <div className="mb-2 flex items-center gap-3 rounded-xl bg-black/5 dark:bg-black/20 p-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-foreground">
                        {fileName || "document.pdf"}
                      </p>
                      <p className="text-[10px] text-foreground-secondary">
                        Dokumen PDF • Siap Dikirim
                      </p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {messageType === "location" && (
                  <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-black/5 dark:bg-black/20 p-2.5">
                    <MapPin className="size-4 shrink-0 text-rose-500" />
                    <p className="text-xs font-semibold text-foreground truncate">
                      {locationAddress || "Lokasi Koordinat GPS"}
                    </p>
                  </div>
                )}

                {/* Message Body */}
                <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                  {messageText || (
                    <span className="italic text-foreground-muted opacity-70">
                      Ketik pesan pada form di sebelah kiri...
                    </span>
                  )}
                </p>

                {/* Bubble Footer */}
                <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-zinc-500 dark:text-emerald-200/70">
                  <span>{timeStr}</span>
                  <CheckCheck className="size-3.5 text-[#53bdeb] dark:text-[#53bdeb]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: Meta WABA Official Preview (HSM Template & Verified Badge)
  // --------------------------------------------------------------------------
  if (channelType === "META_WABA_OFFICIAL") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <span>Live Chat Preview</span>
            <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10">
              Meta WABA Official
            </Badge>
          </h3>
          <span className="text-[11px] text-foreground-muted flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-500" />
            Verified Cloud API
          </span>
        </div>

        <div className="border-border bg-surface overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xs">
          {/* Header with Official Business Badge */}
          <div className="flex items-center justify-between bg-[#128C7E] dark:bg-[#1a2e35] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
                <User className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-1 ring-white">
                  <ShieldCheck className="size-2.5" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold leading-tight text-white line-clamp-1">
                    {senderName || "Akun Bisnis Resmi"}
                  </p>
                  <ShieldCheck className="size-3.5 text-emerald-300" />
                </div>
                <p className="text-[10px] text-emerald-100 font-medium">
                  {senderIdentifier || "WhatsApp Business Official"}
                </p>
              </div>
            </div>
            <MoreVertical className="size-4 text-white/80 cursor-pointer" />
          </div>

          {/* Canvas */}
          <div
            className="relative min-h-[260px] p-4 flex flex-col justify-end bg-[#efeae2] dark:bg-[#0b141a]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            <div className="self-end max-w-[88%] sm:max-w-[82%]">
              <div className="relative rounded-2xl rounded-tr-xs bg-white dark:bg-[#1f2c34] p-3.5 text-zinc-900 dark:text-zinc-100 shadow-md border border-black/5 dark:border-white/5 space-y-2">
                {/* Meta Verified Tag */}
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5 text-[10px] text-muted-foreground">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Official Meta Cloud HSM
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold">
                    {wabaMode === "template_hsm" ? (templateName || "UTILITY") : "24H SESSION"}
                  </span>
                </div>

                {/* Optional Media Header */}
                {mediaUrl && (
                  <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl}
                      alt="Header Attachment"
                      className="max-h-40 w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Body Content */}
                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                  {messageText ? (
                    messageText
                  ) : (
                    <span className="italic text-foreground-muted opacity-70">
                      {wabaMode === "template_hsm"
                        ? "Halo {{1}}, pesanan Anda {{2}} sedang diproses."
                        : "Ketik pesan sesi layanan pelanggan 24 jam..."}
                    </span>
                  )}
                </div>

                {/* Template Variables indicator */}
                {templateParams && Object.keys(templateParams).length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {Object.entries(templateParams).map(([k, v]) => (
                      <span
                        key={k}
                        className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/20"
                      >
                        {`{{${k}}}`}: {v || "..."}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer and Time */}
                <div className="pt-1 text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/30">
                  <span>Balas STOP untuk berhenti langganan.</span>
                  <div className="flex items-center gap-1">
                    <span>{timeStr}</span>
                    <CheckCheck className="size-3 text-blue-500" />
                  </div>
                </div>

                {/* Meta Interactive Buttons Simulation */}
                <div className="pt-1.5 grid grid-cols-1 gap-1.5 border-t border-border/40">
                  <button
                    type="button"
                    className="w-full py-1.5 px-3 rounded-lg bg-muted/70 hover:bg-muted text-foreground text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="size-3 text-blue-500" />
                    <span>Konfirmasi Pesanan</span>
                  </button>
                  <button
                    type="button"
                    className="w-full py-1.5 px-3 rounded-lg bg-muted/70 hover:bg-muted text-foreground text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="size-3 text-emerald-500" />
                    <span>Hubungi CS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: Telegram Bot Engine Preview
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
          <span>Live Chat Preview</span>
          <Badge variant="outline" className="text-[10px] font-bold border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10">
            Telegram Bot
          </Badge>
        </h3>
        <span className="text-[11px] text-foreground-muted flex items-center gap-1">
          {disableNotification && (
            <span className="flex items-center gap-0.5 text-amber-500">
              <BellOff className="size-3" /> Silent
            </span>
          )}
          <Bot className="size-3 text-sky-500" />
          Webhook Engine
        </span>
      </div>

      <div className="border-border bg-surface overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xs">
        {/* Telegram Header */}
        <div className="flex items-center justify-between bg-[#2481cc] dark:bg-[#17212b] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
              <Bot className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold leading-tight text-white line-clamp-1">
                  {senderName || "Wahide Bot"}
                </p>
                <span className="bg-white/20 text-[9px] font-black uppercase px-1 py-0.2 rounded text-white">
                  bot
                </span>
              </div>
              <p className="text-[10px] text-sky-100">
                {senderIdentifier || "@wahide_notification_bot"}
              </p>
            </div>
          </div>
          <MoreVertical className="size-4 text-white/80 cursor-pointer" />
        </div>

        {/* Telegram Canvas */}
        <div
          className="relative min-h-[260px] p-4 flex flex-col justify-end bg-[#0e1621] dark:bg-[#0e1621] text-white"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Target Recipient Info Bar */}
          <div className="mx-auto mb-4 rounded-full bg-black/40 px-3 py-1 text-[10px] text-zinc-300 font-medium backdrop-blur-xs">
            Tujuan: {displayRecipient}
          </div>

          <div className="self-end max-w-[85%] sm:max-w-[78%]">
            <div className="relative rounded-2xl rounded-tr-xs bg-[#2b5278] p-3.5 text-white shadow-md space-y-2">
              {/* Media Photo */}
              {mediaUrl && (
                <div className="overflow-hidden rounded-xl bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl}
                    alt="Telegram Attachment"
                    className="max-h-48 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Message Body with Parse Mode indication */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                {messageText ? (
                  parseMode === "HTML" ? (
                    <span>{messageText}</span>
                  ) : (
                    <span className="font-mono text-xs">{messageText}</span>
                  )
                ) : (
                  <span className="italic text-zinc-300 opacity-70">
                    Ketik pesan untuk bot Telegram...
                  </span>
                )}
              </div>

              {/* Parse Mode indicator tag & Timestamp */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-sky-200/70 border-t border-white/10 pt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                  Mode: {parseMode}
                </span>
                <div className="flex items-center gap-1">
                  <span>{timeStr}</span>
                  <Check className="size-3 text-sky-300" />
                </div>
              </div>

              {/* Simulated Inline Keyboard */}
              <div className="pt-1.5 grid grid-cols-2 gap-1 border-t border-white/10">
                <button
                  type="button"
                  className="py-1 px-2 rounded bg-white/15 hover:bg-white/20 text-white text-[11px] font-semibold text-center truncate"
                >
                  🚀 Buka Web
                </button>
                <button
                  type="button"
                  className="py-1 px-2 rounded bg-white/15 hover:bg-white/20 text-white text-[11px] font-semibold text-center truncate"
                >
                  ℹ️ Bantuan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
