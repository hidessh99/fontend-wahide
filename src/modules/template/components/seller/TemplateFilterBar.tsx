"use client";

import React from "react";
import { TemplateCategory } from "../../types/template.types";
import {
  Star,
  Flame,
  Info,
  Bell,
  CalendarCheck,
  MessageSquareReply,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";

interface TemplateFilterBarProps {
  currentCategory: TemplateCategory | "ALL";
  onSelectCategory: (cat: TemplateCategory | "ALL") => void;
  search: string;
  onSearchChange: (search: string) => void;
  favoriteOnly: boolean;
  onToggleFavoriteOnly: () => void;
  stats?: {
    total: number;
    marketing: number;
    utility: number;
    reminder: number;
    reservation: number;
    quickReply: number;
    favorites: number;
  };
}

export function TemplateFilterBar({
  currentCategory,
  onSelectCategory,
  search,
  onSearchChange,
  favoriteOnly,
  onToggleFavoriteOnly,
  stats,
}: TemplateFilterBarProps) {
  const { t } = useI18n();

  const CATEGORIES: Array<{
    id: TemplateCategory | "ALL";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }> = [
    {
      id: "ALL",
      label: t("template.categories.all"),
      icon: Layers,
      count: stats?.total,
    },
    {
      id: "MARKETING",
      label: t("template.stats.marketing"),
      icon: Flame,
      count: stats?.marketing,
    },
    {
      id: "UTILITY",
      label: t("template.stats.utility"),
      icon: Info,
      count: stats?.utility,
    },
    {
      id: "REMINDER",
      label: t("template.stats.reminder"),
      icon: Bell,
      count: stats?.reminder,
    },
    {
      id: "RESERVATION",
      label: t("template.stats.reservation"),
      icon: CalendarCheck,
      count: stats?.reservation,
    },
    {
      id: "QUICK_REPLY",
      label: t("template.stats.quickReply"),
      icon: MessageSquareReply,
      count: stats?.quickReply,
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Category Pills (1-Row Horizontal Swipeable on Mobile, Wrap on Desktop) */}
      <div className="no-scrollbar -mx-3 flex items-center gap-1.5 overflow-x-auto scroll-smooth px-3 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = currentCategory === cat.id;
          return (
            <Button
              key={cat.id}
              type="button"
              variant={isActive ? "default" : "secondary"}
              size="sm"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "h-8 shrink-0 gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer transition active:scale-95",
                isActive
                  ? "shadow-xs"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className="ml-0.5 h-4 px-1.5 text-[10px]"
                >
                  {cat.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Right Side: Search & Favorite Filter */}
      <div className="flex items-center gap-2">
        <div className="w-full sm:w-64">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            onSearch={onSearchChange}
            onClear={() => onSearchChange("")}
            placeholder={t("template.filter.searchPlaceholder")}
            hideSubmitButton={true}
            className="h-8 text-xs rounded-xl"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleFavoriteOnly}
          className={cn(
            "h-8 gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer",
            favoriteOnly &&
              "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-400",
          )}
          title={t("template.stats.favorites")}
        >
          <Star
            className={cn(
              "size-3.5",
              favoriteOnly
                ? "fill-amber-500 text-amber-500"
                : "text-foreground-muted",
            )}
          />
          <span className="hidden sm:inline">
            {t("template.stats.favorites")}
          </span>
        </Button>
      </div>
    </div>
  );
}
