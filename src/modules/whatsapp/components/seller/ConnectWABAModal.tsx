"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShieldCheck, Loader2, Key, Info, Eye, EyeOff } from "lucide-react";
import { ConnectWABAInput } from "../../types/waba.types";

interface ConnectWABAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ConnectWABAInput) => Promise<unknown>;
}

export function ConnectWABAModal({
  isOpen,
  onClose,
  onSubmit,
}: ConnectWABAModalProps) {
  const [formData, setFormData] = useState<ConnectWABAInput>({
    name: "",
    waba_account_id: "",
    phone_number_id: "",
    system_access_token: "",
  });
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof ConnectWABAInput, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Nama saluran wajib diisi");
      return;
    }
    if (!formData.waba_account_id.trim()) {
      setError("WABA Account ID wajib diisi");
      return;
    }
    if (!formData.phone_number_id.trim()) {
      setError("Phone Number ID wajib diisi");
      return;
    }
    if (!formData.system_access_token.trim()) {
      setError("System User Access Token wajib diisi");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: formData.name.trim(),
        waba_account_id: formData.waba_account_id.trim(),
        phone_number_id: formData.phone_number_id.trim(),
        system_access_token: formData.system_access_token.trim(),
      });
      setFormData({
        name: "",
        waba_account_id: "",
        phone_number_id: "",
        system_access_token: "",
      });
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menghubungkan Meta WABA. Pastikan Phone ID & Token valid.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Hubungkan WhatsApp Official (Meta WABA)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Integrasikan nomor centang hijau resmi melalui Meta WhatsApp Cloud API
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="waba-name" className="text-xs font-semibold">
              Nama Label Saluran <span className="text-destructive">*</span>
            </Label>
            <Input
              id="waba-name"
              placeholder="Contoh: CS Centang Hijau Utama"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={isLoading}
              className="text-sm"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              Nama internal saluran untuk membedakan nomor di dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="waba-account-id" className="text-xs font-semibold">
                WABA Account ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="waba-account-id"
                placeholder="109283746592817"
                value={formData.waba_account_id}
                onChange={(e) => handleChange("waba_account_id", e.target.value)}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="waba-phone-id" className="text-xs font-semibold">
                Phone Number ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="waba-phone-id"
                placeholder="104928172648192"
                value={formData.phone_number_id}
                onChange={(e) => handleChange("phone_number_id", e.target.value)}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="waba-token" className="text-xs font-semibold">
              Permanent System User Token <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="waba-token"
                type={showToken ? "text" : "password"}
                placeholder="EAAG..."
                value={formData.system_access_token}
                onChange={(e) =>
                  handleChange("system_access_token", e.target.value)
                }
                disabled={isLoading}
                className="font-mono text-xs pr-9"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Token permanen dengan permission <code>whatsapp_business_messaging</code>.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Info className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verifikasi Otomatis Meta Graph API v20.0</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sistem akan memvalidasi Token & Phone ID langsung ke server Meta sebelum menyimpan ke database.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifikasi Meta...</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  <span>Verifikasi & Hubungkan</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
