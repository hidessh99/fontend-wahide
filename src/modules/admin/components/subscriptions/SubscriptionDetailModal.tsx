"use client";

import React from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useClipboard } from "@/hooks/useClipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  CreditCard,
  Copy,
  Check,
  Building2,
  CheckCircle2,
  Clock,
  Smartphone,
  Users,
  Calendar,
  Layers,
  Sparkles,
  Ban,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface SubscriptionDetailModalProps {
  subscription: AdminSubscriptionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function getSubscriptionStatusVisual(status: string, t: (key: string) => string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ACTIVE":
      return {
        label: t("admin.subscriptions.statusActive"),
        color: "bg-emerald-500/10 text-emerald-700 dark:text-wise-green border-emerald-500/20",
        icon: <CheckCircle2 className="size-3.5" />,
      };
    case "EXPIRED":
      return {
        label: t("admin.subscriptions.statusExpired"),
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: <Clock className="size-3.5" />,
      };
    case "TRIAL":
      return {
        label: t("admin.subscriptions.statusTrial"),
        color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        icon: <Sparkles className="size-3.5" />,
      };
    case "SUSPENDED":
      return {
        label: t("admin.subscriptions.statusSuspended"),
        color: "bg-muted text-foreground-secondary border-border",
        icon: <Ban className="size-3.5" />,
      };
    default:
      return {
        label: status,
        color: "bg-muted text-foreground-secondary border-border",
        icon: <Layers className="size-3.5" />,
      };
  }
}

export function SubscriptionDetailModal({
  subscription,
  isOpen,
  onClose,
}: SubscriptionDetailModalProps) {
  const { t, locale } = useI18n();
  const { copied: copiedField, copy } = useClipboard<string>();

  if (!subscription) return null;

  const handleCopy = async (text: string, label: string) => {
    const success = await copy(text, label);
    if (success) {
      toast.success(t("admin.subscriptions.copiedToast", { label }), { id: "clipboard-copy" });
    } else {
      toast.error(t("admin.subscriptions.copyFailedToast"), { id: "clipboard-copy" });
    }
  };

  const plan = subscription.plan;
  const planName = plan?.name || `Paket ${subscription.planId.slice(0, 8)}`;
  const tenantName = subscription.tenant?.name || `Tenant ${subscription.tenantId.slice(0, 8)}`;
  const statusVisual = getSubscriptionStatusVisual(subscription.status, t as unknown as (key: string) => string);

  const quotaLimit = plan?.monthly_message_limit ?? 1000;
  const quotaUsed = subscription.currentMonthUsage;
  const usagePercentage = Math.min(100, Math.round((quotaUsed / (quotaLimit || 1)) * 100));

  const isExpired = subscription.status === "EXPIRED";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg dark:bg-[#161715]">
        {/* Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-2.5 border-b p-5 pb-3.5 text-left sm:p-6">
          <div className="dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <CreditCard className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-base font-black tracking-tight">
              {planName}
            </DialogTitle>
            <span className="text-foreground-muted block font-mono text-[11px]">
              ID: {subscription.id}
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Status & Plan Info Bar */}
          <div className="border-border bg-muted/20 flex items-center justify-between rounded-xl border p-3">
            <div>
              <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                {t("admin.subscriptions.pricePerMonthLabel")}
              </span>
              <span className="text-foreground font-mono text-sm font-black">
                Rp {(plan?.price ?? 0).toLocaleString(locale === "en" ? "en-US" : "id-ID")}{" "}
                {t("admin.subscriptions.perMonth")}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black tracking-wider uppercase ${statusVisual.color}`}
            >
              {statusVisual.icon}
              <span>{statusVisual.label}</span>
            </span>
          </div>

          {/* Quota Progress Meter */}
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold uppercase">
                {t("admin.subscriptions.monthlyQuotaUsage")}
              </span>
              <span className="text-foreground font-mono font-black">
                {quotaUsed.toLocaleString(locale === "en" ? "en-US" : "id-ID")} /{" "}
                {quotaLimit.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
              </span>
            </div>

            {/* Progress Track */}
            <Progress value={usagePercentage} className="h-2 w-full" />
            <div className="text-foreground-muted flex justify-between font-mono text-[10px]">
              <span>{t("admin.subscriptions.quotaUsedPercent", { percent: usagePercentage })}</span>
              <span>
                {t("admin.subscriptions.quotaRemaining", {
                  remaining: Math.max(0, quotaLimit - quotaUsed).toLocaleString(
                    locale === "en" ? "en-US" : "id-ID"
                  ),
                })}
              </span>
            </div>
          </div>

          {/* Feature Limits Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3">
              <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <Smartphone className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">
                  {t("admin.subscriptions.deviceLimitTitle")}
                </span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {t("admin.subscriptions.deviceLimitValue", { count: plan?.max_devices ?? 1 })}
              </div>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <Users className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">
                  {t("admin.subscriptions.agentLimitTitle")}
                </span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {t("admin.subscriptions.agentLimitValue", { count: plan?.max_agents ?? 1 })}
              </div>
            </div>
          </div>

          {/* Details & Identity */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-xl border p-4">
            <span className="text-foreground-secondary block text-[11px] font-bold tracking-wider uppercase">
              {t("admin.subscriptions.customerDurationInfo")}
            </span>

            {/* Tenant Name */}
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
                <Building2 className="text-foreground-muted size-3" />
                <span>{t("admin.subscriptions.tenantNameLabel")}</span>
              </span>
              <span className="text-foreground font-bold">{tenantName}</span>
            </div>

            {/* Tenant ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">
                {t("admin.subscriptions.tenantIdLabel")}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono text-[11px] font-semibold">
                  {subscription.tenantId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.tenantId, "Tenant ID")}
                  className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5"
                  title="Salin Tenant ID"
                >
                  {copiedField === "Tenant ID" ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Subscription ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">
                {t("admin.subscriptions.subscriptionIdLabel")}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono text-[11px] font-semibold">
                  {subscription.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.id, "Subscription ID")}
                  className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5"
                  title="Salin Subscription ID"
                >
                  {copiedField === "Subscription ID" ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Started At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Calendar className="text-foreground-muted size-3.5" />
                <span>{t("admin.subscriptions.startedAtLabel")}</span>
              </span>
              <span className="text-foreground font-mono text-[11px] font-semibold">
                {formatDateTime(subscription.startedAt)}
              </span>
            </div>

            {/* Expired At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Clock className="text-foreground-muted size-3.5" />
                <span>{t("admin.subscriptions.expiredAtLabel")}</span>
              </span>
              <span
                className={`font-mono text-[11px] font-bold ${
                  isExpired ? "text-rose-600 dark:text-rose-400" : "text-foreground"
                }`}
              >
                {formatDateTime(subscription.expiredAt)}
              </span>
            </div>

            {/* Created At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">
                {t("admin.subscriptions.createdAtLabel")}
              </span>
              <span className="text-foreground-secondary font-mono text-[11px]">
                {formatDateTime(subscription.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row justify-end rounded-none border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted h-8.5 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
