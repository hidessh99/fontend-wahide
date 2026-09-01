"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin/AdminSidebar";
import { AdminHeader } from "@/components/layout/admin/AdminHeader";
import { AdminMobileNav } from "@/components/layout/admin/AdminMobileNav";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <AdminMobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Admin Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 min-w-0">
          <ErrorBoundary fallbackTitle="Terjadi Kendala Memuat Modul Superadmin">
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
