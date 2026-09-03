"use client";

import React, { useState } from "react";
import { AdminPlanItem, CreatePlanInput } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import {
  X,
  CreditCard,
  Layers,
  MessageSquare,
  Smartphone,
  Users,
  Tag,
  Paperclip,
  Send,
  Bot,
  Clock,
  Loader2,
  Save,
  PlusCircle,
  Edit3,
} from "lucide-react";

interface PlanFormModalProps {
  plan: AdminPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlanInput) => Promise<unknown>;
}

interface PlanFormModalContentProps {
  plan: AdminPlanItem | null;
  onClose: () => void;
  onSubmit: (data: CreatePlanInput) => Promise<unknown>;
}

function PlanFormModalContent({
  plan,
  onClose,
  onSubmit,
}: PlanFormModalContentProps) {
  const isEdit = Boolean(plan);

  const [name, setName] = useState(plan?.name || "");
  const [price, setPrice] = useState<number>(plan?.price ?? 50000);
  const [monthlyMessageLimit, setMonthlyMessageLimit] = useState<number>(
    plan?.monthly_message_limit ?? 25000
  );
  const [maxDevices, setMaxDevices] = useState<number>(plan?.max_devices ?? 5);
  const [maxAgents, setMaxAgents] = useState<number>(plan?.max_agents ?? 2);
  const [hasWatermark, setHasWatermark] = useState<boolean>(
    plan?.has_watermark ?? false
  );
  const [watermarkText, setWatermarkText] = useState<string>(
    plan?.watermark_text || "\n\n_Sent via Wahide WhatsApp Gateway_"
  );
  const [allowAttachment, setAllowAttachment] = useState<boolean>(
    plan?.allow_attachment ?? true
  );
  const [allowCampaign, setAllowCampaign] = useState<boolean>(
    plan?.allow_campaign ?? true
  );
  const [allowAutoreply, setAllowAutoreply] = useState<boolean>(
    plan?.allow_autoreply ?? true
  );
  const [allowSchedule, setAllowSchedule] = useState<boolean>(
    plan?.allow_schedule ?? true
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const payload: CreatePlanInput = {
        name: name.trim(),
        price: Number(price) || 0,
        monthly_message_limit: Number(monthlyMessageLimit) || 1000,
        max_devices: Number(maxDevices) || 1,
        max_agents: Number(maxAgents) || 0,
        has_watermark: hasWatermark,
        watermark_text: hasWatermark ? watermarkText : "",
        allow_attachment: allowAttachment,
        allow_campaign: allowCampaign,
        allow_autoreply: allowAutoreply,
        allow_schedule: allowSchedule,
      };

      await onSubmit(payload);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
      {/* Header */}
      <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
            {isEdit ? <Edit3 className="size-5" /> : <PlusCircle className="size-5" />}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              {isEdit ? `Ubah Paket Langganan` : "Tambah Paket Langganan Baru"}
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              {isEdit
                ? `Konfigurasi harga, kuota pesan, dan fitur tier ${plan?.name}.`
                : "Tentukan kuota pesan, batas slot WhatsApp, dan harga tier baru."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0 disabled:opacity-50"
          aria-label="Tutup"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
        <div className="p-5 sm:p-6 space-y-4 flex-1 text-xs">
          {/* Row 1: Nama Paket & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Nama Paket Tier
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: Professional Plus"
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Harga Bulanan (IDR)
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  required
                  placeholder="50000"
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-bold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Batas Kuota Pesan, Slot Device, Slot CS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Batas Pesan / Bulan
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <input
                  type="number"
                  min={100}
                  value={monthlyMessageLimit}
                  onChange={(e) =>
                    setMonthlyMessageLimit(Math.max(1, parseInt(e.target.value, 10) || 1000))
                  }
                  required
                  placeholder="25000"
                  className="w-full h-10 pl-10 pr-3 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-bold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green outline-none transition font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Batas Slot WA
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxDevices}
                  onChange={(e) =>
                    setMaxDevices(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  required
                  placeholder="5"
                  className="w-full h-10 pl-10 pr-3 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-bold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green outline-none transition font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Batas CS Agent
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={maxAgents}
                  onChange={(e) =>
                    setMaxAgents(Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                  required
                  placeholder="2"
                  className="w-full h-10 pl-10 pr-3 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-bold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green outline-none transition font-mono"
                />
              </div>
            </div>
          </div>

          {/* Features Capabilities Grid */}
          <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Izin &amp; Kemampuan Fitur WhatsApp
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 p-2 rounded-md bg-surface dark:bg-[#10110e] border border-border cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowAttachment}
                  onChange={(e) => setAllowAttachment(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Paperclip className="size-3.5 text-foreground-secondary shrink-0" />
                <span className="font-semibold text-foreground">Kirim File / Lampiran</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-md bg-surface dark:bg-[#10110e] border border-border cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowCampaign}
                  onChange={(e) => setAllowCampaign(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Send className="size-3.5 text-foreground-secondary shrink-0" />
                <span className="font-semibold text-foreground">Broadcast &amp; Campaign</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-md bg-surface dark:bg-[#10110e] border border-border cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowAutoreply}
                  onChange={(e) => setAllowAutoreply(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Bot className="size-3.5 text-foreground-secondary shrink-0" />
                <span className="font-semibold text-foreground">Auto-Reply &amp; Bot</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-md bg-surface dark:bg-[#10110e] border border-border cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowSchedule}
                  onChange={(e) => setAllowSchedule(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Clock className="size-3.5 text-foreground-secondary shrink-0" />
                <span className="font-semibold text-foreground">Pesan Terjadwal</span>
              </label>
            </div>
          </div>

          {/* Watermark Section */}
          <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasWatermark}
                  onChange={(e) => setHasWatermark(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Tag className="size-3.5 text-foreground-secondary shrink-0" />
                <span>Paksa Watermark Pada Pesan Broadcast</span>
              </label>
            </div>

            {hasWatermark && (
              <div>
                <label className="block text-[11px] font-semibold text-foreground-muted mb-1">
                  Teks Watermark (Muncul di akhir pesan)
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="\n\n_Sent via Wahide WhatsApp Gateway_"
                  className="w-full h-9 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-mono text-xs border border-border outline-none focus:border-emerald-600 dark:focus:border-wise-green"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full text-xs font-bold border-border hover:bg-muted"
          >
            Batalkan
          </Button>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || !name.trim()}
            className="rounded-full text-xs font-extrabold gap-1.5 px-5 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>{isEdit ? "Simpan Perubahan Paket" : "Tambahkan Paket Baru"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function PlanFormModal({
  plan,
  isOpen,
  onClose,
  onSubmit,
}: PlanFormModalProps) {
  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <PlanFormModalContent
        key={plan?.id || "new-plan"}
        plan={plan}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}
