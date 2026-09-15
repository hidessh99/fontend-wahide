"use client";

import React, { useState } from "react";
import { MessageStatsCards } from "../../components/user/MessageStatsCards";
import { MessageListTable } from "../../components/user/MessageListTable";
import { ComposeMessageCard } from "../../components/user/ComposeMessageCard";
import { WhatsAppChatPreview } from "../../components/shared/WhatsAppChatPreview";
import { useMessageLogs } from "@/modules/campaign/hooks/useMessageLogs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { MessageSquare, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function WhatsAppUserMessagesView() {
  const { t } = useI18n();
  const [activeViewTab, setActiveViewTab] = useState<"chats" | "compose">(
    "chats",
  );

  const [previewText, setPreviewText] = useState<string>("");
  const [previewRecipient, setPreviewRecipient] = useState<string>("");
  const [previewDevice, setPreviewDevice] = useState<string>("");
  const [previewTab, setPreviewTab] = useState<
    "chat" | "image" | "location" | "file"
  >("chat");
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string>("");
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [previewLocation, setPreviewLocation] = useState<string>("");

  const {
    logs,
    total,
    page,
    setPage,
    pageSize,
    isLoading,
    fetchLogs,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useMessageLogs(1, 20);

  const failedCount = logs.filter(
    (l) => l.status?.toUpperCase() === "FAILED",
  ).length;

  const handleMessageSuccess = () => {
    fetchLogs();
    setActiveViewTab("chats");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      <Tabs
        value={activeViewTab}
        onValueChange={(val) => setActiveViewTab(val as "chats" | "compose")}
        className="space-y-6"
      >
        <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
                <MessageSquare className="size-4 sm:size-5" />
              </div>
              <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                {t("whatsapp.messagesChatsTitle")}
              </h1>
            </div>
            <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
              {t("whatsapp.messagesChatsSubtitle")}
            </p>
          </div>

          <TabsList className="bg-muted border-border h-auto w-full grid grid-cols-2 rounded-full border p-1 sm:w-auto sm:flex">
            <TabsTrigger
              value="chats"
              className="data-active:bg-surface data-active:text-foreground cursor-pointer justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition data-active:shadow-sm sm:py-1.5 dark:data-active:bg-[#161715]"
            >
              <MessageSquare className="size-3.5" />
              <span>{t("whatsapp.messagesTabChats")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="compose"
              className="data-active:bg-surface data-active:text-foreground cursor-pointer justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition data-active:shadow-sm sm:py-1.5 dark:data-active:bg-[#161715]"
            >
              <Send className="size-3.5" />
              <span>{t("whatsapp.messagesTabCompose")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="chats"
          className="space-y-6 focus-visible:outline-none"
        >
          <ErrorBoundary fallbackTitle={t("whatsapp.messagesErrorLoadHistory")}>
            <MessageStatsCards
              total={total}
              failedCount={failedCount}
              isLoading={isLoading}
            />

            <MessageListTable
              logs={logs}
              total={total}
              page={page}
              pageSize={pageSize}
              isLoading={isLoading}
              onPageChange={(p) => setPage(p)}
              onNewMessage={() => setActiveViewTab("compose")}
              onRefresh={fetchLogs}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent
          value="compose"
          className="space-y-6 focus-visible:outline-none"
        >
          <ErrorBoundary
            fallbackTitle={t("whatsapp.messagesErrorLoadComposer")}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ComposeMessageCard
                  onMessageChange={setPreviewText}
                  onRecipientChange={setPreviewRecipient}
                  onDeviceChange={setPreviewDevice}
                  onTabChange={setPreviewTab}
                  onMediaUrlChange={setPreviewMediaUrl}
                  onFileNameChange={setPreviewFileName}
                  onLocationChange={setPreviewLocation}
                  onSuccess={handleMessageSuccess}
                />
              </div>

              <div className="lg:col-span-5">
                <div className="sticky top-6">
                  <WhatsAppChatPreview
                    recipientPhone={previewRecipient}
                    deviceName={previewDevice}
                    messageText={previewText}
                    activeTab={previewTab}
                    mediaUrl={previewMediaUrl}
                    fileName={previewFileName}
                    locationAddress={previewLocation}
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

export default WhatsAppUserMessagesView;
