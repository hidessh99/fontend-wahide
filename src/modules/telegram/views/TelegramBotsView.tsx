"use client";

import React, { useState } from "react";
import { useTelegramBots } from "../hooks/useTelegramBots";
import { ConnectTelegramBotModal } from "../components/ConnectTelegramBotModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty";
import {
  Bot,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
} from "lucide-react";

export function TelegramBotsView() {
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
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await syncWebhook(id);
    setSyncingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin memutuskan bot "${name}"? Webhook Telegram akan otomatis dicabut.`)) {
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
              Telegram Bot Engine
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Kelola bot resmi Telegram, pantau sinkronisasi webhook, dan optimalkan pengiriman notifikasi otomatis.
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
            <span>Muat Ulang</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsConnectModalOpen(true)}
            className="bg-wise-green text-dark-green hover:bg-wise-green/90 text-xs font-bold shadow-sm"
          >
            <Plus className="mr-1.5 size-3.5" />
            <span>Hubungkan Bot</span>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-border rounded-2xl border p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : bots.length === 0 ? (
        <EmptyState
          icon={<Bot className="size-10" />}
          title="Belum Ada Bot Telegram Terhubung"
          description="Hubungkan bot Telegram pertama Anda menggunakan BotFather token untuk mulai mengirimkan pesan dan notifikasi instan."
          action={
            <Button
              size="sm"
              onClick={() => setIsConnectModalOpen(true)}
              className="bg-wise-green text-dark-green hover:bg-wise-green/90 font-bold text-xs"
            >
              <Plus className="mr-1.5 size-3.5" />
              <span>Hubungkan Bot Telegram</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => {
            const isSyncing = syncingId === bot.id;
            const isDeleting = deletingId === bot.id;

            return (
              <div
                key={bot.id}
                className="bg-surface border-border flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-150 hover:shadow-md dark:bg-[#151614]"
              >
                <div className="space-y-4">
                  {/* Top Bar: Bot Profile & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                        <Bot className="size-6" />
                      </div>
                      <div>
                        <h3 className="text-foreground text-sm font-bold tracking-tight">
                          {bot.name}
                        </h3>
                        <a
                          href={`https://t.me/${bot.username}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
                        >
                          <span>@{bot.username}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bot.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      {bot.status}
                    </Badge>
                  </div>

                  {/* Webhook & Rate Limit Indicators */}
                  <div className="border-border/60 rounded-xl border bg-muted/40 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary text-[11px] font-medium">Webhook Status</span>
                      <div className="flex items-center gap-1">
                        {bot.webhook_active ? (
                          <>
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              Aktif & Terhubung
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="size-3.5 text-rose-500" />
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                              Terputus
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary text-[11px] font-medium">Pesan Terkirim Hari Ini</span>
                      <span className="font-mono text-[11px] font-bold text-foreground">
                        {bot.daily_sent_count.toLocaleString()} pesan
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-foreground-secondary text-[11px] font-medium">Proteksi Rate Limit</span>
                      <span className="font-mono text-[11px] font-semibold text-wise-green flex items-center gap-1">
                        <Zap className="size-3" />
                        30 req/s Global
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-border/60 flex items-center justify-between border-t pt-3.5 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(bot.id)}
                    disabled={isSyncing || isActionLoading}
                    className="text-xs font-semibold h-8 rounded-full"
                  >
                    <RefreshCw className={`mr-1.5 size-3 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Sync Webhook</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(bot.id, bot.name)}
                    disabled={isDeleting || isActionLoading}
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 text-xs h-8 rounded-full"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect Bot Dialog */}
      <ConnectTelegramBotModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={connectBot}
        isLoading={isActionLoading}
      />
    </div>
  );
}
