"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { CreateAgentInput } from "../../types/team.types";
import { Users, ShieldCheck, Loader2 } from "lucide-react";
import { isValidE164, formatDisplayPhone } from "@/lib/phone";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
  sanitizeSubscriberInput,
} from "@/lib/countryCodes";
import { CountryCodeSelector } from "@/components/shared/CountryCodeSelector";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAgentInput) => Promise<unknown>;
}

export function AddTeamMemberModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTeamMemberModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setSelectedCountry(DEFAULT_COUNTRY);
    setPhone("");
    setPassword("");
    setPasswordError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handlePhoneChange = (val: string) => {
    let currentVal = val;
    if (currentVal.includes("+")) {
      const detected = detectCountryFromPhone(currentVal);
      if (detected.country) {
        setSelectedCountry(detected.country);
        const cleaned = sanitizeSubscriberInput(
          detected.subscriberNumber,
          detected.country.dialCode,
        );
        setPhone(cleaned);
        return;
      }
      currentVal = detected.subscriberNumber;
    }
    const cleaned = sanitizeSubscriberInput(
      currentVal,
      selectedCountry.dialCode,
    );
    setPhone(cleaned);
  };

  const cleanDigits = sanitizeSubscriberInput(phone, selectedCountry.dialCode);
  const fullPhone = cleanDigits
    ? `${selectedCountry.dialCode}${cleanDigits}`
    : "";
  const isPhoneValid = Boolean(
    fullPhone && isValidE164(fullPhone) && cleanDigits.length >= 8,
  );
  const isPhoneTooLong = cleanDigits.length > 14;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    if (!isPhoneValid) {
      toast.error(
        t("team.errInvalidPhone") ||
          "Format nomor WhatsApp tidak valid (minimal 8 digit).",
      );
      return;
    }

    if (!password.trim() || password.trim().length < 6) {
      setPasswordError("Password akun agen wajib diisi minimal 6 karakter");
      return;
    }

    setPasswordError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: fullPhone,
        role: "AGENT",
        password: password.trim(),
      });
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Users className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight">
              {t("team.modalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("team.modalSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("team.nameLabel")}
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("team.namePlaceholder")}
                variant="pill"
              />
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("team.emailLabel")}
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("team.emailPlaceholder")}
                variant="pill"
              />
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("team.phoneLabel")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <div
                className={cn(
                  "flex h-10 w-full items-center rounded-xl border bg-surface transition-all focus-within:ring-2",
                  isPhoneValid
                    ? "border-emerald-500/70 focus-within:ring-emerald-500/30"
                    : isPhoneTooLong
                      ? "border-rose-500/70 focus-within:ring-rose-500/30"
                      : "border-border focus-within:border-primary focus-within:ring-primary/20",
                )}
              >
                <CountryCodeSelector
                  selectedCountry={selectedCountry}
                  onSelectCountry={(c) => {
                    setSelectedCountry(c);
                    if (phone) {
                      setPhone(sanitizeSubscriberInput(phone, c.dialCode));
                    }
                  }}
                  disabled={isSubmitting}
                  variant="rounded"
                  className="h-full rounded-l-xl rounded-r-none border-y-0 border-l-0 px-2.5"
                />
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={t("team.phonePlaceholder") || "812 3456 7890"}
                  className="h-full flex-1 rounded-r-xl rounded-l-none border-0 bg-transparent px-3 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isSubmitting}
                />
              </div>

              {/* Live Preview & Helper Micro-Feedback */}
              <div className="flex items-center justify-between px-1 pt-1 text-[11px]">
                {isPhoneValid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
                    <span>✓</span>
                    <span>
                      {t("team.phoneReadyPreview", {
                        formatted: formatDisplayPhone(fullPhone),
                      })}
                    </span>
                  </span>
                ) : isPhoneTooLong ? (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    {t("team.phoneTooLong")}
                  </span>
                ) : phone.length > 0 ? (
                  <span className="text-foreground-muted">
                    +{selectedCountry.dialCode} {cleanDigits} (min. 8 digit)
                  </span>
                ) : (
                  <span className="text-foreground-muted/70 text-[10px]">
                    {t("team.phoneHelperHint")}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("team.roleLabel")}
              </label>
              <div className="bg-muted/60 text-foreground border-border flex h-10 w-full items-center gap-2 rounded-full border px-4 text-xs font-bold select-none">
                <ShieldCheck className="text-wise-green size-4" />
                <span>{t("team.roleAgent")}</span>
              </div>
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("team.passwordLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder={t("team.passwordPlaceholder")}
                variant="pill"
                isError={!!passwordError}
              />
              {passwordError && (
                <p className="mt-1.5 pl-3 text-xs font-semibold text-rose-500">
                  {passwordError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-border hover:border-foreground-muted rounded-full px-4 text-xs font-bold"
            >
              {t("team.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 px-6 text-xs font-bold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("team.submitting")}</span>
                </>
              ) : (
                <span>{t("team.submitCreate")}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
