"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  AlertTriangle,
  Layers,
} from "lucide-react";

export function WABAStatsView() {
  const freeTierUsed = 184;
  const freeTierMax = 1000;
  const freeTierPercent = Math.round((freeTierUsed / freeTierMax) * 100);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Statistik Meta WABA Official
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Pantau batas kuota harian messaging tier, jendela layanan 24 jam, dan skor kesehatan akun resmi Meta.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs font-semibold">
          <RefreshCw className="mr-1.5 size-3.5" />
          <span>Muat Ulang</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quality Rating */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Quality Rating Meta</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              HIGH (GREEN)
            </span>
          </div>
          <p className="text-foreground-muted text-[11px]">Kualitas transmisi akun optimal</p>
        </div>

        {/* Messaging Tier Limit */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Messaging Tier</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-wise-green/15 text-dark-green dark:text-wise-green">
              <Layers className="size-4" />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-black text-foreground">
              TIER 10K
            </p>
          </div>
          <p className="text-foreground-muted text-[11px]">Maks 10.000 kontak unik per 24 jam</p>
        </div>

        {/* Free Tier Conversations */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Kuota Percakapan Gratis</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-black text-foreground">
              {freeTierUsed} <span className="text-xs text-foreground-muted font-normal">/ {freeTierMax}</span>
            </p>
          </div>
          <p className="text-foreground-muted text-[11px]">Bebas biaya dari Meta per bulan</p>
        </div>

        {/* Active 24-Hour Windows */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Jendela CS 24 Jam Aktif</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-black text-foreground">
              38 Nomor
            </p>
          </div>
          <p className="text-foreground-muted text-[11px]">Bebas kirim pesan teks biasa tanpa HSM</p>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Free Tier Progress */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-foreground text-sm font-bold">Pemakaian Kuota Percakapan Gratis Bulanan</h3>
              <p className="text-foreground-secondary text-xs">Diberikan langsung oleh Meta (1.000 sesi/bulan)</p>
            </div>
            <span className="font-mono text-sm font-bold text-foreground">{freeTierPercent}%</span>
          </div>

          <Progress value={freeTierPercent} className="h-2.5" />

          <div className="flex items-center justify-between text-xs text-foreground-muted font-mono">
            <span>Terpakai: {freeTierUsed} percakapan</span>
            <span>Sisa gratis: {freeTierMax - freeTierUsed} percakapan</span>
          </div>
        </div>

        {/* Safety Margin Rule */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <AlertTriangle className="size-4 text-amber-500" />
            <span>Sistem Proteksi 5-Menit Safety Margin</span>
          </div>
          <p className="text-foreground-secondary text-xs leading-relaxed">
            Untuk mencegah pesan ditolak server Meta saat sesi mendekati menit ke-1440 (24 jam), sistem Wahide memotong batas waktu pada <b>23 jam 55 menit</b>. Jika sisa waktu kurang dari 5 menit, pengiriman otomatis dialihkan menggunakan <b>Template Resmi (HSM)</b>.
          </p>
        </div>
      </div>
    </div>
  );
}
