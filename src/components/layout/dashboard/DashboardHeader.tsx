"use client";

import React from "react";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { DashboardUserNav } from "./DashboardUserNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  onOpenMobileNav?: () => void;
}

export function DashboardHeader({ onOpenMobileNav }: DashboardHeaderProps) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-18 items-center justify-between border-b px-4 backdrop-blur-md sm:px-8">
      {/* Kiri: Mobile Nav Button & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer rounded-full p-2 lg:hidden"
            aria-label="Buka Menu"
          >
            <Menu className="size-5" />
          </button>
        )}
        <DashboardBreadcrumb />
      </div>

      {/* Kanan: Locale Switcher, Theme Toggle, & User Dropdown */}
      <div className="flex items-center gap-2.5">
        <LocaleSwitcher />
        <ThemeToggle />
        <div className="bg-border hidden h-6 w-px sm:block" />
        <DashboardUserNav />
      </div>
    </header>
  );
}
