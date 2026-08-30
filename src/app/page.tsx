"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/public/PublicHeader";
import { PublicFooter } from "@/components/layout/public/PublicFooter";
import { parseSpintax } from "@/lib/utils";
import {
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function HomePage() {
  const [spintaxInput, setSpintaxInput] = useState(
    "{Halo|Hai|Selamat Pagi} {Bpk/Ibu|Kak}, pesanan #{1001|1002|1003} sedang {diproses|dikemas}."
  );
  const [spintaxOutput, setSpintaxOutput] = useState(() =>
    parseSpintax("{Halo|Hai|Selamat Pagi} {Bpk/Ibu|Kak}, pesanan #{1001|1002|1003} sedang {diproses|dikemas}.")
  );

  const handleRandomizeSpintax = () => {
    setSpintaxOutput(parseSpintax(spintaxInput));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* 🌟 Modular Public Header */}
      <PublicHeader />

      {/* 🚀 Hero Section (Wise Massive Billboard Typography) */}
      <main className="flex-1">
        <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
          <div className="space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-surface dark:bg-[#161715] px-4 py-2 border border-border text-xs font-bold shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-wise-green" />
              <span>Phase 1 Completed: Wise Design System & Modular Layouts Ready</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.88] text-foreground">
              WhatsApp Gateway tanpa batas memori.
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-foreground-secondary leading-relaxed max-w-2xl">
              Platform SaaS WhatsApp Multi-Tenant & Multi-Device berkinerja tinggi dengan Session Hibernation, 5 Lapis Anti-Ban, dan arsitektur Go Microservices.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/register">
                <Button variant="primaryPill" size="lg" className="text-lg font-bold gap-3 shadow-sm">
                  <span>Mulai Sekarang (Free Trial)</span>
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outlinePill" size="lg" className="text-lg font-bold">
                  Masuk ke Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* 📊 Key Metric Showcase Cards (Wise Rounded 30px Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-8 border-t border-border">
            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Device Scale</p>
              <p className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">10k+</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">Active WhatsApp sessions</p>
            </div>

            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">RAM Savings</p>
              <p className="text-4xl sm:text-5xl font-black text-dark-green dark:text-wise-green mt-2 leading-none">95%</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">Session Hibernation</p>
            </div>

            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Wakeup Latency</p>
              <p className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">&lt;0.3s</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">On-Demand Noise resume</p>
            </div>

            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Anti-Ban Protection</p>
              <p className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">5 Lapis</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">Spintax, Presence & Jitter</p>
            </div>
          </div>
        </section>

        {/* 🧩 Interactive Spintax Tester Section */}
        <section id="spintax" className="py-16 bg-surface dark:bg-[#161715] border-y border-border px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(159,232,112,0.15)] px-3 py-1 text-xs font-bold text-dark-green dark:text-wise-green">
                <Sparkles className="size-3.5" />
                <span>Live Anti-Ban Spintax Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[0.95] text-foreground">
                Uji Coba Spintax Real-Time
              </h2>
              <p className="text-sm font-semibold text-foreground-secondary">
                Sistem Spintax mengacak variasi kata dalam pesan agar algoritma Meta tidak mendeteksi spam hash berulang.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2">
                  Template Spintax
                </label>
                <textarea
                  rows={3}
                  value={spintaxInput}
                  onChange={(e) => {
                    setSpintaxInput(e.target.value);
                    setSpintaxOutput(parseSpintax(e.target.value));
                  }}
                  className="w-full rounded-[20px] bg-background text-foreground font-semibold p-4 border border-border focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none text-sm transition"
                />
              </div>

              <div className="rounded-[24px] bg-[#eef2eb] dark:bg-[#212320] p-6 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
                    Hasil Acak WhatsApp (Client Preview)
                  </span>
                  <Button
                    variant="primaryPill"
                    size="sm"
                    onClick={handleRandomizeSpintax}
                    className="gap-2 text-xs font-bold"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Acak Variasi Baru</span>
                  </Button>
                </div>
                <p className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
                  {spintaxOutput || "Silakan masukkan template di atas..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🛡️ Core Pillars & Architecture */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[0.95] text-foreground">
              Dirancang untuk keandalan maksimal.
            </h2>
            <p className="text-base font-semibold text-foreground-secondary">
              Infrastruktur terdistribusi yang menggabungkan Go Microservices, Redis 7.x Streams, dan Next.js 16.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-[30px] bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
              <div className="h-12 w-12 rounded-full bg-wise-green text-dark-green flex items-center justify-center font-bold">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">5 Lapis Sistem Anti-Ban</h3>
              <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
                Spintax regex parser, simulasi human typing ChatPresenceComposing, dynamic jitter delay 3-7 detik, kuota account warmup, dan goroutine concurrency throttling.
              </p>
            </div>

            <div className="rounded-[30px] bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
              <div className="h-12 w-12 rounded-full bg-wise-green text-dark-green flex items-center justify-center font-bold">
                <Zap className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Zero-Heap Event Filter</h3>
              <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
                Membuang jutaan event story, call offer, dan centang abu-abu di baris pertama untuk menjamin alokasi RAM Go tetap stabil di bawah 150 MB.
              </p>
            </div>

            <div className="rounded-[30px] bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
              <div className="h-12 w-12 rounded-full bg-wise-green text-dark-green flex items-center justify-center font-bold">
                <Layers className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">9 Domain Services Terisolasi</h3>
              <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
                Arsitektur frontend modular terisolasi (IAM, WhatsApp, Campaign, Contact, Subscription, Finance, Support, Content, Admin) yang siap untuk multi-domain.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ⚓ Modular Public Footer */}
      <PublicFooter />
    </div>
  );
}
