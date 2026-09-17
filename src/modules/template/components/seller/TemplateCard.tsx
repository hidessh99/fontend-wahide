"use client";

import React, { useState } from "react";
import { Template } from "../../types/template.types";
import {
  Star,
  Copy,
  Check,
  MoreVertical,
  Edit2,
  CopyPlus,
  Trash2,
  Flame,
  Info,
  Bell,
  CalendarCheck,
  MessageSquareReply,
  Image as ImageIcon,
  FileText,
  Send,
  MousePointerClick,
  Bot,
  Smartphone,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n/context";

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onToggleFavorite: (template: Template) => void;
  onSelectForCampaign?: (template: Template) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onSelectForCampaign,
}: TemplateCardProps) {
  const { t } = useI18n();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(template.content);
      setIsCopied(true);
      toast.success(t("template.contentCopied"));
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error(t("template.copyFailed"));
    }
  };

  const getCategoryMeta = () => {
    switch (template.category) {
      case "MARKETING":
        return {
          label: t("template.categories.marketing"),
          icon: Flame,
          variant: "warning" as const,
        };
      case "REMINDER":
        return {
          label: t("template.categories.reminder"),
          icon: Bell,
          variant: "secondary" as const,
        };
      case "RESERVATION":
        return {
          label: t("template.categories.reservation"),
          icon: CalendarCheck,
          variant: "info" as const,
        };
      case "QUICK_REPLY":
        return {
          label: t("template.categories.quickReply"),
          icon: MessageSquareReply,
          variant: "neutral" as const,
        };
      case "UTILITY":
      default:
        return {
          label: t("template.categories.utility"),
          icon: Info,
          variant: "success" as const,
        };
    }
  };

  const catMeta = getCategoryMeta();
  const CatIcon = catMeta.icon;

  // Highlight variables in preview
  const previewParts = template.content.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);

  return (
    <Card className="group relative flex flex-col justify-between p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      {/* Top Bar: Category & Media & Favorite & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={catMeta.variant} className="gap-1 font-semibold">
              <CatIcon className="size-3" />
              {catMeta.label}
            </Badge>

            {/* Channel Indicator Badge */}
            {template.channelType === "TELEGRAM_BOT" ? (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5 font-medium"
              >
                <Bot className="size-3" />
                <span>{t("template.channels.telegram")}</span>
              </Badge>
            ) : template.channelType === "WHATSMEOW_UNOFFICIAL" ? (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 font-medium"
              >
                <Smartphone className="size-3" />
                <span>{t("template.channels.whatsappShort")}</span>
              </Badge>
            ) : template.channelType === "META_WABA_OFFICIAL" ? (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5 font-medium"
              >
                <ShieldCheck className="size-3" />
                <span>{t("template.channels.waba")}</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5 font-medium"
              >
                <Globe className="size-3" />
                <span>{t("template.channels.allShort")}</span>
              </Badge>
            )}

            {template.mediaType !== "NONE" && (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] text-foreground-muted"
              >
                {template.mediaType === "IMAGE" && (
                  <ImageIcon className="size-3" />
                )}
                {template.mediaType === "DOCUMENT" && (
                  <FileText className="size-3" />
                )}
                <span>{template.mediaType}</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Star Favorite Button */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onToggleFavorite(template)}
                    className="hover:text-amber-500 cursor-pointer"
                  />
                }
              >
                <Star
                  className={cn(
                    "size-3.5 transition-colors",
                    template.isFavorite
                      ? "fill-amber-400 text-amber-500"
                      : "text-foreground-muted hover:text-amber-400",
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                {template.isFavorite
                  ? t("template.removeFromFavorites")
                  : t("template.addToFavorites")}
              </TooltipContent>
            </Tooltip>

            {/* Actions Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-foreground-muted hover:text-foreground cursor-pointer"
                  />
                }
              >
                <MoreVertical className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => onEdit(template)}
                  className="cursor-pointer gap-2"
                >
                  <Edit2 className="size-3.5 text-foreground-muted" />
                  <span>{t("actions.edit") || t("template.editTemplate")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicate(template.id)}
                  className="cursor-pointer gap-2"
                >
                  <CopyPlus className="size-3.5 text-foreground-muted" />
                  <span>{t("template.duplicateTemplate")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(template.id, template.name)}
                  className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                  <span>
                    {t("actions.delete") || t("template.deleteTemplate")}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Template Title */}
        <h3 className="mt-2.5 font-semibold text-foreground line-clamp-2 leading-snug wrap-break-words text-sm sm:line-clamp-1 sm:text-base">
          {template.name}
        </h3>

        {/* Content Preview Box */}
        <div className="mt-2 min-h-18 rounded-xl bg-muted/40 p-3 text-xs leading-relaxed text-foreground-secondary line-clamp-4">
          {previewParts.map((part, idx) => {
            const isVar = part.startsWith("{{") && part.endsWith("}}");
            return isVar ? (
              <span
                key={idx}
                className="inline-block rounded bg-primary/15 px-1 py-0.2 font-mono font-medium text-primary text-[11px]"
              >
                {part}
              </span>
            ) : (
              <span key={idx}>{part}</span>
            );
          })}
        </div>

        {/* Interactive Buttons Preview (if any) */}
        {template.buttons && template.buttons.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {template.buttons.map((btn, bIdx) => (
              <Badge
                key={bIdx}
                variant="neutral"
                className="inline-flex items-center gap-1 rounded-md text-[10px] font-medium"
              >
                <MousePointerClick className="size-2.5 shrink-0 text-foreground-muted" />
                <span>{btn.text}</span>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Footer Meta & Quick Action */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-foreground-muted">
        <div className="flex items-center gap-2">
          <span>{t("template.usedCount", { count: template.usageCount })}</span>
          {template.variables && template.variables.length > 0 && (
            <Badge variant="outline" className="text-[10px]">
              {template.variables.length} var
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleCopy}
            className="gap-1 rounded-lg text-[11px] cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="size-3 text-emerald-700 dark:text-emerald-400" />
                <span className="text-emerald-800 dark:text-emerald-400">
                  {t("template.copied")}
                </span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>{t("template.copyBtn")}</span>
              </>
            )}
          </Button>

          {onSelectForCampaign && (
            <Button
              type="button"
              variant="default"
              size="xs"
              onClick={() => onSelectForCampaign(template)}
              className="gap-1 rounded-lg text-[11px] cursor-pointer"
            >
              <Send className="size-3" />
              <span>{t("template.useBtn")}</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
