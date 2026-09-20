"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useI18n } from "@/lib/i18n/context";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({ open, onClose }: AdminMobileNavProps) {
  const { t } = useI18n();

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="left"
        showCloseButton={true}
        className="w-full max-w-xs p-0 gap-0 border-r border-border bg-surface dark:bg-[#121310] flex flex-col lg:hidden"
      >
        <SheetTitle className="sr-only">
          {t("admin.adminMenu.closeAdminMenuAria") || "Menu Navigasi Admin"}
        </SheetTitle>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-2">
          <AdminSidebar onItemClick={onClose} className="w-full border-r-0" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
