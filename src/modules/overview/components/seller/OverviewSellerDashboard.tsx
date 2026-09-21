"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { useCampaigns } from "@/modules/campaign/hooks/useCampaigns";
import { UserDashboardStats } from "@/modules/iam/types/dashboard.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import {
  SendHorizontal,
  CheckCircle2,
  XCircle,
  Smartphone,
  RefreshCw,
  BarChart3,
  Inbox,
  History,
  ChevronRight,
  MessageSquare,
  Bot,
  Mail,
  Send,
} from "lucide-react";
import { ChannelBadge } from "@/lib/utils/channel";

interface UserDashboardOverviewProps {
  stats: UserDashboardStats | null;
  onReload?: () => void;
  isReloading?: boolean;
}

export function UserDashboardOverview({
  stats: propStats,
  onReload,
  isReloading = false,
}: UserDashboardOverviewProps) {
  const { t, locale } = useI18n();
  const user = useAuth((s) => s.user);
  const { devices } = useDevices();
  const { campaigns } = useCampaigns();

  const userName = user?.name || "Dedi Susanto";

  // Telemetry KPIs from backend stats or derived fallbacks
  const telemetry = useMemo(() => {
    if (propStats?.telemetry) {
      return propStats.telemetry;
    }
    const connectedDev = devices.filter((d) => d.status === "CONNECTED").length;
    return {
      send_attempts: propStats?.total_messages_sent || 0,
      delivered_count: propStats?.total_messages_sent || 0,
      success_rate: propStats?.total_messages_sent ? 100 : 0,
      failed_count: 0,
      fail_rate: 0,
      total_devices: propStats?.total_devices || devices.length,
      connected_devices: propStats?.connected_devices || connectedDev,
    };
  }, [propStats, devices]);

  // Channel breakdown metrics
  const channels = useMemo(() => {
    if (propStats?.channels && propStats.channels.length > 0) {
      return propStats.channels;
    }
    const waDevices = devices.filter(
      (d) =>
        !d.channel_type ||
        d.channel_type === "WHATSMEOW_UNOFFICIAL" ||
        d.channel_type === "WHATSAPP",
    );
    const wabaDevices = devices.filter(
      (d) =>
        d.channel_type === "META_WABA_OFFICIAL" || d.channel_type === "WABA",
    );

    return [
      {
        channel_type: "WHATSAPP",
        sent_count: propStats?.total_messages_sent || 0,
        device_count: waDevices.length,
        connected_count: waDevices.filter((d) => d.status === "CONNECTED").length,
      },
      {
        channel_type: "WABA",
        sent_count: 0,
        device_count: wabaDevices.length,
        connected_count: wabaDevices.filter((d) => d.status === "CONNECTED").length,
      },
      {
        channel_type: "TELEGRAM",
        sent_count: 0,
        device_count: 0,
        connected_count: 0,
      },
      {
        channel_type: "EMAIL",
        sent_count: 0,
        device_count: 0,
        connected_count: 0,
      },
    ];
  }, [propStats, devices]);

  // Daily activities for stacked chart
  const dailyActivities = useMemo(() => {
    return propStats?.daily_activities || [];
  }, [propStats]);

  const hasActivityData = useMemo(() => {
    return dailyActivities.some((d) => d.total > 0);
  }, [dailyActivities]);

  // Recent outbound messages
  const recentMessages = useMemo(() => {
    return propStats?.recent_outbound_messages || [];
  }, [propStats]);

  // Active campaigns
  const activeCampaigns = useMemo(() => {
    if (propStats?.active_campaigns && propStats.active_campaigns.length > 0) {
      return propStats.active_campaigns;
    }
    return campaigns
      .filter((c) => c.status === "RUNNING")
      .map((c) => ({
        id: c.id,
        name: c.name,
        channel_type: c.channelType || "WHATSAPP",
        status: c.status,
        total_recipients: c.totalRecipients || 0,
        sent_count: c.sentCount || 0,
        progress:
          c.totalRecipients > 0
            ? Math.round((c.sentCount / c.totalRecipients) * 100)
            : 0,
      }));
  }, [propStats, campaigns]);

  // Scheduled queues
  const scheduledQueues = useMemo(() => {
    if (propStats?.scheduled_queues && propStats.scheduled_queues.length > 0) {
      return propStats.scheduled_queues;
    }
    return campaigns
      .filter((c) => c.status === "SCHEDULED")
      .map((c) => ({
        id: c.id,
        name: c.name,
        channel_type: c.channelType || "WHATSAPP",
        total_recipients: c.totalRecipients || 0,
        scheduled_at: (c as { scheduledAt?: string }).scheduledAt,
        status: c.status,
      }));
  }, [propStats, campaigns]);

  // Find counts per channel safely
  const waStats = channels.find((c) => c.channel_type === "WHATSAPP");
  const wabaStats = channels.find((c) => c.channel_type === "WABA");
  const teleStats = channels.find((c) => c.channel_type === "TELEGRAM");
  const emailStats = channels.find((c) => c.channel_type === "EMAIL");

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-7 sm:p-6 lg:p-8">
      {/* ========================================================================= */}
      {/* 1. HEADER SECTION (Greeting, Timeframe Tag & Quick Action Buttons)       */}
      {/* ========================================================================= */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            {t("overview.sevenDays")}
          </span>
          <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            {t("overview.greeting", { name: userName })}
          </h1>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("overview.headerSubtitle")}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onReload}
            disabled={isReloading}
            className="border-border hover:border-foreground-muted gap-1.5 rounded-full text-xs font-bold"
          >
            <RefreshCw
              className={`size-3.5 ${isReloading ? "animate-spin" : ""}`}
            />
            <span>{t("overview.reload")}</span>
          </Button>

          <Link href="/wa/send">
            <Button
              variant="default"
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 gap-1.5 rounded-full text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <SendHorizontal className="size-3.5" />
              <span>{t("overview.sendMessage")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP 4 METRIC CARDS (Gateway Telemetry: Upaya, Terkirim, Gagal, Device) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Card 1: Upaya kirim */}
        <Card className="border-border bg-surface hover:border-border/80 group rounded-2xl border p-5 shadow-xs transition-all">
          <div className="mb-3 flex items-center justify-between">
            <div className="bg-muted/60 text-foreground-secondary flex size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
              <Send className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-foreground font-mono text-2xl font-black tracking-tight sm:text-3xl">
              {telemetry.send_attempts.toLocaleString(
                locale === "en" ? "en-US" : "id-ID",
              )}
            </div>
            <div className="text-foreground text-xs font-bold">
              {t("overview.sendAttempts")}
            </div>
            <p className="text-foreground-muted text-[11px] font-medium">
              {t("overview.allAttemptsRecorded")}
            </p>
          </div>
        </Card>

        {/* Card 2: Terkirim */}
        <Card className="border-border bg-surface hover:border-border/80 group rounded-2xl border p-5 shadow-xs transition-all">
          <div className="mb-3 flex items-center justify-between">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-foreground font-mono text-2xl font-black tracking-tight sm:text-3xl">
              {telemetry.delivered_count.toLocaleString(
                locale === "en" ? "en-US" : "id-ID",
              )}
            </div>
            <div className="text-foreground text-xs font-bold">
              {t("overview.delivered")}
            </div>
            <p className="text-foreground-muted text-[11px] font-medium">
              {t("overview.successRateDesc", {
                rate: telemetry.success_rate,
              })}
            </p>
          </div>
        </Card>

        {/* Card 3: Gagal */}
        <Card className="border-border bg-surface hover:border-border/80 group rounded-2xl border p-5 shadow-xs transition-all">
          <div className="mb-3 flex items-center justify-between">
            <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 flex size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
              <XCircle className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-foreground font-mono text-2xl font-black tracking-tight sm:text-3xl">
              {telemetry.failed_count.toLocaleString(
                locale === "en" ? "en-US" : "id-ID",
              )}
            </div>
            <div className="text-foreground text-xs font-bold">
              {t("overview.failed")}
            </div>
            <p className="text-foreground-muted text-[11px] font-medium">
              {t("overview.failRateDesc", {
                rate: telemetry.fail_rate,
              })}
            </p>
          </div>
        </Card>

        {/* Card 4: Device */}
        <Card className="border-border bg-surface hover:border-border/80 group rounded-2xl border p-5 shadow-xs transition-all">
          <div className="mb-3 flex items-center justify-between">
            <div className="bg-muted/60 text-foreground-secondary flex size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-foreground font-mono text-2xl font-black tracking-tight sm:text-3xl">
              {telemetry.total_devices.toLocaleString(
                locale === "en" ? "en-US" : "id-ID",
              )}
            </div>
            <div className="text-foreground text-xs font-bold">
              {t("overview.device")}
            </div>
            <p className="text-foreground-muted text-[11px] font-medium">
              {t("overview.allChannels")}
            </p>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. ASYMMETRICAL 2-COLUMN LAYOUT (65% Kolom Kiri : 35% Kolom Kanan)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ----------------------------------------------------------------------- */}
        {/* KOLOM KIRI (lg:col-span-8 / 65% Width): Aktivitas Harian & Pesan Terbaru*/}
        {/* ----------------------------------------------------------------------- */}
        <div className="space-y-6 lg:col-span-8">
          {/* Card A: Aktivitas harian */}
          <Card className="border-border bg-surface space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  {t("overview.dailyActivity")}
                </h2>
                <p className="text-foreground-muted text-xs font-medium">
                  {t("overview.dailyActivitySubtitle")}
                </p>
              </div>

              <Link
                href="/wa/stats"
                className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1 text-xs font-bold transition-colors"
              >
                <span>{t("overview.fullStats")}</span>
                <span className="text-[11px]">→</span>
              </Link>
            </div>

            {/* Chart Area / Empty State */}
            {hasActivityData ? (
              <div className="space-y-4 pt-2">
                <div className="flex h-52 items-end justify-between gap-2 sm:gap-4">
                  {dailyActivities.map((day) => {
                    const maxTotal = Math.max(
                      ...dailyActivities.map((d) => d.total),
                      1,
                    );
                    const barHeightPct = Math.max(
                      8,
                      Math.round((day.total / maxTotal) * 100),
                    );
                    return (
                      <div
                        key={day.date}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div className="bg-muted/40 relative flex h-40 w-full max-w-[36px] flex-col justify-end overflow-hidden rounded-t-md">
                          <div
                            style={{ height: `${barHeightPct}%` }}
                            className="bg-emerald-600 dark:bg-emerald-500 w-full rounded-t-md transition-all duration-500"
                            title={`${day.day_label} (${day.date}): ${day.total} kiriman`}
                          />
                        </div>
                        <span className="text-foreground-muted font-mono text-[10px] font-bold sm:text-xs">
                          {day.day_label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Chart Legend */}
                <div className="border-border/60 flex flex-wrap items-center justify-center gap-4 border-t pt-3 text-[11px] font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-teal-500" />
                    <span>WABA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-sky-500" />
                    <span>Telegram</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-purple-500" />
                    <span>Email</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
                <div className="bg-muted/40 mb-3 flex size-12 items-center justify-center rounded-full text-muted-foreground">
                  <BarChart3 className="size-6 stroke-1.5" />
                </div>
                <p className="text-foreground-muted mb-4 max-w-sm text-xs font-semibold">
                  {t("overview.noDispatches7Days")}
                </p>
                <Link href="/wa/send">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 text-xs font-bold shadow-xs transition-transform active:scale-95"
                  >
                    {t("overview.sendFirstMessage")}
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Card B: Kiriman terbaru */}
          <Card className="border-border bg-surface space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  {t("overview.recentDispatches")}
                </h2>
                <p className="text-foreground-muted text-xs font-medium">
                  {t("overview.recentDispatchesSubtitle")}
                </p>
              </div>

              <Link
                href="/wa/logs"
                className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1 text-xs font-bold transition-colors"
              >
                <span>{t("overview.viewAll")}</span>
                <span className="text-[11px]">→</span>
              </Link>
            </div>

            {recentMessages.length > 0 ? (
              <div className="divide-border/60 divide-y overflow-hidden rounded-xl border border-border/60">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="hover:bg-muted/30 flex items-center justify-between p-3 transition-colors text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground truncate">
                          {msg.recipient_jid}
                        </span>
                        <ChannelBadge channelType={msg.channel_type} />
                      </div>
                      <p className="text-foreground-muted truncate text-[11px] mt-0.5">
                        {msg.message_body || "-"}
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          msg.status === "DELIVERED" || msg.status === "SENT"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : msg.status === "FAILED"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "bg-muted text-foreground-muted"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-foreground-muted text-xs font-semibold">
                  {t("overview.noRecentMessages")}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* KOLOM KANAN (lg:col-span-4 / 35% Width): Channel, Campaign, & Antrian   */}
        {/* ----------------------------------------------------------------------- */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card C: Per channel */}
          <Card className="border-border bg-surface space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
            <div>
              <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                {t("overview.perChannel")}
              </h2>
              <p className="text-foreground-muted text-xs font-medium">
                {t("overview.perChannelSubtitle")}
              </p>
            </div>

            {/* List of Channels */}
            <div className="divide-border/40 divide-y">
              {/* WhatsApp */}
              <Link
                href="/wa/devices"
                className="hover:bg-muted/40 group flex items-center justify-between py-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex size-8 items-center justify-center rounded-lg">
                    <MessageSquare className="size-4" />
                  </div>
                  <span className="text-foreground text-xs font-bold">
                    WhatsApp
                  </span>
                </div>
                <div className="text-foreground-muted group-hover:text-foreground flex items-center gap-1 text-[11px] font-medium transition-colors">
                  <span>
                    {t("overview.dispatchesUnit", {
                      count: waStats?.sent_count || 0,
                    })}{" "}
                    •{" "}
                    {t("overview.devicesUnit", {
                      count: waStats?.device_count || 0,
                    })}
                  </span>
                  <ChevronRight className="size-3.5" />
                </div>
              </Link>

              {/* WABA */}
              <Link
                href="/waba"
                className="hover:bg-muted/40 group flex items-center justify-between py-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-teal-500/15 text-teal-600 dark:text-teal-400 flex size-8 items-center justify-center rounded-lg">
                    <Bot className="size-4" />
                  </div>
                  <span className="text-foreground text-xs font-bold">WABA</span>
                </div>
                <div className="text-foreground-muted group-hover:text-foreground flex items-center gap-1 text-[11px] font-medium transition-colors">
                  <span>
                    {t("overview.dispatchesUnit", {
                      count: wabaStats?.sent_count || 0,
                    })}{" "}
                    •{" "}
                    {t("overview.devicesUnit", {
                      count: wabaStats?.device_count || 0,
                    })}
                  </span>
                  <ChevronRight className="size-3.5" />
                </div>
              </Link>

              {/* Telegram */}
              <Link
                href="/tele"
                className="hover:bg-muted/40 group flex items-center justify-between py-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-sky-500/15 text-sky-600 dark:text-sky-400 flex size-8 items-center justify-center rounded-lg">
                    <Send className="size-4" />
                  </div>
                  <span className="text-foreground text-xs font-bold">
                    Telegram
                  </span>
                </div>
                <div className="text-foreground-muted group-hover:text-foreground flex items-center gap-1 text-[11px] font-medium transition-colors">
                  <span>
                    {t("overview.dispatchesUnit", {
                      count: teleStats?.sent_count || 0,
                    })}{" "}
                    •{" "}
                    {t("overview.devicesUnit", {
                      count: teleStats?.device_count || 0,
                    })}
                  </span>
                  <ChevronRight className="size-3.5" />
                </div>
              </Link>

              {/* Email */}
              <div className="group flex items-center justify-between py-3 opacity-80">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/15 text-purple-600 dark:text-purple-400 flex size-8 items-center justify-center rounded-lg">
                    <Mail className="size-4" />
                  </div>
                  <span className="text-foreground text-xs font-bold">Email</span>
                </div>
                <div className="text-foreground-muted flex items-center gap-1 text-[11px] font-medium">
                  <span>
                    {t("overview.dispatchesUnit", {
                      count: emailStats?.sent_count || 0,
                    })}{" "}
                    •{" "}
                    {t("overview.emailsUnit", {
                      count: emailStats?.device_count || 0,
                    })}
                  </span>
                  <ChevronRight className="size-3.5" />
                </div>
              </div>
            </div>

            {/* Quick Action Buttons: Inbox & History */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <Link href="/conversations" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border hover:border-foreground-muted w-full justify-center gap-1.5 rounded-full text-xs font-bold"
                >
                  <Inbox className="size-3.5" />
                  <span>{t("overview.inbox")}</span>
                </Button>
              </Link>

              <Link href="/wa/logs" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border hover:border-foreground-muted w-full justify-center gap-1.5 rounded-full text-xs font-bold"
                >
                  <History className="size-3.5" />
                  <span>{t("overview.history")}</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card D: Campaign aktif */}
          <Card className="border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                {t("overview.activeCampaigns")}
              </h2>
              <Link
                href="/campaigns"
                className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1 text-xs font-bold transition-colors"
              >
                <span>{t("overview.all")}</span>
                <span className="text-[11px]">→</span>
              </Link>
            </div>

            {activeCampaigns.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {activeCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="border-border/60 bg-muted/20 space-y-1.5 rounded-xl border p-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-foreground truncate">
                        {camp.name}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                        {camp.progress}%
                      </span>
                    </div>
                    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        style={{ width: `${camp.progress}%` }}
                        className="bg-emerald-500 h-full rounded-full transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-foreground-muted mb-2 text-xs font-semibold">
                  {t("overview.noCampaigns")}
                </p>
                <Link
                  href="/campaigns"
                  className="text-foreground text-xs font-bold underline hover:opacity-80"
                >
                  {t("overview.openCampaign")}
                </Link>
              </div>
            )}
          </Card>

          {/* Card E: Antrian terjadwal */}
          <Card className="border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                {t("overview.scheduledQueue")}
              </h2>
              <Link
                href="/campaigns"
                className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1 text-xs font-bold transition-colors"
              >
                <span>{t("overview.manage")}</span>
                <span className="text-[11px]">→</span>
              </Link>
            </div>

            {scheduledQueues.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {scheduledQueues.map((item) => (
                  <div
                    key={item.id}
                    className="border-border/60 bg-muted/20 flex items-center justify-between rounded-xl border p-3 text-xs"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <span className="text-foreground block font-bold truncate">
                        {item.name}
                      </span>
                      <span className="text-foreground-muted text-[10px]">
                        {item.total_recipients} target
                      </span>
                    </div>
                    <div className="text-foreground-muted text-[10px] font-mono whitespace-nowrap">
                      {item.scheduled_at
                        ? new Date(item.scheduled_at).toLocaleDateString(
                            locale === "en" ? "en-US" : "id-ID",
                            { day: "numeric", month: "short" },
                          )
                        : "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-foreground-muted mb-2 text-xs font-semibold">
                  {t("overview.noScheduledMessages")}
                </p>
                <Link
                  href="/campaigns"
                  className="text-foreground text-xs font-bold underline hover:opacity-80"
                >
                  {t("overview.scheduleDispatch")}
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export { UserDashboardOverview as OverviewSellerDashboard };
