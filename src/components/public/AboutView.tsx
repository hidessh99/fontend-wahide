"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  Building2,
  ShieldCheck,
  Cpu,
  Zap,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity,
} from "lucide-react";

export function AboutView() {
  const { t } = useI18n();

  return (
    <div className="space-y-16 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
          <Building2 className="size-3.5" />
          <span>{t("about.badge")}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
          {t("about.title")}
        </h1>
        <p className="text-sm sm:text-base font-semibold text-foreground-secondary leading-relaxed">
          {t("about.subtitle")}
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: t("about.statsUptime"), value: "99.9%", icon: Activity },
          { label: t("about.statsRam"), value: "< 150 MB", icon: Cpu },
          { label: t("about.statsMessages"), value: "1.000.000+", icon: Zap },
          { label: t("about.statsTenants"), value: "500+", icon: ShieldCheck },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-md border border-border bg-surface text-center space-y-2 shadow-sm"
            >
              <Icon className="size-5 text-dark-green dark:text-wise-green mx-auto" />
              <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                {s.value}
              </div>
              <div className="text-xs font-semibold text-foreground-secondary">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 sm:p-8 rounded-md border border-border bg-surface space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 text-dark-green dark:text-wise-green font-bold text-xs uppercase tracking-wider">
            <Sparkles className="size-4" />
            <span>{t("about.visionTitle")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {t("about.visionTitle")}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
            {t("about.visionDesc")}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-md border border-border bg-surface space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 text-dark-green dark:text-wise-green font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="size-4" />
            <span>{t("about.missionTitle")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {t("about.missionTitle")}
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-wise-green mt-2 shrink-0" />
              <span>{t("about.mission1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-wise-green mt-2 shrink-0" />
              <span>{t("about.mission2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-wise-green mt-2 shrink-0" />
              <span>{t("about.mission3")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Engineering Architecture Highlights */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {t("about.techArchitectureTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-md border border-border bg-surface space-y-3">
            <div className="size-10 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
              <Cpu className="size-5" />
            </div>
            <h3 className="text-base font-black text-foreground">
              {t("about.tech1Title")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              {t("about.tech1Desc")}
            </p>
          </div>

          <div className="p-6 rounded-md border border-border bg-surface space-y-3">
            <div className="size-10 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
              <Zap className="size-5" />
            </div>
            <h3 className="text-base font-black text-foreground">
              {t("about.tech2Title")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              {t("about.tech2Desc")}
            </p>
          </div>

          <div className="p-6 rounded-md border border-border bg-surface space-y-3">
            <div className="size-10 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-base font-black text-foreground">
              {t("about.tech3Title")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              {t("about.tech3Desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Office & Headquarters Card */}
      <div className="p-6 sm:p-8 rounded-md border border-border bg-surface shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {t("about.officeTitle")}
          </h2>
          <p className="text-xs font-semibold text-foreground-secondary">
            {t("about.officeSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-md border border-border bg-muted/20 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs">
              <MapPin className="size-4 text-dark-green dark:text-wise-green" />
              <span>Alamat Kantor</span>
            </div>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              {t("about.officeAddress")}
            </p>
          </div>

          <div className="p-4 rounded-md border border-border bg-muted/20 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs">
              <Mail className="size-4 text-dark-green dark:text-wise-green" />
              <span>Email Resmi</span>
            </div>
            <a
              href={`mailto:${t("about.officeEmail")}`}
              className="text-xs font-mono font-bold text-dark-green dark:text-wise-green hover:underline block"
            >
              {t("about.officeEmail")}
            </a>
          </div>

          <div className="p-4 rounded-md border border-border bg-muted/20 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs">
              <Phone className="size-4 text-dark-green dark:text-wise-green" />
              <span>WhatsApp / Hotline</span>
            </div>
            <a
              href={`https://wa.me/62877111301818`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold text-dark-green dark:text-wise-green hover:underline block"
            >
              {t("about.officePhone")}
            </a>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="p-8 sm:p-10 rounded-md border border-wise-green/30 bg-wise-green/10 dark:bg-wise-green/5 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {t("about.ctaTitle")}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-xl mx-auto">
          {t("about.ctaSubtitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/register">
            <Button variant="primaryPill" size="default" className="gap-2 px-6">
              <span>{t("about.ctaButton")}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondaryPill" size="default" className="px-6">
              <span>{t("about.ctaContact")}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
