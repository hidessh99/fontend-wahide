"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { OmnichannelChannelType } from "../types/omnichannel.types";
import { useOmnichannelSenders } from "../hooks/useOmnichannelSenders";
import { useOmnichannelLogs } from "../hooks/useOmnichannelLogs";
import { OmnichannelComposer } from "../components/OmnichannelComposer";
import { OmnichannelChatPreview } from "../components/OmnichannelChatPreview";
import { OmnichannelStatsCards } from "../components/OmnichannelStatsCards";
import { OmnichannelLogsTable } from "../components/OmnichannelLogsTable";

export function OmnichannelMessagesView() {
  const [activeViewTab, setActiveViewTab] = useState<"chats" | "compose">(
    "chats",
  );

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

  // Omnichannel Logs Hook
  const {
    logs,
    total,
    page,
    setPage,
    pageSize,
    isLoading: isLoadingLogs,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    channelFilter,
    setChannelFilter,
    refreshLogs,
    stats,
  } = useOmnichannelLogs(1, 20);

  const handleMessageSuccess = () => {
    refreshLogs();
    refreshSenders();
    setActiveViewTab("chats");
  };

  const handleSenderChange = (name: string, identifier?: string) => {
    setPreviewSenderName(name);
    setPreviewSenderId(identifier || "");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      <Tabs
        value={activeViewTab}
        onValueChange={(val) => setActiveViewTab(val as "chats" | "compose")}
        className="space-y-6"
      >
        {/* Top Header */}
        <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
                <MessageSquare className="size-4 sm:size-5" />
              </div>
              <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl flex items-center gap-2">
                <span>Omnichannel Chats & Messages</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold py-0.5 px-2 rounded-full bg-wise-green/20 text-dark-green dark:text-wise-green">
                  <Sparkles className="size-3" /> Multi-Engine
                </span>
              </h1>
            </div>
            <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
              Kirim pesan langsung 1-on-1 dan pantau riwayat delivery di WhatsApp Web (Unofficial), Meta WABA Official, dan Telegram Bot.
            </p>
          </div>

          <TabsList className="bg-muted border-border h-auto w-full grid grid-cols-2 rounded-full border p-1 sm:w-auto sm:flex">
            <TabsTrigger
              value="chats"
              className="data-active:bg-surface data-active:text-foreground cursor-pointer justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition data-active:shadow-sm sm:py-1.5 dark:data-active:bg-[#161715]"
            >
              <MessageSquare className="size-3.5" />
              <span>Riwayat Pesan</span>
            </TabsTrigger>
            <TabsTrigger
              value="compose"
              className="data-active:bg-surface data-active:text-foreground cursor-pointer justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition data-active:shadow-sm sm:py-1.5 dark:data-active:bg-[#161715]"
            >
              <Send className="size-3.5" />
              <span>Kirim Pesan</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Riwayat Pesan (Chats) */}
        <TabsContent
          value="chats"
          className="space-y-6 focus-visible:outline-none"
        >
          <ErrorBoundary fallbackTitle="Gagal memuat statistik log pesan">
            <OmnichannelStatsCards stats={stats} isLoading={isLoadingLogs} />

            <OmnichannelLogsTable
              logs={logs}
              total={total}
              page={page}
              pageSize={pageSize}
              isLoading={isLoadingLogs}
              channelFilter={channelFilter}
              onChannelFilterChange={setChannelFilter}
              activeCounts={activeCounts}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPageChange={(p) => setPage(p)}
              onNewMessage={() => setActiveViewTab("compose")}
              onRefresh={refreshLogs}
            />
          </ErrorBoundary>
        </TabsContent>

        {/* TAB 2: Kirim Pesan (Compose) */}
        <TabsContent
          value="compose"
          className="space-y-6 focus-visible:outline-none"
        >
          <ErrorBoundary fallbackTitle="Gagal memuat form pengirim pesan">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OmnichannelMessagesView;
