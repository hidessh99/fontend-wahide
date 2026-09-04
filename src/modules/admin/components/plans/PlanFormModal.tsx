"use client";

import React, { useState } from "react";
import { AdminPlanItem, CreatePlanInput } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
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
    <>
      {/* Header */}
      <DialogHeader className="border-border flex flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
        <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          {isEdit ? <Edit3 className="size-5" /> : <PlusCircle className="size-5" />}
        </div>
        <div>
          <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
            {isEdit ? `Ubah Paket Langganan` : "Tambah Paket Langganan Baru"}
          </DialogTitle>
          <DialogDescription className="text-foreground-secondary text-xs font-semibold">
            {isEdit
              ? `Konfigurasi harga, kuota pesan, dan fitur tier ${plan?.name}.`
              : "Tentukan kuota pesan, batas slot WhatsApp, dan harga tier baru."}
          </DialogDescription>
        </div>
      </DialogHeader>

      {/* Scrollable Form Body */}
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex-1 space-y-4.5 p-5 text-xs sm:p-6">
          {/* Nama Paket & Harga */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="plan-name-input"
                className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
              >
                <Tag className="size-3.5" />
                <span>Nama Paket Langganan:</span>
              </label>
              <Input
                id="plan-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Pro Enterprise"
                variant="rounded"
              />
            </div>

            <div>
              <label
                htmlFor="plan-price-input"
                className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
              >
                <CreditCard className="size-3.5" />
                <span>Harga / Bulan (Rp):</span>
              </label>
              <Input
                id="plan-price-input"
                type="number"
                min={0}
                step={1000}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="50000"
                variant="rounded"
                className="font-mono font-black"
              />
            </div>
          </div>

          {/* Kuota Pesan & Batas Resource */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-3.5">
            <span className="text-foreground-secondary block text-[11px] font-bold tracking-wider uppercase">
              Batas Kuota Operasional:
            </span>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="plan-message-limit-input"
                  className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-semibold"
                >
                  <MessageSquare className="size-3.5" />
                  <span>Limit Pesan/Bulan:</span>
                </label>
                <Input
                  id="plan-message-limit-input"
                  type="number"
                  min={100}
                  required
                  value={monthlyMessageLimit}
                  onChange={(e) => setMonthlyMessageLimit(Number(e.target.value))}
                  variant="rounded"
                  className="h-9 font-mono font-bold"
                />
              </div>

              <div>
                <label
                  htmlFor="plan-max-devices-input"
                  className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-semibold"
                >
                  <Smartphone className="size-3.5" />
                  <span>Slot Nomor WhatsApp:</span>
                </label>
                <Input
                  id="plan-max-devices-input"
                  type="number"
                  min={1}
                  required
                  value={maxDevices}
                  onChange={(e) => setMaxDevices(Number(e.target.value))}
                  variant="rounded"
                  className="h-9 font-mono font-bold"
                />
              </div>

              <div>
                <label
                  htmlFor="plan-max-agents-input"
                  className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-semibold"
                >
                  <Users className="size-3.5" />
                  <span>Maks Anggota CS:</span>
                </label>
                <Input
                  id="plan-max-agents-input"
                  type="number"
                  min={0}
                  required
                  value={maxAgents}
                  onChange={(e) => setMaxAgents(Number(e.target.value))}
                  variant="rounded"
                  className="h-9 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Toggle Hak Akses Fitur */}
          <div className="space-y-2.5">
            <span className="text-foreground-secondary block text-[11px] font-bold tracking-wider uppercase">
              Hak Akses Modul Fitur:
            </span>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <label className="border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-lg border p-3 dark:bg-[#10110e]">
                <div className="flex items-center gap-2">
                  <Paperclip className="text-foreground-muted size-4" />
                  <div>
                    <span className="text-foreground block font-bold">Kirim Lampiran File</span>
                    <span className="text-foreground-muted text-[10px]">
                      Gambar, Dokumen PDF, &amp; Audio
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowAttachment}
                  onChange={(e) => setAllowAttachment(e.target.checked)}
                  className="border-border dark:text-wise-green size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-lg border p-3 dark:bg-[#10110e]">
                <div className="flex items-center gap-2">
                  <Send className="text-foreground-muted size-4" />
                  <div>
                    <span className="text-foreground block font-bold">Kampanye Broadcast</span>
                    <span className="text-foreground-muted text-[10px]">
                      Kirim Pesan Massal Terjadwal
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowCampaign}
                  onChange={(e) => setAllowCampaign(e.target.checked)}
                  className="border-border dark:text-wise-green size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-lg border p-3 dark:bg-[#10110e]">
                <div className="flex items-center gap-2">
                  <Bot className="text-foreground-muted size-4" />
                  <div>
                    <span className="text-foreground block font-bold">Auto-Reply &amp; Bot</span>
                    <span className="text-foreground-muted text-[10px]">
                      Balas Cepat Berbasis Kata Kunci
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowAutoreply}
                  onChange={(e) => setAllowAutoreply(e.target.checked)}
                  className="border-border dark:text-wise-green size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-lg border p-3 dark:bg-[#10110e]">
                <div className="flex items-center gap-2">
                  <Clock className="text-foreground-muted size-4" />
                  <div>
                    <span className="text-foreground block font-bold">Jadwal Pesan Kalender</span>
                    <span className="text-foreground-muted text-[10px]">
                      Antrean Pengiriman Otomatis
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowSchedule}
                  onChange={(e) => setAllowSchedule(e.target.checked)}
                  className="border-border dark:text-wise-green size-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* Watermark Section */}
          <div className="border-border bg-muted/20 space-y-2.5 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-foreground flex items-center gap-1.5 font-bold">
                  <Layers className="size-3.5" />
                  <span>Sertakan Watermark Footer Pesan</span>
                </span>
                <span className="text-foreground-muted text-[11px]">
                  Tambahkan teks promosi default di akhir setiap pesan keluar.
                </span>
              </div>
              <Switch
                checked={hasWatermark}
                onCheckedChange={setHasWatermark}
                aria-label="Sertakan Watermark Footer Pesan"
              />
            </div>

            {hasWatermark && (
              <div>
                <label
                  htmlFor="plan-watermark-text-input"
                  className="text-foreground-secondary mb-1 block text-[11px] font-semibold"
                >
                  Isi Teks Watermark:
                </label>
                <Textarea
                  id="plan-watermark-text-input"
                  rows={2}
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="_Sent via Wahide WhatsApp Gateway_"
                  variant="rounded"
                  className="p-2.5 font-mono text-[11px]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-3 rounded-none border-t p-4 sm:p-5">
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
        </DialogFooter>
      </form>
    </>
  );
}

export function PlanFormModal({ plan, isOpen, onClose, onSubmit }: PlanFormModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[92vh] max-w-xl gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        <PlanFormModalContent
          key={plan?.id || "new-plan"}
          plan={plan}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
