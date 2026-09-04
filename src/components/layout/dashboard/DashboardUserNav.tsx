"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { isAdmin } from "@/modules/iam/types/auth.types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Shield, Key, ChevronDown, MapPin } from "lucide-react";

export function DashboardUserNav() {
  const router = useRouter();
  const { user, tenant, logout } = useAuth();
  const { t } = useI18n();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-surface hover:border-border flex cursor-pointer items-center gap-2 rounded-full border border-transparent p-1.5 transition outline-none dark:hover:bg-[#161715]"
        aria-label="Menu Pengguna"
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
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-1.5 shadow-xl">
        <DropdownMenuLabel className="border-border/60 border-b px-2.5 py-2">
          <p className="text-foreground truncate text-xs font-bold">{user.name}</p>
          <p className="text-foreground-muted truncate font-mono text-[11px] font-semibold">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuGroup className="space-y-0.5 py-1">
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="cursor-pointer gap-2 rounded-md px-2.5 py-2 text-xs font-semibold"
          >
            <User className="size-3.5" />
            <span>{t("dashboardMenu.profile")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/settings/address")}
            className="cursor-pointer gap-2 rounded-md px-2.5 py-2 text-xs font-semibold"
          >
            <MapPin className="size-3.5" />
            <span>{t("address.title")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/settings/api-key")}
            className="cursor-pointer gap-2 rounded-md px-2.5 py-2 text-xs font-semibold"
          >
            <Key className="size-3.5" />
            <span>{t("dashboardMenu.apiKey")}</span>
          </DropdownMenuItem>

          {isAdmin(user.role) && (
            <DropdownMenuItem
              onClick={() => router.push("/admin/users")}
              className="text-dark-green dark:text-wise-green cursor-pointer gap-2 rounded-md bg-[rgba(159,232,112,0.12)] px-2.5 py-2 text-xs font-bold"
            >
              <Shield className="size-3.5" />
              <span>{t("dashboardMenu.superadminPanel")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="border-border/60" />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer gap-2 rounded-md px-2.5 py-2 text-xs font-bold"
        >
          <LogOut className="size-3.5" />
          <span>{t("dashboardMenu.logoutBtn")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
