"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  Users,
  CreditCard,
  Radio,
  FileText,
  ArrowLeft,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  {
    title: "Global Overview",
    href: "/admin/overview",
    icon: ShieldAlert,
  },
  {
    title: "Kelola User & Tenant",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Paket & Harga SaaS",
    href: "/admin/plans",
    icon: CreditCard,
  },
  {
    title: "Monitor Queue & Redis",
    href: "/admin/queues",
    icon: Radio,
  },
  {
    title: "Audit Keamanan",
    href: "/admin/audit-logs",
    icon: FileText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col bg-[#14080a] text-white border-r border-rose-950/60 h-full select-none">
      <div className="h-18 px-6 flex items-center justify-between border-b border-rose-950/60">
        <Link href="/admin/overview" className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-black text-xl tracking-tight text-white">
            Wahide<span className="text-rose-500"> Admin</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-rose-300/60 mb-2">
          Platform Controls
        </p>

        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-rose-600 text-white font-bold shadow-sm"
                  : "text-rose-100/70 hover:text-white hover:bg-rose-950/40"
              )}
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-rose-950/60">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-xs font-bold text-rose-200 hover:text-white hover:bg-rose-950/40 transition"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Tenant App</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
