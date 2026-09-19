"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SendHorizontal, ScrollText } from "lucide-react";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { OmnichannelChannelType } from "../types/omnichannel.types";
import { useOmnichannelSenders } from "../hooks/useOmnichannelSenders";
import { OmnichannelComposer } from "../components/OmnichannelComposer";
import { OmnichannelChatPreview } from "../components/OmnichannelChatPreview";

export function OmnichannelMessagesView() {
  const { t } = useI18n();
  // Active Channel for composer & preview
  const [selectedChannel, setSelectedChannel] =
    useState<OmnichannelChannelType>("WHATSMEOW_UNOFFICIAL");

  // Live preview synchronization state
  const [previewText, setPreviewText] = useState<string>("");
  const [previewRecipient, setPreviewRecipient] = useState<string>("");
  const [previewSenderName, setPreviewSenderName] = useState<string>("");
  const [previewSenderId, setPreviewSenderId] = useState<string>("");
  const [previewMessageType, setPreviewMessageType] = useState<
    "chat" | "image" | "file" | "location" | "photo" | "document"
  >("chat");
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string>("");
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [previewLocation, setPreviewLocation] = useState<string>("");

  // WABA specific preview state
  const [wabaMode, setWabaMode] = useState<"session_text" | "template_hsm">(
    "session_text",
  );
  const [templateName, setTemplateName] = useState<string>("order_confirmation");
  const [templateParams, setTemplateParams] = useState<Record<string, string>>({
    "1": "Budi",
    "2": "INV-2026-001",
  });

  // Telegram specific preview state
  const [telegramParseMode, setTelegramParseMode] = useState<
    "HTML" | "MarkdownV2" | "Markdown"
  >("HTML");
  const [telegramSilent, setTelegramSilent] = useState<boolean>(false);

  // Omnichannel Senders Hook
  const {
    isLoading: isLoadingSenders,
    sendersByChannel,
    activeCounts,
    refreshSenders,
  } = useOmnichannelSenders();

  const handleMessageSuccess = () => {
    refreshSenders();
  };

  const handleSenderChange = (name: string, identifier?: string) => {
    setPreviewSenderName(name);
    setPreviewSenderId(identifier || "");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
              <SendHorizontal className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl flex items-center gap-2">
              <span>{t("omnichannel.messages.title")}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold py-0.5 px-2 rounded-full bg-wise-green/20 text-dark-green dark:text-wise-green">
                {t("omnichannel.messages.badge")}
              </span>
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("omnichannel.messages.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/wa/logs"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors dark:bg-[#161715]"
          >
            <ScrollText className="size-3.5 text-foreground-muted" />
            <span>{t("omnichannel.messages.logLink")}</span>
          </Link>
        </div>
      </div>

      {/* Main Workstation: Composer (7 cols) + Live Chat Preview (5 cols, sticky) */}
      <ErrorBoundary fallbackTitle={t("omnichannel.messages.composerError")}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Dynamic Composer */}
          <div className="lg:col-span-7">
            <OmnichannelComposer
              selectedChannel={selectedChannel}
              onChannelChange={setSelectedChannel}
              sendersByChannel={sendersByChannel}
              activeCounts={activeCounts}
              isLoadingSenders={isLoadingSenders}
              onMessageChange={setPreviewText}
              onRecipientChange={setPreviewRecipient}
              onSenderChange={handleSenderChange}
              onMessageTypeChange={setPreviewMessageType}
              onMediaUrlChange={setPreviewMediaUrl}
              onFileNameChange={setPreviewFileName}
              onLocationChange={setPreviewLocation}
              onWabaModeChange={setWabaMode}
              onTemplateNameChange={setTemplateName}
              onTemplateParamsChange={setTemplateParams}
              onTelegramParseModeChange={setTelegramParseMode}
              onTelegramSilentChange={setTelegramSilent}
              onSuccess={handleMessageSuccess}
            />
          </div>

          {/* Right Column: Adaptive Live Chat Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <OmnichannelChatPreview
                channelType={selectedChannel}
                recipient={previewRecipient}
                senderName={previewSenderName}
                senderIdentifier={previewSenderId}
                messageText={previewText}
                messageType={previewMessageType}
                mediaUrl={previewMediaUrl}
                fileName={previewFileName}
                locationAddress={previewLocation}
                wabaMode={wabaMode}
                templateName={templateName}
                templateParams={templateParams}
                parseMode={telegramParseMode}
                disableNotification={telegramSilent}
              />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default OmnichannelMessagesView;
