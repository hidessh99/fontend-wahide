"use client";

import React from "react";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { DashboardUserNav } from "./DashboardUserNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { useAuth } from "@/services/iam/hooks/useAuth";
import { Menu, Zap } from "lucide-react";

interface DashboardHeaderProps {
  onOpenMobileNav?: () => void;
}

export function DashboardHeader({ onOpenMobileNav }: DashboardHeaderProps) {
  const { tenant } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-18 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
      {/* Kiri: Mobile Nav Button & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-full hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="size-5" />
          </button>
        )}
        <DashboardBreadcrumb />
      </div>

      {/* Kanan: Quota Pill, Locale Switcher, Theme Toggle, & User Dropdown */}
      <div className="flex items-center gap-2.5">
        {tenant && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(159,232,112,0.15)] border border-[rgba(159,232,112,0.3)] text-xs font-bold text-dark-green dark:text-wise-green">
            <Zap className="size-3.5" />
            <span>
              {tenant.usedQuota.toLocaleString("id-ID")} / {tenant.monthlyQuota.toLocaleString("id-ID")}
            </span>
          </div>
        )}

        <LocaleSwitcher />
        <ThemeToggle />
        <div className="h-6 w-px bg-border hidden sm:block" />
        <DashboardUserNav />
      </div>
    </header>
  );
}
