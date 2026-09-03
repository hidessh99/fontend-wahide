"use client";

import React, { useState } from "react";
import { Campaign } from "../../types/campaign.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import {
  Calendar,
  Clock,
  Smartphone,
  Users,
  ShieldCheck,
  Copy,
  Check,
  Play,
  Pause,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Tag as TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CampaignDetailModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onStartCampaign?: (id: string) => Promise<void>;
  onPauseCampaign?: (id: string) => Promise<void>;
  onResumeCampaign?: (id: string) => Promise<void>;
}

export function CampaignDetailModal({
  isOpen,
  campaign,
  onClose,
  onStartCampaign,
  onPauseCampaign,
  onResumeCampaign,
}: CampaignDetailModalProps) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!campaign) return null;

  const handleCopyMessage = async () => {
    if (!campaign.messageTemplate) return;
    await navigator.clipboard.writeText(campaign.messageTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = () => {
    if (campaign.scheduledAt && campaign.status === "DRAFT") {
      return (
        <Badge variant="warning" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
          <Clock className="size-3" />
          <span>{t("campaign.statusScheduled")}</span>
        </Badge>
      );
    }

    switch (campaign.status) {
      case "RUNNING":
        return (
          <Badge variant="success" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
            <span className="mr-0.5 size-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span>{t("campaign.statusRunning")}</span>
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge variant="warning" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
            <Pause className="size-3" />
            <span>{t("campaign.statusPaused")}</span>
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
            <CheckCircle2 className="size-3" />
            <span>{t("campaign.statusCompleted")}</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="danger" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
            <AlertCircle className="size-3" />
            <span>{t("campaign.statusFailed")}</span>
          </Badge>
        );
      case "DRAFT":
      default:
        return (
          <Badge variant="neutral" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
            <span>{t("campaign.statusDraft")}</span>
          </Badge>
        );
    }
  };

  const totalRecipients = campaign.totalRecipients ?? 0;
  const sentCount = campaign.sentCount ?? 0;
  const failedCount = campaign.failedCount ?? 0;
  const percent =
    totalRecipients > 0 ? Math.min(100, Math.round((sentCount / totalRecipients) * 100)) : 0;

  const handleAction = async (action: () => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await action();
    } catch (err: unknown) {
      console.warn("Modal action error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl dark:bg-[#161715]">
        <DialogHeader className="border-border/80 shrink-0 space-y-2 border-b p-5 pr-12 text-left sm:p-6">
          <div className="flex items-start gap-3">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <Send className="size-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <DialogTitle className="text-foreground truncate text-lg font-extrabold tracking-tight sm:text-xl">
                  {campaign.name || "Kampanye Siaran"}
                </DialogTitle>
                {renderStatusBadge()}
              </div>
              <DialogDescription className="text-foreground-secondary line-clamp-2 text-xs font-medium">
                {t("campaign.detailModalSubtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs font-semibold sm:p-6">
          {/* Scheduled Banner (if set) */}
          {campaign.scheduledAt && (
            <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-700 dark:border-amber-500/30 dark:text-amber-400">
              <Clock className="size-4 shrink-0" />
              <div>
                <span className="block font-bold">
                  {t("campaign.scheduledBanner", { time: formatDateTime(campaign.scheduledAt) })}
                </span>
                <span className="text-[11px] font-medium opacity-90">
                  Pesan siaran otomatis disiapkan untuk jadwal waktu ini.
                </span>
              </div>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Created At */}
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3 dark:bg-[#10110e]">
              <Calendar className="text-foreground-muted size-4 shrink-0" />
              <div>
                <span className="text-foreground-muted block text-[11px]">
                  {t("campaign.createdAtLabel")}
                </span>
                <span className="text-foreground font-mono font-bold">
                  {formatDateTime(campaign.createdAt)}
                </span>
              </div>
            </div>

            {/* Device Info */}
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3 dark:bg-[#10110e]">
              <Smartphone className="dark:text-wise-green size-4 shrink-0 text-emerald-700" />
              <div>
                <span className="text-foreground-muted block text-[11px]">
                  {t("campaign.deviceInfoLabel")}
                </span>
                <span className="text-foreground font-bold">
                  {campaign.deviceName || "Perangkat Utama"}
                </span>
              </div>
            </div>

            {/* Audience Scope */}
            <div className="border-border bg-muted/30 flex min-w-0 items-start gap-3 rounded-lg border p-3.5 dark:bg-[#10110e]">
              <Users className="text-foreground-secondary mt-0.5 size-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-foreground-muted block text-[11px]">
                  {t("campaign.audienceScope")}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-foreground font-bold">
                    {campaign.targetType === "TAGS" ||
                    (campaign.targetTags &&
                      campaign.targetTags.length > 0 &&
                      !campaign.targetTags.includes("ALL"))
                      ? t("campaign.audienceTagsTitle")
                      : campaign.targetType === "CUSTOM"
                        ? t("campaign.audienceCustomTitle")
                        : t("campaign.audienceAllTitle")}
                  </span>
                  {campaign.targetTags &&
                    campaign.targetTags.length > 0 &&
                    !campaign.targetTags.includes("ALL") && (
                      <div className="flex flex-wrap gap-1">
                        {campaign.targetTags.map((tag) => (
                          <span
                            key={tag}
                            className="dark:bg-wise-green/20 dark:text-wise-green inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
                          >
                            <TagIcon className="size-2.5" />#{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  {campaign.targetType === "CUSTOM" &&
                    campaign.targetNumbers &&
                    campaign.targetNumbers.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {campaign.targetNumbers.map((num) => (
                          <span
                            key={num}
                            className="dark:bg-sky-500/20 dark:text-sky-300 inline-flex items-center gap-0.5 rounded-full bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-700"
                          >
                            📞 {num}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Anti-Ban Settings */}
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3 dark:bg-[#10110e]">
              <ShieldCheck className="dark:text-wise-green size-4 shrink-0 text-emerald-700" />
              <div>
                <span className="text-foreground-muted block text-[11px]">
                  {t("campaign.antiBanProtection")}
                </span>
                <div className="text-foreground flex items-center gap-2 pt-0.5 text-[11px] font-bold">
                  <span>Jitter: {campaign.jitterDelaySeconds ?? 3}s</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-500" />
                    Typing:{" "}
                    {campaign.enableHumanTyping ? t("campaign.active") : t("campaign.inactive")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Metrics Card */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-lg border p-4 dark:bg-[#10110e]">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-bold">{t("campaign.deliveryMetrics")}</span>
              <span className="text-dark-green dark:text-wise-green font-mono text-sm font-black">
                {percent}%
              </span>
            </div>
            <Progress value={percent} className="h-2 w-full" />
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-xs">
              <div className="border-border/60 rounded border p-2">
                <span className="text-foreground-muted block font-sans text-[10px] font-semibold">
                  {t("campaign.totalRecipients")}
                </span>
                <span className="text-foreground font-bold">{totalRecipients}</span>
              </div>
              <div className="border-border/60 rounded border p-2">
                <span className="text-foreground-muted block font-sans text-[10px] font-semibold">
                  {t("campaign.sentMessages")}
                </span>
                <span className="dark:text-wise-green font-bold text-emerald-700">{sentCount}</span>
              </div>
              <div className="border-border/60 rounded border p-2">
                <span className="text-foreground-muted block font-sans text-[10px] font-semibold">
                  {t("campaign.failedMessages")}
                </span>
                <span className="font-bold text-rose-500">{failedCount}</span>
              </div>
            </div>
          </div>

          {/* Message Template Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold uppercase">
                {t("campaign.messageTemplateLabel")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyMessage}
                className="h-7 gap-1.5 px-2 text-[11px] font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span className="text-emerald-500">{t("campaign.copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>{t("campaign.copyTemplate")}</span>
                  </>
                )}
              </Button>
            </div>
            <div className="border-border/60 bg-muted/40 text-foreground max-h-40 overflow-y-auto rounded-lg border p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text dark:bg-[#10110e]">
              {campaign.messageTemplate || "-"}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <DialogFooter className="border-border/70 bg-muted/20 flex shrink-0 items-center justify-between border-t p-4 sm:justify-between sm:p-5 dark:bg-[#10110e]">
          <div>
            {campaign.status === "DRAFT" && onStartCampaign && (
              <Button
                variant="primaryPill"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleAction(() => onStartCampaign(campaign.id))}
                className="gap-2 text-xs font-bold"
              >
                <Play className="size-3.5 fill-current" />
                <span>{t("campaign.startBroadcastNow")}</span>
              </Button>
            )}

            {campaign.status === "RUNNING" && onPauseCampaign && (
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleAction(() => onPauseCampaign(campaign.id))}
                className="border-border gap-2 rounded-full text-xs font-bold"
              >
                <Pause className="size-3.5" />
                <span>{t("campaign.pauseCampaign")}</span>
              </Button>
            )}

            {campaign.status === "PAUSED" && onResumeCampaign && (
              <Button
                variant="primaryPill"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleAction(() => onResumeCampaign(campaign.id))}
                className="gap-2 text-xs font-bold"
              >
                <Play className="size-3.5" />
                <span>{t("campaign.resumeCampaign")}</span>
              </Button>
            )}

            {campaign.status === "COMPLETED" && (
              <div className="dark:text-wise-green flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="size-4" />
                <span>{t("campaign.statusCompleted")}</span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border text-xs font-bold"
          >
            {t("campaign.closeBtn") || t("campaign.btnClose") || "Tutup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
