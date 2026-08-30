"use client";

import React from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DashboardUserNav } from "@/components/layout/dashboard/DashboardUserNav";
import { ShieldAlert, Activity } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 h-18 border-b border-rose-200 dark:border-rose-950/60 bg-background/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-black">
          <ShieldAlert className="size-3.5" />
          <span>SUPERADMIN CONTROL PLANE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <Activity className="size-3.5" />
          <span>Cluster: All Green (99.99%)</span>
        </div>
        <ThemeToggle />
        <div className="h-6 w-px bg-border" />
        <DashboardUserNav />
      </div>
    </header>
  );
}
