"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/modules/iam/types/auth.types";
import { User, LogOut, Shield, Key, ChevronDown, MapPin } from "lucide-react";

export function DashboardUserNav() {
  const router = useRouter();
  const { user, tenant, logout } = useAuth();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="hover:bg-surface hover:border-border flex cursor-pointer items-center gap-2 rounded-full border border-transparent p-1.5 transition dark:hover:bg-[#161715]"
        aria-expanded={open}
      >
        <div className="bg-wise-green text-dark-green flex size-8 items-center justify-center rounded-full text-xs font-black">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden flex-col text-left md:flex">
          <span className="text-foreground text-xs leading-tight font-bold">{user.name}</span>
          <span className="text-foreground-muted text-[10px] font-semibold tracking-wider uppercase">
            {user.role} {tenant ? `• ${tenant.planName}` : ""}
          </span>
        </div>
        <ChevronDown className="text-foreground-muted hidden size-3.5 md:block" />
      </button>

      {open && (
        <div className="bg-surface border-border animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-56 rounded-md border p-2 shadow-xl duration-150 dark:bg-[#161715]">
          <div className="border-border/60 border-b px-3 py-2">
            <p className="text-foreground truncate text-xs font-bold">{user.name}</p>
            <p className="text-foreground-muted truncate text-[11px] font-semibold">{user.email}</p>
          </div>

          <div className="text-foreground-secondary space-y-0.5 py-1 text-xs font-semibold">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-full px-3 py-2 transition"
            >
              <User className="size-3.5" />
              <span>{t("dashboardMenu.profile")}</span>
            </Link>
            <Link
              href="/settings/address"
              onClick={() => setOpen(false)}
              className="hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-full px-3 py-2 transition"
            >
              <MapPin className="size-3.5" />
              <span>{t("address.title")}</span>
            </Link>
            <Link
              href="/settings/api-key"
              onClick={() => setOpen(false)}
              className="hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-full px-3 py-2 transition"
            >
              <Key className="size-3.5" />
              <span>{t("dashboardMenu.apiKey")}</span>
            </Link>
            {isAdmin(user.role) && (
              <Link
                href="/admin/users"
                onClick={() => setOpen(false)}
                className="text-dark-green dark:text-wise-green flex items-center gap-2 rounded-full bg-[rgba(159,232,112,0.12)] px-3 py-2 font-bold transition"
              >
                <Shield className="size-3.5" />
                <span>{t("dashboardMenu.superadminPanel")}</span>
              </Link>
            )}
          </div>

          <div className="border-border/60 border-t pt-1">
            <Button
              variant="dangerPill"
              size="xs"
              onClick={handleLogout}
              className="w-full justify-center gap-1.5 text-xs"
            >
              <LogOut className="size-3" />
              <span>{t("dashboardMenu.logoutBtn")}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
