"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import {
  ShieldAlert,
  Users,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  Smartphone,
  Radio,
  ArrowLeft,
  ShieldCheck,
  Activity,
  UserCheck,
  Receipt,
  ChevronDown,
} from "lucide-react";

export interface AdminNavSubItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AdminNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: AdminNavSubItem[];
}

export interface AdminNavGroup {
  groupTitle: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    groupTitle: "Kontrol Platform",
    items: [
      {
        title: "Pengguna & Member",
        href: "/admin/users",
        icon: Users,
        subItems: [
          {
            title: "Daftar Member",
            href: "/admin/users",
            icon: UserCheck,
          },
          {
            title: "Log Aktivitas",
            href: "/admin/activities",
            icon: Activity,
          },
          {
            title: "Billing & Topup",
            href: "/admin/billing",
            icon: Receipt,
          },
        ],
      },
      {
        title: "Langganan & Paket SaaS",
        href: "/admin/subscriptions",
        icon: CreditCard,
        subItems: [
          {
            title: "Daftar Langganan",
            href: "/admin/subscriptions",
            icon: Receipt,
          },
          {
            title: "Paket & Harga SaaS",
            href: "/admin/plans",
            icon: CreditCard,
          },
        ],
      },
    ],
  },
  {
    groupTitle: "Operasional & Monitoring",
    items: [
      {
        title: "WhatsApp Gateway",
        href: "/admin/devices",
        icon: Smartphone,
        subItems: [
          {
            title: "Perangkat WhatsApp",
            href: "/admin/devices",
            icon: Smartphone,
          },
          {
            title: "Log Pesan WhatsApp",
            href: "/admin/messages",
            icon: MessageSquare,
          },
        ],
      },
      {
        title: "Siaran & Notifikasi",
        href: "/admin/notifications",
        icon: Radio,
      },
      {
        title: "Pusat Bantuan",
        href: "/admin/support",
        icon: LifeBuoy,
      },
    ],
  },
];

interface AdminSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function AdminSidebar({ onItemClick, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useAuth((s) => s.user);

  // State to track accordion open/close state for each parent menu
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of ADMIN_NAV_GROUPS) {
      for (const item of group.items) {
        if (item.subItems && item.subItems.some((sub) => sub.href === pathname)) {
          initial[item.title] = true;
        }
      }
    }
    return initial;
  });

  // Auto-expand parent accordion when pathname changes
  useEffect(() => {
    for (const group of ADMIN_NAV_GROUPS) {
      for (const item of group.items) {
        if (item.subItems && item.subItems.some((sub) => sub.href === pathname)) {
          setOpenGroups((prev) => {
            if (prev[item.title]) return prev;
            return { ...prev, [item.title]: true };
          });
        }
      }
    }
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside
      className={cn(
        "w-64 flex flex-col bg-surface dark:bg-[#121310] text-foreground border-r border-border h-full select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-border bg-muted/20">
        <Link
          href="/admin/users"
          onClick={onItemClick}
          className="flex items-center gap-2.5"
        >
          <div className="size-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <ShieldAlert className="size-4" />
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-foreground leading-tight">
              Wahide<span className="text-rose-600">.Admin</span>
            </div>
            <span className="inline-block text-[9px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono">
              Protected Shell
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-foreground-muted mb-2">
              {group.groupTitle}
            </p>

            {group.items.map((item) => {
              const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
              const isParentActive = hasSubItems
                ? item.subItems?.some((sub) => pathname === sub.href)
                : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
              const isOpen = hasSubItems ? Boolean(openGroups[item.title]) : false;
              const Icon = item.icon;

              return (
                <div key={item.title} className="space-y-1">
                  {hasSubItems ? (
                    // Interactive Accordion Trigger Button
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.title)}
                      aria-expanded={isOpen}
                      className={cn(
                        "w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs transition-all duration-150 cursor-pointer select-none",
                        isParentActive
                          ? "text-rose-600 dark:text-rose-400 font-bold bg-muted/40"
                          : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isParentActive ? "text-rose-600 dark:text-rose-400" : "text-foreground-muted"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 transition-transform duration-200",
                          isOpen ? "rotate-0 text-rose-600 dark:text-rose-400" : "-rotate-90 text-foreground-muted"
                        )}
                      />
                    </button>
                  ) : (
                    // Direct Navigation Link (for standalone single items)
                    <Link
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2 rounded-full text-xs transition-all duration-150 relative",
                        isParentActive
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 shadow-xs"
                          : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isParentActive ? "text-rose-600 dark:text-rose-400" : "text-foreground-muted"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      {isParentActive && (
                        <span className="size-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
                      )}
                    </Link>
                  )}

                  {/* Sub-menu Items with Smooth Height Transition and Tree Guideline */}
                  {hasSubItems && item.subItems && (
                    <div
                      className={cn(
                        "grid transition-all duration-200 ease-in-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                      )}
                    >
                      <div className="overflow-hidden pl-3.5 pr-1 space-y-1 py-0.5 border-l-2 border-border/70 ml-4.5 my-1">
                        {item.subItems.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          const SubIcon = sub.icon;

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={onItemClick}
                              className={cn(
                                "flex items-center justify-between px-3 py-1.5 rounded-full text-[11px] transition-all duration-150 relative",
                                isSubActive
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 shadow-2xs"
                                  : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <SubIcon
                                  className={cn(
                                    "size-3.5 shrink-0",
                                    isSubActive ? "text-rose-600 dark:text-rose-400" : "text-foreground-muted"
                                  )}
                                />
                                <span className="truncate">{sub.title}</span>
                              </div>

                              {isSubActive && (
                                <span className="size-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile & Tenant App Navigation */}
      <div className="p-3.5 border-t border-border bg-muted/20 space-y-2.5">
        {/* User Identity Chip */}
        {user && (
          <div className="p-2.5 rounded-lg border border-border bg-surface dark:bg-[#161715] flex items-center gap-2.5">
            <div className="size-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-foreground truncate leading-tight">
                {user.name || "Administrator"}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 font-mono font-bold">
                <ShieldCheck className="size-3 shrink-0" />
                <span className="truncate">{user.role.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Link to Tenant Dashboard */}
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-full text-xs font-bold bg-wise-green text-dark-green hover:scale-[1.02] active:scale-[0.98] transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Tenant App</span>
        </Link>
      </div>
    </aside>
  );
}
