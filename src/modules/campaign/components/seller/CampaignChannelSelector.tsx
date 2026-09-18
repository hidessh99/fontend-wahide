"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Smartphone, ShieldCheck, Bot, CheckCircle2, AlertCircle } from "lucide-react";
import { CampaignChannelType } from "../../types/campaign.types";
import { OmnichannelActiveCounts } from "@/modules/omnichannel/types/omnichannel.types";

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
      title: "WhatsApp Web (Socket)",
      description: "Siaran massal via nomor handphone fisik terhubung. Dilengkapi multi-device pooling & proteksi anti-ban.",
      badge: "Socket QR",
      icon: Smartphone,
      count: activeCounts.waWeb,
      activeText: `${activeCounts.waWeb} HP Terhubung`,
      colorScheme: "emerald",
      recommendedFor: "Pesan personal, promo harian, dan obrolan kasual",
    },
    {
      id: "META_WABA_OFFICIAL",
      title: "WhatsApp Official (WABA)",
      description: "Jalur resmi Meta Cloud API dengan centang hijau bisnis. Kecepatan ultra tinggi tanpa resiko blokir nomor.",
      badge: "Official Cloud",
      icon: ShieldCheck,
      count: activeCounts.waba,
      activeText: `${activeCounts.waba} Akun Resmi`,
      colorScheme: "sky",
      recommendedFor: "Siaran skala besar (>1.000 pesan), pengumuman resmi & OTP",
    },
    {
      id: "TELEGRAM_BOT",
      title: "Telegram Bot Broadcast",
      description: "Kirim pesan siaran instan hingga 30 pesan/detik langsung ke pelanggan & channel tanpa biaya transmisi.",
      badge: "100% Gratis",
      icon: Bot,
      count: activeCounts.telegram,
      activeText: `${activeCounts.telegram} Bot Aktif`,
      colorScheme: "blue",
      recommendedFor: "Pemberitahuan komunitas, flash sale, dan buletin gratis",
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
                    Status Pengirim:
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
                          0 Pengirim Aktif
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
