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

const CampaignDetailModal = dynamic(
  () => import("./CampaignDetailModal").then((m) => m.CampaignDetailModal),
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
  Calendar,
  ExternalLink,
  Users,
} from "lucide-react";

export function CampaignList() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    campaigns,
    isLoading,
    fetchCampaigns,
    createCampaign,
    startCampaign,
    pauseCampaign,
    resumeCampaign,
    cancelCampaign,
  } = useCampaigns();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCheckingDevices, setIsCheckingDevices] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] = useState<Campaign | null>(null);

  const { locale } = useI18n();

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
        hour12: false,
      }).format(date);
    } catch {
      return dateStr;
    }
  };

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

  const renderStatusBadge = (status: CampaignStatus, scheduledAt?: string) => {
    if (scheduledAt && status === "DRAFT") {
      return (
        <Badge variant="warning" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
          <Clock className="size-3" />
          <span>{t("campaign.statusScheduled")}</span>
        </Badge>
      );
    }

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
      <div className="border-border bg-surface flex flex-col justify-between gap-3 rounded-xl border p-3.5 shadow-xs sm:flex-row sm:items-center sm:p-4">
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
            className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
            aria-label="Refresh Kampanye"
            title="Refresh Kampanye"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={handleCreateCampaignClick}
            disabled={isLoading || isCheckingDevices}
            className="h-10 shrink-0 cursor-pointer gap-2 px-4 text-xs font-bold shadow-sm"
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

            return (
              <div
                key={campaign.id}
                onClick={() => setSelectedCampaignForDetail(campaign)}
                className="border-border bg-surface hover:border-wise-green/60 group flex cursor-pointer flex-col justify-between space-y-4 rounded-md border p-5 transition hover:shadow-md sm:p-6"
                title={t("campaign.cardClickHint")}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green line-clamp-1 text-base font-extrabold transition">
                        {campaign.name || "Kampanye Siaran"}
                      </h3>
                      <ExternalLink className="text-foreground-muted size-3.5 opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <div className="text-foreground-muted flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <div className="flex items-center gap-1">
                        <Smartphone className="size-3.5" />
                        <span>{campaign.deviceName || "Perangkat Utama"}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="dark:text-wise-green size-3.5 text-emerald-700" />
                        <span>Jitter {campaign.jitterDelaySeconds ?? 3}s</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span>
                          {campaign.targetType === "CUSTOM"
                            ? `Input Manual (${campaign.totalRecipients ?? 0} no)`
                            : campaign.targetType === "TAGS" &&
                                campaign.targetTags &&
                                campaign.targetTags.length > 0
                              ? `#${campaign.targetTags[0]}`
                              : "Semua Kontak"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {renderStatusBadge(campaign.status, campaign.scheduledAt)}
                </div>

                {/* Scheduled banner pill (if set) */}
                {campaign.scheduledAt && (
                  <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-700 dark:border-amber-500/30 dark:text-amber-400">
                    <Clock className="size-3.5 shrink-0" />
                    <span className="font-bold">
                      {t("campaign.scheduledBanner", {
                        time: formatDateTime(campaign.scheduledAt),
                      })}
                    </span>
                  </div>
                )}

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
                  <div className="text-foreground-muted flex items-center gap-1.5 text-[11px] font-semibold">
                    <Calendar className="size-3.5 shrink-0" />
                    <span>
                      {t("campaign.createdAtLabel")}: {formatDateTime(campaign.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {campaign.status === "DRAFT" && (
                      <Button
                        variant="primaryPill"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCampaign(campaign.id);
                        }}
                        className="gap-1.5 text-xs font-bold"
                      >
                        <Play className="size-3 fill-current" />
                        <span>{t("campaign.startCampaign") || "Mulai Siaran"}</span>
                      </Button>
                    )}

                    {campaign.status === "RUNNING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          pauseCampaign(campaign.id);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          resumeCampaign(campaign.id);
                        }}
                        className="gap-1.5 text-xs font-bold"
                      >
                        <Play className="size-3" />
                        <span>{t("campaign.resumeCampaign")}</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCampaignToDelete(campaign);
                      }}
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

      {/* Campaign Detail Modal */}
      {selectedCampaignForDetail && (
        <CampaignDetailModal
          isOpen={Boolean(selectedCampaignForDetail)}
          campaign={selectedCampaignForDetail}
          onClose={() => setSelectedCampaignForDetail(null)}
          onStartCampaign={async (id) => {
            await startCampaign(id);
            setSelectedCampaignForDetail((prev) =>
              prev && prev.id === id ? { ...prev, status: "RUNNING" } : prev
            );
          }}
          onPauseCampaign={async (id) => {
            await pauseCampaign(id);
            setSelectedCampaignForDetail((prev) =>
              prev && prev.id === id ? { ...prev, status: "PAUSED" } : prev
            );
          }}
          onResumeCampaign={async (id) => {
            await resumeCampaign(id);
            setSelectedCampaignForDetail((prev) =>
              prev && prev.id === id ? { ...prev, status: "RUNNING" } : prev
            );
          }}
        />
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
