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
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface dark:bg-[#161715] shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <CreditCard className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground tracking-tight">
                {planName}
              </h2>
              <span className="font-mono text-[11px] text-foreground-muted block">
                ID: {subscription.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
          {/* Status & Plan Info Bar */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-foreground-muted font-bold uppercase block">
                Harga Langganan
              </span>
              <span className="text-sm font-black font-mono text-foreground">
                {formatCurrency(plan?.price ?? 0)} / bulan
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusVisual.color}`}
            >
              {statusVisual.icon}
              <span>{statusVisual.label}</span>
            </span>
          </div>

          {/* Monthly Quota Progress Box */}
          <div className="p-3.5 rounded-xl border border-border bg-surface dark:bg-[#10110e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-secondary">
                Penggunaan Kuota Pesan Bulanan
              </span>
              <span className="font-mono font-bold text-foreground">
                {quotaUsed.toLocaleString("id-ID")} / {quotaLimit.toLocaleString("id-ID")} ({usagePercentage}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  usagePercentage >= 90
                    ? "bg-rose-500"
                    : usagePercentage >= 70
                    ? "bg-amber-500"
                    : "bg-emerald-600 dark:bg-wise-green"
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          {/* Limits & Capability Strip */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg border border-border bg-muted/20 flex items-center gap-2">
              <Smartphone className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
              <div>
                <span className="text-[10px] text-foreground-muted font-bold uppercase block">
                  Maks. Perangkat WA
                </span>
                <span className="font-mono font-bold text-foreground">
                  {plan?.max_devices ?? 1} Slot
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-muted/20 flex items-center gap-2">
              <Users className="size-4 text-blue-500 shrink-0" />
              <div>
                <span className="text-[10px] text-foreground-muted font-bold uppercase block">
                  Maks. Agen CS
                </span>
                <span className="font-mono font-bold text-foreground">
                  {plan?.max_agents ?? 0} Agen
                </span>
              </div>
            </div>
          </div>

          {/* Technical Metadata Grid */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2.5 text-xs">
            {/* Tenant Info */}
            <div className="flex items-center justify-between">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Building2 className="size-3.5 text-foreground-muted" />
                <span>Tenant / Organisasi:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground">{tenantName}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.tenantId, "Tenant ID")}
                  className="p-1 hover:bg-muted rounded text-foreground-muted hover:text-foreground cursor-pointer"
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
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold">Plan ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-foreground-muted select-text">
                  {subscription.planId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(subscription.planId, "Plan ID")}
                  className="p-1 hover:bg-muted rounded text-foreground-muted hover:text-foreground cursor-pointer"
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
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Calendar className="size-3.5 text-foreground-muted" />
                <span>Mulai Aktif:</span>
              </span>
              <span className="font-mono text-[11px] text-foreground font-semibold">
                {formatDateTime(subscription.startedAt)}
              </span>
            </div>

            {/* Expired At */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold flex items-center gap-1.5">
                <Clock className="size-3.5 text-foreground-muted" />
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
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-foreground-secondary font-semibold">Dibuat Pada:</span>
              <span className="font-mono text-[11px] text-foreground-secondary">
                {formatDateTime(subscription.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-border flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8.5 px-4 text-xs font-bold rounded-full border-border hover:bg-muted cursor-pointer"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
