"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { isSeller, isAdmin } from "@/modules/iam/types/auth.types";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";

interface SellerRouteGuardProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function SellerRouteGuard({
  children,
  fallbackTitle = "Akses Terbatas: Khusus Pemilik Bisnis (Seller)",
  fallbackDescription = "Halaman ini memuat pengaturan sensitif yang hanya dapat dikelola oleh Akun Pemilik Bisnis (Seller). Staf agen CS/Operator tidak memiliki izin untuk mengakses menu ini.",
}: SellerRouteGuardProps) {
  const user = useAuth((s) => s.user);

  // Jika user belum login atau memiliki role selain seller/admin (misal role 'user')
  const hasAccess = isSeller(user?.role) || isAdmin(user?.role);

  if (!hasAccess) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-surface dark:bg-[#161715] border border-border shadow-lg text-center space-y-5">
          <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="size-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {fallbackTitle}
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              {fallbackDescription}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="sm"
                className="w-full rounded-full bg-wise-green text-dark-green font-bold text-xs px-5 h-10 hover:bg-wise-green/90"
              >
                <LayoutDashboard className="size-4 mr-2" />
                Kembali ke Dasbor
              </Button>
            </Link>
            <Link href="/contacts" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full text-xs font-bold px-5 h-10 border-border hover:border-foreground-muted"
              >
                <ArrowLeft className="size-4 mr-2" />
                Buku Kontak
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
