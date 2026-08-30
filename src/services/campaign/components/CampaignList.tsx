"use client";

import React, { useState } from "react";
import { CampaignStatus } from "../types/campaign.types";
import { CampaignWizardModal } from "./CampaignWizardModal";
import { useCampaigns } from "../hooks/useCampaigns";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  Send,
  Plus,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function CampaignList() {
  const { t } = useI18n();
  const {
    campaigns,
    isLoading,
    fetchCampaigns,
    createCampaign,
    pauseCampaign,
    resumeCampaign,
    cancelCampaign,
  } = useCampaigns();

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const renderStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case "RUNNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {t("campaign.statusRunning")}
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Pause className="size-3" />
            {t("campaign.statusPaused")}
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/15 text-wise-green border border-wise-green/20">
            <CheckCircle2 className="size-3" />
            {t("campaign.statusCompleted")}
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Clock className="size-3" />
            {t("campaign.statusScheduled")}
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="size-3" />
            {t("campaign.statusFailed")}
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            {t("campaign.statusDraft")}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
            <Zap className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-foreground">
              Anti-Ban Broadcast Dispatcher
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              Total {campaigns.length} kampanye blast terdaftar di sistem.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCampaigns}
            disabled={isLoading}
            className="rounded-full size-9 p-0 border-border hover:border-foreground-muted"
            aria-label="Refresh Kampanye"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            className="gap-2 text-xs font-bold shadow-sm"
          >
            <Plus className="size-4" />
            <span>{t("campaign.createCampaign")}</span>
          </Button>
        </div>
      </div>

      {/* Campaign List Grid */}
      {isLoading && campaigns.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-56 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-6"
            />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-md border border-dashed border-border bg-surface dark:bg-[#161715]/50 space-y-4">
          <div className="size-14 rounded-full bg-wise-green/10 text-wise-green flex items-center justify-center">
            <Send className="size-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t("campaign.noCampaigns")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary">
              {t("campaign.noCampaignsDesc")}
            </p>
          </div>
          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            className="gap-2 text-xs font-bold mt-2 shadow-sm"
          >
            <Plus className="size-4" />
            <span>{t("campaign.createCampaign")}</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.map((campaign) => {
            const percent =
              campaign.totalRecipients > 0
                ? Math.round((campaign.sentCount / campaign.totalRecipients) * 100)
                : 0;

            return (
              <div
                key={campaign.id}
                className="rounded-md border border-border bg-surface dark:bg-[#161715] p-5 sm:p-6 space-y-4 hover:border-foreground-muted/40 transition flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-foreground line-clamp-1">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted">
                      <Smartphone className="size-3.5" />
                      <span>{campaign.deviceName || "Perangkat Utama"}</span>
                      <span>•</span>
                      <ShieldCheck className="size-3.5 text-wise-green" />
                      <span>Jitter {campaign.jitterDelaySeconds}s</span>
                    </div>
                  </div>
                  {renderStatusBadge(campaign.status)}
                </div>

                {/* Template preview */}
                <div className="p-3 rounded-md bg-muted/40 border border-border/50 text-xs font-semibold text-foreground-secondary line-clamp-2 leading-relaxed">
                  {campaign.messageTemplate}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">
                      {t("campaign.progressSent", {
                        sent: campaign.sentCount.toString(),
                        total: campaign.totalRecipients.toString(),
                        percent: percent.toString(),
                      })}
                    </span>
                    <span className="text-wise-green font-mono">{percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-wise-green rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-[11px] font-semibold text-foreground-muted">
                    {new Date(campaign.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {campaign.status === "RUNNING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pauseCampaign(campaign.id)}
                        className="rounded-full text-xs font-bold gap-1.5 border-border"
                      >
                        <Pause className="size-3" />
                        <span>{t("campaign.pauseCampaign")}</span>
                      </Button>
                    )}

                    {campaign.status === "PAUSED" && (
                      <Button
                        variant="primaryPill"
                        size="sm"
                        onClick={() => resumeCampaign(campaign.id)}
                        className="text-xs font-bold gap-1.5"
                      >
                        <Play className="size-3" />
                        <span>{t("campaign.resumeCampaign")}</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelCampaign(campaign.id)}
                      className="rounded-full size-8 p-0 text-rose-500 hover:bg-rose-500/10 border-rose-500/20"
                      aria-label="Batalkan Kampanye"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Campaign Creation Wizard Modal */}
      <CampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={createCampaign}
      />
    </div>
  );
}
