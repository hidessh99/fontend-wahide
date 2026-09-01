"use client";

import React, { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { User, Menu, X, ArrowRight } from "lucide-react";

export function PublicHeader() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-wise-green shadow-xs transition-transform group-hover:scale-110" />
          <span className="font-black text-xl sm:text-2xl tracking-tight text-foreground">
            Wahide<span className="text-dark-green dark:text-wise-green">.</span>
          </span>
        </Link>

        {/* Desktop Navigation: Fitur, Harga, FAQ, Tentang Kami, Hubungi Kami */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-bold text-foreground-secondary">
          <Link href="/#features" className="hover:text-foreground transition-colors">
            {t("common.nav.features")}
          </Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">
            {t("common.nav.pricing")}
          </Link>
          <Link href="/#faq" className="hover:text-foreground transition-colors">
            {t("common.nav.faq")}
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            {t("common.nav.about")}
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            {t("common.nav.contact")}
          </Link>
        </nav>

        {/* Action Controls & Auth State */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <LocaleSwitcher />
          <ThemeToggle />

          {isAuthenticated && user ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "sm" }),
                "gap-2 px-5 font-bold shadow-xs min-h-9"
              )}
            >
              <User className="size-3.5" />
              <span>{t("common.nav.dashboard")} ({user.name.split(" ")[0]})</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "font-bold text-xs sm:text-sm text-foreground-secondary hover:text-foreground rounded-full px-4 min-h-9"
                )}
              >
                {t("common.nav.login")}
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "primaryPill", size: "sm" }),
                  "font-bold text-xs sm:text-sm gap-1.5 px-5 shadow-xs min-h-9"
                )}
              >
                <span>{t("common.nav.register")}</span>
                <ArrowRight className="size-3.5 hidden xl:inline" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-foreground-secondary hover:text-foreground hover:bg-muted/60 transition min-size-10 flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-surface dark:bg-[#161715] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col gap-1 text-sm font-bold text-foreground">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-md hover:bg-muted/60 transition min-h-11 flex items-center"
            >
              {t("common.nav.features")}
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-md hover:bg-muted/60 transition min-h-11 flex items-center"
            >
              {t("common.nav.pricing")}
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-md hover:bg-muted/60 transition min-h-11 flex items-center"
            >
              {t("common.nav.faq")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-md hover:bg-muted/60 transition min-h-11 flex items-center"
            >
              {t("common.nav.about")}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-md hover:bg-muted/60 transition min-h-11 flex items-center"
            >
              {t("common.nav.contact")}
            </Link>
          </nav>

          <div className="pt-3 border-t border-border/70 flex flex-col gap-2.5">
            {isAuthenticated && user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "primaryPill", size: "default" }),
                  "w-full gap-2 font-bold shadow-xs min-h-11"
                )}
              >
                <User className="size-4" />
                <span>{t("common.nav.dashboard")} ({user.name.split(" ")[0]})</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "w-full rounded-full font-bold border-border min-h-11"
                  )}
                >
                  {t("common.nav.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "primaryPill", size: "default" }),
                    "w-full font-bold shadow-sm min-h-11"
                  )}
                >
                  {t("common.nav.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
