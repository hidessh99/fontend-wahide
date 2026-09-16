"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export function WhatsAppStatsView() {
  const dailySent = 1420;
  const dailyLimit = 5000;
  const dailyPercent = Math.round((dailySent / dailyLimit) * 100);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Statistik WhatsApp Web (Unofficial)
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Pantau kesehatan slot fisik HP, rasio keberhasilan pengiriman socket whatsmeow, dan skor proteksi anti-ban.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs font-semibold">
          <RefreshCw className="mr-1.5 size-3.5" />
          <span>Muat Ulang</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Devices */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Perangkat Terkoneksi</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Smartphone className="size-4" />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-black text-foreground">
              3 <span className="text-xs text-foreground-muted font-normal">/ 5 slot</span>
            </p>
          </div>
          <p className="text-foreground-muted text-[11px]">HP aktif mengirim & menerima pesan</p>
        </div>

        {/* Daily Sent Messages */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Pesan Terkirim Hari Ini</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-black text-foreground">
              {dailySent.toLocaleString()}
            </p>
          </div>
          <p className="text-foreground-muted text-[11px]">Akumulasi pesan broadcast & direct</p>
        </div>

        {/* Delivery Rate */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Delivery ACK Rate</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-wise-green/15 text-dark-green dark:text-wise-green">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-black text-foreground">
              98.6%
            </p>
          </div>
          <p className="text-foreground-muted text-[11px]">Pesan sampai di perangkat penerima</p>
        </div>

        {/* Anti-Ban Health */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">Tingkat Anti-Ban</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              OPTIMAL (TIER 5)
            </span>
          </div>
          <p className="text-foreground-muted text-[11px]">5 Lapis proteksi warmup aktif</p>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Quota Card */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-foreground text-sm font-bold">Batas Rekomendasi Broadcast Harian</h3>
              <p className="text-foreground-secondary text-xs">Untuk menjaga reputasi nomor WhatsApp Anda</p>
            </div>
            <span className="font-mono text-sm font-bold text-foreground">{dailyPercent}%</span>
          </div>

          <Progress value={dailyPercent} className="h-2.5" />

          <div className="flex items-center justify-between text-xs text-foreground-muted font-mono">
            <span>Terpakai: {dailySent.toLocaleString()} pesan</span>
            <span>Batas aman: {dailyLimit.toLocaleString()} pesan/hari</span>
          </div>
        </div>

        {/* 5-Layer Anti-Ban Overview */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-wise-green/15 text-dark-green dark:text-wise-green">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-bold">5-Layer Anti-Ban Warmup Engine</h3>
              <p className="text-foreground-secondary text-xs">Teknologi otomatis menjaga nomor HP tidak diblokir</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5">
              <p className="font-semibold text-foreground">1. Dynamic Jitter Delay</p>
              <p className="text-[11px] text-foreground-muted">Jeda acak 3 - 8 detik per pesan</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5">
              <p className="font-semibold text-foreground">2. Human Typing Simulation</p>
              <p className="text-[11px] text-foreground-muted">Simulasi mengetik sebelum kirim</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5">
              <p className="font-semibold text-foreground">3. Multi-Device Rotation</p>
              <p className="text-[11px] text-foreground-muted">Distribusi beban antar slot HP</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5">
              <p className="font-semibold text-foreground">4. Spintax Randomization</p>
              <p className="text-[11px] text-foreground-muted">Variasi teks anti-duplikasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
