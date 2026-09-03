"use client";

import React, { useState, useCallback } from "react";
import { UserActivityItem } from "@/modules/admin/types/admin.types";
import { formatHumanActivityDate } from "./UserActivitiesTable";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Trash2, Loader2, Clock, User, Mail } from "lucide-react";

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

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, handleClose);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        className="bg-surface border-border animate-in fade-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl duration-200 dark:bg-[#161715]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-activity-title"
      >
        {/* Header Section */}
        <div className="border-border flex items-center justify-between border-b bg-rose-500/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-4.5" />
            </div>
            <div>
              <h2 id="delete-activity-title" className="text-foreground text-base font-extrabold">
                Hapus Rekaman Aktivitas
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                Tindakan ini akan menghapus rekaman log audit secara permanen.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup Dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDelete} className="space-y-4 p-5 text-xs font-semibold">
          {/* Target Activity Summary Card */}
          <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-600">
                  {activity.user?.name ? (
                    activity.user.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="size-3" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-foreground truncate text-xs font-bold">
                    {activity.user?.name || "Pengguna Tanpa Nama"}
                  </div>
                  <div className="text-foreground-muted flex items-center gap-1 truncate font-mono text-[10px]">
                    <Mail className="size-2.5" />
                    <span>{activity.user?.email || activity.userId}</span>
                  </div>
                </div>
              </div>

              <span className="bg-surface border-border text-foreground rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold dark:bg-[#10110e]">
                {activity.activityType || activity.type}
              </span>
            </div>

            {/* Description Box */}
            <div className="bg-surface border-border/60 text-foreground-secondary rounded-md border p-2.5 text-xs leading-relaxed dark:bg-[#121310]">
              {activity.description || "Tidak ada deskripsi detail kejadian."}
            </div>

            {/* Timestamp & ID */}
            <div className="text-foreground-muted border-border/40 flex items-center justify-between border-t pt-1 text-[11px]">
              <div className="text-foreground-secondary flex items-center gap-1.5 font-medium">
                <Clock className="text-foreground-muted size-3" />
                <span>{formatHumanActivityDate(activity.createdAt).fullHuman}</span>
              </div>
              <span className="font-mono text-[9px]">ID: {activity.id}</span>
            </div>
          </div>

          {/* Security Confirmation Checkbox */}
          <div className="border-border border-t pt-2">
            <label className="group flex cursor-pointer items-start gap-2.5 select-none">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="border-border mt-0.5 size-4 cursor-pointer rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-foreground-secondary group-hover:text-foreground text-xs leading-tight font-bold transition">
                Saya mengonfirmasi bahwa rekaman log audit ini akan dihapus secara permanen dan
                tidak dapat dipulihkan.
              </span>
            </label>
          </div>

          {/* Footer Action Buttons */}
          <div className="border-border flex items-center justify-end gap-2.5 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isDeleting}
              className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-4 text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={!isConfirmed || isDeleting}
              className="cursor-pointer gap-2 rounded-full px-5 text-xs font-bold shadow-sm disabled:opacity-50"
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
