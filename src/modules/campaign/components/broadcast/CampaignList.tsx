"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Campaign, CampaignStatus } from "@/modules/campaign/types/campaign.types";
import { useCampaigns } from "@/modules/campaign/hooks/useCampaigns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";

const CampaignWizardModal = dynamic(
  () => import("./CampaignWizardModal").then((m) => m.CampaignWizardModal),
  { ssr: false }
);

const DeleteCampaignModal = dynamic(
  () => import("./DeleteCampaignModal").then((m) => m.DeleteCampaignModal),
  { ssr: false }
);
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
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
  Loader2,
} from "lucide-react";

export function CampaignList() {
  const router = useRouter();
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
  const [isCheckingDevices, setIsCheckingDevices] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  const handleCreateCampaignClick = async () => {
    if (isCheckingDevices) return;
    setIsCheckingDevices(true);
    try {
      const devices = await whatsappApi.getDevices();
      const onlineDevices = devices.filter(
        (d) => d.status === "CONNECTED" || (d.status as string) === "ONLINE"
      );

      if (onlineDevices.length === 0) {
        toast.error(t("campaign.noActiveDeviceRedirect"));
        router.push("/devices");
        return;
      }

      setIsWizardOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memeriksa status perangkat";
      toast.error(msg);
    } finally {
      setIsCheckingDevices(false);
    }
  };

  const renderStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case "RUNNING":
        return (
          <Badge variant="success">
            <span className="mr-1 size-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span>{t("campaign.statusRunning")}</span>
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge variant="warning">
            <Pause className="mr-1 size-3" />
            <span>{t("campaign.statusPaused")}</span>
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success">
            <CheckCircle2 className="mr-1 size-3" />
            <span>{t("campaign.statusCompleted")}</span>
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge variant="info">
            <Clock className="mr-1 size-3" />
            <span>{t("campaign.statusScheduled")}</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="danger">
            <AlertCircle className="mr-1 size-3" />
            <span>{t("campaign.statusFailed")}</span>
          </Badge>
        );
      case "DRAFT":
      default:
        return (
          <Badge variant="neutral">
            <span>{t("campaign.statusDraft")}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="border-border bg-surface flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:p-4 dark:bg-[#161715]">
        <div className="flex items-center gap-3">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-10">
            <Zap className="size-4 sm:size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-sm font-extrabold sm:text-base">
              Anti-Ban Broadcast Dispatcher
            </h2>
            <p className="text-foreground-secondary text-[11px] font-semibold sm:text-xs">
              Total {campaigns.length} kampanye blast terdaftar di sistem.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCampaigns}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted size-9 rounded-full p-0"
            aria-label="Refresh Kampanye"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={handleCreateCampaignClick}
            disabled={isLoading || isCheckingDevices}
            className="h-9 gap-2 px-4 text-xs font-bold shadow-sm"
          >
            {isCheckingDevices ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            <span>{t("campaign.createCampaign")}</span>
          </Button>
        </div>
      </div>

      {/* Campaign List Grid */}
      {isLoading && campaigns.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-md" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<Send className="size-6" />}
          title={t("campaign.noCampaigns")}
          description={t("campaign.noCampaignsDesc")}
          action={
            <Button
              variant="primaryPill"
              size="sm"
              onClick={handleCreateCampaignClick}
              disabled={isLoading || isCheckingDevices}
              className="mt-2 h-9 gap-2 px-4 text-xs font-bold shadow-sm"
            >
              {isCheckingDevices ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              <span>{t("campaign.createCampaign")}</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {campaigns.map((campaign) => {
            const totalRecipients = campaign.totalRecipients ?? 0;
            const sentCount = campaign.sentCount ?? 0;
            const percent =
              totalRecipients > 0
                ? Math.min(100, Math.round((sentCount / totalRecipients) * 100))
                : 0;

            const formattedDate = campaign.createdAt
              ? new Date(campaign.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "-";

            return (
              <div
                key={campaign.id}
                className="border-border bg-surface hover:border-foreground-muted/40 flex flex-col justify-between space-y-4 rounded-md border p-5 transition sm:p-6 dark:bg-[#161715]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-foreground line-clamp-1 text-base font-extrabold">
                      {campaign.name || "Kampanye Siaran"}
                    </h3>
                    <div className="text-foreground-muted flex items-center gap-2 text-xs font-semibold">
                      <Smartphone className="size-3.5" />
                      <span>{campaign.deviceName || "Perangkat Utama"}</span>
                      <span>•</span>
                      <ShieldCheck className="dark:text-wise-green size-3.5 text-emerald-700" />
                      <span>Jitter {campaign.jitterDelaySeconds ?? 3}s</span>
                    </div>
                  </div>
                  {renderStatusBadge(campaign.status)}
                </div>

                {/* Template preview */}
                <div className="bg-muted/40 border-border/50 text-foreground-secondary line-clamp-2 rounded-md border p-3 text-xs leading-relaxed font-semibold">
                  {campaign.messageTemplate || "-"}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">
                      {t("campaign.progressSent", {
                        sent: String(sentCount),
                        total: String(totalRecipients),
                        percent: String(percent),
                      })}
                    </span>
                    <span className="text-dark-green dark:text-wise-green font-mono">
                      {percent}%
                    </span>
                  </div>
                  <Progress value={percent} className="h-2 w-full" />
                </div>

                {/* Action Footer */}
                <div className="border-border/60 flex items-center justify-between border-t pt-2">
                  <span className="text-foreground-muted text-[11px] font-semibold">
                    {formattedDate}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {campaign.status === "RUNNING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pauseCampaign(campaign.id)}
                        className="border-border gap-1.5 rounded-full text-xs font-bold"
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
                        className="gap-1.5 text-xs font-bold"
                      >
                        <Play className="size-3" />
                        <span>{t("campaign.resumeCampaign")}</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCampaignToDelete(campaign)}
                      className="size-8 rounded-full border-rose-500/20 p-0 text-rose-500 hover:bg-rose-500/10"
                      aria-label={t("campaign.deleteConfirmBtn") || "Hapus Kampanye"}
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
      {isWizardOpen && (
        <CampaignWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSubmit={createCampaign}
        />
      )}

      {/* Campaign Deletion Confirmation Modal */}
      {campaignToDelete && (
        <DeleteCampaignModal
          isOpen={Boolean(campaignToDelete)}
          campaign={campaignToDelete}
          onClose={() => setCampaignToDelete(null)}
          onConfirm={async () => {
            if (campaignToDelete) {
              await cancelCampaign(campaignToDelete.id);
            }
          }}
        />
      )}
    </div>
  );
}
