"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/iam/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, LogOut, Shield, Key, ChevronDown } from "lucide-react";

export function DashboardUserNav() {
  const router = useRouter();
  const { user, tenant, logout } = useAuth();
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
        <div className="size-8 rounded-full bg-[#9fe870] text-[#163300] font-black text-xs flex items-center justify-center">
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
        <div className="absolute right-0 mt-2 w-56 rounded-[20px] bg-surface dark:bg-[#161715] border border-border shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-border/60">
            <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
            <p className="text-[11px] font-semibold text-foreground-muted truncate">{user.email}</p>
          </div>

          <div className="py-1 text-xs font-semibold text-foreground-secondary space-y-0.5">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-[12px] hover:bg-muted hover:text-foreground transition"
            >
              <User className="size-3.5" />
              <span>Profil Akun</span>
            </Link>
            <Link
              href="/settings/api-key"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-[12px] hover:bg-muted hover:text-foreground transition"
            >
              <Key className="size-3.5" />
              <span>API Key Fast-Path</span>
            </Link>
            {user.role === "SUPER_ADMIN" && (
              <Link
                href="/admin/overview"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[rgba(159,232,112,0.12)] text-[#163300] dark:text-[#9fe870] font-bold transition"
              >
                <Shield className="size-3.5" />
                <span>Panel Superadmin</span>
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
              <span>Keluar Sesi</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
