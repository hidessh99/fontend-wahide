"use client";

import React from "react";
import { Send, CheckCheck, CheckCircle2, XCircle, Smartphone, Building2, Bot } from "lucide-react";
import { OmnichannelStats } from "../types/omnichannel.types";

interface OmnichannelStatsCardsProps {
  stats: OmnichannelStats;
  isLoading?: boolean;
}

export function OmnichannelStatsCards({
  stats,
  isLoading = false,
}: OmnichannelStatsCardsProps) {
  const { totalMessages, sentCount, failedCount, successRate, byChannel } = stats;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* 1. Total Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight">
              Total Pesan
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : totalMessages.toLocaleString()}
            </h3>
            {/* Channel breakdown icons */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5" title="WhatsApp Web">
                <Smartphone className="size-3 text-emerald-500" />
                {byChannel.waWeb.total}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5" title="Meta WABA">
                <Building2 className="size-3 text-blue-500" />
                {byChannel.waba.total}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5" title="Telegram">
                <Bot className="size-3 text-sky-400" />
                {byChannel.telegram.total}
              </span>
            </div>
          </div>
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-700">
            <Send className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 2. Delivered / Sent Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight">
              Pesan Terkirim
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : sentCount.toLocaleString()}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground-secondary line-clamp-1 font-medium">
              Berhasil terdistribusi
            </p>
          </div>
          <div className="flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400">
            <CheckCheck className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 3. Delivery Success Rate */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 w-full pr-1 sm:pr-2 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight">
              Tingkat Keberhasilan
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : `${successRate}%`}
            </h3>
            <div className="mt-1 sm:mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-wise-green dark:bg-wise-green transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-700">
            <CheckCircle2 className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 4. Failed Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 w-full pr-1 sm:pr-2 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight">
              Pesan Gagal
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : failedCount.toLocaleString()}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground-secondary font-medium">
              {failedCount > 0 ? "Periksa nomor / kuota" : "Nol kendala pengiriman"}
            </p>
          </div>
          <div className="flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
            <XCircle className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
