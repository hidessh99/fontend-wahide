"use client";

import React from "react";
import Link from "next/link";
import { useDevices } from "@/services/whatsapp/hooks/useDevices";
import { useSubscription } from "@/services/subscription/hooks/useSubscription";
import { useCampaigns } from "@/services/campaign/hooks/useCampaigns";
import { useContacts } from "@/services/contact/hooks/useContacts";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Send,
  Users,
  Zap,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Radio,
  Layers,
} from "lucide-react";

export function DashboardOverviewView() {
  const { devices } = useDevices();
  const { subscription } = useSubscription();
  const { campaigns } = useCampaigns();
  const { contacts } = useContacts();

  const connectedDevices = devices.filter((d) => d.status === "CONNECTED");
  const quotaRemaining = subscription
    ? Math.max(0, subscription.quotaTotal - subscription.quotaUsed)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-wise-green/15 text-wise-green">
              <Zap className="size-3.5" />
              <span>Wahide Gateway Enterprise</span>
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
              <span>Perangkat</span>
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
            {connectedDevices.length} / {devices.length} Sesi
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            {connectedDevices.length > 0 ? "Node Aktif & Siap Kirim" : "Belum Ada Node Terhubung"}
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
            Dari {subscription?.quotaTotal.toLocaleString("id-ID") || 0} kuota bulanan
          </span>
        </div>

        {/* Contacts Count */}
        <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Buku Kontak
            </span>
            <div className="size-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground tracking-tight">
            {contacts.length} Kontak
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            Tersimpan dalam antrean
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
            {campaigns.length} Batch
          </div>
          <span className="text-[11px] font-semibold text-foreground-muted block">
            Antrean Spintax &amp; Jitter
          </span>
        </div>
      </div>

      {/* Main 2-Column Split: Active Devices & Broadcast Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active WhatsApp Devices with Error Boundary */}
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

        {/* Broadcast Campaigns Activity with Error Boundary */}
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

            {campaigns.length === 0 ? (
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
