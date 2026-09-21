"use client";

import React, { useState } from "react";
import { useTelegramBots } from "../../hooks/useTelegramBots";
import { ConnectTelegramBotModal } from "../../components/seller/ConnectTelegramBotModal";
import { TelegramBotDetailModal } from "../../components/seller/TelegramBotDetailModal";
import { TelegramBotList } from "../../components/seller/TelegramBotList";
import { TelegramBot } from "../../types/telegram.types";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Bot, Plus, RefreshCw } from "lucide-react";

export function TelegramBotsView() {
  const { t } = useI18n();
  const {
    bots,
    isLoading,
    isActionLoading,
    reload,
    connectBot,
    syncWebhook,
    deleteBot,
  } = useTelegramBots();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<TelegramBot | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await syncWebhook(id);
    setSyncingId(null);
  };

  const handleDetail = (bot: TelegramBot) => {
    setSelectedBot(bot);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        t("telegram.bots.deleteConfirm", { name }),
      )
    ) {
      setDeletingId(id);
      await deleteBot(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <Bot className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("telegram.bots.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("telegram.bots.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => reload()}
            disabled={isLoading}
            className="text-xs font-semibold"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{t("telegram.bots.reload")}</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsConnectModalOpen(true)}
            className="bg-wise-green text-dark-green hover:bg-wise-green/90 text-xs font-bold shadow-sm"
          >
            <Plus className="mr-1.5 size-3.5" />
            <span>{t("telegram.bots.connectBot")}</span>
          </Button>
        </div>
      </div>

      {/* Bot List Grid */}
      <TelegramBotList
        bots={bots}
        isLoading={isLoading}
        onConnectClick={() => setIsConnectModalOpen(true)}
        onSync={handleSync}
        onDelete={handleDelete}
        onDetail={handleDetail}
        syncingId={syncingId}
        deletingId={deletingId}
        isActionLoading={isActionLoading}
      />

      {/* Connect Modal */}
      <ConnectTelegramBotModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={connectBot}
        isLoading={isActionLoading}
      />

      {/* Bot Detail & Webhook Routing Modal */}
      <TelegramBotDetailModal
        bot={selectedBot}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBot(null);
        }}
        onSync={handleSync}
        isSyncing={syncingId === selectedBot?.id}
      />
    </div>
  );
}

export default TelegramBotsView;
