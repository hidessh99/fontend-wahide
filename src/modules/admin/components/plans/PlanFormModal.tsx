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

function PlanFormModalContent({ plan, onClose, onSubmit }: PlanFormModalContentProps) {
  const isEdit = Boolean(plan);

  const [name, setName] = useState(plan?.name || "");
  const [price, setPrice] = useState<number>(plan?.price ?? 50000);
  const [monthlyMessageLimit, setMonthlyMessageLimit] = useState<number>(
    plan?.monthly_message_limit ?? 25000
  );
  const [maxDevices, setMaxDevices] = useState<number>(plan?.max_devices ?? 5);
  const [maxAgents, setMaxAgents] = useState<number>(plan?.max_agents ?? 2);
  const [hasWatermark, setHasWatermark] = useState<boolean>(plan?.has_watermark ?? false);
  const [watermarkText, setWatermarkText] = useState<string>(
    plan?.watermark_text || "\n\n_Sent via Wahide WhatsApp Gateway_"
  );
  const [allowAttachment, setAllowAttachment] = useState<boolean>(plan?.allow_attachment ?? true);
  const [allowCampaign, setAllowCampaign] = useState<boolean>(plan?.allow_campaign ?? true);
  const [allowAutoreply, setAllowAutoreply] = useState<boolean>(plan?.allow_autoreply ?? true);
  const [allowSchedule, setAllowSchedule] = useState<boolean>(plan?.allow_schedule ?? true);
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
    <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border shadow-2xl dark:bg-[#161715]">
      {/* Header */}
      <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            {isEdit ? <Edit3 className="size-5" /> : <PlusCircle className="size-5" />}
          </div>
          <div>
            <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {isEdit ? `Ubah Paket Langganan` : "Tambah Paket Langganan Baru"}
            </h2>
            <p className="text-foreground-secondary text-xs font-semibold">
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
          className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition disabled:opacity-50"
          aria-label="Tutup"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex-1 space-y-4 p-5 text-xs sm:p-6">
          {/* Row 1: Nama Paket & Harga */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Nama Paket Tier
              </label>
              <div className="relative">
                <Layers className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: Professional Plus"
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-4 pl-10 font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Harga Bulanan (IDR)
              </label>
              <div className="relative">
                <CreditCard className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  required
                  placeholder="50000"
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-4 pl-10 font-mono font-bold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Batas Kuota Pesan, Slot Device, Slot CS */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Batas Pesan / Bulan
              </label>
              <div className="relative">
                <MessageSquare className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="number"
                  min={100}
                  value={monthlyMessageLimit}
                  onChange={(e) =>
                    setMonthlyMessageLimit(Math.max(1, parseInt(e.target.value, 10) || 1000))
                  }
                  required
                  placeholder="25000"
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green h-10 w-full rounded-full border pr-3 pl-10 font-mono font-bold transition outline-none focus:border-emerald-600 dark:bg-[#10110e]"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Batas Slot WA
              </label>
              <div className="relative">
                <Smartphone className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxDevices}
                  onChange={(e) => setMaxDevices(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  required
                  placeholder="5"
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green h-10 w-full rounded-full border pr-3 pl-10 font-mono font-bold transition outline-none focus:border-emerald-600 dark:bg-[#10110e]"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Batas CS Agent
              </label>
              <div className="relative">
                <Users className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={maxAgents}
                  onChange={(e) => setMaxAgents(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  required
                  placeholder="2"
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green h-10 w-full rounded-full border pr-3 pl-10 font-mono font-bold transition outline-none focus:border-emerald-600 dark:bg-[#10110e]"
                />
              </div>
            </div>
          </div>

          {/* Features Capabilities Grid */}
          <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-3.5">
            <span className="text-foreground block text-xs font-bold tracking-wider uppercase">
              Izin &amp; Kemampuan Fitur WhatsApp
            </span>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <label className="bg-surface border-border flex cursor-pointer items-center gap-2.5 rounded-md border p-2 select-none dark:bg-[#10110e]">
                <input
                  type="checkbox"
                  checked={allowAttachment}
                  onChange={(e) => setAllowAttachment(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Paperclip className="text-foreground-secondary size-3.5 shrink-0" />
                <span className="text-foreground font-semibold">Kirim File / Lampiran</span>
              </label>

              <label className="bg-surface border-border flex cursor-pointer items-center gap-2.5 rounded-md border p-2 select-none dark:bg-[#10110e]">
                <input
                  type="checkbox"
                  checked={allowCampaign}
                  onChange={(e) => setAllowCampaign(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Send className="text-foreground-secondary size-3.5 shrink-0" />
                <span className="text-foreground font-semibold">Broadcast &amp; Campaign</span>
              </label>

              <label className="bg-surface border-border flex cursor-pointer items-center gap-2.5 rounded-md border p-2 select-none dark:bg-[#10110e]">
                <input
                  type="checkbox"
                  checked={allowAutoreply}
                  onChange={(e) => setAllowAutoreply(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Bot className="text-foreground-secondary size-3.5 shrink-0" />
                <span className="text-foreground font-semibold">Auto-Reply &amp; Bot</span>
              </label>

              <label className="bg-surface border-border flex cursor-pointer items-center gap-2.5 rounded-md border p-2 select-none dark:bg-[#10110e]">
                <input
                  type="checkbox"
                  checked={allowSchedule}
                  onChange={(e) => setAllowSchedule(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Clock className="text-foreground-secondary size-3.5 shrink-0" />
                <span className="text-foreground font-semibold">Pesan Terjadwal</span>
              </label>
            </div>
          </div>

          {/* Watermark Section */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-lg border p-3.5">
            <div className="flex items-center justify-between">
              <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wider uppercase select-none">
                <input
                  type="checkbox"
                  checked={hasWatermark}
                  onChange={(e) => setHasWatermark(e.target.checked)}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Tag className="text-foreground-secondary size-3.5 shrink-0" />
                <span>Paksa Watermark Pada Pesan Broadcast</span>
              </label>
            </div>

            {hasWatermark && (
              <div>
                <label className="text-foreground-muted mb-1 block text-[11px] font-semibold">
                  Teks Watermark (Muncul di akhir pesan)
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="\n\n_Sent via Wahide WhatsApp Gateway_"
                  className="bg-surface text-foreground border-border dark:focus:border-wise-green h-9 w-full rounded-md border px-3 font-mono text-xs outline-none focus:border-emerald-600 dark:bg-[#10110e]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-border bg-muted/20 flex shrink-0 items-center justify-end gap-3 border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            Batalkan
          </Button>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || !name.trim()}
            className="gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-sm"
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

export function PlanFormModal({ plan, isOpen, onClose, onSubmit }: PlanFormModalProps) {
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
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
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
