"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/services/iam/hooks/useAuth";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  CreditCard,
  LifeBuoy,
  FileText,
  Radio,
  ArrowLeft,
  ShieldCheck,
  Activity,
  UserCheck,
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
        title: "Overview Global",
        href: "/admin/overview",
        icon: LayoutDashboard,
      },
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
        ],
      },
      {
        title: "Paket & Harga SaaS",
        href: "/admin/plans",
        icon: CreditCard,
      },
    ],
  },
  {
    groupTitle: "Operasional & Monitoring",
    items: [
      {
        title: "Pusat Bantuan",
        href: "/admin/support",
        icon: LifeBuoy,
      },
      {
        title: "Log Audit & Keamanan",
        href: "/admin/logs",
        icon: FileText,
      },
      {
        title: "Siaran & Notifikasi",
        href: "/admin/notifications",
        icon: Radio,
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
          href="/admin/overview"
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
                ? item.subItems?.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"))
                : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;

              return (
                <div key={item.href} className="space-y-1">
                  <Link
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2 rounded-full text-xs transition-all duration-150 relative",
                      isParentActive && !hasSubItems
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 shadow-xs"
                        : isParentActive && hasSubItems
                        ? "text-rose-600 dark:text-rose-400 font-bold"
                        : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isParentActive ? "text-rose-600 dark:text-rose-400" : "text-foreground-muted"
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                    {isParentActive && !hasSubItems && (
                      <span className="absolute right-3 size-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
                    )}
                  </Link>

                  {/* Sub-menu Items */}
                  {hasSubItems && item.subItems && (
                    <div className="pl-4 pr-1 space-y-1 py-0.5 border-l-2 border-border/60 ml-4.5 my-1">
                      {item.subItems.map((sub) => {
                        const isSubActive =
                          pathname === sub.href ||
                          (sub.href !== "/admin/users" && pathname.startsWith(sub.href + "/"));
                        const SubIcon = sub.icon;

                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onItemClick}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] transition-all duration-150 relative",
                              isSubActive
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 shadow-2xs"
                                : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                            )}
                          >
                            <SubIcon
                              className={cn(
                                "size-3.5 shrink-0",
                                isSubActive ? "text-rose-600 dark:text-rose-400" : "text-foreground-muted"
                              )}
                            />
                            <span className="truncate">{sub.title}</span>
                            {isSubActive && (
                              <span className="absolute right-2.5 size-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
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
