"use client";

import React, { useState } from "react";
import { useWABAAccounts } from "../../hooks/useWABAAccounts";
import { ConnectWABAModal } from "../../components/seller/ConnectWABAModal";
import { WABAAccountDetailModal } from "../../components/seller/WABAAccountDetailModal";
import { MetaEmbeddedSignupButton } from "../../components/seller/MetaEmbeddedSignupButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  KeyRound,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { WABAAccount } from "../../types/waba.types";
import { useI18n } from "@/lib/i18n/context";

export function WABASellerAccountsView() {
  const { t, locale } = useI18n();
  const {
    filteredAccounts,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchAccounts,
    connectAccount,
    disconnectAccount,
  } = useWABAAccounts();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<WABAAccount | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const handleDisconnect = async (id: string, name: string) => {
    if (
      !confirm(
        t("whatsapp.waba.confirmDisconnect", { name })
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

  const getQualityBadge = (rating: string) => {
    switch (rating?.toUpperCase()) {
      case "GREEN":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
            <CheckCircle2 className="h-2.5 w-2.5" />
            GREEN
          </Badge>
        );
      case "YELLOW":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[10px]">
            <AlertTriangle className="h-2.5 w-2.5" />
            YELLOW
          </Badge>
        );
      case "RED":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1 text-[10px]">
            <AlertTriangle className="h-2.5 w-2.5" />
            RED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 text-[10px]">
            UNKNOWN
          </Badge>
        );
    }
  };

  const getTierBadge = (tier: string) => {
    const formatted = tier?.replace("TIER_", "") || "1K";
    return (
      <Badge variant="secondary" className="font-mono text-[10px] gap-1">
        <Zap className="h-2.5 w-2.5 text-amber-500" />
        {formatted} {t("whatsapp.waba.perDay")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* 1. Header & Dual-Mode CTA Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("whatsapp.waba.pageTitle")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {t("whatsapp.waba.pageSubtitle")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {/* Mode 1: Primary Meta Embedded Signup Button */}
          <MetaEmbeddedSignupButton
            onSuccess={fetchAccounts}
            onManualClick={() => setIsConnectModalOpen(true)}
          />

          {/* Mode 2: Secondary Developer / Enterprise Manual Credential Trigger */}
          <button
            type="button"
            onClick={() => setIsConnectModalOpen(true)}
            className="text-[11px] text-muted-foreground hover:text-foreground hover:underline transition-colors pr-1 font-medium"
          >
            {t("whatsapp.waba.manualDevMode")}
          </button>
        </div>
      </div>

      {/* 2. Kirisan Contextual Notice Callout Box */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed space-y-1.5 shadow-2xs">
        <p>
          {t("whatsapp.waba.calloutText1")}
        </p>
        <p>
          {t("whatsapp.waba.calloutText2")}
        </p>
      </div>

      {/* 3. Search and Action Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("whatsapp.waba.searchColPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchAccounts()}
          disabled={isLoading}
          className="gap-1.5 text-xs h-9"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{t("whatsapp.waba.refreshBtn")}</span>
        </Button>
      </div>

      {/* 4. Enterprise Table Layout matching Kirisan */}
      <div className="rounded-xl border border-border/70 bg-card text-card-foreground shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                <th className="py-3 px-4">{t("whatsapp.waba.colDisplayName")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colPhone")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colPlan")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colCredit")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colQuality")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colPhoneId")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colWabaId")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colApiToken")}</th>
                <th className="py-3 px-4">{t("whatsapp.waba.colCreated")}</th>
                <th className="py-3 px-4 text-right">{t("whatsapp.waba.colAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                      <p className="text-xs text-muted-foreground">
                        {t("whatsapp.waba.loadingAccounts")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-16 text-center text-xs text-muted-foreground font-medium"
                  >
                    {t("whatsapp.waba.noData")}
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account: WABAAccount) => (
                  <tr
                    key={account.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Nama Tampilan */}
                    <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{account.name}</span>
                        {account.verified_name && (
                          <span title={`Terverifikasi: ${account.verified_name}`}>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Telepon */}
                    <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                      {account.phone_number || "-"}
                    </td>

                    {/* Paket */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono gap-1 border-muted-foreground/30"
                      >
                        <Layers className="h-2.5 w-2.5 text-muted-foreground" />
                        {t("whatsapp.waba.regularPlan")}
                      </Badge>
                    </td>

                    {/* Kredit / Tier Limit */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getTierBadge(account.meta_messaging_tier)}
                    </td>

                    {/* Quality Rating */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getQualityBadge(account.meta_quality_rating)}
                    </td>

                    {/* ID Nomor Telepon */}
                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {account.phone_number_id}
                    </td>

                    {/* ID WABA */}
                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {account.waba_account_id}
                    </td>

                    {/* Token API Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1 font-mono">
                        <KeyRound className="h-2.5 w-2.5 text-emerald-600" />
                        {t("whatsapp.waba.tokenActive")}
                      </Badge>
                    </td>

                    {/* Dibuat */}
                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(account.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Detail & Webhook Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAccount(account);
                            setIsDetailModalOpen(true);
                          }}
                          className="h-7 px-2 text-[11px] font-semibold gap-1"
                        >
                          <SlidersHorizontal className="h-3 w-3" />
                          <span>Detail & Webhook</span>
                        </Button>

                        {/* Reconnect Action (Re-trigger Meta pop-up) */}
                        <MetaEmbeddedSignupButton
                          onSuccess={fetchAccounts}
                          onManualClick={() => setIsConnectModalOpen(true)}
                          className="!h-7 !px-2.5 !text-[11px] !bg-neutral-800 hover:!bg-neutral-700"
                        />

                        {/* Disconnect Action */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDisconnect(account.id, account.name)
                          }
                          disabled={disconnectingId === account.id}
                          className="h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{t("whatsapp.waba.disconnect")}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mode 2: Connect WABA Modal (Manual Developer Credentials) */}
      <ConnectWABAModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onSubmit={connectAccount}
      />

      {/* Mode 3: WABA Account Detail & Webhook Routing Modal */}
      <WABAAccountDetailModal
        account={selectedAccount}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAccount(null);
        }}
        onReconnect={() => {
          setIsDetailModalOpen(false);
          setIsConnectModalOpen(true);
        }}
      />
    </div>
  );
}
