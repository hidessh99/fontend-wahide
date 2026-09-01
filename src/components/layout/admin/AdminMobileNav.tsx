"use client";

import React, { useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { X } from "lucide-react";

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({ open, onClose }: AdminMobileNavProps) {
  // Escape key listener to close drawer
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface dark:bg-[#121310] shadow-2xl z-50 animate-in slide-in-from-left duration-200 flex flex-col">
        <div className="absolute right-4 top-4 z-50">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer transition"
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
