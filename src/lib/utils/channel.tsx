import React from "react";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Building2, Bot, Mail, MessageSquare } from "lucide-react";

export type NormalizedChannelType =
  | "WHATSAPP_WEB"
  | "META_WABA"
  | "TELEGRAM"
  | "EMAIL"
  | "UNKNOWN";

export function normalizeChannelType(
  rawChannel?: string | null,
): NormalizedChannelType {
  if (!rawChannel) return "WHATSAPP_WEB";
  const ch = rawChannel.trim().toUpperCase();

  if (
    ch === "WHATSMEOW_UNOFFICIAL" ||
    ch === "WHATSAPP" ||
    ch === "WHATSAPP_WEB" ||
    ch === "WA" ||
    ch === "SOCKET"
  ) {
    return "WHATSAPP_WEB";
  }

  if (
    ch === "META_WABA_OFFICIAL" ||
    ch === "WABA" ||
    ch === "WABA_OFFICIAL" ||
    ch === "OFFICIAL"
  ) {
    return "META_WABA";
  }

  if (ch === "TELEGRAM_BOT" || ch === "TELEGRAM" || ch === "TELE") {
    return "TELEGRAM";
  }

  if (ch === "EMAIL") {
    return "EMAIL";
  }

  return "UNKNOWN";
}

export function getChannelLabel(rawChannel?: string | null): string {
  const norm = normalizeChannelType(rawChannel);
  switch (norm) {
    case "WHATSAPP_WEB":
      return "WhatsApp Web";
    case "META_WABA":
      return "Meta WABA";
    case "TELEGRAM":
      return "Telegram Bot";
    case "EMAIL":
      return "Email";
    default:
      return "WhatsApp Web";
  }
}

export function getChannelShortLabel(rawChannel?: string | null): string {
  const norm = normalizeChannelType(rawChannel);
  switch (norm) {
    case "WHATSAPP_WEB":
      return "WA Web";
    case "META_WABA":
      return "Meta WABA";
    case "TELEGRAM":
      return "Telegram";
    case "EMAIL":
      return "Email";
    default:
      return "WA Web";
  }
}

export interface ChannelBadgeProps {
  channelType?: string | null;
  className?: string;
  showIcon?: boolean;
}

export function ChannelBadge({
  channelType,
  className = "",
  showIcon = true,
}: ChannelBadgeProps) {
  const norm = normalizeChannelType(channelType);

  switch (norm) {
    case "WHATSAPP_WEB":
      return (
        <Badge
          variant="outline"
          className={`gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 ${className}`}
        >
          {showIcon && <Smartphone className="size-3 shrink-0" />}
          <span>WA Web</span>
        </Badge>
      );
    case "META_WABA":
      return (
        <Badge
          variant="outline"
          className={`gap-1 border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-700 dark:text-blue-400 ${className}`}
        >
          {showIcon && <Building2 className="size-3 shrink-0" />}
          <span>Meta WABA</span>
        </Badge>
      );
    case "TELEGRAM":
      return (
        <Badge
          variant="outline"
          className={`gap-1 border-sky-500/30 bg-sky-500/10 text-[10px] font-bold text-sky-700 dark:text-sky-400 ${className}`}
        >
          {showIcon && <Bot className="size-3 shrink-0" />}
          <span>Telegram</span>
        </Badge>
      );
    case "EMAIL":
      return (
        <Badge
          variant="outline"
          className={`gap-1 border-purple-500/30 bg-purple-500/10 text-[10px] font-bold text-purple-700 dark:text-purple-400 ${className}`}
        >
          {showIcon && <Mail className="size-3 shrink-0" />}
          <span>Email</span>
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={`gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 ${className}`}
        >
          {showIcon && <MessageSquare className="size-3 shrink-0" />}
          <span>WA Web</span>
        </Badge>
      );
  }
}
