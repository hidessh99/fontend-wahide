"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/iam/hooks/useAuth";
import {
  Smartphone,
  Send,
  Users,
  Zap,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user, tenant } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner (Wise Rounded Card) */}
      <div className="rounded-[30px] bg-surface dark:bg-[#161715] p-6 sm:p-10 border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(159,232,112,0.15)] px-3.5 py-1 text-xs font-bold text-[#163300] dark:text-[#9fe870]">
            <span className="size-2 rounded-full bg-[#9fe870] animate-pulse" />
            <span>Sesi Gateway Aktif</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Halo, {user?.name || "Partner"}!
          </h1>
          <p className="text-sm font-semibold text-foreground-secondary max-w-xl">
            Kelola slot WhatsApp bisnis Anda, pantau pengiriman broadcast spintax, dan optimalkan kuota bulanan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/devices">
            <Button variant="primaryPill" size="default" className="gap-2">
              <Plus className="size-4" />
              <span>Tambah Perangkat WA</span>
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button variant="secondaryPill" size="default" className="gap-2">
              <Send className="size-4" />
              <span>Buat Broadcast</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-[24px] bg-surface dark:bg-[#161715] p-6 border border-border space-y-1">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Slot Perangkat</span>
            <Smartphone className="size-4 text-[#9fe870]" />
          </div>
          <p className="text-3xl font-black text-foreground pt-2">
            {tenant?.activeDevicesCount || 0}{" "}
            <span className="text-base font-semibold text-foreground-muted">
              / {tenant?.maxDevices || 1}
            </span>
          </p>
          <p className="text-xs font-semibold text-foreground-secondary">
            Perangkat terhubung aktif
          </p>
        </div>

        <div className="rounded-[24px] bg-surface dark:bg-[#161715] p-6 border border-border space-y-1">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Sisa Kuota Pesan</span>
            <Zap className="size-4 text-[#9fe870]" />
          </div>
          <p className="text-3xl font-black text-[#163300] dark:text-[#9fe870] pt-2">
            {((tenant?.monthlyQuota || 1000) - (tenant?.usedQuota || 0)).toLocaleString("id-ID")}
          </p>
          <p className="text-xs font-semibold text-foreground-secondary">
            Dari {tenant?.monthlyQuota?.toLocaleString("id-ID") || "1.000"} kuota bulanan
          </p>
        </div>

        <div className="rounded-[24px] bg-surface dark:bg-[#161715] p-6 border border-border space-y-1">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Total Kontak</span>
            <Users className="size-4 text-[#9fe870]" />
          </div>
          <p className="text-3xl font-black text-foreground pt-2">0</p>
          <p className="text-xs font-semibold text-foreground-secondary">
            Tersimpan di buku telepon
          </p>
        </div>

        <div className="rounded-[24px] bg-surface dark:bg-[#161715] p-6 border border-border space-y-1">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Tingkat Anti-Ban</span>
            <ShieldCheck className="size-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 pt-2">100%</p>
          <p className="text-xs font-semibold text-foreground-secondary">
            5 Lapis proteksi aktif
          </p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-[30px] bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Status Perangkat WhatsApp</h2>
            <Link href="/devices" className="text-xs font-bold text-[#163300] dark:text-[#9fe870] hover:underline flex items-center gap-1">
              <span>Semua Slot</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="rounded-[20px] bg-[#f2f4ef] dark:bg-[#212320] p-6 text-center space-y-3">
            <Smartphone className="size-8 mx-auto text-foreground-muted" />
            <p className="text-sm font-semibold text-foreground">Belum ada perangkat WhatsApp yang dipasangkan.</p>
            <Link href="/devices">
              <Button variant="primaryPill" size="sm">
                Scan QR Code Pairing
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-[30px] bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Kampanye Terakhir</h2>
            <Link href="/campaigns" className="text-xs font-bold text-[#163300] dark:text-[#9fe870] hover:underline flex items-center gap-1">
              <span>Riwayat Blast</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="rounded-[20px] bg-[#f2f4ef] dark:bg-[#212320] p-6 text-center space-y-3">
            <TrendingUp className="size-8 mx-auto text-foreground-muted" />
            <p className="text-sm font-semibold text-foreground">Belum ada kampanye broadcast yang dibuat.</p>
            <Link href="/campaigns">
              <Button variant="secondaryPill" size="sm">
                Mulai Kampanye Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
