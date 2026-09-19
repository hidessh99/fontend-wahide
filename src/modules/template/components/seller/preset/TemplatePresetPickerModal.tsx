"use client";

import React, { useState } from "react";
import {
  TemplatePreset,
  PresetCategoryFilter,
  getFilteredPresets,
} from "../../../data/templatePresets";
import { TemplateChannelType } from "../../../types/template.types";
import { TemplatePresetCard } from "./TemplatePresetCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplate,
  Search,
  Smartphone,
  Bot,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export interface TemplatePresetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: TemplatePreset) => void;
  lockChannel?: TemplateChannelType;
  initialChannel?: TemplateChannelType | "ALL";
}

const CATEGORY_PILLS: { id: PresetCategoryFilter; labelKey: string; defaultLabel: string }[] = [
  { id: "ALL", labelKey: "template.presets.categories.all", defaultLabel: "Semua" },
  { id: "BLANK", labelKey: "template.presets.categories.blank", defaultLabel: "Blank" },
  { id: "WELCOME", labelKey: "template.presets.categories.welcome", defaultLabel: "Welcome" },
  { id: "OTP", labelKey: "template.presets.categories.otp", defaultLabel: "OTP" },
  { id: "ORDER", labelKey: "template.presets.categories.order", defaultLabel: "Order" },
  { id: "REMINDER", labelKey: "template.presets.categories.reminder", defaultLabel: "Reminder" },
  { id: "NOTIFICATION", labelKey: "template.presets.categories.notification", defaultLabel: "Notification" },
  { id: "PROMO", labelKey: "template.presets.categories.promo", defaultLabel: "Promo" },
  { id: "FEEDBACK", labelKey: "template.presets.categories.feedback", defaultLabel: "Feedback" },
  { id: "SUPPORT", labelKey: "template.presets.categories.support", defaultLabel: "Support" },
];

export function TemplatePresetPickerModal({
  isOpen,
  onClose,
  onSelectPreset,
  lockChannel,
  initialChannel = "ALL",
}: TemplatePresetPickerModalProps) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<PresetCategoryFilter>("ALL");
  const [selectedChannel, setSelectedChannel] = useState<TemplateChannelType | "ALL">(
    lockChannel || initialChannel,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const effectiveChannel = lockChannel || selectedChannel;

  // Filter presets by active category & channel & search query
  const presets = getFilteredPresets(
    activeCategory,
    effectiveChannel === "ALL" ? "WHATSMEOW_UNOFFICIAL" : effectiveChannel,
  ).filter((preset) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      preset.title.toLowerCase().includes(query) ||
      preset.description.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={true}
        className="flex flex-col max-h-[92dvh] w-[96vw] sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl overflow-hidden rounded-3xl p-0 border border-border shadow-2xl bg-surface dark:bg-[#121312] gap-0"
      >
        {/* Modal Header */}
        <div className="shrink-0 p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border/70 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-8 sm:pr-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="size-8 sm:size-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <LayoutTemplate className="size-4 sm:size-5" />
                </div>
                <DialogTitle className="text-lg sm:text-xl font-black tracking-tight text-foreground">
                  {t("template.presets.modalTitle") || "Pilih template"}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-foreground-muted sm:pl-11">
                {t("template.presets.modalSubtitle") ||
                  "Pilih titik awal atau Blank untuk menulis dari awal"}
              </DialogDescription>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="text-foreground-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder={t("template.presets.searchPlaceholder") || "Cari preset template..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs rounded-full bg-muted/40 border-border/70 focus-visible:ring-emerald-500/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Omnichannel Channel Selector (Only visible if channel is not locked) */}
          {!lockChannel && (
            <div className="flex items-center gap-2 pt-1 border-t border-border/50 overflow-x-auto scrollbar-none flex-nowrap">
              <span className="text-[11px] font-semibold text-foreground-muted shrink-0 mr-1">
                Kanal:
              </span>
              {[
                { id: "WHATSMEOW_UNOFFICIAL", label: "WhatsApp Web", icon: Smartphone },
                { id: "TELEGRAM_BOT", label: "Telegram Bot", icon: Bot },
                { id: "META_WABA_OFFICIAL", label: "Meta WABA", icon: ShieldCheck },
              ].map((ch) => {
                const Icon = ch.icon;
                const isSelected = effectiveChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedChannel(ch.id as TemplateChannelType)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 border whitespace-nowrap",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 hover:bg-muted text-foreground-secondary border-border/60",
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Filter Pills (Horizontal Scrollable, strictly flex-nowrap) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none flex-nowrap -mx-1 px-1">
            {CATEGORY_PILLS.map((cat) => {
              const isActive = activeCategory === cat.id;
              const label = t(cat.labelKey) || cat.defaultLabel;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 border whitespace-nowrap",
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-xs"
                      : "bg-surface hover:bg-muted/80 text-foreground-secondary border-border/70 dark:bg-zinc-900/60 hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets Grid Body (Scrollable, 1 col on mobile, 2 on tablet, 3 on desktop, 4 on xl desktop) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 scrollbar-thin">
          {presets.length === 0 ? (
            <div className="py-16 text-center text-foreground-muted space-y-2">
              <Sparkles className="size-9 mx-auto text-foreground-muted/60" />
              <p className="text-sm font-semibold text-foreground">{t("template.noMatchingPresets")}</p>
              <p className="text-xs">{t("template.tryChangeFilters")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5">
              {presets.map((preset) => (
                <TemplatePresetCard
                  key={preset.id}
                  preset={preset}
                  activeChannel={effectiveChannel}
                  onSelect={(p) => {
                    onSelectPreset(p);
                    onClose();
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 sm:px-6 py-3">
          <span className="text-xs text-foreground-muted">
            Menampilkan <strong className="text-foreground">{presets.length}</strong> template preset
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full text-xs cursor-pointer px-4"
          >
            {t("cancel") || "Tutup"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
