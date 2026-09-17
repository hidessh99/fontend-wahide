"use client";

import React, { useState } from "react";
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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface DeleteCouponModalProps {
  couponCode: string;
  couponName?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function DeleteCouponModal({
  couponCode,
  couponName,
  isOpen,
  onClose,
  onConfirm,
}: DeleteCouponModalProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
        {/* Header */}
        <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Trash2 className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight">
              {t("admin.coupons.deleteModalTitle") || "Hapus Kupon Promo"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("admin.coupons.deleteModalSubtitle") || "Konfirmasi penghapusan permanen kode kupon."}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Content Body */}
        <div className="space-y-4 p-5 sm:p-6">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-950 dark:text-rose-200">
                  {t("admin.coupons.deleteConfirmQuestion", {
                    code: couponCode,
                  }) || `Hapus kode kupon "${couponCode}"?`}
                </p>
                {couponName && (
                  <p className="text-rose-900/80 dark:text-rose-300 text-[11px]">
                    {couponName}
                  </p>
                )}
                <p className="text-rose-900/70 dark:text-rose-300/80 text-[11px] leading-relaxed pt-1">
                  {t("admin.coupons.deleteWarningNotice") ||
                    "Kupon ini tidak dapat digunakan lagi oleh tenant untuk pembelian langganan selanjutnya."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="border-border bg-muted/20 flex shrink-0 flex-row items-center justify-end gap-2 border-t p-4 sm:px-6">
          <AlertDialogCancel
            disabled={isLoading}
            onClick={onClose}
            className="border-border hover:bg-muted text-foreground h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            {t("common.cancel") || "Batal"}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="h-9 cursor-pointer gap-1.5 rounded-full px-5 text-xs font-bold shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("common.deleting") || "Menghapus..."}</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>{t("common.delete") || "Hapus Kupon"}</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
