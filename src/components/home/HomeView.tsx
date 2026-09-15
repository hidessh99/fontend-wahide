"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import dynamic from "next/dynamic";
import { FaqAccordion } from "./FaqAccordion";
import { SmartFeatureTabs } from "./SmartFeatureTabs";
import { BusinessSolutionsSection } from "./BusinessSolutionsSection";
import { ApiCodeSandbox } from "./ApiCodeSandbox";
import { SpintaxSandbox } from "./SpintaxSandbox";

const MessageSimulator = dynamic(
  () => import("./MessageSimulator").then((mod) => mod.MessageSimulator),
  {
    ssr: false,
    loading: () => (
      <div className="border-border bg-muted/30 h-96 w-full animate-pulse rounded-2xl border" />
    ),
  },
);

import {
  ArrowRight,
  CheckCircle2,
  Check,
  CreditCard,
  QrCode,
  Workflow,
  Sliders,
  Zap,
  ShieldCheck,
} from "lucide-react";

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="space-y-14 py-4 sm:space-y-20 sm:py-8">
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8 text-center flex flex-col items-center">
          <div className="bg-surface border-border inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-xs">
            <span className="bg-wise-green h-2 w-2 animate-pulse rounded-full" />
            <span>{t("common.hero.badge")}</span>
          </div>

          <h1 className="text-foreground max-w-4xl text-3xl leading-[1.04] font-black tracking-tight sm:text-5xl lg:text-6xl text-center mx-auto">
            {t("common.hero.title")}
          </h1>

          <p className="text-foreground-secondary max-w-2xl text-sm leading-relaxed font-semibold sm:text-base lg:text-lg text-center mx-auto">
            {t("common.hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "default" }),
                "min-h-12 gap-2.5 px-6 py-5 text-sm font-bold shadow-sm sm:px-7 sm:py-6 sm:text-base",
              )}
            >
              <span>{t("common.hero.ctaTrial")}</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "border-border hover:border-foreground-muted min-h-12 rounded-full px-6 py-5 text-sm font-bold sm:px-7 sm:py-6 sm:text-base",
              )}
            >
              {t("common.hero.ctaLogin")}
            </Link>
          </div>

          <div className="text-foreground-muted flex items-center justify-center gap-2 pt-1 text-xs font-semibold">
            <CheckCircle2 className="text-dark-green dark:text-wise-green size-3.5" />
            <span>{t("common.hero.trustBadge")}</span>
          </div>
          {/* High-Impact Trust Strip */}
          <div className="border-border/60 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t pt-4 text-xs font-semibold text-foreground-secondary w-full max-w-3xl mx-auto">
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />{" "}
              {t("common.landing.trustStrip.stripUptime")}
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
              <Zap className="size-3.5" />{" "}
              {t("common.landing.trustStrip.stripOtp")}
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-dark-green dark:text-wise-green">
              <ShieldCheck className="size-3.5" />{" "}
              {t("common.landing.trustStrip.stripSmart")}
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Check className="size-3.5" />{" "}
              {t("common.landing.trustStrip.stripCost")}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Interactive WhatsApp Simulator Showcase */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <MessageSimulator />
      </section>

      {/* 3. Dedicated Business Solutions (Reservasi, Pengingat, Form, Template) */}
      <BusinessSolutionsSection />

      {/* 4. Smart Interactive Solution Tabs (OTP API, Broadcast, Business Tools) */}
      <SmartFeatureTabs />

      {/* 4.5. Live API Code & Spintax Simulator Sandboxes */}
      <section className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ApiCodeSandbox />
        <SpintaxSandbox />
      </section>

      {/* 5. How It Works (3 Steps) */}
      <section
        id="how-it-works"
        className="scroll-mt-20 sm:scroll-mt-24 mx-auto max-w-5xl space-y-8 px-4 sm:px-6"
      >
        <div className="mx-auto max-w-xl space-y-2.5 text-center">
          <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Workflow className="size-3.5" />
            <span>{t("common.landing.howItWorks.badge")}</span>
          </div>
          <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            {t("common.landing.howItWorks.title")}
          </h2>
          <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
            {t("common.landing.howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          <div className="border-border bg-surface flex flex-col justify-between space-y-3.5 rounded-2xl border p-6 shadow-xs transition hover:border-border/90">
            <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-11 items-center justify-center rounded-xl">
              <QrCode className="size-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                {t("common.landing.howItWorks.step1Title")}
              </h3>
              <p className="text-foreground-secondary mt-2 text-xs font-medium leading-relaxed">
                {t("common.landing.howItWorks.step1Desc")}
              </p>
            </div>
          </div>

          <div className="border-border bg-surface flex flex-col justify-between space-y-3.5 rounded-2xl border p-6 shadow-xs transition hover:border-border/90">
            <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-11 items-center justify-center rounded-xl">
              <Sliders className="size-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                {t("common.landing.howItWorks.step2Title")}
              </h3>
              <p className="text-foreground-secondary mt-2 text-xs font-medium leading-relaxed">
                {t("common.landing.howItWorks.step2Desc")}
              </p>
            </div>
          </div>

          <div className="border-border bg-surface flex flex-col justify-between space-y-3.5 rounded-2xl border p-6 shadow-xs transition hover:border-border/90">
            <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-11 items-center justify-center rounded-xl">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                {t("common.landing.howItWorks.step3Title")}
              </h3>
              <p className="text-foreground-secondary mt-2 text-xs font-medium leading-relaxed">
                {t("common.landing.howItWorks.step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparent 3-Tier Pricing Grid */}
      <section
        id="pricing"
        className="scroll-mt-20 sm:scroll-mt-24 mx-auto max-w-5xl space-y-10 px-4 sm:px-6"
      >
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

        {/* Cost Comparison Callout Banner */}
        <div className="mx-auto max-w-2xl rounded-xl border border-wise-green/40 bg-wise-green/10 dark:bg-wise-green/5 p-3.5 text-center text-xs font-bold text-foreground sm:text-sm shadow-xs">
          <span className="text-dark-green dark:text-wise-green mr-1.5">
            {t("common.landing.pricing.costCompareTitle")}
          </span>
          {t("common.landing.pricing.costCompareDesc")}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {/* Plan 1: Starter Free Trial */}
          <div className="border-border bg-surface flex flex-col justify-between space-y-6 rounded-lg border p-6 shadow-xs sm:p-7">
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
                  "border-border hover:border-foreground-muted min-h-11 w-full text-xs font-bold",
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
                  "min-h-11 w-full text-xs font-bold shadow-sm",
                )}
              >
                {t("common.landing.pricing.p2Btn")}
              </Link>
            </div>
          </div>

          {/* Plan 3: Enterprise Gateway */}
          <div className="border-border bg-surface flex flex-col justify-between space-y-6 rounded-lg border p-6 shadow-xs sm:p-7">
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
                  "border-border hover:border-foreground-muted min-h-11 w-full text-xs font-bold",
                )}
              >
                {t("common.landing.pricing.p3Btn")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section
        id="faq"
        className="scroll-mt-20 sm:scroll-mt-24 content-visibility-auto mx-auto max-w-3xl px-4 sm:px-6"
      >
        <FaqAccordion />
      </section>

      {/* 9. Final High-Impact CTA Banner */}
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
                "min-h-12 gap-2 px-7 py-5 text-sm font-bold shadow-sm sm:text-base",
              )}
            >
              <span>{t("common.landing.cta.btnTrial")}</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "secondaryPill", size: "default" }),
                "min-h-12 px-7 py-5 text-sm font-bold sm:text-base",
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
