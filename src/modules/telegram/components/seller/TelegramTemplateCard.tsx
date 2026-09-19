"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export interface TelegramTemplateItem {
  id: string;
  name: string;
  category: "NOTIFICATION" | "PROMOTION" | "ALERT";
  parseMode: "HTML" | "MarkdownV2";
  content: string;
  buttons: Array<{ text: string; url?: string; callback_data?: string }>;
}

interface TelegramTemplateCardProps {
  template: TelegramTemplateItem;
}

export function TelegramTemplateCard({ template }: TelegramTemplateCardProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopied(true);
      toast.success(t("telegram.templates.toastCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("telegram.templates.toastCopyFailed"));
    }
  };

  return (
    <div className="bg-surface border-border flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-150 hover:shadow-md dark:bg-[#151614]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-400"
          >
            {template.parseMode}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          >
            {template.category}
          </Badge>
        </div>

        <h3 className="text-foreground text-sm font-bold tracking-tight">
          {template.name}
        </h3>

        {/* Message Bubble Preview */}
        <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
            <Bot className="size-3 text-sky-500" />
            <span>{t("telegram.templates.previewBubble")}</span>
          </div>
          <pre className="font-mono text-xs whitespace-pre-wrap break-words text-foreground bg-surface p-2.5 rounded-lg border border-border/40 dark:bg-[#181917]">
            {template.content}
          </pre>

          {/* Inline Buttons Layout */}
          {template.buttons && template.buttons.length > 0 && (
            <div className="space-y-1 pt-1">
              {template.buttons.map((btn, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 py-1.5 px-3 text-xs font-semibold text-sky-700 dark:text-sky-400 cursor-pointer hover:bg-sky-100/60 dark:hover:bg-sky-950/40 transition"
                >
                  <span>{btn.text}</span>
                  {btn.url && <ExternalLink className="size-3" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-border/60 flex items-center justify-between border-t pt-3 mt-4">
        <span className="text-[11px] text-foreground-muted font-mono">
          {t("telegram.templates.inlineButtonsCount", { count: template.buttons.length })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="text-xs h-8 rounded-full"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 size-3 text-emerald-500" />
              <span>{t("telegram.templates.copied")}</span>
            </>
          ) : (
            <>
              <Copy className="mr-1.5 size-3" />
              <span>{t("telegram.templates.copySyntax")}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
