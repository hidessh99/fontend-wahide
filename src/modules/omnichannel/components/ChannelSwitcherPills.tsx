"use client";

import React from "react";
import { Smartphone, Building2, Send, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
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

export function ChannelSwitcherPills({
  selectedChannel,
  onSelectChannel,
  counts,
  includeAllOption = false,
  className,
  size = "md",
}: ChannelSwitcherPillsProps) {
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
      label: "Semua Saluran",
      count: counts?.total,
      icon: Layers,
    });
  }

  options.push({
    id: "WHATSMEOW_UNOFFICIAL",
    label: CHANNEL_CONFIGS.WHATSMEOW_UNOFFICIAL.label,
    badgeText: CHANNEL_CONFIGS.WHATSMEOW_UNOFFICIAL.badge,
    count: counts?.waWeb,
    icon: Smartphone,
  });

  options.push({
    id: "META_WABA_OFFICIAL",
    label: CHANNEL_CONFIGS.META_WABA_OFFICIAL.label,
    badgeText: CHANNEL_CONFIGS.META_WABA_OFFICIAL.badge,
    count: counts?.waba,
    icon: Building2,
  });

  options.push({
    id: "TELEGRAM_BOT",
    label: CHANNEL_CONFIGS.TELEGRAM_BOT.label,
    badgeText: CHANNEL_CONFIGS.TELEGRAM_BOT.badge,
    count: counts?.telegram,
    icon: Send,
  });

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 rounded-2xl bg-muted/60 dark:bg-muted/30 p-1 border border-border/80 shadow-xs",
        className,
      )}
      role="tablist"
      aria-label="Pilih Saluran Pesan"
    >
      {options.map((opt) => {
        const isSelected = selectedChannel === opt.id;
        const IconComponent = opt.icon;

        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectChannel(opt.id)}
            className={cn(
              "group relative flex items-center gap-2 rounded-xl font-bold transition-all duration-200 cursor-pointer select-none",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm",
              isSelected
                ? "bg-surface text-foreground shadow-sm dark:bg-[#1f201d] ring-1 ring-border/80"
                : "text-foreground-secondary hover:text-foreground hover:bg-surface/50",
            )}
          >
            {/* Channel Icon */}
            <IconComponent
              className={cn(
                "transition-transform group-hover:scale-110",
                size === "sm" ? "size-3.5" : "size-4",
                isSelected
                  ? opt.id === "WHATSMEOW_UNOFFICIAL"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : opt.id === "META_WABA_OFFICIAL"
                      ? "text-blue-600 dark:text-blue-400"
                      : opt.id === "TELEGRAM_BOT"
                        ? "text-sky-500 dark:text-sky-400"
                        : "text-wise-green"
                  : "text-foreground-muted",
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
                    ? "bg-muted text-foreground"
                    : "bg-muted/70 text-foreground-muted",
                )}
              >
                {opt.count}
              </span>
            )}

            {/* Official / Badge indicator */}
            {opt.badgeText && size !== "sm" && (
              <span
                className={cn(
                  "hidden sm:inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black",
                  opt.id === "META_WABA_OFFICIAL"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                    : opt.id === "TELEGRAM_BOT"
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                )}
              >
                {opt.badgeText}
              </span>
            )}

            {/* Active Pill Indicator Dot */}
            {isSelected && (
              <span
                className={cn(
                  "absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full",
                  opt.id === "WHATSMEOW_UNOFFICIAL"
                    ? "bg-emerald-500"
                    : opt.id === "META_WABA_OFFICIAL"
                      ? "bg-blue-500"
                      : opt.id === "TELEGRAM_BOT"
                        ? "bg-sky-400"
                        : "bg-wise-green",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
