"use client";

import React, { useState } from "react";
import { User, Tenant } from "@/modules/iam/types/auth.types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Smartphone,
  Building,
  Lock,
  Save,
  Loader2,
} from "lucide-react";

interface ProfileInfoCardProps {
  user: User | null;
  tenant: Tenant | null;
  onSaveProfile: (name: string) => Promise<void>;
}

export function ProfileInfoCard({
  user,
  tenant,
  onSaveProfile,
}: ProfileInfoCardProps) {
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const email = user?.email || "";
  const phone = user?.phone || "";
  const tenantName =
    tenant?.name || (user?.name ? `${user.name}'s Workspace` : "PT Wahide Solusi Digital");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    try {
      await onSaveProfile(trimmedName);
      toast.success("Nama profil berhasil diperbarui.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui nama profil.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-5 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="size-9 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
          <UserIcon className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Informasi Profil</h2>
          <p className="text-xs font-semibold text-foreground-secondary">
            Nama bisnis dan kontak akun admin utama.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
            Nama Lengkap
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Lengkap Anda"
              required
              className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Alamat Email
            </label>
            <span className="text-[10px] font-semibold text-foreground-muted inline-flex items-center gap-1">
              <Lock className="size-2.5" />
              Terkunci
            </span>
          </div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <input
              type="email"
              disabled
              readOnly
              value={email}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 text-foreground-muted font-semibold border border-border text-xs cursor-not-allowed select-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Nomor WhatsApp Admin
            </label>
            <span className="text-[10px] font-semibold text-foreground-muted inline-flex items-center gap-1">
              <Lock className="size-2.5" />
              Terkunci
            </span>
          </div>
          <div className="relative">
            <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <input
              type="text"
              disabled
              readOnly
              value={phone}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 text-foreground-muted font-semibold border border-border text-xs font-mono cursor-not-allowed select-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
            Nama Perusahaan / Tenant
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <input
              type="text"
              disabled
              readOnly
              value={tenantName}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 text-foreground-muted font-semibold border border-border text-xs cursor-not-allowed select-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isSaving}
            className="text-xs font-bold gap-1.5 px-5 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Simpan Profil</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
