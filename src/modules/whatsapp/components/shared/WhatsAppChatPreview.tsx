"use client";

import React from "react";
import {
  User,
  Smartphone,
  Check,
  FileText,
  MapPin,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";
import { formatDisplayPhone } from "@/lib/phone";

interface WhatsAppChatPreviewProps {
  recipientName?: string;
  recipientPhone?: string;
  deviceName?: string;
  messageText?: string;
  activeTab?: "chat" | "image" | "location" | "file";
  mediaUrl?: string;
  fileName?: string;
  locationAddress?: string;
}

export function WhatsAppChatPreview({
  recipientName = "Recipient",
  recipientPhone,
  deviceName,
  messageText = "",
  activeTab = "chat",
  mediaUrl,
  fileName,
  locationAddress,
}: WhatsAppChatPreviewProps) {
  const { t } = useI18n();
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const displayName = recipientPhone
    ? formatDisplayPhone(recipientPhone)
    : recipientName;

  return (
    <div className="space-y-4">
      {/* Container Title */}
      <h3 className="text-base sm:text-lg font-bold text-foreground">
        {t("whatsapp.messagesPreviewTitle")}{" "}
        <span className="text-xs sm:text-sm font-normal text-muted-foreground">
          {t("whatsapp.messagesPreviewChat")}
        </span>
      </h3>

      {/* WhatsApp Window Card */}
      <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs sm:rounded-3xl">
        {/* WhatsApp Top Header */}
        <div className="flex items-center justify-between bg-[#008069] dark:bg-[#1f2c34] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
              <User className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-white line-clamp-1">
                {displayName}
              </p>
              <p className="text-[11px] text-emerald-100 dark:text-emerald-300">
                {t("whatsapp.messagesOnline")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Video className="size-4 hover:text-white cursor-pointer transition-colors" />
            <Phone className="size-4 hover:text-white cursor-pointer transition-colors" />
            <MoreVertical className="size-4 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        {/* WhatsApp Chat Canvas */}
        <div
          className="relative min-h-65 p-4 flex flex-col justify-end bg-[#efeae2] dark:bg-[#0b141a] transition-colors"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.02) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          {/* Outgoing Message Bubble */}
          <div className="self-end max-w-[85%] sm:max-w-[78%]">
            <div className="relative rounded-2xl rounded-tr-xs bg-[#d9fdd3] dark:bg-[#005c4b] p-3 text-zinc-900 dark:text-zinc-100 shadow-xs">
              {/* Media Preview: Image */}
              {activeTab === "image" && mediaUrl && (
                <div className="mb-2 overflow-hidden rounded-xl border border-black/5 bg-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl}
                    alt="Media preview"
                    className="max-h-48 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Media Preview: File / Document */}
              {activeTab === "file" && (
                <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-black/5 dark:bg-white/10 p-2.5 text-xs">
                  <FileText className="size-5 text-red-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">
                      {fileName || "Document.pdf"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t("whatsapp.messagesPdfDocument")}
                    </p>
                  </div>
                </div>
              )}

              {/* Media Preview: Location */}
              {activeTab === "location" && locationAddress && (
                <div className="mb-2 flex items-start gap-2 rounded-xl bg-black/5 dark:bg-white/10 p-2 text-xs">
                  <MapPin className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{locationAddress}</p>
                </div>
              )}

              {/* Message Text */}
              {messageText ? (
                <p className="text-sm whitespace-pre-wrap wrap-break-words leading-relaxed text-zinc-800 dark:text-zinc-100">
                  {messageText}
                </p>
              ) : (
                <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
                  {t("whatsapp.messagesPreviewEmpty")}
                </p>
              )}

              {/* Timestamp & Sent Checkmark */}
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-zinc-500 dark:text-zinc-300">
                <span>{timeStr}</span>
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Status Widget */}
      <div className="border-border bg-surface rounded-2xl border p-4 shadow-xs space-y-2.5 sm:rounded-3xl">
        <p className="text-foreground-secondary text-xs font-semibold uppercase tracking-wider">
          {t("whatsapp.messagesStatusTitle")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {/* Recipient Badge */}
          <Badge
            variant="neutral"
            className="h-6 px-2.5 py-1 text-xs gap-1.5 rounded-full"
          >
            <User className="size-3 text-muted-foreground" />
            <span>
              {t("whatsapp.messagesStatusTo")}{" "}
              {recipientPhone
                ? formatDisplayPhone(recipientPhone)
                : t("whatsapp.messagesStatusNotSelected")}
            </span>
          </Badge>

          {/* Device Badge */}
          <Badge
            variant={deviceName ? "wise" : "neutral"}
            className="h-6 px-2.5 py-1 text-xs gap-1.5 rounded-full"
          >
            <Smartphone className="size-3" />
            <span>
              {deviceName || t("whatsapp.messagesStatusSelectDevice")}
            </span>
          </Badge>
        </div>
      </div>
    </div>
  );
}
