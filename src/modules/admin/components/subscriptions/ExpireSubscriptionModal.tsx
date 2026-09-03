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
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="border-border bg-surface animate-in fade-in zoom-in-95 relative z-10 w-full max-w-md space-y-5 rounded-2xl border p-6 shadow-2xl dark:bg-[#161715]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-base font-black tracking-tight">
                Tandai Langganan Kedaluwarsa
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                Ubah status langganan pengguna menjadi EXPIRED.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Subscription Summary Box */}
        <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
              <Building2 className="text-foreground-muted size-3" />
              <span>Tenant:</span>
            </span>
            <span className="text-foreground font-bold">{tenantName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
              <CreditCard className="text-foreground-muted size-3" />
              <span>Paket Saat Ini:</span>
            </span>
            <span className="text-foreground font-bold">
              {planName} ({formatCurrency(subscription.plan?.price ?? 0)})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
              <Clock className="text-foreground-muted size-3" />
              <span>Batas Waktu Saat Ini:</span>
            </span>
            <span className="text-foreground font-mono font-bold">
              {formatDateTime(subscription.expiredAt)}
            </span>
          </div>

          <div className="border-border/50 flex items-center justify-between border-t pt-1">
            <span className="text-foreground-secondary font-semibold">Status Awal:</span>
            <span className="text-foreground font-mono font-bold uppercase">
              {subscription.status}
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span className="leading-relaxed font-semibold">
            Status langganan ini akan segera diset ke <strong>EXPIRED</strong> dan masa aktif
            dihentikan per detik ini. Cache izin tenant akan otomatis direset.
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
            className="border-border hover:bg-muted h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleExpire}
            disabled={isUpdating}
            className="h-9 cursor-pointer gap-1.5 rounded-full bg-amber-600 px-4 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
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
