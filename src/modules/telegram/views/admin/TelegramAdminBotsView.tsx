"use client";

import React, { useState } from "react";
import { useTelegramBots } from "../../hooks/useTelegramBots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bot,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Globe,
  Radio,
  Clock,
  Layers,
} from "lucide-react";
import { TelegramBot, TelegramBotStatus } from "../../types/telegram.types";
import { useI18n } from "@/lib/i18n/context";

export function TelegramAdminBotsView() {
  const { t, locale } = useI18n();
  const dateLocale = locale === "en" ? "en-US" : "id-ID";
  const {
    bots,
    isLoading,
    isActionLoading,
    reload: fetchBots,
    syncWebhook,
    deleteBot: disconnectBot,
  } = useTelegramBots();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await syncWebhook(id);
    } finally {
      setSyncingId(null);
    }
  };

  const handleRevoke = async (id: string, name: string) => {
    if (
      !confirm(
        t("admin.telegramBots.confirmRevoke", { name }),
      )
    ) {
      return;
    }
    setRevokingId(id);
    try {
      await disconnectBot(id);
    } finally {
      setRevokingId(null);
    }
  };

  const filteredBots = bots.filter((bot) => {
    const matchesSearch =
      !searchQuery ||
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(bot.bot_id).includes(searchQuery);

    const matchesStatus =
      statusFilter === "ALL" ||
      bot.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate platform metrics
  const totalBots = bots.length;
  const activeBots = bots.filter((b) => b.status === "ACTIVE").length;
  const webhookActiveBots = bots.filter((b) => b.webhook_active).length;
  const totalDailySent = bots.reduce(
    (acc, curr) => acc + (curr.daily_sent_count || 0),
    0,
  );

  const getStatusBadge = (status: TelegramBotStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px] font-bold">
            <CheckCircle2 className="h-2.5 w-2.5" />
            ACTIVE
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[10px] font-bold">
            <Clock className="h-2.5 w-2.5" />
            PAUSED
          </Badge>
        );
      case "REVOKED":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1 text-[10px] font-bold">
            <AlertTriangle className="h-2.5 w-2.5" />
            REVOKED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* 1. Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 sm:size-9">
              <Bot className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("admin.telegramBots.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("admin.telegramBots.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBots()}
            disabled={isLoading || isActionLoading}
            className="border-border/80 text-xs font-semibold rounded-full h-8 px-3"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("admin.telegramBots.reload")}</span>
          </Button>
        </div>
      </div>

      {/* 2. Platform Summary Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Bots */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.telegramBots.statTotalBots")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Bot className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-foreground">
            {isLoading ? <Skeleton className="h-7 w-12" /> : totalBots}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.telegramBots.statTotalBotsDesc")}
          </p>
        </div>

        {/* Active Bots */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.telegramBots.statActiveBots")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-12" /> : activeBots}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.telegramBots.statActiveBotsDesc")}
          </p>
        </div>

        {/* Webhooks Active */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.telegramBots.statHealthyWebhooks")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Globe className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-foreground">
            {isLoading ? <Skeleton className="h-7 w-12" /> : webhookActiveBots}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.telegramBots.statHealthyWebhooksDesc")}
          </p>
        </div>

        {/* Daily Outbound Volume */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.telegramBots.statMessagesToday")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-wise-green/15 text-dark-green dark:text-wise-green">
              <Send className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-foreground">
            {isLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              totalDailySent.toLocaleString(dateLocale)
            )}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.telegramBots.statMessagesTodayDesc")}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-surface border-border flex flex-col gap-3 rounded-2xl border p-4 shadow-xs dark:bg-[#151614] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="text-foreground-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("admin.telegramBots.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border/80 h-9 rounded-full pl-9 text-xs focus-visible:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto">
          {["ALL", "ACTIVE", "PAUSED", "REVOKED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                statusFilter === status
                  ? "bg-rose-600 text-white shadow-2xs dark:bg-rose-600"
                  : "bg-muted/60 text-foreground-secondary hover:text-foreground border border-border/80"
              }`}
            >
              {status === "ALL" ? t("admin.telegramBots.filterAll") : status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Data Table */}
      <div className="bg-surface border-border rounded-2xl border shadow-xs overflow-hidden dark:bg-[#151614]">
        <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2 text-xs font-black text-foreground">
            <Layers className="size-4 text-rose-500" />
            <span>{t("admin.telegramBots.listTitle")}</span>
          </div>
          <span className="text-[11px] font-mono text-foreground-muted">
            {t("admin.telegramBots.showingBots", { count: filteredBots.length })}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredBots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-foreground-muted mb-3">
              <Bot className="size-6" />
            </div>
            <p className="text-sm font-bold text-foreground">
              {t("admin.telegramBots.emptyTitle")}
            </p>
            <p className="text-xs text-foreground-secondary mt-1 max-w-sm">
              {searchQuery
                ? t("admin.telegramBots.emptyDescMatch")
                : t("admin.telegramBots.emptyDescDefault")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b border-border/80 text-foreground-muted font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">{t("admin.telegramBots.colBot")}</th>
                  <th className="py-3.5 px-4">{t("admin.telegramBots.colBotId")}</th>
                  <th className="py-3.5 px-4">{t("admin.telegramBots.colStatus")}</th>
                  <th className="py-3.5 px-4">{t("admin.telegramBots.colWebhook")}</th>
                  <th className="py-3.5 px-4">{t("admin.telegramBots.colSentToday")}</th>
                  <th className="py-3.5 px-4">{t("admin.telegramBots.colLastSync")}</th>
                  <th className="py-3.5 px-4 text-right">{t("admin.telegramBots.colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium text-foreground">
                {filteredBots.map((bot: TelegramBot) => (
                  <tr
                    key={bot.id}
                    className="hover:bg-muted/30 transition-colors duration-150"
                  >
                    {/* Bot Name & Username */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">
                        {bot.name || bot.first_name}
                      </div>
                      <div className="font-mono text-[11px] text-sky-600 dark:text-sky-400 mt-0.5">
                        @{bot.username}
                      </div>
                    </td>

                    {/* Bot ID */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-foreground-secondary">
                      {bot.bot_id}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(bot.status)}
                    </td>

                    {/* Webhook Status */}
                    <td className="py-3.5 px-4 text-[11px]">
                      {bot.webhook_active ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Radio className="size-3" />
                          {t("admin.telegramBots.webhookListening")}
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          {t("admin.telegramBots.webhookInactive")}
                        </span>
                      )}
                    </td>

                    {/* Sent Count */}
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {(bot.daily_sent_count || 0).toLocaleString(dateLocale)}
                    </td>

                    {/* Last Sync */}
                    <td className="py-3.5 px-4 text-[11px] text-foreground-muted">
                      {bot.last_sync_at
                        ? new Date(bot.last_sync_at).toLocaleDateString(dateLocale, {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(bot.id)}
                        disabled={syncingId === bot.id || isActionLoading}
                        className="h-7 px-2 text-[11px] font-semibold rounded-full border-border hover:border-sky-500 text-sky-600 dark:text-sky-400"
                      >
                        <RefreshCw
                          className={`mr-1 size-3 ${syncingId === bot.id ? "animate-spin" : ""}`}
                        />
                        <span>{t("admin.telegramBots.syncBtn")}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(bot.id, bot.name)}
                        disabled={revokingId === bot.id || isActionLoading}
                        className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 font-semibold"
                      >
                        <Trash2 className="mr-1 size-3" />
                        <span>{t("admin.telegramBots.revokeBtn")}</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TelegramAdminBotsView;
