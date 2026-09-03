"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { DashboardMobileNav } from "@/components/layout/dashboard/DashboardMobileNav";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Desktop Persistent Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <DashboardMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <DashboardHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="min-w-0 flex-1">
          <ErrorBoundary fallbackTitle="Terjadi Kendala Memuat Halaman Dasbor">
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
