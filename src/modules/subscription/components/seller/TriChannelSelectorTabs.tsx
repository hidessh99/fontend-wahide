"use client";

import React from "react";
import { SubscriptionChannel } from "../../types/subscription.types";
import { Smartphone, ShieldCheck, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n/context";

interface TriChannelSelectorTabsProps {
  activeChannel: SubscriptionChannel;
  onSelectChannel: (channel: SubscriptionChannel) => void;
}

export function TriChannelSelectorTabs({
  activeChannel,
  onSelectChannel,
}: TriChannelSelectorTabsProps) {
  const { t } = useI18n();

  const channels: Array<{
    id: SubscriptionChannel;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    activeBg: string;
  }> = [
    {
      id: "WHATSMEOW_UNOFFICIAL",
      label: t("subscription.channels.whatsmeow"),
      sublabel: t("subscription.channels.whatsmeowSubtitle"),
      icon: Smartphone,
      accentColor: "text-emerald-700 dark:text-emerald-400",
      activeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300",
    },
    {
      id: "META_WABA_OFFICIAL",
      label: t("subscription.channels.waba"),
      sublabel: t("subscription.channels.wabaSubtitle"),
      icon: ShieldCheck,
      accentColor: "text-blue-700 dark:text-blue-400",
      activeBg: "bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300",
    },
    {
      id: "TELEGRAM_BOT",
      label: t("subscription.channels.telegram"),
      sublabel: t("subscription.channels.telegramSubtitle"),
      icon: Bot,
      accentColor: "text-sky-700 dark:text-sky-400",
      activeBg: "bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-300",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          {t("subscription.channels.title")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {channels.map((ch) => {
          const Icon = ch.icon;
          const isActive = activeChannel === ch.id;

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChannel(ch.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer shadow-2xs",
                isActive
                  ? cn("border-2 shadow-xs", ch.activeBg)
                  : "border-border/70 bg-card hover:bg-muted/50 hover:border-border text-foreground-secondary",
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-background/80 shadow-2xs"
                    : "bg-muted text-foreground-muted group-hover:text-foreground",
                  isActive && ch.accentColor,
                )}
              >
                <Icon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-bold truncate",
                      isActive ? "text-foreground" : "text-foreground-secondary",
                    )}
                  >
                    {ch.label}
                  </span>
                </div>
                <p className="text-[11px] text-foreground-muted truncate">
                  {ch.sublabel}
                </p>
              </div>

              {isActive && (
                <div className="absolute right-3 top-3 size-2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
