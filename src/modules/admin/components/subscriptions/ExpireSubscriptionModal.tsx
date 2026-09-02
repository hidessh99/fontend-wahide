"use client";

import React, { useState } from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AlertTriangle, Clock, X, Loader2, Building2, CreditCard, ShieldAlert } from "lucide-react";

interface ExpireSubscriptionModalProps {
  subscription: AdminSubscriptionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function ExpireSubscriptionModal({
  subscription,
  isOpen,
  onClose,
  onConfirm,
}: ExpireSubscriptionModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !subscription) return null;

  const handleExpire = async () => {
    setIsUpdating(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  const planName = subscription.plan?.name || `Paket ${subscription.planId.slice(0, 8)}`;
  const tenantName = subscription.tenant?.name || subscription.tenantId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface dark:bg-[#161715] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground tracking-tight">
                Tandai Langganan Kedaluwarsa
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Ubah status langganan pengguna menjadi EXPIRED.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Subscription Summary Box */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold flex items-center gap-1">
              <Building2 className="size-3 text-foreground-muted" />
              <span>Tenant:</span>
            </span>
            <span className="font-bold text-foreground">{tenantName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold flex items-center gap-1">
              <CreditCard className="size-3 text-foreground-muted" />
              <span>Paket Saat Ini:</span>
            </span>
            <span className="font-bold text-foreground">
              {planName} ({formatCurrency(subscription.plan?.price ?? 0)})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary font-semibold flex items-center gap-1">
              <Clock className="size-3 text-foreground-muted" />
              <span>Batas Waktu Saat Ini:</span>
            </span>
            <span className="font-mono font-bold text-foreground">
              {formatDateTime(subscription.expiredAt)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <span className="text-foreground-secondary font-semibold">Status Awal:</span>
            <span className="font-mono font-bold uppercase text-foreground">
              {subscription.status}
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-semibold">
            Status langganan ini akan segera diset ke <strong>EXPIRED</strong> dan masa aktif dihentikan per detik ini. Cache izin tenant akan otomatis direset.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isUpdating}
            className="h-9 px-4 text-xs font-bold rounded-full border-border hover:bg-muted cursor-pointer"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleExpire}
            disabled={isUpdating}
            className="h-9 px-4 text-xs font-bold rounded-full gap-1.5 cursor-pointer shadow-xs bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isUpdating ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Memperbarui...</span>
              </>
            ) : (
              <>
                <Clock className="size-3.5" />
                <span>Ubah Status ke EXPIRED</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
