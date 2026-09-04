"use client";

import React, { useState } from "react";
import { UserActivityItem } from "@/modules/admin/types/admin.types";
import { formatHumanActivityDate } from "./UserActivitiesTable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Loader2, Clock, User, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

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
  const { t, locale } = useI18n();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setIsConfirmed(false);
      onClose();
    }
  };

  if (!activity) return null;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed || isDeleting) return;

    try {
      setIsDeleting(true);
      await onConfirm(activity.id);
      setIsConfirmed(false);
      onClose();
    } catch {
      // Handled in parent / hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        {/* Header Section */}
        <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b bg-rose-500/5 p-5 text-left">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-4.5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-base font-extrabold">
              {t("admin.activities.deleteModalTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("admin.activities.deleteModalSubtitle", { id: activity.id.slice(-6) })}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Form Body */}
        <form onSubmit={handleDelete} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs font-semibold">
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
                  <span>{formatHumanActivityDate(activity.createdAt, locale).fullHuman}</span>
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
                  {t("admin.activities.deleteWarning")}
                </span>
              </label>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-4 text-xs font-bold"
            >
              {t("actions.cancel")}
            </AlertDialogCancel>
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
                  <span>{t("admin.activities.deletingBtn")}</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  <span>{t("admin.activities.deleteConfirmBtn")}</span>
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
