"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { useI18n } from "@/lib/i18n/context";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/shared/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

interface DashboardMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardMobileNav({ open, onClose }: DashboardMobileNavProps) {
  const { t } = useI18n();

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="left"
        showCloseButton={true}
        className="w-full max-w-xs p-0 gap-0 border-r border-border bg-surface dark:bg-[#131412] flex flex-col lg:hidden"
      >
        <SheetTitle className="sr-only">
          {t("common.closeMenuAria") || "Menu Navigasi Mobile"}
        </SheetTitle>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-2">
          <DashboardSidebar
            onItemClick={onClose}
            className="w-full flex-1 border-r-0"
          />
        </div>

        {/* Mobile Drawer Footer: Quick Settings */}
        <div className="border-border bg-surface/90 dark:bg-[#161715]/90 flex shrink-0 items-center justify-between border-t px-4 py-3 backdrop-blur-md">
          <LocaleSwitcher />
          <ThemeToggle showLabel={true} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
