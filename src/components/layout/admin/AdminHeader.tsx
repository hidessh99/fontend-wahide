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
  "/admin/billing": { title: "Billing & Topup", section: "Platform" },
  "/admin/support": { title: "Pusat Bantuan", section: "Operasional" },
  "/admin/notifications": { title: "Siaran & Notifikasi", section: "Operasional" },
};

export function AdminHeader({ onOpenMobileNav }: AdminHeaderProps) {
  const pathname = usePathname();
  const currentRoute = ROUTE_TITLES[pathname] || {
    title: "Portal Superadmin",
    section: "Admin",
  };

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Dynamic Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-full hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer transition"
            aria-label="Buka Menu Admin"
          >
            <Menu className="size-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs font-semibold text-foreground-secondary">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-rose-600" />
            <span className="font-bold text-foreground">Admin</span>
          </div>
          <span>/</span>
          <span className="text-foreground-muted hidden sm:inline">
            {currentRoute.section}
          </span>
          <span className="hidden sm:inline">/</span>
          <span className="font-bold text-foreground truncate max-w-40 sm:max-w-none">
            {currentRoute.title}
          </span>
        </div>
      </div>

      {/* Right: Cluster Status, Theme, Locale, and Tenant Link */}
      <div className="flex items-center gap-2.5">
        {/* Cluster Health Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cluster 99.9% Uptime</span>
        </div>

        <LocaleSwitcher />
        <ThemeToggle />

        <div className="h-5 w-px bg-border hidden sm:block mx-0.5" />

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-wise-green text-dark-green hover:scale-105 active:scale-95 transition shadow-xs"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden sm:inline">Tenant Dashboard</span>
        </Link>
      </div>
    </header>
  );
}
