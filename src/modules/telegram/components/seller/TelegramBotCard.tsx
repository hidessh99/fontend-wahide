"use client";

import React from "react";
import {
  Bot,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TelegramBot } from "../../types/telegram.types";

interface TelegramBotCardProps {
  bot: TelegramBot;
  onSync: (id: string) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
  isSyncing?: boolean;
  isDeleting?: boolean;
  disabled?: boolean;
}

export function TelegramBotCard({
  bot,
  onSync,
  onDelete,
  isSyncing = false,
  isDeleting = false,
  disabled = false,
}: TelegramBotCardProps) {
  return (
    <div className="bg-surface border-border flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-150 hover:shadow-md dark:bg-[#151614]">
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
          onClick={() => onSync(bot.id)}
          disabled={isSyncing || disabled}
          className="text-xs font-semibold h-8 rounded-full"
        >
          <RefreshCw className={`mr-1.5 size-3 ${isSyncing ? "animate-spin" : ""}`} />
          <span>Sync Webhook</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(bot.id, bot.name)}
          disabled={isDeleting || disabled}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 text-xs h-8 rounded-full"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
