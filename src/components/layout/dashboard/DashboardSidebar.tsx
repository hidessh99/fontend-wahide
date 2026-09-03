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

const SELLER_ROLES: UserRole[] = ["admin", "seller", "SUPER_ADMIN", "SELLER"];

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
        roles: SELLER_ROLES,
      },
      {
        key: "dashboardMenu.contacts",
        href: "/contacts",
        icon: Users,
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
        roles: SELLER_ROLES,
      },
      {
        key: "dashboardMenu.billing",
        href: "/billing",
        icon: Receipt,
        roles: SELLER_ROLES,
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
        roles: SELLER_ROLES,
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
    <aside
      className={cn(
        "bg-surface border-border flex h-full w-64 flex-col border-r select-none dark:bg-[#131412]",
        className
      )}
    >
      {/* Brand Header - Clean without badge */}
      <div className="border-border flex h-18 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-wise-green h-3.5 w-3.5 animate-pulse rounded-full" />
          <span className="text-foreground text-xl font-black tracking-tight">
            Wahide<span className="text-dark-green dark:text-wise-green">.</span>
          </span>
        </Link>
      </div>

      {/* Nav List with Grouping */}
      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
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
                <p className="text-foreground-muted mb-1.5 px-3 text-[10px] font-bold tracking-wider uppercase">
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
                      "flex items-center justify-between rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-150",
                      isActive
                        ? "bg-wise-green text-dark-green font-bold shadow-sm"
                        : "text-foreground-secondary hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-4",
                          isActive ? "text-dark-green" : "text-foreground-muted"
                        )}
                      />
                      <span>{t(item.key)}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="text-foreground-muted rounded-full bg-[#eef2eb] px-2 py-0.5 text-[10px] font-bold dark:bg-[#212320]">
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
          <div className="border-border space-y-1 border-t pt-2">
            <p className="mb-1.5 px-3 text-[10px] font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
              {t("dashboardMenu.superAdmin")}
            </p>
            <Link
              href="/admin/users"
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-full px-3.5 py-2 text-xs font-semibold transition-all",
                pathname.startsWith("/admin")
                  ? "bg-rose-600 font-bold text-white"
                  : "text-foreground-secondary hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
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
