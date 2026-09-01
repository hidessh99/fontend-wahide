"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserActivityItem } from "../types/admin.types";
import { formatHumanActivityDate } from "./UserActivitiesTable";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  X,
  Trash2,
  Loader2,
  Clock,
  User,
  Mail,
} from "lucide-react";

interface DeleteActivityConfirmModalProps {
  isOpen: boolean;
  activity: UserActivityItem | null;
  onClose: () => void;
  onConfirm: (activityId: string) => Promise<void>;
}

export function DeleteActivityConfirmModal({
  isOpen,
  activity,
  onClose,
  onConfirm,
}: DeleteActivityConfirmModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = useCallback(() => {
    setIsConfirmed(false);
    setIsDeleting(false);
    onClose();
  }, [onClose]);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !activity) return null;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed || isDeleting) return;

    try {
      setIsDeleting(true);
      await onConfirm(activity.id);
      onClose();
    } catch {
      // Handled in parent / hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg bg-surface dark:bg-[#161715] rounded-xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-activity-title"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-rose-500/5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-4.5" />
            </div>
            <div>
              <h2 id="delete-activity-title" className="text-base font-extrabold text-foreground">
                Hapus Rekaman Aktivitas
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Tindakan ini akan menghapus rekaman log audit secara permanen.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-secondary hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup Dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDelete} className="p-5 space-y-4 text-xs font-semibold">
          {/* Target Activity Summary Card */}
          <div className="p-3.5 rounded-lg border border-border bg-muted/40 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-7 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {activity.user?.name ? activity.user.name.charAt(0).toUpperCase() : <User className="size-3" />}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-foreground truncate text-xs">
                    {activity.user?.name || "Pengguna Tanpa Nama"}
                  </div>
                  <div className="text-[10px] text-foreground-muted font-mono truncate flex items-center gap-1">
                    <Mail className="size-2.5" />
                    <span>{activity.user?.email || activity.userId}</span>
                  </div>
                </div>
              </div>

              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface dark:bg-[#10110e] border border-border text-foreground">
                {activity.activityType || activity.type}
              </span>
            </div>

            {/* Description Box */}
            <div className="p-2.5 rounded-md bg-surface dark:bg-[#121310] border border-border/60 text-foreground-secondary text-xs leading-relaxed">
              {activity.description || "Tidak ada deskripsi detail kejadian."}
            </div>

            {/* Timestamp & ID */}
            <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1 border-t border-border/40">
              <div className="flex items-center gap-1.5 font-medium text-foreground-secondary">
                <Clock className="size-3 text-foreground-muted" />
                <span>{formatHumanActivityDate(activity.createdAt).fullHuman}</span>
              </div>
              <span className="font-mono text-[9px]">ID: {activity.id}</span>
            </div>
          </div>

          {/* Security Confirmation Checkbox */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 size-4 rounded border-border text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span className="text-xs text-foreground-secondary group-hover:text-foreground transition leading-tight font-bold">
                Saya mengonfirmasi bahwa rekaman log audit ini akan dihapus secara permanen dan tidak dapat dipulihkan.
              </span>
            </label>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isDeleting}
              className="rounded-full px-4 text-xs font-bold border-border hover:border-foreground-muted cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={!isConfirmed || isDeleting}
              className="gap-2 px-5 text-xs font-bold rounded-full shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  <span>Hapus Permanen</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
