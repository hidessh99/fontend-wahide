"use client";

import React from "react";
import { MessageSquare, ShieldCheck, Megaphone, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export type MessageCategory = "ALL" | "DIRECT" | "OTP" | "BROADCAST";

interface MessageCategoryTabsProps {
  activeCategory: MessageCategory;
  onCategoryChange: (category: MessageCategory) => void;
  counts?: Partial<Record<MessageCategory, number>>;
  className?: string;
}

export function MessageCategoryTabs({
  activeCategory,
  onCategoryChange,
  counts,
  className = "",
}: MessageCategoryTabsProps) {
  const { t } = useI18n();

  const categories: {
    id: MessageCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "ALL", label: t("common.all") || "Semua", icon: Layers },
    { id: "DIRECT", label: t("whatsapp.categoryDirect") || "Pesan", icon: MessageSquare },
    { id: "OTP", label: t("whatsapp.categoryOTP") || "OTP", icon: ShieldCheck },
    { id: "BROADCAST", label: t("whatsapp.categoryBroadcast") || "Broadcast", icon: Megaphone },
  ];

  return (
    <div
      className={`border-border/80 bg-muted/60 inline-flex items-center gap-1 rounded-full border p-1 shadow-xs max-w-full overflow-x-auto scrollbar-none ${className}`}
      role="tablist"
      aria-label="Filter kategori pesan"
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const Icon = cat.icon;
        const count = counts?.[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer select-none ${
              isActive
                ? "bg-white text-dark-green shadow-xs dark:bg-wise-green dark:text-dark-green"
                : "text-foreground-secondary hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Icon className={`size-3.5 ${isActive ? "opacity-100" : "opacity-70"}`} />
            <span>{cat.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? "bg-dark-green/10 text-dark-green dark:bg-dark-green/20 dark:text-dark-green"
                    : "bg-muted text-foreground-muted"
                }`}
              >
                {count.toLocaleString()}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default MessageCategoryTabs;
