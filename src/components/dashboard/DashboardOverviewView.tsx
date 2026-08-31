"use client";

import React from "react";
import Link from "next/link";
import { useDashboardStats } from "@/services/iam/hooks/useDashboardStats";
import { useDevices } from "@/services/whatsapp/hooks/useDevices";
import { useCampaigns } from "@/services/campaign/hooks/useCampaigns";
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
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="p-6 rounded-md border border-red-500/20 bg-red-500/10 text-center space-y-3">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-full text-xs font-bold gap-1.5"
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
  const connectedCount = stats.connected_devices || devices.filter((d) => d.status === "CONNECTED").length;
  const totalDevCount = stats.total_devices || devices.length;
  const quotaRemaining = Math.max(0, stats.monthly_message_limit - stats.total_messages_sent);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-foreground/5 text-foreground-secondary border border-border">
              Paket {stats.plan_name} ({stats.plan_status})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Dasbor Bisnis &amp; Ringkasan
          </h1>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            Pantau status operasional gateway WhatsApp, sisa kuota bulanan, dan antrean kampanye broadcast pesan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/devices">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted"
            >
              <Smartphone className="size-3.5 text-wise-green" />
              <span>Perangkat ({totalDevCount}/{stats.device_limit})</span>
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button
              variant="primaryPill"
              size="sm"
              className="rounded-full text-xs font-bold gap-1.5 shadow-sm"
            >
              <Plus className="size-3.5" />
              <span>Broadcast Baru</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Device Status */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              WhatsApp Terhubung
            </span>
            <div className="size-8 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {connectedCount} / {totalDevCount} Sesi
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            {connectedCount > 0 ? "Node Aktif & Siap Kirim" : "Belum Ada Node Terhubung"}
          </span>
        </div>

        {/* Quota Remaining */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Sisa Kuota Pesan
            </span>
            <div className="size-8 rounded-full bg-sky-500/15 text-sky-500 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {quotaRemaining.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            Dari {stats.monthly_message_limit.toLocaleString("id-ID")} kuota bulanan
          </span>
        </div>

        {/* Contacts Count & Balance */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Buku Kontak &amp; Saldo
            </span>
            <div className="size-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {stats.total_contacts.toLocaleString("id-ID")} Kontak
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            Saldo: Rp {stats.balance.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Campaigns Count */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Kampanye Aktif
            </span>
            <div className="size-8 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Send className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {stats.total_campaigns || campaigns.length} Batch
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            {stats.total_messages_sent.toLocaleString("id-ID")} Pesan Terkirim
          </span>
        </div>
      </div>

      {/* Main 2-Column Split: Active Devices & Broadcast Campaigns / Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active WhatsApp Devices */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Ringkasan Sesi WhatsApp">
          <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Radio className="size-4 text-wise-green" />
                <h2 className="font-extrabold text-sm sm:text-base text-foreground">
                  Node Sesi WhatsApp
                </h2>
              </div>
              <Link
                href="/devices"
                className="text-xs font-bold text-wise-green hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {devices.length === 0 ? (
              <div className="p-8 text-center text-xs text-foreground-secondary">
                Belum ada perangkat yang terhubung.
              </div>
            ) : (
              <div className="space-y-2.5">
                {devices.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-md border border-border bg-surface dark:bg-[#10110e] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
                        <Smartphone className="size-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-foreground block">{d.name}</span>
                        <span className="text-[11px] text-foreground-muted font-mono">
                          +{d.phone || "Menunggu Pairing"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.status === "CONNECTED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
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
          <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-wise-green" />
                <h2 className="font-extrabold text-sm sm:text-base text-foreground">
                  Kampanye Broadcast Terkini
                </h2>
              </div>
              <Link
                href="/campaigns"
                className="text-xs font-bold text-wise-green hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {campaigns.length === 0 && (!stats.recent_invoices || stats.recent_invoices.length === 0) ? (
              <div className="p-8 text-center text-xs text-foreground-secondary">
                Belum ada kampanye siaran yang dibuat.
              </div>
            ) : (
              <div className="space-y-2.5">
                {campaigns.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-md border border-border bg-surface dark:bg-[#10110e] flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">{c.name}</span>
                      <span className="text-[10px] text-foreground-muted block">
                        {c.sentCount} dari {c.totalRecipients} pesan terkirim
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-wise-green/10 text-wise-green border border-wise-green/20">
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
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/20">
              <ShieldCheck className="size-3.5" />
              <span>Super Administrator Portal</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Dasbor Platform &amp; Analitik Global
          </h1>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            Pantau kesehatan kluster server, total pengguna &amp; organisasi bisnis, serta volume pesan gateway WhatsApp di seluruh sistem.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/users">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted"
            >
              <Users className="size-3.5 text-wise-green" />
              <span>Kelola Pengguna</span>
            </Button>
          </Link>
          <Link href="/admin/plans">
            <Button
              variant="primaryPill"
              size="sm"
              className="rounded-full text-xs font-bold gap-1.5 shadow-sm"
            >
              <Layers className="size-3.5" />
              <span>Kelola Paket</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users & Tenants */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Pengguna Platform
            </span>
            <div className="size-8 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {stats.total_users.toLocaleString("id-ID")} User
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            {stats.total_tenants.toLocaleString("id-ID")} Organisasi Bisnis
          </span>
        </div>

        {/* WhatsApp Nodes Platform-wide */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Node WhatsApp Global
            </span>
            <div className="size-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {stats.connected_devices} / {stats.total_devices} Sesi
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            Koneksi Multi-Device Aktif
          </span>
        </div>

        {/* Messages Platform-wide */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Volume Pesan Gateway
            </span>
            <div className="size-8 rounded-full bg-sky-500/15 text-sky-500 flex items-center justify-center">
              <Send className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {stats.total_messages_sent.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            Dari {stats.total_campaigns.toLocaleString("id-ID")} Kampanye Broadcast
          </span>
        </div>

        {/* Total Omset & Tickets */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Omset &amp; Tiket Bantuan
            </span>
            <div className="size-8 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            Rp {stats.total_transactions.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
            {stats.active_tickets} Tiket Support Aktif
          </span>
        </div>
      </div>

      {/* Main 2-Column Split for Admin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Users */}
        <ErrorBoundary fallbackTitle="Gagal Memuat Pengguna Terbaru">
          <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-wise-green" />
                <h2 className="font-extrabold text-sm sm:text-base text-foreground">
                  Pengguna Baru Mendaftar
                </h2>
              </div>
              <Link
                href="/admin/users"
                className="text-xs font-bold text-wise-green hover:underline inline-flex items-center gap-1"
              >
                <span>Kelola Semua</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recent_users.length === 0 ? (
              <div className="p-8 text-center text-xs text-foreground-secondary">
                Belum ada pendaftaran pengguna baru.
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recent_users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-md border border-border bg-surface dark:bg-[#10110e] flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">{u.name}</span>
                      <span className="text-[11px] text-foreground-muted font-mono block">
                        {u.email}
                      </span>
                    </div>

                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground-secondary border border-border uppercase">
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
          <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-wise-green" />
                <h2 className="font-extrabold text-sm sm:text-base text-foreground">
                  Transaksi &amp; Pembayaran Terkini
                </h2>
              </div>
              <Link
                href="/admin/overview"
                className="text-xs font-bold text-wise-green hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Laporan</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recent_transactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-foreground-secondary">
                Belum ada riwayat transaksi keuangan.
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recent_transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-md border border-border bg-surface dark:bg-[#10110e] flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">{tx.title}</span>
                      <span className="text-[10px] text-foreground-muted font-mono block">
                        Ref: {tx.ref}
                      </span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">
                        Rp {tx.total_price.toLocaleString("id-ID")}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-foreground/10 rounded-full" />
          <div className="h-8 w-64 bg-foreground/10 rounded" />
          <div className="h-4 w-96 bg-foreground/10 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-foreground/10 rounded-full" />
          <div className="h-9 w-32 bg-foreground/10 rounded-full" />
        </div>
      </div>

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-foreground/10 rounded" />
              <div className="size-8 rounded-full bg-foreground/10" />
            </div>
            <div className="h-7 w-32 bg-foreground/10 rounded" />
            <div className="h-3 w-40 bg-foreground/10 rounded" />
          </div>
        ))}
      </div>

      {/* 2 Columns Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 space-y-4">
            <div className="h-5 w-40 bg-foreground/10 rounded" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-14 bg-foreground/5 rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
