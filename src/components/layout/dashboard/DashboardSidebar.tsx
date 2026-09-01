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
  Activity,
  LifeBuoy,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { UserRole, isAdmin } from "@/modules/iam/types/auth.types";

export interface DashboardNavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: UserRole[];
}

export interface DashboardNavGroup {
  groupKey?: string;
  roles?: UserRole[];
  items: DashboardNavItem[];
}

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    // General / Menu Utama
    items: [
      {
        key: "dashboardMenu.overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    // WhatsApp Engine
    groupKey: "dashboardMenu.groupWhatsapp",
    items: [
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
    ],
  },
  {
    // Manajemen & Akun (Account & Billing / Me)
    groupKey: "dashboardMenu.groupAccount",
    items: [
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
        key: "dashboardMenu.activities",
        href: "/activities",
        icon: Activity,
      },
      {
        key: "dashboardMenu.settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
  {
    // Pusat Bantuan (Support)
    groupKey: "dashboardMenu.groupSupport",
    items: [
      {
        key: "dashboardMenu.support",
        href: "/support",
        icon: LifeBuoy,
      },
    ],
  },
];

interface DashboardSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function DashboardSidebar({ onItemClick, className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const { t } = useI18n();

  return (
    <aside className={cn("w-64 flex flex-col bg-surface dark:bg-[#131412] border-r border-border h-full select-none", className)}>
      {/* Brand Header - Clean without badge */}
      <div className="h-18 px-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 rounded-full bg-wise-green animate-pulse" />
          <span className="font-black text-xl tracking-tight text-foreground">
            Wahide<span className="text-dark-green dark:text-wise-green">.</span>
          </span>
        </Link>
      </div>

      {/* Nav List with Grouping */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
        {DASHBOARD_NAV_GROUPS.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.roles || !user?.role) return true;
            const userRoleLower = user.role.toLowerCase();
            return item.roles.some((r) => r.toLowerCase() === userRoleLower);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              {group.groupKey && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-1.5">
                  {t(group.groupKey)}
                </p>
              )}
              {visibleItems.map((item) => {
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
                      "flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-150",
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
            </div>
          );
        })}

        {/* Superadmin Menu (Jika Role admin / super_admin) */}
        {isAdmin(user?.role) && (
          <div className="pt-2 border-t border-border space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
              {t("dashboardMenu.superAdmin")}
            </p>
            <Link
              href="/admin/overview"
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2 rounded-full text-xs font-semibold transition-all",
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
    </aside>
  );
}
