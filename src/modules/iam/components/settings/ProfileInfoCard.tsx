"use client";

import React, { useState } from "react";
import { User, Tenant } from "@/modules/iam/types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User as UserIcon, Mail, Smartphone, Building, Lock, Save, Loader2 } from "lucide-react";

interface ProfileInfoCardProps {
  user: User | null;
  tenant: Tenant | null;
  onSaveProfile: (name: string) => Promise<void>;
}

export function ProfileInfoCard({ user, tenant, onSaveProfile }: ProfileInfoCardProps) {
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const email = user?.email || "";
  const phone = user?.phone || "";
  const tenantName =
    tenant?.name || (user?.name ? `${user.name}'s Workspace` : "PT Wahide Solusi Digital");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Nama lengkap tidak boleh kosong.");
      return;
    }

    setNameError(null);
    setIsSaving(true);
    try {
      await onSaveProfile(trimmedName);
      toast.success("Nama profil berhasil diperbarui.", { id: "profile-save" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui nama profil.";
      toast.error(msg, { id: "profile-save" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border-border bg-surface space-y-5 rounded-xl border p-6 shadow-sm sm:p-8 dark:bg-[#161715]">
      <div className="border-border flex items-center gap-3 border-b pb-4">
        <div className="bg-muted text-foreground-secondary flex size-9 items-center justify-center rounded-full">
          <UserIcon className="size-4" />
        </div>
        <div>
          <h2 className="text-foreground text-lg font-black">Informasi Profil</h2>
          <p className="text-foreground-secondary text-xs font-semibold">
            Nama bisnis dan kontak akun admin utama.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            Nama Lengkap
          </label>
          <div className="relative">
            <UserIcon className="text-foreground-muted absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Nama Lengkap Anda"
              required
              variant="pill"
              isError={!!nameError}
              className="pr-4 pl-10"
            />
          </div>
          {nameError && (
            <p className="mt-1.5 pl-3 text-xs font-semibold text-rose-500">{nameError}</p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-foreground-secondary block text-xs font-semibold tracking-wider uppercase">
              Alamat Email
            </label>
            <span className="text-foreground-muted inline-flex items-center gap-1 text-[10px] font-semibold">
              <Lock className="size-2.5" />
              Terkunci
            </span>
          </div>
          <div className="relative">
            <Mail className="text-foreground-muted absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              type="email"
              disabled
              readOnly
              value={email}
              variant="pill"
              className="cursor-not-allowed bg-muted/60 text-foreground-muted pr-4 pl-10 select-none"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-foreground-secondary block text-xs font-semibold tracking-wider uppercase">
              Nomor WhatsApp Admin
            </label>
            <span className="text-foreground-muted inline-flex items-center gap-1 text-[10px] font-semibold">
              <Lock className="size-2.5" />
              Terkunci
            </span>
          </div>
          <div className="relative">
            <Smartphone className="text-foreground-muted absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              type="text"
              disabled
              readOnly
              value={phone}
              variant="pill"
              className="cursor-not-allowed bg-muted/60 text-foreground-muted pr-4 pl-10 font-mono select-none"
            />
          </div>
        </div>

        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            Nama Perusahaan / Tenant
          </label>
          <div className="relative">
            <Building className="text-foreground-muted absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              type="text"
              disabled
              readOnly
              value={tenantName}
              variant="pill"
              className="cursor-not-allowed bg-muted/60 text-foreground-muted pr-4 pl-10 select-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isSaving}
            className="gap-1.5 px-5 text-xs font-bold shadow-sm"
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
