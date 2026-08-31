"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { ExternalLink, Mail, Clock } from "lucide-react";

export function PublicFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-surface dark:bg-[#161715] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
        {/* Brand & Operating Hours Information */}
        <div className="space-y-3.5 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="h-3.5 w-3.5 rounded-full bg-wise-green shadow-xs transition-transform group-hover:scale-110" />
            <span className="font-black text-xl sm:text-2xl tracking-tight text-foreground">
              Wahide<span className="text-dark-green dark:text-wise-green">.</span>
            </span>
          </Link>

          <div className="space-y-2 text-xs font-semibold text-foreground-secondary leading-relaxed">
            <div className="font-bold text-foreground">
              {t("footer.by")}
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              <Mail className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
              <span>{t("footer.emailLabel")}</span>
              <a
                href={`mailto:${t("footer.emailValue")}`}
                className="text-foreground hover:text-dark-green dark:hover:text-wise-green underline decoration-border hover:decoration-current transition font-medium"
              >
                {t("footer.emailValue")}
              </a>
            </div>

            <div className="pt-1.5 border-t border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-foreground font-bold">
                <Clock className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
                <span>{t("footer.openHoursTitle")}</span>
              </div>
              <div className="text-[11px] text-foreground-muted pl-5">
                {t("footer.openHoursDesc")}
              </div>
            </div>
          </div>
        </div>

        {/* Product Column */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            {t("footer.product")}
          </p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li>
              <Link href="/about" className="hover:text-foreground transition-colors">
                {t("common.nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/#features" className="hover:text-foreground transition-colors">
                {t("common.nav.features")}
              </Link>
            </li>
            <li>
              <Link href="/#spintax" className="hover:text-foreground transition-colors">
                Anti-Ban Spintax
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-foreground transition-colors">
                {t("common.nav.pricing")}
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-foreground transition-colors">
                {t("common.nav.faq")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer Column */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            {t("footer.developer")}
          </p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li>
              <a
                href="https://documenter.getpostman.com/view/26294023/2sBYAuSqz3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground text-dark-green dark:text-wise-green font-bold transition-colors group"
              >
                <span>{t("footer.postmanDocs")}</span>
                <ExternalLink className="size-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            {t("footer.legal")}
          </p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                {t("common.nav.contact")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Syarat &amp; Ketentuan
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Kebijakan Privasi
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Copyright & Trust SLA Bar */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-foreground-muted">
        <span>&copy; {new Date().getFullYear()} Hide Group. {t("footer.rights")}</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span>{t("footer.sla")}</span>
          <span>•</span>
          <span>{t("footer.encryption")}</span>
        </div>
      </div>
    </footer>
  );
}
