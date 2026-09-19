"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Smartphone, ShieldCheck, Bot, CheckCircle2, AlertCircle } from "lucide-react";
import { CampaignChannelType } from "../../types/campaign.types";
import { OmnichannelActiveCounts } from "@/modules/omnichannel/types/omnichannel.types";
import { useI18n } from "@/lib/i18n/context";

interface CampaignChannelSelectorProps {
  selectedChannel: CampaignChannelType;
  onSelectChannel: (channel: CampaignChannelType) => void;
  activeCounts: OmnichannelActiveCounts;
  className?: string;
}

export function CampaignChannelSelector({
  selectedChannel,
  onSelectChannel,
  activeCounts,
  className,
}: CampaignChannelSelectorProps) {
  const { t } = useI18n();

  const channels: Array<{
    id: CampaignChannelType;
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
      id: "WHATSMEOW_UNOFFICIAL",
      title: t("campaign.channels.waWebTitle"),
      description: t("campaign.channels.waWebDesc"),
      badge: t("campaign.channels.waWebBadge"),
      icon: Smartphone,
      count: activeCounts.waWeb,
      activeText: t("campaign.channels.waWebActive", { count: activeCounts.waWeb }),
      colorScheme: "emerald",
      recommendedFor: t("campaign.channels.waWebRecommended"),
    },
    {
      id: "META_WABA_OFFICIAL",
      title: t("campaign.channels.wabaTitle"),
      description: t("campaign.channels.wabaDesc"),
      badge: t("campaign.channels.wabaBadge"),
      icon: ShieldCheck,
      count: activeCounts.waba,
      activeText: t("campaign.channels.wabaActive", { count: activeCounts.waba }),
      colorScheme: "sky",
      recommendedFor: t("campaign.channels.wabaRecommended"),
    },
    {
      id: "TELEGRAM_BOT",
      title: t("campaign.channels.telegramTitle"),
      description: t("campaign.channels.telegramDesc"),
      badge: t("campaign.channels.telegramBadge"),
      icon: Bot,
      count: activeCounts.telegram,
      activeText: t("campaign.channels.telegramActive", { count: activeCounts.telegram }),
      colorScheme: "blue",
      recommendedFor: t("campaign.channels.telegramRecommended"),
    },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {channels.map((ch) => {
          const isSelected = selectedChannel === ch.id;
          const Icon = ch.icon;
          const hasSenders = ch.count > 0;

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChannel(ch.id)}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-150 cursor-pointer select-none",
                isSelected
                  ? ch.colorScheme === "emerald"
                    ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20 shadow-sm"
                    : ch.colorScheme === "sky"
                      ? "border-sky-500 bg-sky-500/5 ring-2 ring-sky-500/20 shadow-sm"
                      : "border-blue-500 bg-blue-500/5 ring-2 ring-blue-500/20 shadow-sm"
                  : "border-border/70 hover:border-foreground/30 hover:bg-muted/40 bg-surface",
              )}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl",
                      ch.colorScheme === "emerald"
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : ch.colorScheme === "sky"
                          ? "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"
                          : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground-secondary">
                      {ch.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2
                        className={cn(
                          "size-4 shrink-0",
                          ch.colorScheme === "emerald"
                            ? "text-emerald-600"
                            : ch.colorScheme === "sky"
                              ? "text-sky-600"
                              : "text-blue-600",
                        )}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground text-xs font-bold sm:text-sm">
                    {ch.title}
                  </h4>
                  <p className="text-foreground-secondary line-clamp-2 mt-1 text-[11px] leading-relaxed">
                    {ch.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Status Pengirim */}
              <div className="border-border/60 mt-3 border-t pt-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-foreground-secondary font-medium">
                    {t("campaign.channels.senderStatus")}
                  </span>
                  <div className="flex items-center gap-1 font-bold">
                    {hasSenders ? (
                      <>
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span className="text-foreground">{ch.activeText}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="size-3 text-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400">
                          {t("campaign.channels.noSenders")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
