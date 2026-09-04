"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/shared/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { useI18n } from "@/lib/i18n/context";
import { Menu, ArrowLeft, ShieldAlert } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileNav?: () => void;
}

export function AdminHeader({ onOpenMobileNav }: AdminHeaderProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  const getRouteInfo = (path: string): { title: string; section: string } => {
    switch (path) {
      case "/admin/users":
        return { title: t("admin.usersTitle"), section: "Platform" };
      case "/admin/activities":
        return { title: t("admin.activitiesTitle"), section: "Platform" };
      case "/admin/plans":
        return { title: t("admin.plansTitle"), section: "Platform" };
      case "/admin/subscriptions":
        return { title: t("admin.subscriptionsTitle"), section: "Platform" };
      case "/admin/billing":
        return { title: t("admin.billingTitle"), section: "Platform" };
      case "/admin/support":
        return { title: t("admin.supportTitle"), section: "Operations" };
      case "/admin/devices":
        return { title: t("admin.devicesTitle"), section: "Operations" };
      case "/admin/messages":
        return { title: t("admin.messagesTitle"), section: "Operations" };
      case "/admin/notifications":
        return { title: t("admin.notificationsTitle"), section: "Operations" };
      default:
        return {
          title: t("admin.title"),
          section: "Admin",
        };
    }
  };

  const currentRoute = getRouteInfo(pathname);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile Menu Toggle & Dynamic Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer rounded-full p-2 transition lg:hidden"
            aria-label={t("nav.openMenu")}
          >
            <Menu className="size-5" />
          </button>
        )}

        <div className="text-foreground-secondary flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-rose-600" />
            <span className="text-foreground font-bold">Admin</span>
          </div>
          <span>/</span>
          <span className="text-foreground-muted hidden sm:inline">{currentRoute.section}</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-foreground max-w-40 truncate font-bold sm:max-w-none">
            {currentRoute.title}
          </span>
        </div>
      </div>

      {/* Right: Cluster Status, Theme, Locale, and Tenant Link */}
      <div className="flex items-center gap-2.5">
        {/* Cluster Health Pill */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 md:flex dark:text-emerald-400">
          <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
          <span>Cluster 99.9% Uptime</span>
        </div>

        <LocaleSwitcher />
        <ThemeToggle />

        <div className="bg-border mx-0.5 hidden h-5 w-px sm:block" />

        <Link
          href="/dashboard"
          className="bg-wise-green text-dark-green flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-xs transition hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden sm:inline">{t("admin.backToDashboard")}</span>
        </Link>
      </div>
    </header>
  );
}
