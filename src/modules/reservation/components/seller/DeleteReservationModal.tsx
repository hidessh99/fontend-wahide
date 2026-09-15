"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Reservation } from "../../types/reservation.types";

interface DeleteReservationModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, name?: string) => Promise<boolean>;
}

export function DeleteReservationModal({
  reservation,
  isOpen,
  onClose,
  onConfirm,
}: DeleteReservationModalProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!reservation) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    const success = await onConfirm(reservation.id, reservation.customerName);
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-105">
        <AlertDialogHeader>
          <div className="flex items-center gap-2.5 text-destructive mb-1">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogTitle className="text-base font-bold text-foreground sm:text-lg">
              {t("reservation.deleteTitle")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-foreground-secondary pt-2 leading-relaxed">
            {t("reservation.deleteConfirmPrompt")}{" "}
            <strong className="text-foreground font-semibold">
              {reservation.customerName}
            </strong>{" "}
            ({reservation.bookingDate})?
            <br />
            <br />
            <span className="text-destructive font-medium">
              {t("reservation.deleteWarning")}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            size="sm"
            className="rounded-xl cursor-pointer"
          >
            {t("common.cancel")}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("common.deleting")}</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>{t("common.delete")}</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
