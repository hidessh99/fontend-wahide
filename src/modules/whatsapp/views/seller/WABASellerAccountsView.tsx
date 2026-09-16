"use client";

import React, { useState } from "react";
import { useWABAAccounts } from "../../hooks/useWABAAccounts";
import { ConnectWABAModal } from "../../components/seller/ConnectWABAModal";
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
} from "lucide-react";
import { WABAAccount } from "../../types/waba.types";

export function WABASellerAccountsView() {
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
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const handleDisconnect = async (id: string, name: string) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin memutuskan integrasi Meta WABA untuk "${name}"? Pesan resmi tidak akan dapat dikirim melalui nomor ini.`,
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
        {formatted} / hari
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* 1. Header & Dual-Mode CTA Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Device WABA
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Hubungkan nomor WhatsApp Business via Meta Embedded Signup.
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
            Mode Pengembang: Input Manual Kredensial
          </button>
        </div>
      </div>

      {/* 2. Kirisan Contextual Notice Callout Box */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed space-y-1.5 shadow-2xs">
        <p>
          Saat Anda klik <strong className="text-foreground font-semibold">Hubungkan dengan Meta</strong>, Anda masuk dengan Meta untuk menautkan nomor. Chat yang sudah ada dan aplikasi WhatsApp Business di ponsel tetap berjalan — pastikan aplikasinya versi v2.24.17 atau lebih baru.
        </p>
        <p>
          Jika Meta mengeluarkan Anda nanti, gunakan <strong className="text-foreground font-semibold">Hubungkan ulang</strong> pada baris itu. Token API dan paket berbayar tetap sama — jangan putuskan lalu tambah lagi.
        </p>
      </div>

      {/* 3. Search and Action Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pilih kolom pencarian..."
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
          <span>Segarkan</span>
        </Button>
      </div>

      {/* 4. Enterprise Table Layout matching Kirisan */}
      <div className="rounded-xl border border-border/70 bg-card text-card-foreground shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                <th className="py-3 px-4">Nama Tampilan</th>
                <th className="py-3 px-4">Telepon</th>
                <th className="py-3 px-4">Paket</th>
                <th className="py-3 px-4">Kredit</th>
                <th className="py-3 px-4">Quality Rating</th>
                <th className="py-3 px-4">ID Nomor Telepon</th>
                <th className="py-3 px-4">ID WABA</th>
                <th className="py-3 px-4">Token API</th>
                <th className="py-3 px-4">Dibuat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                      <p className="text-xs text-muted-foreground">
                        Memuat data akun WhatsApp Official...
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
                    Belum ada data.
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
                        WABA REGULAR
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
                        Aktif
                      </Badge>
                    </td>

                    {/* Dibuat */}
                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(account.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 justify-end">
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
                          <span>Putuskan</span>
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
    </div>
  );
}
