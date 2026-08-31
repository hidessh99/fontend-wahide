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
  UserCheck,
  CreditCard,
  Receipt,
  LifeBuoy,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/services/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { UserRole, isAdmin } from "@/services/iam/types/auth.types";

export interface DashboardNavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: UserRole[];
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    key: "dashboardMenu.overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "dashboardMenu.whatsappSlots",
    href: "/devices",
    icon: Smartphone,
    badge: "Engine",
  },
  {
    key: "dashboardMenu.campaigns",
    href: "/campaigns",
    icon: Send,
  },
  {
    key: "dashboardMenu.contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    key: "dashboardMenu.team",
    href: "/team",
    icon: UserCheck,
    roles: ["admin", "seller", "SUPER_ADMIN", "SELLER"],
  },
  {
    key: "dashboardMenu.subscription",
    href: "/subscription",
    icon: CreditCard,
    roles: ["admin", "seller", "SUPER_ADMIN", "SELLER"],
  },
  {
    key: "dashboardMenu.billing",
    href: "/billing",
    icon: Receipt,
    roles: ["admin", "seller", "SUPER_ADMIN", "SELLER"],
  },
  {
    key: "dashboardMenu.support",
    href: "/support",
    icon: LifeBuoy,
  },
  {
    key: "dashboardMenu.settings",
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
  const user = useAuth((s) => s.user);
  const tenant = useAuth((s) => s.tenant);
  const { t } = useI18n();

  return (
    <aside className={cn("w-64 flex flex-col bg-surface dark:bg-[#131412] border-r border-border h-full select-none", className)}>
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 rounded-full bg-wise-green animate-pulse" />
          <span className="font-black text-xl tracking-tight text-foreground">
            Wahide<span className="text-wise-green">.</span>
          </span>
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full">
          {tenant?.planName || "Free"}
        </span>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-foreground-muted mb-2">
          {t("dashboardMenu.businessMenu")}
        </p>

        {DASHBOARD_NAV_ITEMS.filter((item) => {
          if (!item.roles || !user?.role) return true;
          const userRoleLower = user.role.toLowerCase();
          return item.roles.some((r) => r.toLowerCase() === userRoleLower);
        }).map((item) => {
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
                  ? "bg-wise-green text-dark-green font-bold shadow-sm"
                  : "text-foreground-secondary hover:text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("size-4", isActive ? "text-dark-green" : "text-foreground-muted")} />
                <span>{t(item.key)}</span>
              </div>
              {item.badge && !isActive && (
                <span className="text-[10px] font-bold bg-[#eef2eb] dark:bg-[#212320] text-foreground-muted px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Superadmin Menu (Jika Role admin / super_admin) */}
        {isAdmin(user?.role) && (
          <div className="pt-4 mt-4 border-t border-border space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
              {t("dashboardMenu.superAdmin")}
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
              <span>{t("dashboardMenu.globalSystem")}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-border m-3 rounded-md bg-[#f2f4ef] dark:bg-[#161715]">
        <p className="text-xs font-bold text-foreground">Anti-Ban Multi-Device</p>
        <p className="text-[11px] font-semibold text-foreground-muted mt-0.5">
          Noise Protocol &amp; Spintax Engine aktif
        </p>
      </div>
    </aside>
  );
}
