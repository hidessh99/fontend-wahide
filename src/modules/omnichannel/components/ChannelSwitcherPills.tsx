"use client";

import React from "react";
import { Smartphone, Building2, Send, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import {
  OmnichannelChannelType,
  CHANNEL_CONFIGS,
  OmnichannelActiveCounts,
} from "../types/omnichannel.types";

interface ChannelSwitcherPillsProps {
  selectedChannel: OmnichannelChannelType | "ALL";
  onSelectChannel: (channel: OmnichannelChannelType | "ALL") => void;
  counts?: OmnichannelActiveCounts;
  includeAllOption?: boolean;
  className?: string;
  size?: "sm" | "md";
}

interface ChannelColorConfig {
  activeButton: string;
  activeIcon: string;
  activeCount: string;
  activeBadge: string;
  inactiveIcon: string;
  inactiveBadge: string;
}

const CHANNEL_STYLE_MAP: Record<OmnichannelChannelType | "ALL", ChannelColorConfig> = {
  WHATSMEOW_UNOFFICIAL: {
    activeButton:
      "bg-emerald-600 dark:bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/60 scale-[1.02]",
    activeIcon: "text-white",
    activeCount: "bg-white/20 text-white",
    activeBadge: "bg-white/20 text-white border-transparent",
    inactiveIcon: "text-emerald-600 dark:text-emerald-400",
    inactiveBadge:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  META_WABA_OFFICIAL: {
    activeButton:
      "bg-blue-600 dark:bg-blue-600 text-white font-black shadow-md shadow-blue-600/25 ring-2 ring-blue-500/60 scale-[1.02]",
    activeIcon: "text-white",
    activeCount: "bg-white/20 text-white",
    activeBadge: "bg-white/20 text-white border-transparent",
    inactiveIcon: "text-blue-600 dark:text-blue-400",
    inactiveBadge:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
  },
  TELEGRAM_BOT: {
    activeButton:
      "bg-sky-500 dark:bg-sky-500 text-white font-black shadow-md shadow-sky-500/25 ring-2 ring-sky-400/60 scale-[1.02]",
    activeIcon: "text-white",
    activeCount: "bg-white/20 text-white",
    activeBadge: "bg-white/20 text-white border-transparent",
    inactiveIcon: "text-sky-500 dark:text-sky-400",
    inactiveBadge:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20",
  },
  ALL: {
    activeButton:
      "bg-wise-green text-dark-green font-black shadow-md shadow-wise-green/25 ring-2 ring-wise-green/60 scale-[1.02]",
    activeIcon: "text-dark-green",
    activeCount: "bg-dark-green/20 text-dark-green",
    activeBadge: "bg-dark-green/20 text-dark-green border-transparent",
    inactiveIcon: "text-foreground-muted",
    inactiveBadge: "bg-muted text-foreground-muted border border-border/40",
  },
};

export function ChannelSwitcherPills({
  selectedChannel,
  onSelectChannel,
  counts,
  includeAllOption = false,
  className,
  size = "md",
}: ChannelSwitcherPillsProps) {
  const { t } = useI18n();
  const options: Array<{
    id: OmnichannelChannelType | "ALL";
    label: string;
    badgeText?: string;
    count?: number;
    icon: React.ComponentType<{ className?: string }>;
  }> = [];

  if (includeAllOption) {
    options.push({
      id: "ALL",
      label: t("common.allFilter") || "Semua Saluran",
      count: counts?.total,
      icon: Layers,
    });
  }

  options.push({
    id: "WHATSMEOW_UNOFFICIAL",
    label: t("omnichannel.channels.waWeb") || CHANNEL_CONFIGS.WHATSMEOW_UNOFFICIAL.label,
    badgeText: t("omnichannel.channels.waWebBadge") || CHANNEL_CONFIGS.WHATSMEOW_UNOFFICIAL.badge,
    count: counts?.waWeb,
    icon: Smartphone,
  });

  options.push({
    id: "META_WABA_OFFICIAL",
    label: t("omnichannel.channels.waba") || CHANNEL_CONFIGS.META_WABA_OFFICIAL.label,
    badgeText: t("omnichannel.channels.wabaBadge") || CHANNEL_CONFIGS.META_WABA_OFFICIAL.badge,
    count: counts?.waba,
    icon: Building2,
  });

  options.push({
    id: "TELEGRAM_BOT",
    label: t("omnichannel.channels.telegram") || CHANNEL_CONFIGS.TELEGRAM_BOT.label,
    badgeText: t("omnichannel.channels.telegramBadge") || CHANNEL_CONFIGS.TELEGRAM_BOT.badge,
    count: counts?.telegram,
    icon: Send,
  });

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 rounded-2xl bg-muted/60 dark:bg-muted/30 p-1.5 border border-border/80 shadow-xs",
        className,
      )}
      role="tablist"
      aria-label={t("omnichannel.composer.channelTab")}
    >
      {options.map((opt) => {
        const isSelected = selectedChannel === opt.id;
        const IconComponent = opt.icon;
        const styleConfig = CHANNEL_STYLE_MAP[opt.id];

        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectChannel(opt.id)}
            className={cn(
              "group relative flex items-center gap-2 rounded-xl transition-all duration-200 cursor-pointer select-none active:scale-95",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm",
              isSelected
                ? styleConfig.activeButton
                : "font-semibold text-foreground-secondary hover:text-foreground hover:bg-surface/80 dark:hover:bg-zinc-800/80 border border-transparent",
            )}
          >
            {/* Channel Icon */}
            <IconComponent
              className={cn(
                "transition-transform duration-200 group-hover:scale-110",
                size === "sm" ? "size-3.5" : "size-4",
                isSelected ? styleConfig.activeIcon : styleConfig.inactiveIcon,
              )}
            />

            {/* Label */}
            <span>{opt.label}</span>

            {/* Optional Count Badge */}
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-extrabold transition-colors",
                  isSelected
                    ? styleConfig.activeCount
                    : "bg-muted/80 text-foreground-muted",
                )}
              >
                {opt.count}
              </span>
            )}

            {/* Official / Badge indicator */}
            {opt.badgeText && size !== "sm" && (
              <span
                className={cn(
                  "hidden sm:inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black transition-colors",
                  isSelected ? styleConfig.activeBadge : styleConfig.inactiveBadge,
                )}
              >
                {opt.badgeText}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
