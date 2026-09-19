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
import { useI18n } from "@/lib/i18n/context";

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
  const { t } = useI18n();
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
      setError(t("whatsapp.waba.errNameRequired"));
      return;
    }
    if (!formData.waba_account_id.trim()) {
      setError(t("whatsapp.waba.errWabaIdRequired"));
      return;
    }
    if (!formData.phone_number_id.trim()) {
      setError(t("whatsapp.waba.errPhoneIdRequired"));
      return;
    }
    if (!formData.system_access_token.trim()) {
      setError(t("whatsapp.waba.errTokenRequired"));
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
          : t("whatsapp.waba.errConnectFailed");
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
                {t("whatsapp.waba.modalTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("whatsapp.waba.modalSubtitle")}
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
              {t("whatsapp.waba.channelLabel")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="waba-name"
              placeholder={t("whatsapp.waba.channelLabelPlaceholder")}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={isLoading}
              className="text-sm"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              {t("whatsapp.waba.channelLabelHint")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="waba-account-id" className="text-xs font-semibold">
                {t("whatsapp.waba.wabaIdLabel")} <span className="text-destructive">*</span>
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
                {t("whatsapp.waba.phoneIdLabel")} <span className="text-destructive">*</span>
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
              {t("whatsapp.waba.systemTokenLabel")} <span className="text-destructive">*</span>
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
              {t("whatsapp.waba.systemTokenHint")}
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Info className="h-3.5 w-3.5 text-emerald-500" />
              <span>{t("whatsapp.waba.autoVerifyTitle")}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t("whatsapp.waba.autoVerifyDesc")}
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("whatsapp.waba.btnVerifying")}</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  <span>{t("whatsapp.waba.btnVerifyConnect")}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
