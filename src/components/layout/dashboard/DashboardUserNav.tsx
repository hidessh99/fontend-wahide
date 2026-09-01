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
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface dark:hover:bg-[#161715] transition cursor-pointer border border-transparent hover:border-border"
        aria-expanded={open}
      >
        <div className="size-8 rounded-full bg-wise-green text-dark-green font-black text-xs flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-foreground leading-tight">
            {user.name}
          </span>
          <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
            {user.role} {tenant ? `• ${tenant.planName}` : ""}
          </span>
        </div>
        <ChevronDown className="size-3.5 text-foreground-muted hidden md:block" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-surface dark:bg-[#161715] border border-border shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-border/60">
            <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
            <p className="text-[11px] font-semibold text-foreground-muted truncate">{user.email}</p>
          </div>

          <div className="py-1 text-xs font-semibold text-foreground-secondary space-y-0.5">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted hover:text-foreground transition"
            >
              <User className="size-3.5" />
              <span>{t("dashboardMenu.profile")}</span>
            </Link>
            <Link
              href="/settings/address"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted hover:text-foreground transition"
            >
              <MapPin className="size-3.5" />
              <span>{t("address.title")}</span>
            </Link>
            <Link
              href="/settings/api-key"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted hover:text-foreground transition"
            >
              <Key className="size-3.5" />
              <span>{t("dashboardMenu.apiKey")}</span>
            </Link>
            {isAdmin(user.role) && (
              <Link
                href="/admin/overview"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-[rgba(159,232,112,0.12)] text-dark-green dark:text-wise-green font-bold transition"
              >
                <Shield className="size-3.5" />
                <span>{t("dashboardMenu.superadminPanel")}</span>
              </Link>
            )}
          </div>

          <div className="pt-1 border-t border-border/60">
            <Button
              variant="dangerPill"
              size="xs"
              onClick={handleLogout}
              className="w-full gap-1.5 justify-center text-xs"
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
