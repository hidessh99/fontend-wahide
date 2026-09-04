"use client";

import React from "react";
import Link from "next/link";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { useCampaigns } from "@/modules/campaign/hooks/useCampaigns";
import { UserDashboardStats } from "@/modules/iam/types/dashboard.types";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { MetricCard } from "@/components/shared/MetricCard";
import { useI18n } from "@/lib/i18n/context";
import {
  Smartphone,
  Send,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Radio,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface UserDashboardOverviewProps {
  stats: UserDashboardStats | null;
}

export function UserDashboardOverview({ stats: propStats }: UserDashboardOverviewProps) {
  const { t, locale } = useI18n();
  const { devices } = useDevices();
  const { campaigns } = useCampaigns();

  const stats = propStats || {
    balance: 0,
    income: 0,
    total_devices: devices.length,
    connected_devices: devices.filter((d) => d.status === "CONNECTED").length,
    total_contacts: 0,
    total_campaigns: campaigns.length,
    total_messages_sent: 0,
    plan_name: "FREE",
    plan_status: "ACTIVE",
    device_limit: 1,
    monthly_message_limit: 1200,
    open_tickets: 0,
    recent_activities: [],
    recent_invoices: [],
  };

  const connectedCount =
    stats.connected_devices || devices.filter((d) => d.status === "CONNECTED").length;
  const totalDevCount = stats.total_devices || devices.length;
  const quotaRemaining = Math.max(0, stats.monthly_message_limit - stats.total_messages_sent);

  const isFreePlan =
    !stats.plan_name ||
    stats.plan_name.toUpperCase() === "FREE" ||
    stats.plan_name.toUpperCase() === "STARTER";

  let expirationLabel = t("overview.planUnlimited");
  let isExpiringSoon = false;
  let isExpired = false;

  if (!isFreePlan && stats.subscription_expires_at) {
    const expDate = new Date(stats.subscription_expires_at);
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = expDate.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (diffDays <= 0 || stats.plan_status === "EXPIRED") {
      isExpired = true;
      expirationLabel = t("overview.planExpired", { date: formattedDate });
    } else if (diffDays <= 7) {
      isExpiringSoon = true;
      expirationLabel = t("overview.planExpiring", { date: formattedDate, days: diffDays });
    } else {
      expirationLabel = t("overview.planExpiring", { date: formattedDate, days: diffDays });
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Welcome & Quick Action Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition ${
                isExpired
                  ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                  : isExpiringSoon
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "bg-surface text-foreground-secondary border-border"
              }`}
            >
              <span className="text-foreground font-black">Paket {stats.plan_name}</span>
              <span className="text-foreground-muted">•</span>
              <span>{isFreePlan ? t("overview.planUnlimited") : expirationLabel}</span>
            </span>

            <Link
              href="/subscription"
              className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold transition hover:opacity-85"
            >
              <span>
                {isFreePlan
                  ? t("overview.upgradePlan")
                  : isExpiringSoon || isExpired
                    ? t("overview.renewPlan")
                    : t("overview.changePlan")}
              </span>
              <ArrowUpRight className="stroke-2.5 size-3" />
            </Link>
          </div>
          <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
            {t("overview.dashboardTitle")}
          </h1>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("overview.dashboardSubtitle")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link href="/devices">
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:border-foreground-muted gap-1.5 rounded-full text-xs font-bold"
            >
              <Smartphone className="text-dark-green dark:text-wise-green size-3.5" />
              <span>
                {t("overview.devicesButton", { count: totalDevCount, limit: stats.device_limit })}
              </span>
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button
              variant="primaryPill"
              size="sm"
              className="gap-1.5 rounded-full text-xs font-bold shadow-sm"
            >
              <Plus className="size-3.5" />
              <span>{t("overview.newBroadcastButton")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Device Status */}
        <MetricCard
          title={t("overview.whatsappConnected")}
          icon={<Smartphone className="size-4" />}
          iconClassName="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green"
          value={t("overview.sessionUnit", { connected: connectedCount, total: totalDevCount })}
          subtitle={
            <span className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {connectedCount > 0 ? t("overview.nodesReady") : t("overview.noNodesConnected")}
            </span>
          }
        />

        {/* Quota Remaining */}
        <MetricCard
          title={t("overview.remainingQuota")}
          icon={<TrendingUp className="size-4" />}
          iconClassName="bg-sky-500/15 text-sky-500"
          value={quotaRemaining.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
          subtitle={
            <span className="text-foreground-muted block text-[11px] font-semibold">
              {t("overview.monthlyQuotaInfo", {
                limit: stats.monthly_message_limit.toLocaleString(locale === "en" ? "en-US" : "id-ID"),
              })}
            </span>
          }
        />

        {/* Contacts Count & Balance */}
        <MetricCard
          title={t("overview.contactsAndBalance")}
          icon={<Users className="size-4" />}
          iconClassName="bg-emerald-500/15 text-emerald-500"
          value={t("overview.contactsUnit", {
            count: stats.total_contacts.toLocaleString(locale === "en" ? "en-US" : "id-ID"),
          })}
          subtitle={
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-foreground-muted text-[11px] font-semibold">
                {t("overview.balanceLabel")}{" "}
                <strong className="text-foreground font-mono">
                  Rp {stats.balance.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                </strong>
              </span>
              <Link
                href="/billing"
                className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition hover:opacity-80"
              >
                <Plus className="size-2.5" />
                <span>{t("overview.topUp")}</span>
              </Link>
            </div>
          }
        />

        {/* Campaigns Count */}
        <MetricCard
          title={t("overview.activeCampaigns")}
          icon={<Send className="size-4" />}
          iconClassName="bg-amber-500/15 text-amber-500"
          value={t("overview.batchUnit", { count: stats.total_campaigns || campaigns.length })}
          subtitle={
            <span className="text-foreground-muted block text-[11px] font-semibold">
              {t("overview.messagesSentUnit", {
                count: stats.total_messages_sent.toLocaleString(locale === "en" ? "en-US" : "id-ID"),
              })}
            </span>
          }
        />
      </div>

      {/* Main 2-Column Split: Active Devices & Broadcast Campaigns / Recent Invoices */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Active WhatsApp Devices */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Ringkasan Sesi WhatsApp">
          <div className="border-border bg-surface space-y-4 rounded-xl border p-4 shadow-xs sm:p-6">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Radio className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  {t("overview.whatsappNodesTitle")}
                </h2>
              </div>
              <Link
                href="/devices"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>{t("overview.viewAll")}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {devices.length === 0 ? (
              <EmptyState
                icon={<Smartphone className="size-6" />}
                title={t("overview.noConnectedDevicesTitle")}
                description={t("overview.noConnectedDevicesDesc")}
                className="p-6 sm:p-8"
              />
            ) : (
              <div className="space-y-2.5">
                {devices.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    className="border-border bg-surface flex items-center justify-between rounded-xl border p-3 dark:bg-[#10110e]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 items-center justify-center rounded-full">
                        <Smartphone className="size-4" />
                      </div>
                      <div>
                        <span className="text-foreground block text-xs font-bold">
                          {d.push_name || d.pushName || d.name || "WhatsApp Device"}
                        </span>
                        <span className="text-foreground-muted font-mono text-[11px]">
                          +{d.phone || t("overview.waitingPairing")}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={d.status === "CONNECTED" ? "success" : "warning"}
                      className="text-[10px]"
                    >
                      <CheckCircle2 className="size-2.5" />
                      <span>{d.status}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ErrorBoundary>

        {/* Broadcast Campaigns & Invoices Activity */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Ringkasan Kampanye">
          <div className="border-border bg-surface space-y-4 rounded-xl border p-4 shadow-xs sm:p-6">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Layers className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  {t("overview.recentCampaignsTitle")}
                </h2>
              </div>
              <Link
                href="/campaigns"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>{t("overview.viewAll")}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {campaigns.length === 0 &&
            (!stats.recent_invoices || stats.recent_invoices.length === 0) ? (
              <EmptyState
                icon={<Layers className="size-6" />}
                title={t("overview.noCampaignsTitle")}
                description={t("overview.noCampaignsDesc")}
                className="p-6 sm:p-8"
              />
            ) : (
              <div className="space-y-2.5">
                {campaigns.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="border-border bg-surface flex items-center justify-between rounded-xl border p-3 dark:bg-[#10110e]"
                  >
                    <div className="space-y-0.5">
                      <span className="text-foreground block text-xs font-bold">{c.name}</span>
                      <span className="text-foreground-muted block text-[10px]">
                        {t("overview.campaignProgress", {
                          sent: c.sentCount,
                          total: c.totalRecipients,
                        })}
                      </span>
                    </div>

                    <Badge variant="success" className="text-[10px]">
                      <ShieldCheck className="size-2.5" />
                      <span>{c.status}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
