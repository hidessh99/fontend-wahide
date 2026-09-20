"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { getCookie } from "@/lib/storage/cookies";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

const DashboardMobileNav = dynamic(
  () =>
    import("@/components/layout/dashboard/DashboardMobileNav").then(
      (m) => m.DashboardMobileNav,
    ),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  useEffect(() => {
    // 1. Immediate client-side check: if completely unauthenticated, redirect to login
    const cookieToken =
      getCookie("hide-jwt") || getCookie("wahide_session_token");
    if (!token && !cookieToken && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    // 2. Background Identity Anchor check: verify user entity still exists in DB
    useAuth
      .getState()
      .fetchProfile()
      .catch(() => null);
  }, [token, isAuthenticated, router]);

  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Desktop Persistent Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <DashboardMobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <DashboardHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="min-w-0 flex-1 pb-8 sm:pb-12">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
