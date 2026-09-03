"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { X } from "lucide-react";

interface DashboardMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardMobileNav({ open, onClose }: DashboardMobileNavProps) {
  useEscapeKey(open, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface dark:bg-[#131412] shadow-2xl z-50 animate-in slide-in-from-left duration-200 flex flex-col">
        <div className="absolute right-4 top-4 z-50">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <DashboardSidebar onItemClick={onClose} className="w-full border-r-0" />
      </div>
    </div>
  );
}
