"use client";

import React, { useState } from "react";
import { CreateDealInput, CRMStage } from "../types/crm.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

interface CreateDealModalProps {
  isOpen: boolean;
  pipelineId: string;
  defaultStageId: string;
  stages: CRMStage[];
  onClose: () => void;
  onSubmit: (input: CreateDealInput) => Promise<unknown>;
}

export function CreateDealModal({
  isOpen,
  pipelineId,
  defaultStageId,
  stages,
  onClose,
  onSubmit,
}: CreateDealModalProps) {
  const [stageId, setStageId] = useState(defaultStageId);
  const [title, setTitle] = useState("");
  const [valueAmount, setValueAmount] = useState<number>(0);
  const [contactId, setContactId] = useState("");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (defaultStageId) {
      setStageId(defaultStageId);
    }
  }, [defaultStageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        pipeline_id: pipelineId,
        stage_id: stageId || defaultStageId,
        contact_id: contactId || "generic-lead",
        title: title.trim(),
        value_amount: Number(valueAmount) || 0,
        expected_close_date: expectedCloseDate || undefined,
      });
      setTitle("");
      setValueAmount(0);
      setContactId("");
      setExpectedCloseDate("");
      onClose();
    } catch {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Tambah Peluang Penjualan
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat kartu peluang baru di pipeline CRM untuk melacak prospek penjualan hingga tahap closing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Judul Peluang / Prospek *</Label>
              <Input
                placeholder="Misal: Pembelian Paket Enterprise 10 Perangkat"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tahapan Prospek (Stage)</Label>
                <select
                  value={stageId}
                  onChange={(e) => setStageId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Nilai Prospek (IDR)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={valueAmount || ""}
                    onChange={(e) => setValueAmount(Number(e.target.value))}
                    className="text-xs pl-8"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-muted-foreground font-semibold">
                    Rp
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Kontak / Pelanggan ID</Label>
                <Input
                  placeholder="ID Kontak (opsional)"
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Estimasi Tanggal Closing</Label>
                <Input
                  type="date"
                  value={expectedCloseDate}
                  onChange={(e) => setExpectedCloseDate(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!title.trim() || isSubmitting}
              className="text-xs gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Simpan Peluang
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
