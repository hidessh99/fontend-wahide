"use client";

import { AdminSidebar } from "./AdminSidebar";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { X } from "lucide-react";

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({ open, onClose }: AdminMobileNavProps) {
  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(open, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="bg-surface animate-in slide-in-from-left fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col shadow-2xl duration-200 dark:bg-[#121310]">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer rounded-full p-2 transition"
            aria-label="Tutup Menu Admin"
          >
            <X className="size-5" />
          </button>
        </div>
        <AdminSidebar onItemClick={onClose} className="w-full border-r-0" />
      </div>
    </div>
  );
}
