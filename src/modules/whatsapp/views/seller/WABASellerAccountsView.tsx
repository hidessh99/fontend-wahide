"use client";

import React, { useState } from "react";
import { useWABAAccounts } from "../../hooks/useWABAAccounts";
import { ConnectWABAModal } from "../../components/seller/ConnectWABAModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShieldCheck,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Phone,
  Webhook,
} from "lucide-react";

export function WABASellerAccountsView() {
  const {
    filteredAccounts,
    stats,
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
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Quality: GREEN
          </Badge>
        );
      case "YELLOW":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Quality: YELLOW
          </Badge>
        );
      case "RED":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Quality: RED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            Quality: UNKNOWN
          </Badge>
        );
    }
  };

  const getTierBadge = (tier: string) => {
    const formatted = tier?.replace("TIER_", "") || "250";
    return (
      <Badge variant="secondary" className="font-mono text-[10px] gap-1">
        <Zap className="h-3 w-3 text-amber-500" />
        Limit: {formatted}/hari
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              WhatsApp Official (Meta WABA Cloud API)
            </h1>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            Kelola nomor resmi WhatsApp Business Platform resmi Meta. Bebas risiko blokir hardware, template pesan terverifikasi, dan kuota broadcast enterprise.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAccounts()}
            disabled={isLoading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Segarkan</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsConnectModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Hubungkan Nomor Meta WABA</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Nomor Terhubung
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {stats.active} nomor aktif melayani pesan resmi
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Meta Health Quality
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.highQuality} / {stats.total || 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Nomor dengan rating GREEN (sangat sehat)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tipe Saluran
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-foreground">
              Meta WhatsApp Cloud API v20.0
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Didukung SLA resmi Meta & enkripsi end-to-end
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama, Phone ID, WABA ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Account List / Empty State */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border/60 bg-surface">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-xs text-muted-foreground">
              Memuat data akun WhatsApp Official...
            </p>
          </div>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <Card className="border-dashed border-2 border-border/80 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {searchQuery
              ? "Tidak ada nomor WABA yang cocok"
              : "Belum ada Nomor WhatsApp Official yang Terhubung"}
          </h3>
          <p className="mt-1.5 max-w-md mx-auto text-xs text-muted-foreground">
            {searchQuery
              ? "Coba ubah kata kunci pencarian Anda."
              : "Hubungkan WABA Account ID, Phone Number ID, dan System Access Token dari Meta Business Manager Anda untuk mulai mengirim pesan resmi centang hijau."}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <Button
                onClick={() => setIsConnectModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold"
              >
                <Plus className="h-4 w-4" />
                <span>Hubungkan Nomor Meta WABA Sekarang</span>
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredAccounts.map((account) => (
            <Card
              key={account.id}
              className="border-border/60 hover:border-emerald-500/40 transition-all duration-150 shadow-xs"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-foreground">
                        {account.name}
                      </CardTitle>
                      {account.verified_name && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1 font-semibold"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {account.verified_name}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs font-mono">
                      {account.phone_number || "Nomor Cloud Resmi"}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    {getQualityBadge(account.meta_quality_rating)}
                    {getTierBadge(account.meta_messaging_tier)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      Phone Number ID
                    </span>
                    <span className="text-foreground font-semibold truncate block">
                      {account.phone_number_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      WABA Account ID
                    </span>
                    <span className="text-foreground font-semibold truncate block">
                      {account.waba_account_id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                    <Webhook className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Webhook Meta Aktif</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDisconnect(account.id, account.name)
                    }
                    disabled={disconnectingId === account.id}
                    className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Putuskan Koneksi</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Connect WABA Modal */}
      <ConnectWABAModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onSubmit={connectAccount}
      />
    </div>
  );
}
