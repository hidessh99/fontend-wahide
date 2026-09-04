"use client";

import React from "react";
import Link from "next/link";
import { AdminDashboardStats } from "@/modules/iam/types/dashboard.types";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { useI18n } from "@/lib/i18n/context";
import {
  Smartphone,
  Send,
  Users,
  ArrowRight,
  ShieldCheck,
  Layers,
  CreditCard,
  Wallet,
} from "lucide-react";

interface AdminDashboardOverviewProps {
  stats: AdminDashboardStats;
}

export function AdminDashboardOverview({ stats }: AdminDashboardOverviewProps) {
  const { t, locale } = useI18n();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Welcome & Quick Action Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-500">
              <ShieldCheck className="size-3.5" />
              <span>{t("overview.adminBadge")}</span>
            </span>
          </div>
          <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
            {t("overview.adminDashboardTitle")}
          </h1>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("overview.adminDashboardSubtitle")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link href="/admin/users">
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:border-foreground-muted gap-1.5 rounded-full text-xs font-bold"
            >
              <Users className="text-dark-green dark:text-wise-green size-3.5" />
              <span>{t("overview.adminManageUsers")}</span>
            </Button>
          </Link>
          <Link href="/admin/plans">
            <Button
              variant="primaryPill"
              size="sm"
              className="gap-1.5 rounded-full text-xs font-bold shadow-sm"
            >
              <Layers className="size-3.5" />
              <span>{t("overview.adminManagePlans")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Total Users & Tenants */}
        <div className="border-border bg-surface space-y-2 rounded-xl border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              {t("overview.adminPlatformUsers")}
            </span>
            <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 items-center justify-center rounded-full">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {t("overview.adminUserUnit", {
              count: stats.total_users.toLocaleString(locale === "en" ? "en-US" : "id-ID"),
            })}
          </div>
          <span className="text-foreground-muted block text-[11px] font-semibold">
            {t("overview.adminTenantUnit", {
              count: stats.total_tenants.toLocaleString(locale === "en" ? "en-US" : "id-ID"),
            })}
          </span>
        </div>

        {/* WhatsApp Nodes Platform-wide */}
        <div className="border-border bg-surface space-y-2 rounded-xl border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              {t("overview.adminGlobalNodes")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {t("overview.sessionUnit", {
              connected: stats.connected_devices,
              total: stats.total_devices,
            })}
          </div>
          <span className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {t("overview.adminMultiDeviceActive")}
          </span>
        </div>

        {/* Messages Platform-wide */}
        <div className="border-border bg-surface space-y-2 rounded-xl border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              {t("overview.adminGatewayVolume")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-sky-500/15 text-sky-500">
              <Send className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {stats.total_messages_sent.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
          </div>
          <span className="text-foreground-muted block text-[11px] font-semibold">
            {t("overview.adminCampaignCount", {
              count: stats.total_campaigns.toLocaleString(locale === "en" ? "en-US" : "id-ID"),
            })}
          </span>
        </div>

        {/* Total Omset & Tickets */}
        <div className="border-border bg-surface space-y-2 rounded-xl border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              {t("overview.adminRevenueAndTickets")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            Rp {stats.total_transactions.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
          </div>
          <span className="block text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            {t("overview.adminActiveTickets", { count: stats.active_tickets })}
          </span>
        </div>
      </div>

      {/* Main 2-Column Split for Admin */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent Registered Users */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Pengguna Terbaru">
          <div className="border-border bg-surface space-y-4 rounded-xl border p-4 shadow-xs sm:p-6 dark:bg-[#161715]">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Users className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  {t("overview.adminRecentUsersTitle")}
                </h2>
              </div>
              <Link
                href="/admin/users"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>{t("overview.adminManageAll")}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recent_users.length === 0 ? (
              <EmptyState
                icon={<Users className="size-6" />}
                title={t("overview.adminNoUsersTitle")}
                description={t("overview.adminNoUsersDesc")}
                className="p-6 sm:p-8"
              />
            ) : (
              <div className="space-y-2.5">
                {stats.recent_users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="border-border bg-surface flex items-center justify-between rounded-xl border p-3 dark:bg-[#10110e]"
                  >
                    <div className="space-y-0.5">
                      <span className="text-foreground block text-xs font-bold">{u.name}</span>
                      <span className="text-foreground-muted block font-mono text-[11px]">
                        {u.email}
                      </span>
                    </div>

                    <Badge variant="neutral" className="text-[10px] uppercase">
                      {u.role_name || "seller"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ErrorBoundary>

        {/* Recent Transactions & Financial Overview */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Transaksi Terbaru">
          <div className="border-border bg-surface space-y-4 rounded-xl border p-4 shadow-xs sm:p-6 dark:bg-[#161715]">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  {t("overview.adminRecentTransactionsTitle")}
                </h2>
              </div>
              <Link
                href="/admin/users"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>{t("overview.adminViewReport")}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recent_transactions.length === 0 ? (
              <EmptyState
                icon={<CreditCard className="size-6" />}
                title={t("overview.adminNoTransactionsTitle")}
                description={t("overview.adminNoTransactionsDesc")}
                className="p-6 sm:p-8"
              />
            ) : (
              <div className="space-y-2.5">
                {stats.recent_transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="border-border bg-surface flex items-center justify-between rounded-xl border p-3 dark:bg-[#10110e]"
                  >
                    <div className="space-y-0.5">
                      <span className="text-foreground block text-xs font-bold">{tx.title}</span>
                      <span className="text-foreground-muted block font-mono text-[10px]">
                        {t("overview.adminRef", { ref: tx.ref })}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-right">
                      <span className="text-foreground block text-xs font-bold">
                        Rp {tx.total_price.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                      </span>
                      <Badge variant="success" className="text-[10px]">
                        {tx.status}
                      </Badge>
                    </div>
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
