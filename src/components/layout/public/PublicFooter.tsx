"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export function PublicFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-surface dark:bg-[#161715] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-3 col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-wise-green" />
            <span className="font-black text-xl tracking-tight text-foreground">
              Wahide<span className="text-wise-green">.</span>
            </span>
          </Link>
          <p className="text-xs font-semibold text-foreground-secondary leading-relaxed max-w-xs">
            {t("footer.description")}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">{t("footer.product")}</p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li><Link href="/about" className="hover:text-foreground">Tentang Kami</Link></li>
            <li><Link href="/blog" className="hover:text-foreground">Blog &amp; Panduan</Link></li>
            <li><Link href="/#features" className="hover:text-foreground">Multi-Device Gateway</Link></li>
            <li><Link href="/#spintax" className="hover:text-foreground">Anti-Ban Spintax</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">{t("nav.pricing")}</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">{t("footer.developer")}</p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li><a href="https://github.com/hidessh99/fontend-wahide" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub Repo</a></li>
            <li><Link href="/contact" className="hover:text-foreground">Kemitraan &amp; API</Link></li>
            <li><Link href="/#architecture" className="hover:text-foreground">Arsitektur whatsmeow</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">{t("footer.legal")}</p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li><Link href="/contact" className="hover:text-foreground">Hubungi Kami</Link></li>
            <li><Link href="/terms" className="hover:text-foreground">Syarat &amp; Ketentuan</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">Kebijakan Privasi</Link></li>
            <li><Link href="/support" className="hover:text-foreground">Helpdesk Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-foreground-muted">
        <span>&copy; {new Date().getFullYear()} Hide Group. {t("footer.rights")}</span>
        <div className="flex items-center gap-4">
          <span>{t("footer.sla")}</span>
          <span>•</span>
          <span>{t("footer.encryption")}</span>
        </div>
      </div>
    </footer>
  );
}
