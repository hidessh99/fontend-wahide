"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/public/PublicHeader";
import { PublicFooter } from "@/components/layout/public/PublicFooter";
import { parseSpintax } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import {
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const DEFAULT_SPINTAX_INPUT =
  "{Halo|Hai|Selamat Pagi} {Bpk/Ibu|Kak}, pesanan #{1001|1002|1003} sedang {diproses|dikemas}.";
const DEFAULT_SPINTAX_OUTPUT =
  "Halo Kak, pesanan #1001 sedang diproses.";

export default function HomePage() {
  const { t } = useI18n();

  const [spintaxInput, setSpintaxInput] = useState(DEFAULT_SPINTAX_INPUT);
  const [spintaxOutput, setSpintaxOutput] = useState(DEFAULT_SPINTAX_OUTPUT);

  const handleRandomizeSpintax = () => {
    setSpintaxOutput(parseSpintax(spintaxInput));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
          <div className="space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-surface dark:bg-[#161715] px-4 py-2 border border-border text-xs font-bold shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-wise-green" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.88] text-foreground">
              {t("hero.title")}
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-foreground-secondary leading-relaxed max-w-2xl">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/register">
                <Button variant="primaryPill" size="lg" className="text-lg font-bold gap-3 shadow-sm">
                  <span>{t("hero.ctaTrial")}</span>
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outlinePill" size="lg" className="text-lg font-bold">
                  {t("hero.ctaLogin")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-8 border-t border-border">
            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("metrics.deviceScale")}</p>
              <p className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">10k+</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">{t("metrics.deviceScaleDesc")}</p>
            </div>

            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("metrics.ramSavings")}</p>
              <p className="text-4xl sm:text-5xl font-black text-dark-green dark:text-wise-green mt-2 leading-none">95%</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">{t("metrics.ramSavingsDesc")}</p>
            </div>

            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("metrics.wakeupLatency")}</p>
              <p className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">&lt;0.3s</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">{t("metrics.wakeupLatencyDesc")}</p>
            </div>

            <div className="rounded-[26px] bg-surface dark:bg-[#161715] p-6 border border-border shadow-[0_0_0_1px_rgba(14,15,12,0.04)]">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("metrics.antiBan")}</p>
              <p className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">5 Lapis</p>
              <p className="text-xs font-semibold text-foreground-secondary mt-2">{t("metrics.antiBanDesc")}</p>
            </div>
          </div>
        </section>

        {/* Spintax Playground Section */}
        <section id="spintax" className="py-16 bg-surface dark:bg-[#161715] border-y border-border px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(159,232,112,0.15)] px-3 py-1 text-xs font-bold text-dark-green dark:text-wise-green">
                <Sparkles className="size-3.5" />
                <span>{t("spintaxSection.badge")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[0.95] text-foreground">
                {t("spintaxSection.title")}
              </h2>
              <p className="text-sm font-semibold text-foreground-secondary">
                {t("spintaxSection.subtitle")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2">
                  {t("spintaxSection.templateLabel")}
                </label>
                <textarea
                  rows={3}
                  value={spintaxInput}
                  onChange={(e) => {
                    setSpintaxInput(e.target.value);
                    setSpintaxOutput(parseSpintax(e.target.value));
                  }}
                  className="w-full rounded-md bg-background text-foreground font-semibold p-4 border border-border focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none text-sm transition"
                />
              </div>

              <div className="rounded-[24px] bg-[#eef2eb] dark:bg-[#212320] p-6 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
                    {t("spintaxSection.resultLabel")}
                  </span>
                  <Button
                    variant="primaryPill"
                    size="sm"
                    onClick={handleRandomizeSpintax}
                    className="gap-2 text-xs font-bold"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>{t("spintaxSection.randomizeBtn")}</span>
                  </Button>
                </div>
                <p
                  suppressHydrationWarning
                  className="text-base sm:text-lg font-bold text-foreground leading-relaxed"
                >
                  {spintaxOutput || "Silakan masukkan template di atas..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[0.95] text-foreground">
              {t("featuresSection.title")}
            </h2>
            <p className="text-base font-semibold text-foreground-secondary">
              {t("featuresSection.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
              <div className="h-12 w-12 rounded-full bg-wise-green text-dark-green flex items-center justify-center font-bold">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("featuresSection.f1Title")}</h3>
              <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
                {t("featuresSection.f1Desc")}
              </p>
            </div>

            <div className="rounded-lg bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
              <div className="h-12 w-12 rounded-full bg-wise-green text-dark-green flex items-center justify-center font-bold">
                <Zap className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("featuresSection.f2Title")}</h3>
              <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
                {t("featuresSection.f2Desc")}
              </p>
            </div>

            <div className="rounded-lg bg-surface dark:bg-[#161715] p-8 border border-border space-y-4">
              <div className="h-12 w-12 rounded-full bg-wise-green text-dark-green flex items-center justify-center font-bold">
                <Layers className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("featuresSection.f3Title")}</h3>
              <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
                {t("featuresSection.f3Desc")}
              </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
