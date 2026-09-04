"use client";

import React, { useState } from "react";
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

  // User manual toggle overrides for accordions (keyed by item title)
  const [manuallyToggled, setManuallyToggled] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string, currentIsOpen: boolean) => {
    setManuallyToggled((prev) => ({
      ...prev,
      [title]: !currentIsOpen,
    }));
  };

  return (
    <aside
      className={cn(
        "bg-surface text-foreground border-border flex h-full w-64 flex-col border-r select-none dark:bg-[#121310]",
        className
      )}
    >
      {/* Brand Header */}
      <div className="border-border bg-muted/20 flex h-16 items-center justify-between border-b px-5">
        <Link href="/admin/users" onClick={onItemClick} className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-600 font-bold text-white shadow-xs">
            <ShieldAlert className="size-4" />
          </div>
          <div>
            <div className="text-foreground text-base leading-tight font-black tracking-tight">
              Wahide<span className="text-rose-600">.Admin</span>
            </div>
            <span className="inline-block font-mono text-[9px] font-black tracking-wider text-rose-600 uppercase dark:text-rose-400">
              Protected Shell
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3.5 py-5">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <p className="text-foreground-muted mb-2 px-3 text-[10px] font-extrabold tracking-wider uppercase">
              {group.groupTitle}
            </p>

            {group.items.map((item) => {
              const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
              const isParentActive = hasSubItems
                ? item.subItems?.some((sub) => pathname === sub.href)
                : pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
              const isOpen = hasSubItems ? (manuallyToggled[item.title] ?? isParentActive) : false;
              const Icon = item.icon;

              return (
                <div key={item.title} className="space-y-1">
                  {hasSubItems ? (
                    // Interactive Accordion Trigger Button
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.title, isOpen)}
                      aria-expanded={isOpen}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-full px-3.5 py-2 text-xs transition-all duration-150 select-none",
                        isParentActive
                          ? "bg-muted/40 font-bold text-rose-600 dark:text-rose-400"
                          : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isParentActive
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-foreground-muted"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 transition-transform duration-200",
                          isOpen
                            ? "rotate-0 text-rose-600 dark:text-rose-400"
                            : "text-foreground-muted -rotate-90"
                        )}
                      />
                    </button>
                  ) : (
                    // Direct Navigation Link (for standalone single items)
                    <Link
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "relative flex items-center justify-between rounded-full px-3.5 py-2 text-xs transition-all duration-150",
                        isParentActive
                          ? "border border-rose-500/20 bg-rose-500/10 font-bold text-rose-600 shadow-xs dark:text-rose-400"
                          : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isParentActive
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-foreground-muted"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      {isParentActive && (
                        <span className="size-1.5 shrink-0 rounded-full bg-rose-600 dark:bg-rose-400" />
                      )}
                    </Link>
                  )}

                  {/* Sub-menu Items with Smooth Height Transition and Tree Guideline */}
                  {hasSubItems && item.subItems && (
                    <div
                      className={cn(
                        "grid transition-all duration-200 ease-in-out",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "pointer-events-none grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="border-border/70 my-1 ml-4.5 space-y-1 overflow-hidden border-l-2 py-0.5 pr-1 pl-3.5">
                        {item.subItems.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          const SubIcon = sub.icon;

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={onItemClick}
                              className={cn(
                                "relative flex items-center justify-between rounded-full px-3 py-1.5 text-[11px] transition-all duration-150",
                                isSubActive
                                  ? "border border-rose-500/20 bg-rose-500/10 font-bold text-rose-600 shadow-2xs dark:text-rose-400"
                                  : "text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold"
                              )}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <SubIcon
                                  className={cn(
                                    "size-3.5 shrink-0",
                                    isSubActive
                                      ? "text-rose-600 dark:text-rose-400"
                                      : "text-foreground-muted"
                                  )}
                                />
                                <span className="truncate">{sub.title}</span>
                              </div>

                              {isSubActive && (
                                <span className="size-1.5 shrink-0 rounded-full bg-rose-600 dark:bg-rose-400" />
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
      <div className="border-border bg-muted/20 space-y-2.5 border-t p-3.5">
        {/* User Identity Chip */}
        {user && (
          <div className="border-border bg-surface flex items-center gap-2.5 rounded-lg border p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-foreground truncate text-xs leading-tight font-bold">
                {user.name || "Administrator"}
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">
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
          className="bg-wise-green text-dark-green flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Tenant App</span>
        </Link>
      </div>
    </aside>
  );
}
