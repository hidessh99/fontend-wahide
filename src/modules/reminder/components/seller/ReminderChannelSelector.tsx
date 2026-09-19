"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Smartphone, ShieldCheck, Bot, CheckCircle2, AlertCircle } from "lucide-react";
import { ReminderChannelType } from "../../types/reminder.types";
import { OmnichannelActiveCounts } from "@/modules/omnichannel/types/omnichannel.types";
import { useI18n } from "@/lib/i18n/context";

interface ReminderChannelSelectorProps {
  selectedChannel: ReminderChannelType;
  onSelectChannel: (channel: ReminderChannelType) => void;
  activeCounts: OmnichannelActiveCounts;
  className?: string;
  variant?: "cards" | "pills";
}

export function ReminderChannelSelector({
  selectedChannel,
  onSelectChannel,
  activeCounts,
  className,
  variant = "cards",
}: ReminderChannelSelectorProps) {
  const { t } = useI18n();

  const channels: Array<{
    id: ReminderChannelType;
    title: string;
    description: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    count: number;
    activeText: string;
    colorScheme: "emerald" | "sky" | "blue";
    recommendedFor: string;
  }> = [
    {
      id: "WHATSAPP_WEB",
      title: t("reminder.channels.waWebTitle"),
      description: t("reminder.channels.waWebDesc"),
      badge: t("reminder.channels.waWebBadge"),
      icon: Smartphone,
      count: activeCounts.waWeb,
      activeText: t("reminder.channels.waWebActive", { count: activeCounts.waWeb }),
      colorScheme: "emerald",
      recommendedFor: t("reminder.channels.waWebRecommended"),
    },
    {
      id: "WHATSAPP_OFFICIAL",
      title: t("reminder.channels.wabaTitle"),
      description: t("reminder.channels.wabaDesc"),
      badge: t("reminder.channels.wabaBadge"),
      icon: ShieldCheck,
      count: activeCounts.waba,
      activeText: t("reminder.channels.wabaActive", { count: activeCounts.waba }),
      colorScheme: "sky",
      recommendedFor: t("reminder.channels.wabaRecommended"),
    },
    {
      id: "TELEGRAM",
      title: t("reminder.channels.telegramTitle"),
      description: t("reminder.channels.telegramDesc"),
      badge: t("reminder.channels.telegramBadge"),
      icon: Bot,
      count: activeCounts.telegram,
      activeText: t("reminder.channels.telegramActive", { count: activeCounts.telegram }),
      colorScheme: "blue",
      recommendedFor: t("reminder.channels.telegramRecommended"),
    },
  ];

  if (variant === "pills") {
    return (
      <div className={cn("inline-flex items-center gap-1.5 p-1 rounded-full bg-surface-raised border border-border", className)}>
        {channels.map((ch) => {
          const isSelected = selectedChannel === ch.id;
          const Icon = ch.icon;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChannel(ch.id)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface"
              )}
            >
              <Icon className="size-3.5" />
              <span>{ch.title}</span>
              {ch.count > 0 && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-border text-foreground-muted"
                  )}
                >
                  {ch.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4", className)}>
      {channels.map((ch) => {
        const isSelected = selectedChannel === ch.id;
        const Icon = ch.icon;
        const isAvailable = ch.count > 0;

        return (
          <div
            key={ch.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectChannel(ch.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectChannel(ch.id);
              }
            }}
            className={cn(
              "relative flex flex-col p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer select-none",
              isSelected
                ? ch.colorScheme === "emerald"
                  ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/10"
                  : ch.colorScheme === "sky"
                  ? "border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 shadow-md shadow-sky-500/10"
                  : "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-md shadow-blue-500/10"
                : "border-border/70 hover:border-border bg-card/60 hover:bg-card/90"
            )}
          >
            {/* Header: Icon & Badge */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center transition-colors",
                  isSelected
                    ? ch.colorScheme === "emerald"
                      ? "bg-emerald-500 text-white"
                      : ch.colorScheme === "sky"
                      ? "bg-sky-500 text-white"
                      : "bg-blue-500 text-white"
                    : "bg-surface-raised text-foreground-muted"
                )}
              >
                <Icon className="size-5" />
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                    isSelected
                      ? "bg-surface text-foreground border-border/80 shadow-xs"
                      : "bg-surface-raised text-foreground-muted border-border/50"
                  )}
                >
                  {ch.badge}
                </span>
                {isSelected && (
                  <CheckCircle2
                    className={cn(
                      "size-4.5 shrink-0",
                      ch.colorScheme === "emerald"
                        ? "text-emerald-500"
                        : ch.colorScheme === "sky"
                        ? "text-sky-500"
                        : "text-blue-500"
                    )}
                  />
                )}
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">
              {ch.title}
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2 mb-3">
              {ch.description}
            </p>

            {/* Senders Status */}
            <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0",
                    isAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  )}
                />
                <span
                  className={cn(
                    "font-semibold",
                    isAvailable ? "text-foreground" : "text-amber-600 dark:text-amber-400"
                  )}
                >
                  {ch.activeText}
                </span>
              </div>

              {!isAvailable && (
                <span className="flex items-center gap-1 text-[10px] text-foreground-muted">
                  <AlertCircle className="size-3" />
                  {t("reminder.channels.notReady")}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
