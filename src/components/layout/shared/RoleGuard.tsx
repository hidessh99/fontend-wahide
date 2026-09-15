"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import {
  isCS,
  canAccessBilling,
  canManageTeam,
  canPairQRDevice,
  canAccessCampaigns,
} from "@/modules/iam/types/auth.types";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LayoutDashboard } from "lucide-react";

export interface RoleGuardProps {
  children: React.ReactNode;
  requireBilling?: boolean;
  requireTeamManagement?: boolean;
  requireQRPairing?: boolean;
  requireCampaignAccess?: boolean;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function RoleGuard({
  children,
  requireBilling,
  requireTeamManagement,
  requireQRPairing,
  requireCampaignAccess,
  fallbackTitle,
  fallbackDescription,
}: RoleGuardProps) {
  const userRole = useAuth((s) => s.user?.role);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full animate-pulse">
        <div className="h-8 w-64 bg-muted/60 rounded-xl" />
        <div className="h-36 w-full bg-muted/30 rounded-2xl border border-border/40" />
      </div>
    );
  }

  let hasPermission = true;

  if (requireBilling && !canAccessBilling(userRole)) {
    hasPermission = false;
  }
  if (requireTeamManagement && !canManageTeam(userRole)) {
    hasPermission = false;
  }
  if (requireQRPairing && !canPairQRDevice(userRole)) {
    hasPermission = false;
  }
  if (requireCampaignAccess && !canAccessCampaigns(userRole)) {
    hasPermission = false;
  }

  // If user is CS staff trying to access restricted page
  if (isCS(userRole) && !hasPermission) {
    const title = fallbackTitle || "Akses Terbatas: Khusus Pemilik Tenant";
    const description =
      fallbackDescription ||
      "Akun Staf CS / Operator Live Chat tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi Pemilik Akun / Manager Anda.";

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6">
        <div className="bg-surface border-border w-full max-w-md space-y-5 rounded-3xl border p-6 text-center shadow-lg sm:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="size-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-foreground text-lg font-bold sm:text-xl">
              {title}
            </h2>
            <p className="text-foreground-secondary text-xs leading-relaxed sm:text-sm">
              {description}
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <Link href="/messages">
              <Button
                variant="default"
                size="sm"
                className="bg-wise-green text-dark-green hover:bg-wise-green/90 h-10 rounded-full px-5 text-xs font-bold"
              >
                <LayoutDashboard className="mr-2 size-4" />
                Buka Live Chat Inbox
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
