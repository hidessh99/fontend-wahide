"use client";

import React, { useState } from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  CreditCard,
  Copy,
  Check,
  Building2,
  CheckCircle2,
  Clock,
  Smartphone,
  Users,
  Calendar,
  Layers,
  Sparkles,
  Ban,
} from "lucide-react";

interface SubscriptionDetailModalProps {
  subscription: AdminSubscriptionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function getSubscriptionStatusVisual(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ACTIVE":
      return {
        label: "ACTIVE (Aktif)",
        color: "bg-emerald-500/10 text-emerald-700 dark:text-wise-green border-emerald-500/20",
        icon: <CheckCircle2 className="size-3.5" />,
      };
    case "EXPIRED":
      return {
        label: "EXPIRED (Kedaluwarsa)",
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: <Clock className="size-3.5" />,
      };
    case "TRIAL":
      return {
        label: "TRIAL (Uji Coba)",
        color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        icon: <Sparkles className="size-3.5" />,
      };
    case "SUSPENDED":
      return {
        label: "SUSPENDED (Ditangguhkan)",
        color: "bg-muted text-foreground-secondary border-border",
        icon: <Ban className="size-3.5" />,
      };
    default:
      return {
        label: status,
        color: "bg-muted text-foreground-secondary border-border",
        icon: <Layers className="size-3.5" />,
      };
  }
}

export function SubscriptionDetailModal({
  subscription,
  isOpen,
  onClose,
}: SubscriptionDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!subscription) return null;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      toast.success(`${label} disalin ke clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Gagal menyalin teks");
    }
  };

  const plan = subscription.plan;
  const planName = plan?.name || `Paket ${subscription.planId.slice(0, 8)}`;
  const tenantName = subscription.tenant?.name || `Tenant ${subscription.tenantId.slice(0, 8)}`;
  const statusVisual = getSubscriptionStatusVisual(subscription.status);

  const quotaLimit = plan?.monthly_message_limit ?? 1000;
  const quotaUsed = subscription.currentMonthUsage;
  const usagePercentage = Math.min(100, Math.round((quotaUsed / (quotaLimit || 1)) * 100));

  const isExpired = subscription.status === "EXPIRED";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[90vh] max-w-lg gap-0 space-y-4 overflow-hidden p-5 sm:p-6 dark:bg-[#161715]">
        {/* Header */}
        <DialogHeader className="border-border flex flex-row items-center gap-2.5 border-b pb-3.5 text-left">
          <div className="dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <CreditCard className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-base font-black tracking-tight">
              {planName}
            </DialogTitle>
            <span className="text-foreground-muted block font-mono text-[11px]">
              ID: {subscription.id}
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-xs">
          {/* Status & Plan Info Bar */}
          <div className="border-border bg-muted/20 flex items-center justify-between rounded-xl border p-3">
            <div>
              <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                Harga Langganan
              </span>
              <span className="text-foreground font-mono text-sm font-black">
                {formatCurrency(plan?.price ?? 0)} / bulan
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black tracking-wider uppercase ${statusVisual.color}`}
            >
              {statusVisual.icon}
              <span>{statusVisual.label}</span>
            </span>
          </div>

          {/* Quota Progress Meter */}
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold uppercase">
                Penggunaan Kuota Pesan Bulanan:
              </span>
              <span className="text-foreground font-mono font-black">
                {quotaUsed.toLocaleString("id-ID")} / {quotaLimit.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Progress Track */}
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-full transition-all duration-500 ${
                  usagePercentage > 90
                    ? "bg-rose-500"
                    : usagePercentage > 70
                      ? "bg-amber-500"
                      : "dark:bg-wise-green bg-emerald-600"
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="text-foreground-muted flex justify-between font-mono text-[10px]">
              <span>{usagePercentage}% terpakai</span>
              <span>Sisa: {Math.max(0, quotaLimit - quotaUsed).toLocaleString("id-ID")} pesan</span>
            </div>
          </div>

          {/* Feature Limits Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3">
              <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <Smartphone className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">Batas Device</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {plan?.max_devices ?? 1} Slot WhatsApp
              </div>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-xl border p-3">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <Users className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">Batas Anggota</span>
              </div>
              <div className="text-foreground font-mono text-base font-black">
                {plan?.max_agents ?? 1} CS / Agen
              </div>
            </div>
          </div>

          {/* Details & Identity */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-xl border p-4">
            <span className="text-foreground-secondary block text-[11px] font-bold tracking-wider uppercase">
              Informasi Pelanggan &amp; Durasi:
            </span>

            {/* Tenant Name */}
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1 font-semibold">
                <Building2 className="text-foreground-muted size-3" />
                <span>Nama Tenant:</span>
              </span>
              <span className="text-foreground font-bold">{tenantName}</span>
            </div>

            {/* Tenant ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">Tenant ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono text-[11px] font-semibold">
                  {subscription.tenantId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.tenantId, "Tenant ID")}
                  className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5"
                  title="Salin Tenant ID"
                >
                  {copiedField === "Tenant ID" ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Subscription ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">Subscription ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-mono text-[11px] font-semibold">
                  {subscription.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.id, "Subscription ID")}
                  className="text-foreground-muted hover:text-foreground cursor-pointer p-0.5"
                  title="Salin Subscription ID"
                >
                  {copiedField === "Subscription ID" ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Started At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Calendar className="text-foreground-muted size-3.5" />
                <span>Mulai Berlangganan:</span>
              </span>
              <span className="text-foreground font-mono text-[11px] font-semibold">
                {formatDateTime(subscription.startedAt)}
              </span>
            </div>

            {/* Expired At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Clock className="text-foreground-muted size-3.5" />
                <span>Batas Waktu (Expired At):</span>
              </span>
              <span
                className={`font-mono text-[11px] font-bold ${
                  isExpired ? "text-rose-600 dark:text-rose-400" : "text-foreground"
                }`}
              >
                {formatDateTime(subscription.expiredAt)}
              </span>
            </div>

            {/* Created At */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">Dibuat Pada:</span>
              <span className="text-foreground-secondary font-mono text-[11px]">
                {formatDateTime(subscription.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-border m-0 flex shrink-0 flex-row justify-end rounded-none border-t p-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted h-8.5 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
