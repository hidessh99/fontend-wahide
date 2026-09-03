"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { MessageSimulator } from "./MessageSimulator";
import { SpintaxSandbox } from "./SpintaxSandbox";
import { ApiCodeSandbox } from "./ApiCodeSandbox";
import { FaqAccordion } from "./FaqAccordion";
import {
  Zap,
  Layers,
  ArrowRight,
  RefreshCw,
  Cpu,
  Activity,
  Bot,
  Users,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  Check,
  CreditCard,
  Sliders,
} from "lucide-react";

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="space-y-20 py-6 sm:space-y-28 sm:py-10">
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-surface border-border inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-xs dark:bg-[#161715]">
            <span className="bg-wise-green h-2 w-2 animate-pulse rounded-full" />
            <span>{t("common.hero.badge")}</span>
          </div>

          <h1 className="text-foreground max-w-3xl text-3xl leading-[1.04] font-black tracking-tight sm:text-5xl lg:text-6xl">
            {t("common.hero.title")}
          </h1>

          <p className="text-foreground-secondary max-w-2xl text-sm leading-relaxed font-semibold sm:text-base lg:text-lg">
            {t("common.hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "default" }),
                "min-h-12 gap-2.5 px-6 py-5 text-sm font-bold shadow-sm sm:px-7 sm:py-6 sm:text-base"
              )}
            >
              <span>{t("common.hero.ctaTrial")}</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "border-border hover:border-foreground-muted min-h-12 rounded-full px-6 py-5 text-sm font-bold sm:px-7 sm:py-6 sm:text-base"
              )}
            >
              {t("common.hero.ctaLogin")}
            </Link>
          </div>

          <div className="text-foreground-muted flex items-center gap-2 pt-1 text-xs font-semibold">
            <CheckCircle2 className="text-dark-green dark:text-wise-green size-3.5" />
            <span>{t("common.hero.trustBadge")}</span>
          </div>
        </div>

        {/* Key Metrics Bento Grid */}
        <div className="border-border/80 mt-12 grid grid-cols-2 gap-3.5 border-t pt-8 sm:gap-4 lg:grid-cols-4">
          <div className="bg-surface border-border space-y-1 rounded-lg border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
            <p className="text-foreground-muted text-[11px] font-bold tracking-wider uppercase">
              {t("common.metrics.deviceScale")}
            </p>
            <p className="text-foreground font-mono text-2xl font-black sm:text-3xl">10.000+</p>
            <p className="text-foreground-secondary text-xs font-semibold">
              {t("common.metrics.deviceScaleDesc")}
            </p>
          </div>

          <div className="bg-surface border-border space-y-1 rounded-lg border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
            <p className="text-foreground-muted text-[11px] font-bold tracking-wider uppercase">
              {t("common.metrics.ramSavings")}
            </p>
            <p className="text-dark-green dark:text-wise-green font-mono text-2xl font-black sm:text-3xl">
              95%
            </p>
            <p className="text-foreground-secondary text-xs font-semibold">
              {t("common.metrics.ramSavingsDesc")}
            </p>
          </div>

          <div className="bg-surface border-border space-y-1 rounded-lg border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
            <p className="text-foreground-muted text-[11px] font-bold tracking-wider uppercase">
              {t("common.metrics.wakeupLatency")}
            </p>
            <p className="text-foreground font-mono text-2xl font-black sm:text-3xl">&lt; 0.3s</p>
            <p className="text-foreground-secondary text-xs font-semibold">
              {t("common.metrics.wakeupLatencyDesc")}
            </p>
          </div>

          <div className="bg-surface border-border space-y-1 rounded-lg border p-4 shadow-xs sm:p-5 dark:bg-[#161715]">
            <p className="text-foreground-muted text-[11px] font-bold tracking-wider uppercase">
              {t("common.metrics.antiBan")}
            </p>
            <p className="text-dark-green dark:text-wise-green font-mono text-2xl font-black sm:text-3xl">
              5-Layer
            </p>
            <p className="text-foreground-secondary text-xs font-semibold">
              {t("common.metrics.antiBanDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive WhatsApp Simulator Showcase */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <MessageSimulator />
      </section>

      {/* 3. Spintax Anti-Ban Engine Section */}
      <section id="spintax" className="mx-auto max-w-4xl px-4 sm:px-6">
        <SpintaxSandbox />
      </section>

      {/* 4. Developer REST API & Webhooks Code Sandbox */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <ApiCodeSandbox />
      </section>

      {/* 5. 9 Core Enterprise Features Grid */}
      <section id="features" className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-2.5 text-center">
          <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Zap className="size-3.5" />
            <span>{t("common.landing.features.badge")}</span>
          </div>
          <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            {t("common.landing.features.title")}
          </h2>
          <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
            {t("common.landing.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {[
            {
              icon: Cpu,
              title: t("common.landing.features.f1Title"),
              desc: t("common.landing.features.f1Desc"),
            },
            {
              icon: RefreshCw,
              title: t("common.landing.features.f2Title"),
              desc: t("common.landing.features.f2Desc"),
            },
            {
              icon: Activity,
              title: t("common.landing.features.f3Title"),
              desc: t("common.landing.features.f3Desc"),
            },
            {
              icon: Bot,
              title: t("common.landing.features.f4Title"),
              desc: t("common.landing.features.f4Desc"),
            },
            {
              icon: FileSpreadsheet,
              title: t("common.landing.features.f5Title"),
              desc: t("common.landing.features.f5Desc"),
            },
            {
              icon: Clock,
              title: t("common.landing.features.f6Title"),
              desc: t("common.landing.features.f6Desc"),
            },
            {
              icon: Users,
              title: t("common.landing.features.f7Title"),
              desc: t("common.landing.features.f7Desc"),
            },
            {
              icon: Layers,
              title: t("common.landing.features.f8Title"),
              desc: t("common.landing.features.f8Desc"),
            },
            {
              icon: Sliders,
              title: t("common.landing.features.f9Title"),
              desc: t("common.landing.features.f9Desc"),
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="border-border bg-surface hover:border-wise-green/50 space-y-2.5 rounded-lg border p-5 shadow-xs transition duration-150 sm:p-6 dark:bg-[#161715]"
            >
              <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-9 items-center justify-center rounded-full">
                <feat.icon className="size-4.5" />
              </div>
              <h3 className="text-foreground text-sm font-bold sm:text-base">{feat.title}</h3>
              <p className="text-foreground-secondary text-xs leading-relaxed font-semibold">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Transparent 3-Tier Pricing Grid */}
      <section id="pricing" className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
        <div className="mx-auto max-w-xl space-y-2.5 text-center">
          <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <CreditCard className="size-3.5" />
            <span>{t("common.landing.pricing.badge")}</span>
          </div>
          <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            {t("common.landing.pricing.title")}
          </h2>
          <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
            {t("common.landing.pricing.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {/* Plan 1: Starter Free Trial */}
          <div className="border-border bg-surface flex flex-col justify-between space-y-6 rounded-lg border p-6 shadow-xs sm:p-7 dark:bg-[#161715]">
            <div className="space-y-4">
              <div>
                <h3 className="text-foreground text-base font-black sm:text-lg">
                  {t("common.landing.pricing.p1Name")}
                </h3>
                <p className="text-foreground-secondary mt-1 text-xs font-semibold">
                  {t("common.landing.pricing.p1Desc")}
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-foreground font-mono text-3xl font-black sm:text-4xl">
                  {t("common.landing.pricing.p1Price")}
                </span>
                <span className="text-foreground-muted text-xs font-semibold">
                  {t("common.landing.pricing.p1Period")}
                </span>
              </div>

              <ul className="text-foreground-secondary border-border space-y-2.5 border-t pt-4 text-xs font-semibold">
                {[
                  t("common.landing.pricing.p1F1"),
                  t("common.landing.pricing.p1F2"),
                  t("common.landing.pricing.p1F3"),
                  t("common.landing.pricing.p1F4"),
                  t("common.landing.pricing.p1F5"),
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-dark-green dark:text-wise-green size-3.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "border-border hover:border-foreground-muted min-h-11 w-full text-xs font-bold"
                )}
              >
                {t("common.landing.pricing.p1Btn")}
              </Link>
            </div>
          </div>

          {/* Plan 2: Pro Merchant (Highlighted) */}
          <div className="border-wise-green bg-wise-green/5 dark:bg-wise-green/10 relative flex flex-col justify-between space-y-6 rounded-lg border-2 p-6 shadow-md sm:p-7">
            <div className="bg-wise-green text-near-black absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-black tracking-wider uppercase shadow-xs">
              {t("common.landing.pricing.p2Badge")}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-foreground text-base font-black sm:text-lg">
                  {t("common.landing.pricing.p2Name")}
                </h3>
                <p className="text-foreground-secondary mt-1 text-xs font-semibold">
                  {t("common.landing.pricing.p2Desc")}
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-foreground font-mono text-3xl font-black sm:text-4xl">
                  {t("common.landing.pricing.p2Price")}
                </span>
                <span className="text-foreground-muted text-xs font-semibold">
                  {t("common.landing.pricing.p2Period")}
                </span>
              </div>

              <ul className="text-foreground-secondary border-wise-green/20 space-y-2.5 border-t pt-4 text-xs font-semibold">
                {[
                  t("common.landing.pricing.p2F1"),
                  t("common.landing.pricing.p2F2"),
                  t("common.landing.pricing.p2F3"),
                  t("common.landing.pricing.p2F4"),
                  t("common.landing.pricing.p2F5"),
                  t("common.landing.pricing.p2F6"),
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-dark-green dark:text-wise-green size-3.5 shrink-0" />
                    <span className="text-foreground font-bold">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "primaryPill", size: "default" }),
                  "min-h-11 w-full text-xs font-bold shadow-sm"
                )}
              >
                {t("common.landing.pricing.p2Btn")}
              </Link>
            </div>
          </div>

          {/* Plan 3: Enterprise Gateway */}
          <div className="border-border bg-surface flex flex-col justify-between space-y-6 rounded-lg border p-6 shadow-xs sm:p-7 dark:bg-[#161715]">
            <div className="space-y-4">
              <div>
                <h3 className="text-foreground text-base font-black sm:text-lg">
                  {t("common.landing.pricing.p3Name")}
                </h3>
                <p className="text-foreground-secondary mt-1 text-xs font-semibold">
                  {t("common.landing.pricing.p3Desc")}
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-foreground font-mono text-3xl font-black sm:text-4xl">
                  {t("common.landing.pricing.p3Price")}
                </span>
                <span className="text-foreground-muted text-xs font-semibold">
                  {t("common.landing.pricing.p3Period")}
                </span>
              </div>

              <ul className="text-foreground-secondary border-border space-y-2.5 border-t pt-4 text-xs font-semibold">
                {[
                  t("common.landing.pricing.p3F1"),
                  t("common.landing.pricing.p3F2"),
                  t("common.landing.pricing.p3F3"),
                  t("common.landing.pricing.p3F4"),
                  t("common.landing.pricing.p3F5"),
                  t("common.landing.pricing.p3F6"),
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-dark-green dark:text-wise-green size-3.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "border-border hover:border-foreground-muted min-h-11 w-full text-xs font-bold"
                )}
              >
                {t("common.landing.pricing.p3Btn")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6">
        <FaqAccordion />
      </section>

      {/* 8. Final High-Impact CTA Banner */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="border-wise-green/40 bg-wise-green/10 dark:bg-wise-green/5 space-y-6 rounded-lg border p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto max-w-xl space-y-2">
            <h2 className="text-foreground text-2xl leading-tight font-black tracking-tight sm:text-4xl">
              {t("common.landing.cta.title")}
            </h2>
            <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
              {t("common.landing.cta.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "default" }),
                "min-h-12 gap-2 px-7 py-5 text-sm font-bold shadow-sm sm:text-base"
              )}
            >
              <span>{t("common.landing.cta.btnTrial")}</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "secondaryPill", size: "default" }),
                "min-h-12 px-7 py-5 text-sm font-bold sm:text-base"
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
