"use client";

import React from "react";
import Link from "next/link";
import { useDashboardStats } from "@/modules/iam/hooks/useDashboardStats";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { useCampaigns } from "@/modules/campaign/hooks/useCampaigns";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
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
  CreditCard,
  RefreshCw,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

export function DashboardOverviewView() {
  const { isSuperAdmin, userStats, adminStats, isLoading, error, refetch } = useDashboardStats();
  const { devices } = useDevices();
  const { campaigns } = useCampaigns();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8">
        <div className="space-y-3 rounded-md border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 rounded-full text-xs font-bold"
          >
            <RefreshCw className="size-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      </div>
    );
  }

  if (isSuperAdmin && adminStats) {
    return <AdminDashboardOverview stats={adminStats} />;
  }

  return (
    <UserDashboardOverview
      stats={
        userStats || {
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
        }
      }
      devices={devices}
      campaigns={campaigns}
    />
  );
}

// =========================================================================
// 1. SELLER / USER DASHBOARD VIEW
// =========================================================================

interface UserDashboardOverviewProps {
  stats: NonNullable<ReturnType<typeof useDashboardStats>["userStats"]>;
  devices: ReturnType<typeof useDevices>["devices"];
  campaigns: ReturnType<typeof useCampaigns>["campaigns"];
}

function UserDashboardOverview({ stats, devices, campaigns }: UserDashboardOverviewProps) {
  const connectedCount =
    stats.connected_devices || devices.filter((d) => d.status === "CONNECTED").length;
  const totalDevCount = stats.total_devices || devices.length;
  const quotaRemaining = Math.max(0, stats.monthly_message_limit - stats.total_messages_sent);

  const isFreePlan =
    !stats.plan_name ||
    stats.plan_name.toUpperCase() === "FREE" ||
    stats.plan_name.toUpperCase() === "STARTER";

  let expirationLabel = "Masa Aktif Langganan: Selamanya (Unlimited)";
  let isExpiringSoon = false;
  let isExpired = false;

  if (!isFreePlan && stats.subscription_expires_at) {
    const expDate = new Date(stats.subscription_expires_at);
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = expDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (diffDays <= 0 || stats.plan_status === "EXPIRED") {
      isExpired = true;
      expirationLabel = `Masa Aktif Berakhir (${formattedDate})`;
    } else if (diffDays <= 7) {
      isExpiringSoon = true;
      expirationLabel = `Berlaku s/d ${formattedDate} (Sisa ${diffDays} Hari)`;
    } else {
      expirationLabel = `Berlaku s/d ${formattedDate} (Sisa ${diffDays} Hari)`;
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
                    : "bg-surface text-foreground-secondary border-border dark:bg-[#161715]"
              }`}
            >
              <span className="text-foreground font-black">Paket {stats.plan_name}</span>
              <span className="text-foreground-muted">•</span>
              <span>
                {isFreePlan ? "Masa Aktif Langganan: Selamanya (Unlimited)" : expirationLabel}
              </span>
            </span>

            <Link
              href="/subscription"
              className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold transition hover:opacity-85"
            >
              <span>
                {isFreePlan
                  ? "Tingkatkan Paket"
                  : isExpiringSoon || isExpired
                    ? "Perpanjang"
                    : "Ubah Paket"}
              </span>
              <ArrowUpRight className="stroke-2.5 size-3" />
            </Link>
          </div>
          <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
            Dasbor Bisnis &amp; Ringkasan
          </h1>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            Pantau status operasional gateway WhatsApp, sisa kuota bulanan, dan antrean kampanye
            broadcast pesan.
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
                Perangkat ({totalDevCount}/{stats.device_limit})
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
              <span>Broadcast Baru</span>
            </Button>
          </Link>
        </div>
      </div>
      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Device Status */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-4 sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              WhatsApp Terhubung
            </span>
            <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 items-center justify-center rounded-full">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {connectedCount} / {totalDevCount} Sesi
          </div>
          <span className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {connectedCount > 0 ? "Node Aktif & Siap Kirim" : "Belum Ada Node Terhubung"}
          </span>
        </div>

        {/* Quota Remaining */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              Sisa Kuota Pesan
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-sky-500/15 text-sky-500">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {quotaRemaining.toLocaleString("id-ID")}
          </div>
          <span className="text-foreground-muted block text-[11px] font-semibold">
            Dari {stats.monthly_message_limit.toLocaleString("id-ID")} kuota bulanan
          </span>
        </div>

        {/* Contacts Count & Balance */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              Buku Kontak &amp; Saldo
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {stats.total_contacts.toLocaleString("id-ID")} Kontak
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-foreground-muted text-[11px] font-semibold">
              Saldo:{" "}
              <strong className="text-foreground font-mono">
                Rp {stats.balance.toLocaleString("id-ID")}
              </strong>
            </span>
            <Link
              href="/billing"
              className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition hover:opacity-80"
            >
              <Plus className="size-2.5" />
              <span>Top-Up</span>
            </Link>
          </div>
        </div>

        {/* Campaigns Count */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              Kampanye Aktif
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
              <Send className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {stats.total_campaigns || campaigns.length} Batch
          </div>
          <span className="text-foreground-muted block text-[11px] font-semibold">
            {stats.total_messages_sent.toLocaleString("id-ID")} Pesan Terkirim
          </span>
        </div>
      </div>{" "}
      {/* Main 2-Column Split: Active Devices & Broadcast Campaigns / Recent Invoices */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Active WhatsApp Devices */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Ringkasan Sesi WhatsApp">
          <div className="border-border bg-surface space-y-4 rounded-md border p-4 sm:p-6 dark:bg-[#161715]">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Radio className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  Node Sesi WhatsApp
                </h2>
              </div>
              <Link
                href="/devices"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {devices.length === 0 ? (
              <div className="text-foreground-secondary p-6 text-center text-xs sm:p-8">
                Belum ada perangkat yang terhubung.
              </div>
            ) : (
              <div className="space-y-2.5">
                {devices.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    className="border-border bg-surface flex items-center justify-between rounded-md border p-3 dark:bg-[#10110e]"
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
                          +{d.phone || "Menunggu Pairing"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        d.status === "CONNECTED"
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      <CheckCircle2 className="size-2.5" />
                      <span>{d.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ErrorBoundary>

        {/* Broadcast Campaigns & Invoices Activity */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Ringkasan Kampanye">
          <div className="border-border bg-surface space-y-4 rounded-md border p-4 sm:p-6 dark:bg-[#161715]">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Layers className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  Kampanye Broadcast Terkini
                </h2>
              </div>
              <Link
                href="/campaigns"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {campaigns.length === 0 &&
            (!stats.recent_invoices || stats.recent_invoices.length === 0) ? (
              <div className="text-foreground-secondary p-8 text-center text-xs">
                Belum ada kampanye siaran yang dibuat.
              </div>
            ) : (
              <div className="space-y-2.5">
                {campaigns.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="border-border bg-surface flex items-center justify-between rounded-md border p-3 dark:bg-[#10110e]"
                  >
                    <div className="space-y-0.5">
                      <span className="text-foreground block text-xs font-bold">{c.name}</span>
                      <span className="text-foreground-muted block text-[10px]">
                        {c.sentCount} dari {c.totalRecipients} pesan terkirim
                      </span>
                    </div>

                    <span className="bg-light-mint dark:bg-wise-green/10 text-dark-green dark:text-wise-green border-wise-green/30 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                      <ShieldCheck className="size-2.5" />
                      <span>{c.status}</span>
                    </span>
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

// =========================================================================
// 2. SUPER ADMIN DASHBOARD VIEW
// =========================================================================

interface AdminDashboardOverviewProps {
  stats: NonNullable<ReturnType<typeof useDashboardStats>["adminStats"]>;
}

function AdminDashboardOverview({ stats }: AdminDashboardOverviewProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Welcome & Quick Action Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-500">
              <ShieldCheck className="size-3.5" />
              <span>Super Administrator Portal</span>
            </span>
          </div>
          <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
            Dasbor Platform &amp; Analitik Global
          </h1>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            Pantau kesehatan kluster server, total pengguna &amp; organisasi bisnis, serta volume
            pesan gateway WhatsApp di seluruh sistem.
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
              <span>Kelola Pengguna</span>
            </Button>
          </Link>
          <Link href="/admin/plans">
            <Button
              variant="primaryPill"
              size="sm"
              className="gap-1.5 rounded-full text-xs font-bold shadow-sm"
            >
              <Layers className="size-3.5" />
              <span>Kelola Paket</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Total Users & Tenants */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-4 sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              Pengguna Platform
            </span>
            <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 items-center justify-center rounded-full">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {stats.total_users.toLocaleString("id-ID")} User
          </div>
          <span className="text-foreground-muted block text-[11px] font-semibold">
            {stats.total_tenants.toLocaleString("id-ID")} Organisasi Bisnis
          </span>
        </div>

        {/* WhatsApp Nodes Platform-wide */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-4 sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              Node WhatsApp Global
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {stats.connected_devices} / {stats.total_devices} Sesi
          </div>
          <span className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Koneksi Multi-Device Aktif
          </span>
        </div>

        {/* Messages Platform-wide */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-4 sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              Volume Pesan Gateway
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-sky-500/15 text-sky-500">
              <Send className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            {stats.total_messages_sent.toLocaleString("id-ID")}
          </div>
          <span className="text-foreground-muted block text-[11px] font-semibold">
            Dari {stats.total_campaigns.toLocaleString("id-ID")} Kampanye Broadcast
          </span>
        </div>

        {/* Total Omset & Tickets */}
        <div className="border-border bg-surface space-y-2 rounded-md border p-4 sm:p-5 dark:bg-[#161715]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
              Omset &amp; Tiket Bantuan
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-black tracking-tight">
            Rp {stats.total_transactions.toLocaleString("id-ID")}
          </div>
          <span className="block text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            {stats.active_tickets} Tiket Support Aktif
          </span>
        </div>
      </div>

      {/* Main 2-Column Split for Admin */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent Registered Users */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Pengguna Terbaru">
          <div className="border-border bg-surface space-y-4 rounded-md border p-4 sm:p-6 dark:bg-[#161715]">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Users className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  Pengguna Baru Mendaftar
                </h2>
              </div>
              <Link
                href="/admin/users"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>Kelola Semua</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recent_users.length === 0 ? (
              <div className="text-foreground-secondary p-6 text-center text-xs sm:p-8">
                Belum ada pendaftaran pengguna baru.
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recent_users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="border-border bg-surface flex items-center justify-between rounded-md border p-3 dark:bg-[#10110e]"
                  >
                    <div className="space-y-0.5">
                      <span className="text-foreground block text-xs font-bold">{u.name}</span>
                      <span className="text-foreground-muted block font-mono text-[11px]">
                        {u.email}
                      </span>
                    </div>

                    <span className="bg-foreground/5 text-foreground-secondary border-border inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase">
                      {u.role_name || "seller"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ErrorBoundary>

        {/* Recent Transactions & Financial Overview */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Transaksi Terbaru">
          <div className="border-border bg-surface space-y-4 rounded-md border p-4 sm:p-6 dark:bg-[#161715]">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-dark-green dark:text-wise-green size-4" />
                <h2 className="text-foreground text-sm font-extrabold sm:text-base">
                  Transaksi &amp; Pembayaran Terkini
                </h2>
              </div>
              <Link
                href="/admin/users"
                className="text-dark-green dark:text-wise-green inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <span>Lihat Laporan</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recent_transactions.length === 0 ? (
              <div className="text-foreground-secondary p-6 text-center text-xs sm:p-8">
                Belum ada riwayat transaksi keuangan.
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recent_transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="border-border bg-surface flex items-center justify-between rounded-md border p-3 dark:bg-[#10110e]"
                  >
                    <div className="space-y-0.5">
                      <span className="text-foreground block text-xs font-bold">{tx.title}</span>
                      <span className="text-foreground-muted block font-mono text-[10px]">
                        Ref: {tx.ref}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-right">
                      <span className="text-foreground block text-xs font-bold">
                        Rp {tx.total_price.toLocaleString("id-ID")}
                      </span>
                      <span className="py-0.2 inline-flex items-center rounded bg-emerald-500/10 px-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {tx.status}
                      </span>
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

// =========================================================================
// 3. SKELETON LOADER (CLS = 0)
// =========================================================================

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-2">
          <div className="bg-foreground/10 h-5 w-40 rounded-full" />
          <div className="bg-foreground/10 h-8 w-64 rounded" />
          <div className="bg-foreground/10 h-4 w-96 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="bg-foreground/10 h-9 w-28 rounded-full" />
          <div className="bg-foreground/10 h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-border bg-surface space-y-3 rounded-md border p-4 sm:p-5 dark:bg-[#161715]"
          >
            <div className="flex items-center justify-between">
              <div className="bg-foreground/10 h-3 w-24 rounded" />
              <div className="bg-foreground/10 size-8 rounded-full" />
            </div>
            <div className="bg-foreground/10 h-7 w-32 rounded" />
            <div className="bg-foreground/10 h-3 w-40 rounded" />
          </div>
        ))}
      </div>

      {/* 2 Columns Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border-border bg-surface space-y-4 rounded-md border p-4 sm:p-6 dark:bg-[#161715]"
          >
            <div className="bg-foreground/10 h-5 w-40 rounded" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="bg-foreground/5 h-14 rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
