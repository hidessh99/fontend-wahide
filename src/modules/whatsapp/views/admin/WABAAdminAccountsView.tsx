"use client";

import React, { useState } from "react";
import { useWABAAccounts } from "../../hooks/useWABAAccounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Phone,
  Layers,
  Globe,
  Check,
} from "lucide-react";
import { WABAAccount } from "../../types/waba.types";
import { useI18n } from "@/lib/i18n/context";

export function WABAAdminAccountsView() {
  const { t } = useI18n();
  const {
    filteredAccounts,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchAccounts,
    disconnectAccount,
  } = useWABAAccounts();

  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const handleDisconnect = async (id: string, name: string) => {
    if (
      !confirm(
        t("admin.wabaAccounts.confirmDisconnect", { name }),
      )
    ) {
      return;
    }
    setDisconnectingId(id);
    try {
      await disconnectAccount(id);
    } finally {
      setDisconnectingId(null);
    }
  };

  const displayedAccounts = filteredAccounts.filter((acc) => {
    if (ratingFilter === "ALL") return true;
    return acc.meta_quality_rating?.toUpperCase() === ratingFilter;
  });

  // Calculate platform-wide WABA metrics
  const totalAccounts = filteredAccounts.length;
  const greenAccounts = filteredAccounts.filter(
    (a) => a.meta_quality_rating?.toUpperCase() === "GREEN",
  ).length;
  const enterpriseTierAccounts = filteredAccounts.filter(
    (a) =>
      a.meta_messaging_tier === "TIER_100K" ||
      a.meta_messaging_tier === "UNLIMITED" ||
      a.meta_messaging_tier === "TIER_10K",
  ).length;
  const activeWebhooks = filteredAccounts.filter((a) => a.is_active).length;

  const getQualityBadge = (rating?: string) => {
    switch (rating?.toUpperCase()) {
      case "GREEN":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px] font-bold">
            <CheckCircle2 className="h-2.5 w-2.5" />
            GREEN
          </Badge>
        );
      case "YELLOW":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[10px] font-bold">
            <AlertTriangle className="h-2.5 w-2.5" />
            YELLOW
          </Badge>
        );
      case "RED":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1 text-[10px] font-bold">
            <AlertTriangle className="h-2.5 w-2.5" />
            RED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
            {rating || "UNKNOWN"}
          </Badge>
        );
    }
  };

  const getTierBadge = (tier?: string) => {
    const isHigh =
      tier === "TIER_100K" || tier === "UNLIMITED" || tier === "TIER_10K";
    return (
      <span
        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          isHigh
            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
            : "bg-muted text-foreground-secondary border-border"
        }`}
      >
        {tier || "TIER_250"}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* 1. Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 sm:size-9">
              <ShieldCheck className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("admin.wabaAccounts.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("admin.wabaAccounts.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAccounts()}
            disabled={isLoading}
            className="border-border/80 text-xs font-semibold rounded-full h-8 px-3"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("admin.wabaAccounts.reload")}</span>
          </Button>
        </div>
      </div>

      {/* 2. Platform Summary Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Accounts */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.wabaAccounts.statTotalAccounts")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ShieldCheck className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-foreground">
            {isLoading ? <Skeleton className="h-7 w-12" /> : totalAccounts}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.wabaAccounts.statTotalAccountsDesc")}
          </p>
        </div>

        {/* Green Quality Rating */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.wabaAccounts.statGreenQuality")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-12" /> : greenAccounts}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.wabaAccounts.statGreenQualityDesc")}
          </p>
        </div>

        {/* Enterprise Tiers */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.wabaAccounts.statEnterpriseTiers")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Zap className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-foreground">
            {isLoading ? <Skeleton className="h-7 w-12" /> : enterpriseTierAccounts}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.wabaAccounts.statEnterpriseTiersDesc")}
          </p>
        </div>

        {/* Webhooks Active */}
        <div className="bg-surface border-border rounded-xl border p-4 shadow-2xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              {t("admin.wabaAccounts.statLiveWebhooks")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-wise-green/15 text-dark-green dark:text-wise-green">
              <Globe className="size-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-foreground">
            {isLoading ? <Skeleton className="h-7 w-12" /> : activeWebhooks}
          </div>
          <p className="text-foreground-muted mt-0.5 text-[11px]">
            {t("admin.wabaAccounts.statLiveWebhooksDesc")}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-surface border-border flex flex-col gap-3 rounded-2xl border p-4 shadow-xs dark:bg-[#151614] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="text-foreground-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("admin.wabaAccounts.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border/80 h-9 rounded-full pl-9 text-xs focus-visible:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto">
          {["ALL", "GREEN", "YELLOW", "RED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setRatingFilter(status)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                ratingFilter === status
                  ? "bg-rose-600 text-white shadow-2xs dark:bg-rose-600"
                  : "bg-muted/60 text-foreground-secondary hover:text-foreground border border-border/80"
              }`}
            >
              {status === "ALL" ? t("admin.wabaAccounts.filterAll") : status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Data Table */}
      <div className="bg-surface border-border rounded-2xl border shadow-xs overflow-hidden dark:bg-[#151614]">
        <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2 text-xs font-black text-foreground">
            <Layers className="size-4 text-rose-500" />
            <span>{t("admin.wabaAccounts.listTitle")}</span>
          </div>
          <span className="text-[11px] font-mono text-foreground-muted">
            {t("admin.wabaAccounts.showingAccounts", { count: displayedAccounts.length })}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : displayedAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-foreground-muted mb-3">
              <ShieldCheck className="size-6" />
            </div>
            <p className="text-sm font-bold text-foreground">
              {t("admin.wabaAccounts.emptyTitle")}
            </p>
            <p className="text-xs text-foreground-secondary mt-1 max-w-sm">
              {searchQuery
                ? t("admin.wabaAccounts.emptyDescMatch")
                : t("admin.wabaAccounts.emptyDescDefault")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b border-border/80 text-foreground-muted font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">{t("admin.wabaAccounts.colAccount")}</th>
                  <th className="py-3.5 px-4">{t("admin.wabaAccounts.colQuality")}</th>
                  <th className="py-3.5 px-4">{t("admin.wabaAccounts.colLimit")}</th>
                  <th className="py-3.5 px-4">{t("admin.wabaAccounts.colIdentifiers")}</th>
                  <th className="py-3.5 px-4">{t("admin.wabaAccounts.colEndpoint")}</th>
                  <th className="py-3.5 px-4 text-right">{t("admin.wabaAccounts.colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium text-foreground">
                {displayedAccounts.map((account: WABAAccount) => (
                  <tr
                    key={account.id}
                    className="hover:bg-muted/30 transition-colors duration-150"
                  >
                    {/* Akun & Nomor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <span>{account.verified_name || account.name}</span>
                        {account.verified_name && (
                          <span
                            className="text-blue-500 font-bold"
                            title="Meta Verified Business Display Name"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-foreground-muted mt-0.5">
                        <Phone className="size-3 text-muted-foreground" />
                        <span>
                          {account.phone_number || account.phone_number_id}
                        </span>
                      </div>
                    </td>

                    {/* Quality Rating */}
                    <td className="py-3.5 px-4">
                      {getQualityBadge(account.meta_quality_rating)}
                    </td>

                    {/* Messaging Tier */}
                    <td className="py-3.5 px-4">
                      {getTierBadge(account.meta_messaging_tier)}
                    </td>

                    {/* Identifiers */}
                    <td className="py-3.5 px-4 font-mono text-[11px] space-y-0.5">
                      <div className="text-foreground-secondary">
                        <span className="text-foreground-muted">WABA: </span>
                        {account.waba_account_id}
                      </div>
                      <div className="text-foreground-muted text-[10px]">
                        Phone ID: {account.phone_number_id}
                      </div>
                    </td>

                    {/* Webhook Status */}
                    <td className="py-3.5 px-4 text-[11px]">
                      {account.is_active ? (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <Check className="size-3" />
                          <span>{t("admin.wabaAccounts.activeCallback")}</span>
                        </div>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          {t("admin.wabaAccounts.inactiveCallback")}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDisconnect(
                            account.id,
                            account.verified_name || account.name,
                          )
                        }
                        disabled={disconnectingId === account.id}
                        className="h-8 px-2.5 text-xs text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 font-semibold"
                      >
                        <Trash2 className="mr-1 size-3.5" />
                        <span>{t("admin.wabaAccounts.disconnectBtn")}</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WABAAdminAccountsView;
