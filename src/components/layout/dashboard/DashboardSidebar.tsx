"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Smartphone,
  Users,
  CreditCard,
  Receipt,
  Activity,
  LifeBuoy,
  Settings,
  ShieldAlert,
  FileText,
  BellRing,
  CalendarDays,
  ClipboardList,
  Megaphone,
  ShieldCheck,
  Bot,
  LayoutTemplate,
  ScrollText,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Radio,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { UserRole, isAdmin, isCS } from "@/modules/iam/types/auth.types";

export interface DashboardNavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: UserRole[];
  hideForCS?: boolean;
}

export interface DashboardNavGroup {
  groupKey?: string;
  roles?: UserRole[];
  items: DashboardNavItem[];
}

export interface ChannelSubItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: UserRole[];
  hideForCS?: boolean;
}

export interface ChannelNavSection {
  id: "wa" | "waba" | "tele";
  titleKey: string;
  baseRoute: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: UserRole[];
  hideForCS?: boolean;
  items: ChannelSubItem[];
}

const SELLER_ROLES: UserRole[] = ["admin", "seller", "SUPER_ADMIN", "SELLER"];

export const CHANNEL_NAV_SECTIONS: ChannelNavSection[] = [
  {
    id: "wa",
    titleKey: "dashboardMenu.channelWaUnofficial",
    baseRoute: "/wa",
    icon: Smartphone,
    badge: "Socket",
    items: [
      {
        key: "dashboardMenu.channelDevices",
        href: "/wa/devices",
        icon: Smartphone,
      },
      {
        key: "dashboardMenu.channelTemplates",
        href: "/wa/templates",
        icon: LayoutTemplate,
      },
      {
        key: "dashboardMenu.channelLogs",
        href: "/wa/logs",
        icon: ScrollText,
      },
      {
        key: "dashboardMenu.channelStats",
        href: "/wa/stats",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "waba",
    titleKey: "dashboardMenu.channelWabaOfficial",
    baseRoute: "/waba",
    icon: ShieldCheck,
    badge: "Official",
    roles: SELLER_ROLES,
    hideForCS: true,
    items: [
      {
        key: "dashboardMenu.channelDevices",
        href: "/waba/devices",
        icon: ShieldCheck,
      },
      {
        key: "dashboardMenu.channelTemplates",
        href: "/waba/templates",
        icon: LayoutTemplate,
      },
      {
        key: "dashboardMenu.channelLogs",
        href: "/waba/logs",
        icon: ScrollText,
      },
      {
        key: "dashboardMenu.channelStats",
        href: "/waba/stats",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "tele",
    titleKey: "dashboardMenu.channelTelegram",
    baseRoute: "/tele",
    icon: Bot,
    badge: "Bot",
    roles: SELLER_ROLES,
    items: [
      {
        key: "dashboardMenu.channelDevices",
        href: "/tele/devices",
        icon: Bot,
      },
      {
        key: "dashboardMenu.channelTemplates",
        href: "/tele/templates",
        icon: LayoutTemplate,
      },
      {
        key: "dashboardMenu.channelLogs",
        href: "/tele/logs",
        icon: ScrollText,
      },
      {
        key: "dashboardMenu.channelStats",
        href: "/tele/stats",
        icon: BarChart3,
      },
    ],
  },
];

export const MAIN_NAV_ITEMS: DashboardNavItem[] = [
  {
    key: "dashboardMenu.overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "dashboardMenu.messages",
    href: "/messages",
    icon: MessageSquare,
    badge: "Omni",
  },
];

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    // Broadcast & Kontak (Pemasaran & Kontak)
    groupKey: "dashboardMenu.groupBroadcast",
    items: [
      {
        key: "dashboardMenu.campaigns",
        href: "/campaigns",
        icon: Megaphone,
        roles: SELLER_ROLES,
        hideForCS: true,
      },
      {
        key: "dashboardMenu.contacts",
        href: "/contacts",
        icon: Users,
      },
      {
        key: "dashboardMenu.templates",
        href: "/templates",
        icon: FileText,
        roles: SELLER_ROLES,
        hideForCS: true,
      },
    ],
  },
  {
    // Otomasi Solusi Bisnis
    groupKey: "dashboardMenu.groupBusiness",
    items: [
      {
        key: "dashboardMenu.reservations",
        href: "/reservations",
        icon: CalendarDays,
        roles: SELLER_ROLES,
        hideForCS: true,
      },
      {
        key: "dashboardMenu.reminders",
        href: "/reminders",
        icon: BellRing,
        roles: SELLER_ROLES,
        hideForCS: true,
      },
      {
        key: "dashboardMenu.forms",
        href: "/forms",
        icon: ClipboardList,
        roles: SELLER_ROLES,
        hideForCS: true,
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
        hideForCS: true,
      },
      {
        key: "dashboardMenu.billing",
        href: "/billing",
        icon: Receipt,
        roles: SELLER_ROLES,
        hideForCS: true,
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
        hideForCS: true,
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

export function DashboardSidebar({
  onItemClick,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const { t } = useI18n();
  const userIsCS = isCS(user?.role);

  // Collapsible channel accordions state
  const [openChannels, setOpenChannels] = useState<Record<string, boolean>>({
    wa: true,
    waba: false,
    tele: false,
  });

  // Auto-expand channel based on current route
  useEffect(() => {
    if (pathname.startsWith("/wa") || pathname === "/devices" || pathname.startsWith("/devices/")) {
      setOpenChannels((prev) => ({ ...prev, wa: true }));
    } else if (pathname.startsWith("/waba")) {
      setOpenChannels((prev) => ({ ...prev, waba: true }));
    } else if (pathname.startsWith("/tele")) {
      setOpenChannels((prev) => ({ ...prev, tele: true }));
    }
  }, [pathname]);

  const toggleChannel = (channelId: string) => {
    setOpenChannels((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    if (href === "/wa/devices") {
      return (
        pathname === "/wa/devices" ||
        pathname.startsWith("/wa/devices/") ||
        pathname === "/devices" ||
        pathname.startsWith("/devices/")
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={cn(
        "bg-surface border-border flex h-full w-64 flex-col border-r select-none dark:bg-[#131412]",
        className,
      )}
    >
      {/* Brand Header */}
      <div className="border-border flex h-14 items-center justify-between border-b px-6 sm:h-16 lg:h-18">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-wise-green h-3.5 w-3.5 animate-pulse rounded-full" />
          <span className="text-foreground text-xl font-black tracking-tight">
            Wahide
            <span className="text-dark-green dark:text-wise-green">.</span>
          </span>
        </Link>
      </div>

      {/* Nav List with Grouping */}
      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {/* Primary Menu (Overview & Omnichannel Messages) */}
        <div className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = isItemActive(item.href);
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
                    : "text-foreground-secondary hover:text-foreground hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "size-4",
                      isActive ? "text-dark-green" : "text-foreground-muted",
                    )}
                  />
                  <span>{t(item.key)}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Channels Section (Saluran Komunikasi) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-3">
            <Radio className="size-3 text-wise-green" />
            <p className="text-foreground-muted text-[10px] font-bold tracking-wider uppercase">
              {t("dashboardMenu.groupChannels")}
            </p>
          </div>

          <div className="space-y-1">
            {CHANNEL_NAV_SECTIONS.map((channel) => {
              if (userIsCS && channel.hideForCS) return null;
              if (channel.roles && user?.role) {
                const userRoleLower = user.role.toLowerCase();
                const hasRole = channel.roles.some((r) => r.toLowerCase() === userRoleLower);
                if (!hasRole) return null;
              }

              const isOpen = !!openChannels[channel.id];
              const isChannelActive = pathname.startsWith(channel.baseRoute);
              const ChannelIcon = channel.icon;

              return (
                <div key={channel.id} className="rounded-xl transition-colors">
                  {/* Channel Header / Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleChannel(channel.id)}
                    aria-expanded={isOpen}
                    className={cn(
                      "flex w-full items-center justify-between rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-150 cursor-pointer",
                      isChannelActive && !isOpen
                        ? "bg-muted text-foreground"
                        : "text-foreground-secondary hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <ChannelIcon className="size-4 text-foreground-muted" />
                      <span className="truncate">{t(channel.titleKey)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {channel.badge && (
                        <span className="rounded-full bg-[#eef2eb] px-1.5 py-0.5 text-[9px] font-bold text-foreground-muted dark:bg-[#212320]">
                          {channel.badge}
                        </span>
                      )}
                      {isOpen ? (
                        <ChevronDown className="size-3.5 text-foreground-muted" />
                      ) : (
                        <ChevronRight className="size-3.5 text-foreground-muted" />
                      )}
                    </div>
                  </button>

                  {/* Channel Submenu (Accordion Panel) */}
                  {isOpen && (
                    <div className="border-border/60 ml-5 pl-2.5 my-1 space-y-0.5 border-l">
                      {channel.items.map((subItem) => {
                        if (userIsCS && subItem.hideForCS) return null;
                        const isActive = isItemActive(subItem.href);
                        const SubIcon = subItem.icon;

                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={onItemClick}
                            className={cn(
                              "flex items-center justify-between rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                              isActive
                                ? "bg-wise-green text-dark-green font-bold shadow-sm"
                                : "text-foreground-secondary hover:text-foreground hover:bg-muted",
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <SubIcon
                                className={cn(
                                  "size-3.5",
                                  isActive
                                    ? "text-dark-green"
                                    : "text-foreground-muted",
                                )}
                              />
                              <span>{t(subItem.key)}</span>
                            </div>
                            {subItem.badge && !isActive && (
                              <span className="rounded-full bg-[#eef2eb] px-1.5 py-0.2 text-[9px] font-bold text-foreground-muted dark:bg-[#212320]">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Dashboard Nav Groups */}
        {DASHBOARD_NAV_GROUPS.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) => {
            if (userIsCS && item.hideForCS) return false;
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
                const isActive = isItemActive(item.href);
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
                        : "text-foreground-secondary hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-4",
                          isActive
                            ? "text-dark-green"
                            : "text-foreground-muted",
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

        {/* Superadmin Menu */}
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
                  : "text-foreground-secondary hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30",
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
