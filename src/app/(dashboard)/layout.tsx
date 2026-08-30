"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { DashboardMobileNav } from "@/components/layout/dashboard/DashboardMobileNav";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <DashboardMobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <DashboardHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary fallbackTitle="Terjadi Kendala Memuat Halaman Dasbor">
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
