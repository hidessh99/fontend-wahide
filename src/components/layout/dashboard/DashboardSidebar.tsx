"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Smartphone,
  Send,
  Users,
  CreditCard,
  Receipt,
  LifeBuoy,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/services/iam/hooks/useAuth";

export const DASHBOARD_NAV_ITEMS = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Slot WhatsApp",
    href: "/devices",
    icon: Smartphone,
    badge: "Engine",
  },
  {
    title: "Kampanye Broadcast",
    href: "/campaigns",
    icon: Send,
  },
  {
    title: "Buku Kontak",
    href: "/contacts",
    icon: Users,
  },
  {
    title: "Paket & Kuota",
    href: "/subscription",
    icon: CreditCard,
  },
  {
    title: "Faktur & Tagihan",
    href: "/billing",
    icon: Receipt,
  },
  {
    title: "Tiket Bantuan",
    href: "/support",
    icon: LifeBuoy,
  },
  {
    title: "Pengaturan & API",
    href: "/settings",
    icon: Settings,
  },
];

interface DashboardSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function DashboardSidebar({ onItemClick, className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, tenant } = useAuth();

  return (
    <aside className={cn("w-64 flex flex-col bg-surface dark:bg-[#131412] border-r border-border h-full select-none", className)}>
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 rounded-full bg-[#9fe870] animate-pulse" />
          <span className="font-black text-xl tracking-tight text-foreground">
            Wahide<span className="text-[#9fe870]">.</span>
          </span>
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#163300] dark:text-[#9fe870] bg-[#e2f6d5] dark:bg-[#9fe870]/15 px-2.5 py-0.5 rounded-full">
          {tenant?.planName || "Free"}
        </span>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-foreground-muted mb-2">
          Menu Bisnis
        </p>

        {DASHBOARD_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#9fe870] text-[#163300] font-bold shadow-sm"
                  : "text-foreground-secondary hover:text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("size-4", isActive ? "text-[#163300]" : "text-foreground-muted")} />
                <span>{item.title}</span>
              </div>
              {item.badge && !isActive && (
                <span className="text-[10px] font-bold bg-[#eef2eb] dark:bg-[#212320] text-foreground-muted px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Superadmin Menu (Jika Role SUPER_ADMIN) */}
        {user?.role === "SUPER_ADMIN" && (
          <div className="pt-4 mt-4 border-t border-border space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
              Super Admin
            </p>
            <Link
              href="/admin/overview"
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all",
                pathname.startsWith("/admin")
                  ? "bg-rose-600 text-white font-bold"
                  : "text-foreground-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              )}
            >
              <ShieldAlert className="size-4" />
              <span>Sistem Global</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-border m-3 rounded-[20px] bg-[#f2f4ef] dark:bg-[#161715]">
        <p className="text-xs font-bold text-foreground">Anti-Ban Multi-Device</p>
        <p className="text-[11px] font-semibold text-foreground-muted mt-0.5">
          Noise Protocol &amp; Spintax Engine aktif
        </p>
      </div>
    </aside>
  );
}
