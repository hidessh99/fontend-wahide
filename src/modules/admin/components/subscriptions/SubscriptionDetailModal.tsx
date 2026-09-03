"use client";

import React, { useState } from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import {
  CreditCard,
  X,
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

  if (!isOpen || !subscription) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="border-border bg-surface animate-in fade-in zoom-in-95 relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col space-y-4 rounded-2xl border p-5 shadow-2xl sm:p-6 dark:bg-[#161715]">
        {/* Header */}
        <div className="border-border flex shrink-0 items-start justify-between gap-3 border-b pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <CreditCard className="size-4.5" />
            </div>
            <div>
              <h2 className="text-foreground text-base font-black tracking-tight">{planName}</h2>
              <span className="text-foreground-muted block font-mono text-[11px]">
                ID: {subscription.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

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
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black tracking-wider uppercase ${statusVisual.color}`}
            >
              {statusVisual.icon}
              <span>{statusVisual.label}</span>
            </span>
          </div>

          {/* Monthly Quota Progress Box */}
          <div className="border-border bg-surface space-y-2 rounded-xl border p-3.5 dark:bg-[#10110e]">
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary text-[11px] font-bold tracking-wider uppercase">
                Penggunaan Kuota Pesan Bulanan
              </span>
              <span className="text-foreground font-mono font-bold">
                {quotaUsed.toLocaleString("id-ID")} / {quotaLimit.toLocaleString("id-ID")} (
                {usagePercentage}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  usagePercentage >= 90
                    ? "bg-rose-500"
                    : usagePercentage >= 70
                      ? "bg-amber-500"
                      : "dark:bg-wise-green bg-emerald-600"
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          {/* Limits & Capability Strip */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-border bg-muted/20 flex items-center gap-2 rounded-lg border p-2.5">
              <Smartphone className="dark:text-wise-green size-4 shrink-0 text-emerald-600" />
              <div>
                <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                  Maks. Perangkat WA
                </span>
                <span className="text-foreground font-mono font-bold">
                  {plan?.max_devices ?? 1} Slot
                </span>
              </div>
            </div>

            <div className="border-border bg-muted/20 flex items-center gap-2 rounded-lg border p-2.5">
              <Users className="size-4 shrink-0 text-blue-500" />
              <div>
                <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                  Maks. Agen CS
                </span>
                <span className="text-foreground font-mono font-bold">
                  {plan?.max_agents ?? 0} Agen
                </span>
              </div>
            </div>
          </div>

          {/* Technical Metadata Grid */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-xl border p-3.5 text-xs">
            {/* Tenant Info */}
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                <Building2 className="text-foreground-muted size-3.5" />
                <span>Tenant / Organisasi:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-bold">{tenantName}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.tenantId, "Tenant ID")}
                  className="hover:bg-muted text-foreground-muted hover:text-foreground cursor-pointer rounded p-1"
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

            {/* Plan ID */}
            <div className="border-border/50 flex items-center justify-between border-t pt-2">
              <span className="text-foreground-secondary font-semibold">Plan ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground-muted font-mono text-[11px] select-text">
                  {subscription.planId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.planId, "Plan ID")}
                  className="hover:bg-muted text-foreground-muted hover:text-foreground cursor-pointer rounded p-1"
                  title="Salin Plan ID"
                >
                  {copiedField === "Plan ID" ? (
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
                <span>Mulai Aktif:</span>
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
        <div className="border-border flex shrink-0 justify-end border-t pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted h-8.5 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
