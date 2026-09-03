"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/shared/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { Menu, ArrowLeft, ShieldAlert } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileNav?: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; section: string }> = {
  "/admin/users": { title: "Kelola Pengguna", section: "Platform" },
  "/admin/activities": { title: "Log Aktivitas Pengguna", section: "Platform" },
  "/admin/plans": { title: "Paket & Harga SaaS", section: "Platform" },
  "/admin/subscriptions": { title: "Langganan Pengguna", section: "Platform" },
  "/admin/billing": { title: "Billing & Topup", section: "Platform" },
  "/admin/support": { title: "Pusat Bantuan", section: "Operasional" },
  "/admin/devices": { title: "Perangkat WhatsApp Pengguna", section: "Operasional" },
  "/admin/messages": { title: "Log Pesan WhatsApp", section: "Operasional" },
  "/admin/notifications": { title: "Siaran & Notifikasi", section: "Operasional" },
};

export function AdminHeader({ onOpenMobileNav }: AdminHeaderProps) {
  const pathname = usePathname();
  const currentRoute = ROUTE_TITLES[pathname] || {
    title: "Portal Superadmin",
    section: "Admin",
  };

  return (
    <header className="border-border bg-background/80 sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile Menu Toggle & Dynamic Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer rounded-full p-2 transition lg:hidden"
            aria-label="Buka Menu Admin"
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
          <span className="hidden sm:inline">Tenant Dashboard</span>
        </Link>
      </div>
    </header>
  );
}
