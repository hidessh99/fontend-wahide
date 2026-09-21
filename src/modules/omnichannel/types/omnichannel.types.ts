import { z } from "zod";
import { isValidE164 } from "@/lib/phone";

export type OmnichannelChannelType =
  | "WHATSMEOW_UNOFFICIAL"
  | "META_WABA_OFFICIAL"
  | "TELEGRAM_BOT";

export interface ChannelMeta {
  id: OmnichannelChannelType;
  label: string;
  badge: string;
  description: string;
  iconName: "Smartphone" | "Building2" | "Send";
  colorClass: string;
}

export const CHANNEL_CONFIGS: Record<OmnichannelChannelType, ChannelMeta> = {
  WHATSMEOW_UNOFFICIAL: {
    id: "WHATSMEOW_UNOFFICIAL",
    label: "WhatsApp Web",
    badge: "WA Web",
    description: "Koneksi multi-device WhatsApp Web via scan QR / pairing phone",
    iconName: "Smartphone",
    colorClass: "emerald",
  },
  META_WABA_OFFICIAL: {
    id: "META_WABA_OFFICIAL",
    label: "Meta WABA",
    badge: "Official",
    description: "Meta WhatsApp Business Cloud API dengan Verified Badge",
    iconName: "Building2",
    colorClass: "sky",
  },
  TELEGRAM_BOT: {
    id: "TELEGRAM_BOT",
    label: "Telegram Bot",
    badge: "Bot Engine",
    description: "Telegram Bot API dengan webhook latency < 10ms",
    iconName: "Send",
    colorClass: "blue",
  },
};

export interface UnifiedSender {
  id: string;
  channelType: OmnichannelChannelType;
  displayName: string;
  identifier: string; // phone number or @botusername or JID
  status: "ACTIVE" | "INACTIVE" | "WARMUP" | "HIBERNATED";
  badgeText?: string;
  qualityRating?: string;
  messagingTier?: string;
  dailySentCount?: number;
  maxDailyLimit?: number;
}

export interface OmnichannelActiveCounts {
  waWeb: number;
  waba: number;
  telegram: number;
  total: number;
}

// Zod Schemas for Omnichannel Composer
export const WhatsAppWebComposeSchema = z.object({
  channelType: z.literal("WHATSMEOW_UNOFFICIAL"),
  deviceId: z.string().min(1, "Silakan pilih perangkat WhatsApp aktif"),
  recipientPhone: z.string().refine(isValidE164, "Nomor tujuan tidak valid (standar E.164, 7-15 digit)"),
  messageType: z.enum(["chat", "image", "file", "location"]),
  messageText: z.string().max(4096, "Maksimal 4096 karakter").optional(),
  mediaUrl: z.string().url("Format URL media tidak valid").optional().or(z.literal("")),
  fileName: z.string().max(100).optional(),
  locationAddress: z.string().max(255).optional(),
  simulateTyping: z.boolean().default(true),
  parseSpintax: z.boolean().default(true),
});

export const MetaWABAComposeSchema = z.object({
  channelType: z.literal("META_WABA_OFFICIAL"),
  wabaAccountId: z.string().min(1, "Silakan pilih nomor resmi WABA"),
  recipientPhone: z.string().refine(isValidE164, "Nomor tujuan tidak valid (standar E.164, 7-15 digit)"),
  mode: z.enum(["session_text", "template_hsm"]),
  messageText: z.string().max(4096).optional(),
  templateName: z.string().optional(),
  templateParams: z.record(z.string(), z.string()).optional(),
  mediaUrl: z.string().url("Format URL media tidak valid").optional().or(z.literal("")),
});

export const TelegramComposeSchema = z.object({
  channelType: z.literal("TELEGRAM_BOT"),
  botId: z.string().min(1, "Silakan pilih bot Telegram aktif"),
  chatId: z.string().regex(/^-?\d+$/, "Chat ID harus berupa ID numerik (contoh: 123456789 atau -100123456789)"),
  messageType: z.enum(["text", "photo", "document"]),
  text: z.string().max(4096, "Maksimal 4096 karakter").optional(),
  parseMode: z.enum(["HTML", "MarkdownV2", "Markdown"]).default("HTML"),
  mediaUrl: z.string().url("Format URL media tidak valid").optional().or(z.literal("")),
  caption: z.string().max(1024).optional(),
  disableWebPagePreview: z.boolean().default(false),
  disableNotification: z.boolean().default(false),
});

export interface UnifiedMessageLog {
  id: string;
  channelType: OmnichannelChannelType;
  senderName: string;
  senderIdentifier: string;
  recipient: string;
  direction: "INBOUND" | "OUTBOUND";
  messageBody: string;
  mediaUrl?: string;
  status: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED" | "QUEUED";
  errorMessage?: string;
  createdAt: string;
  sentAt?: string;
}

export interface OmnichannelStats {
  totalMessages: number;
  sentCount: number;
  failedCount: number;
  successRate: number;
  byChannel: {
    waWeb: { total: number; sent: number; failed: number };
    waba: { total: number; sent: number; failed: number };
    telegram: { total: number; sent: number; failed: number };
  };
}
