"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin/AdminSidebar";
import { AdminHeader } from "@/components/layout/admin/AdminHeader";
import { AdminMobileNav } from "@/components/layout/admin/AdminMobileNav";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="bg-background text-foreground flex min-h-screen font-sans">
      {/* Desktop Persistent Left Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <AdminMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Admin Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <AdminHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="min-w-0 flex-1">
          <ErrorBoundary fallbackTitle="Terjadi Kendala Memuat Modul Superadmin">
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
