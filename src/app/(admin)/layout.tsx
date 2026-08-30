import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LayoutDashboard, Users } from "lucide-react";
import { ThemeToggle } from "@/components/layout/shared/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Superadmin Top Banner */}
      <header className="h-16 px-4 sm:px-8 border-b border-border bg-surface dark:bg-[#131412] flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/overview" className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="size-4" />
            </div>
            <span className="font-black text-lg text-foreground tracking-tight">
              Wahide<span className="text-rose-600">.Admin</span>
            </span>
          </Link>

          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Protected Shell
          </span>
        </div>

        {/* Navigation Tabs & Right Switchers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-full text-xs font-bold">
            <Link
              href="/admin/overview"
              className="px-3 py-1.5 rounded-full text-foreground-secondary hover:text-foreground hover:bg-surface dark:hover:bg-[#161715] transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="size-3.5" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-full text-foreground-secondary hover:text-foreground hover:bg-surface dark:hover:bg-[#161715] transition flex items-center gap-1.5"
            >
              <Users className="size-3.5" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/plans"
              className="px-3 py-1.5 rounded-full text-foreground-secondary hover:text-foreground hover:bg-surface dark:hover:bg-[#161715] transition flex items-center gap-1.5"
            >
              <span>Plans</span>
            </Link>
            <Link
              href="/admin/logs"
              className="px-3 py-1.5 rounded-full text-foreground-secondary hover:text-foreground hover:bg-surface dark:hover:bg-[#161715] transition flex items-center gap-1.5"
            >
              <span>Logs</span>
            </Link>
            <Link
              href="/admin/notifications"
              className="px-3 py-1.5 rounded-full text-foreground-secondary hover:text-foreground hover:bg-surface dark:hover:bg-[#161715] transition flex items-center gap-1.5"
            >
              <span>Broadcast</span>
            </Link>
          </div>

          <ThemeToggle />
          <LocaleSwitcher />

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-wise-green text-dark-green hover:scale-105 transition shadow-sm"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Tenant Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Content with Error Boundary */}
      <main className="flex-1">
        <ErrorBoundary fallbackTitle="Terjadi Kendala Memuat Modul Superadmin">
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}
