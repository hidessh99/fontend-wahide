"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, parseSpintax } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { MessageSimulator } from "./MessageSimulator";
import { ApiCodeSandbox } from "./ApiCodeSandbox";
import { FaqAccordion } from "./FaqAccordion";
import {
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Cpu,
  Activity,
  Bot,
  Users,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  Check,
  X,
  CreditCard,
  Sliders,
} from "lucide-react";

const DEFAULT_SPINTAX_INPUT =
  "{Halo|Hai|Selamat Pagi} {Bpk/Ibu|Kak}, pesanan #{1001|1002|1003} sedang {diproses|dikemas}.";
const DEFAULT_SPINTAX_OUTPUT =
  "Halo Kak, pesanan #1001 sedang diproses.";

export function HomeView() {
  const { t } = useI18n();

  const [spintaxInput, setSpintaxInput] = useState(DEFAULT_SPINTAX_INPUT);
  const [spintaxOutput, setSpintaxOutput] = useState(DEFAULT_SPINTAX_OUTPUT);

  const handleRandomizeSpintax = () => {
    setSpintaxOutput(parseSpintax(spintaxInput));
  };

  return (
    <div className="space-y-24 py-8">
      {/* 1. Hero Section */}
      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-surface dark:bg-[#161715] px-4 py-2 border border-border text-xs font-bold shadow-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-wise-green animate-pulse" />
            <span>{t("common.hero.badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.92] text-foreground">
            {t("common.hero.title")}
          </h1>

          <p className="text-base sm:text-xl font-semibold text-foreground-secondary leading-relaxed max-w-2xl">
            {t("common.hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "default" }),
                "text-sm sm:text-base font-bold gap-3 px-7 py-6 shadow-sm min-h-12"
              )}
            >
              <span>{t("common.hero.ctaTrial")}</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-full text-sm sm:text-base font-bold px-7 py-6 border-border hover:border-foreground-muted min-h-12"
              )}
            >
              {t("common.hero.ctaLogin")}
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted pt-2">
            <CheckCircle2 className="size-3.5 text-dark-green dark:text-wise-green" />
            <span>{t("common.hero.trustBadge")}</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-8 border-t border-border">
          <div className="rounded-md bg-surface dark:bg-[#161715] p-6 border border-border shadow-xs space-y-1">
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("common.metrics.deviceScale")}</p>
            <p className="text-3xl sm:text-4xl font-black text-foreground font-mono">10.000+</p>
            <p className="text-xs font-semibold text-foreground-secondary">{t("common.metrics.deviceScaleDesc")}</p>
          </div>

          <div className="rounded-md bg-surface dark:bg-[#161715] p-6 border border-border shadow-xs space-y-1">
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("common.metrics.ramSavings")}</p>
            <p className="text-3xl sm:text-4xl font-black text-dark-green dark:text-wise-green font-mono">95%</p>
            <p className="text-xs font-semibold text-foreground-secondary">{t("common.metrics.ramSavingsDesc")}</p>
          </div>

          <div className="rounded-md bg-surface dark:bg-[#161715] p-6 border border-border shadow-xs space-y-1">
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("common.metrics.wakeupLatency")}</p>
            <p className="text-3xl sm:text-4xl font-black text-foreground font-mono">&lt; 0.3s</p>
            <p className="text-xs font-semibold text-foreground-secondary">{t("common.metrics.wakeupLatencyDesc")}</p>
          </div>

          <div className="rounded-md bg-surface dark:bg-[#161715] p-6 border border-border shadow-xs space-y-1">
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{t("common.metrics.antiBan")}</p>
            <p className="text-3xl sm:text-4xl font-black text-dark-green dark:text-wise-green font-mono">5-Layer</p>
            <p className="text-xs font-semibold text-foreground-secondary">{t("common.metrics.antiBanDesc")}</p>
          </div>
        </div>
      </section>

      {/* 2. Interactive WhatsApp Simulator Showcase */}
      <section className="px-6 max-w-7xl mx-auto">
        <MessageSimulator />
      </section>

      {/* 3. Spintax Anti-Ban Engine Section */}
      <section id="spintax" className="px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-lg border border-border bg-surface dark:bg-[#161715] space-y-8 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
              <Sparkles className="size-3.5" />
              <span>{t("common.spintaxSection.badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("common.spintaxSection.title")}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
              {t("common.spintaxSection.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="spintax-template-input"
                className="text-xs font-bold text-foreground-muted uppercase tracking-wider block"
              >
                {t("common.spintaxSection.templateLabel")}
              </label>
              <textarea
                id="spintax-template-input"
                name="spintaxTemplate"
                aria-label={t("common.spintaxSection.templateLabel")}
                value={spintaxInput}
                onChange={(e) => setSpintaxInput(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-border bg-background p-4 text-xs font-mono font-medium text-foreground focus:border-wise-green focus:ring-1 focus:ring-wise-green outline-none"
              />
            </div>

            <div className="space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <label
                  htmlFor="spintax-result-output"
                  className="text-xs font-bold text-foreground-muted uppercase tracking-wider block"
                >
                  {t("common.spintaxSection.resultLabel")}
                </label>
                <div
                  id="spintax-result-output"
                  aria-live="polite"
                  className="rounded-md border border-border bg-background p-4 text-xs font-semibold text-foreground min-h-24 flex items-center"
                >
                  &quot;{spintaxOutput}&quot;
                </div>
              </div>

              <Button
                variant="primaryPill"
                size="default"
                onClick={handleRandomizeSpintax}
                className="gap-2 font-bold text-xs self-start"
              >
                <RefreshCw className="size-3.5" />
                <span>{t("common.spintaxSection.randomizeBtn")}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Developer REST API & Webhooks Code Sandbox */}
      <section className="px-6 max-w-7xl mx-auto">
        <ApiCodeSandbox />
      </section>

      {/* 5. 9 Core Enterprise Features Grid */}
      <section id="features" className="px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
            <Zap className="size-3.5" />
            <span>{t("common.landing.features.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("common.landing.features.title")}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
            {t("common.landing.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: t("common.landing.features.f1Title"), desc: t("common.landing.features.f1Desc") },
            { icon: RefreshCw, title: t("common.landing.features.f2Title"), desc: t("common.landing.features.f2Desc") },
            { icon: Activity, title: t("common.landing.features.f3Title"), desc: t("common.landing.features.f3Desc") },
            { icon: Bot, title: t("common.landing.features.f4Title"), desc: t("common.landing.features.f4Desc") },
            { icon: FileSpreadsheet, title: t("common.landing.features.f5Title"), desc: t("common.landing.features.f5Desc") },
            { icon: Clock, title: t("common.landing.features.f6Title"), desc: t("common.landing.features.f6Desc") },
            { icon: Users, title: t("common.landing.features.f7Title"), desc: t("common.landing.features.f7Desc") },
            { icon: Layers, title: t("common.landing.features.f8Title"), desc: t("common.landing.features.f8Desc") },
            { icon: Sliders, title: t("common.landing.features.f9Title"), desc: t("common.landing.features.f9Desc") },
          ].map((feat, i) => (
            <div
              key={i}
              className="p-6 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-3 hover:border-wise-green/50 transition duration-150 shadow-xs"
            >
              <div className="size-10 rounded-full bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
                <feat.icon className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
              <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Technical Architecture Comparison Table */}
      <section id="architecture" className="px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
            <Layers className="size-3.5" />
            <span>{t("common.landing.comparison.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("common.landing.comparison.title")}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
            {t("common.landing.comparison.subtitle")}
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-foreground font-bold">
                <th className="p-4 sm:p-5 w-1/3">{t("common.landing.comparison.colFeature")}</th>
                <th className="p-4 sm:p-5 w-1/3 text-dark-green dark:text-wise-green font-black">{t("common.landing.comparison.colWahide")}</th>
                <th className="p-4 sm:p-5 w-1/3 text-foreground-muted">{t("common.landing.comparison.colOthers")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground-secondary font-semibold">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-foreground">{t("common.landing.comparison.row1Feature")}</td>
                <td className="p-4 sm:p-5 text-dark-green dark:text-wise-green font-bold bg-wise-green/5">{t("common.landing.comparison.row1Wahide")}</td>
                <td className="p-4 sm:p-5 text-rose-500">{t("common.landing.comparison.row1Others")}</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-foreground">{t("common.landing.comparison.row2Feature")}</td>
                <td className="p-4 sm:p-5 text-dark-green dark:text-wise-green font-bold bg-wise-green/5">{t("common.landing.comparison.row2Wahide")}</td>
                <td className="p-4 sm:p-5">{t("common.landing.comparison.row2Others")}</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-foreground">{t("common.landing.comparison.row3Feature")}</td>
                <td className="p-4 sm:p-5 text-dark-green dark:text-wise-green font-bold bg-wise-green/5">{t("common.landing.comparison.row3Wahide")}</td>
                <td className="p-4 sm:p-5">{t("common.landing.comparison.row3Others")}</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-foreground">{t("common.landing.comparison.row4Feature")}</td>
                <td className="p-4 sm:p-5 text-dark-green dark:text-wise-green font-bold bg-wise-green/5 flex items-center gap-1.5">
                  <Check className="size-4 text-dark-green dark:text-wise-green shrink-0" />
                  <span>{t("common.landing.comparison.row4Wahide")}</span>
                </td>
                <td className="p-4 sm:p-5 text-foreground-muted flex items-center gap-1.5">
                  <X className="size-4 text-rose-400 shrink-0" />
                  <span>{t("common.landing.comparison.row4Others")}</span>
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-foreground">{t("common.landing.comparison.row5Feature")}</td>
                <td className="p-4 sm:p-5 text-dark-green dark:text-wise-green font-bold bg-wise-green/5 flex items-center gap-1.5">
                  <Check className="size-4 text-dark-green dark:text-wise-green shrink-0" />
                  <span>{t("common.landing.comparison.row5Wahide")}</span>
                </td>
                <td className="p-4 sm:p-5 text-foreground-muted">{t("common.landing.comparison.row5Others")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Transparent 3-Tier Pricing Grid */}
      <section id="pricing" className="px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
            <CreditCard className="size-3.5" />
            <span>{t("common.landing.pricing.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("common.landing.pricing.title")}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
            {t("common.landing.pricing.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Starter Free Trial */}
          <div className="p-8 rounded-lg border border-border bg-surface dark:bg-[#161715] flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-foreground">{t("common.landing.pricing.p1Name")}</h3>
                <p className="text-xs font-semibold text-foreground-secondary mt-1">{t("common.landing.pricing.p1Desc")}</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">{t("common.landing.pricing.p1Price")}</span>
                <span className="text-xs font-semibold text-foreground-muted">{t("common.landing.pricing.p1Period")}</span>
              </div>

              <ul className="space-y-2.5 text-xs font-semibold text-foreground-secondary pt-4 border-t border-border">
                {[
                  t("common.landing.pricing.p1F1"),
                  t("common.landing.pricing.p1F2"),
                  t("common.landing.pricing.p1F3"),
                  t("common.landing.pricing.p1F4"),
                  t("common.landing.pricing.p1F5"),
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "w-full text-xs font-bold border-border hover:border-foreground-muted min-h-11"
                )}
              >
                {t("common.landing.pricing.p1Btn")}
              </Link>
            </div>
          </div>

          {/* Plan 2: Pro Merchant (Highlighted) */}
          <div className="p-8 rounded-lg border-2 border-wise-green bg-wise-green/5 dark:bg-wise-green/10 flex flex-col justify-between space-y-6 shadow-md relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-wise-green text-near-black text-[10px] font-black uppercase tracking-wider shadow-xs">
              {t("common.landing.pricing.p2Badge")}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-foreground">{t("common.landing.pricing.p2Name")}</h3>
                <p className="text-xs font-semibold text-foreground-secondary mt-1">{t("common.landing.pricing.p2Desc")}</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">{t("common.landing.pricing.p2Price")}</span>
                <span className="text-xs font-semibold text-foreground-muted">{t("common.landing.pricing.p2Period")}</span>
              </div>

              <ul className="space-y-2.5 text-xs font-semibold text-foreground-secondary pt-4 border-t border-wise-green/20">
                {[
                  t("common.landing.pricing.p2F1"),
                  t("common.landing.pricing.p2F2"),
                  t("common.landing.pricing.p2F3"),
                  t("common.landing.pricing.p2F4"),
                  t("common.landing.pricing.p2F5"),
                  t("common.landing.pricing.p2F6"),
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
                    <span className="text-foreground font-bold">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "primaryPill", size: "default" }),
                  "w-full text-xs font-bold shadow-sm min-h-11"
                )}
              >
                {t("common.landing.pricing.p2Btn")}
              </Link>
            </div>
          </div>

          {/* Plan 3: Enterprise Gateway */}
          <div className="p-8 rounded-lg border border-border bg-surface dark:bg-[#161715] flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-foreground">{t("common.landing.pricing.p3Name")}</h3>
                <p className="text-xs font-semibold text-foreground-secondary mt-1">{t("common.landing.pricing.p3Desc")}</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">{t("common.landing.pricing.p3Price")}</span>
                <span className="text-xs font-semibold text-foreground-muted">{t("common.landing.pricing.p3Period")}</span>
              </div>

              <ul className="space-y-2.5 text-xs font-semibold text-foreground-secondary pt-4 border-t border-border">
                {[
                  t("common.landing.pricing.p3F1"),
                  t("common.landing.pricing.p3F2"),
                  t("common.landing.pricing.p3F3"),
                  t("common.landing.pricing.p3F4"),
                  t("common.landing.pricing.p3F5"),
                  t("common.landing.pricing.p3F6"),
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "w-full text-xs font-bold border-border hover:border-foreground-muted min-h-11"
                )}
              >
                {t("common.landing.pricing.p3Btn")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section id="faq" className="py-16 bg-surface dark:bg-[#161715] border-y border-border px-6">
        <FaqAccordion />
      </section>

      {/* 9. Final High-Impact CTA Banner */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-lg border border-wise-green/40 bg-wise-green/10 dark:bg-wise-green/5 text-center space-y-6 shadow-sm">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
              {t("common.landing.cta.title")}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
              {t("common.landing.cta.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "default" }),
                "gap-2 px-8 py-6 font-bold text-sm sm:text-base shadow-sm min-h-12"
              )}
            >
              <span>{t("common.landing.cta.btnTrial")}</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "secondaryPill", size: "default" }),
                "px-8 py-6 font-bold text-sm sm:text-base min-h-12"
              )}
            >
              <span>{t("common.landing.cta.btnContact")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
