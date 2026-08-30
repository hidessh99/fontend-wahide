"use client";

import React, { useState } from "react";
import { DEFAULT_PLANS } from "@/services/subscription/api/subscription.api";
import { SubscriptionPlan } from "@/services/subscription/types/subscription.types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Sparkles } from "lucide-react";

export function PlansManagementTable() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus paket langganan ${name}?`)) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Paket ${name} berhasil dihapus.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">
            Katalog Paket Langganan Platform
          </h2>
          <p className="text-xs font-semibold text-foreground-secondary">
            Atur kuota pesan bulanan, batas slot WhatsApp, dan harga langganan per tier.
          </p>
        </div>

        <Button
          variant="primaryPill"
          size="sm"
          onClick={() => toast.success("Membuka modal draf paket baru...")}
          className="gap-2 text-xs font-bold shadow-sm"
        >
          <Plus className="size-4" />
          <span>Tambah Paket Baru</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-md border border-border bg-surface dark:bg-[#161715] flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-foreground">{p.name}</h3>
                {p.isPopular && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-wise-green text-dark-green uppercase">
                    <Sparkles className="size-2.5" />
                    <span>Popular</span>
                  </span>
                )}
              </div>

              <div className="text-2xl font-black text-foreground">
                Rp {p.priceMonthly.toLocaleString("id-ID")}{" "}
                <span className="text-xs text-foreground-muted font-normal">/ bulan</span>
              </div>

              <div className="p-3 rounded bg-muted/40 text-xs font-semibold text-foreground-secondary space-y-1">
                <div>• Kuota: <strong>{p.quotaMonthly.toLocaleString("id-ID")} Pesan</strong></div>
                <div>• Slot Device: <strong>{p.maxDeviceSlots} WhatsApp</strong></div>
                <div>• Watermark: <strong>{p.hasWatermark ? "Ada" : "Bebas"}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(`Edit paket ${p.name}`)}
                className="size-8 rounded-full p-0 border-border"
                aria-label="Edit Paket"
              >
                <Edit2 className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(p.id, p.name)}
                className="size-8 rounded-full p-0 border-border text-rose-500 hover:bg-rose-500/10"
                aria-label="Hapus Paket"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
