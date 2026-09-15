"use client";

import React, { useState } from "react";
import { UserItem, UpdateUserInput } from "@/modules/iam/types/admin.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { generateSecureRandomString } from "@/lib/utils";
import {
  Edit,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Save,
  Shield,
  Phone,
  Mail,
  User,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
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

interface EditUserModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, data: UpdateUserInput) => Promise<unknown>;
}

interface EditUserModalContentProps {
  user: UserItem;
  onClose: () => void;
  onSubmit: (userId: string, data: UpdateUserInput) => Promise<unknown>;
}

function EditUserModalContent({
  user,
  onClose,
  onSubmit,
}: EditUserModalContentProps) {
  const { t } = useI18n();
  const rawPhone = user.phoneNumber || user.phone || "";
  const detectedInitial = rawPhone ? detectCountryFromPhone(rawPhone) : null;
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(
    detectedInitial?.country || DEFAULT_COUNTRY,
  );
  const [phone, setPhone] = useState(
    detectedInitial ? detectedInitial.subscriberNumber : rawPhone,
  );
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(
    user.status === "ACTIVE" || user.isActive === true,
  );
  const [role, setRole] = useState(user.role || user.roleName || "SELLER");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGeneratePassword = () => {
    const randomPass = generateSecureRandomString("Wahide@", 6);
    setPassword(randomPass);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalPhone: string | undefined = undefined;
    if (cleanDigits.length > 0) {
      if (!isPhoneValid) {
        toast.error(
          t("contact.errPhonePrefix") ||
            "Format nomor WhatsApp tidak valid (minimal 8 digit).",
        );
        return;
      }
      finalPhone = fullPhone;
    }

    setIsLoading(true);
    try {
      const payload: UpdateUserInput = {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: finalPhone,
        phone: finalPhone,
        isActive: isActive,
        role: role,
      };
      if (password.trim()) {
        payload.password = password.trim();
      }

      await onSubmit(user.id, payload);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
        <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <Edit className="size-5" />
        </div>
        <div>
          <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
            {t("admin.users.editModalTitle")}
          </DialogTitle>
          <DialogDescription className="text-foreground-secondary text-xs font-semibold">
            {t("admin.users.editModalSubtitle", { name: user.name })}
          </DialogDescription>
        </div>
      </DialogHeader>

      {/* Scrollable Form Body */}
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Nama Lengkap */}
          <div>
            <label
              htmlFor="edit-user-name"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <User className="size-3.5" />
              <span>{t("admin.users.fullNameLabel")}</span>
            </label>
            <Input
              id="edit-user-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("admin.users.fullNamePlaceholder")}
              variant="pill"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="edit-user-email"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <Mail className="size-3.5" />
              <span>{t("admin.users.emailLabel")}</span>
            </label>
            <Input
              id="edit-user-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("admin.users.emailPlaceholder")}
              variant="pill"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label
              htmlFor="edit-user-phone"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <Phone className="size-3.5" />
              <span>{t("admin.users.phoneLabel")}</span>
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
                disabled={isLoading}
                variant="rounded"
                className="h-full rounded-l-xl rounded-r-none border-y-0 border-l-0 px-2.5"
              />
              <Input
                id="edit-user-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder={
                  t("admin.users.phonePlaceholder") || "812 3456 7890"
                }
                className="h-full flex-1 rounded-r-xl rounded-l-none border-0 bg-transparent px-3 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
            </div>

            {/* Live Preview & Helper Micro-Feedback */}
            <div className="flex items-center justify-between px-1 pt-1 text-[11px]">
              {isPhoneValid ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
                  <span>✓</span>
                  <span>
                    {t("admin.users.phoneReadyPreview", {
                      formatted: formatDisplayPhone(fullPhone),
                    })}
                  </span>
                </span>
              ) : isPhoneTooLong ? (
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  {t("admin.users.phoneTooLong")}
                </span>
              ) : phone.length > 0 ? (
                <span className="text-foreground-muted">
                  +{selectedCountry.dialCode} {cleanDigits} (min. 8 digit)
                </span>
              ) : (
                <span className="text-foreground-muted/70 text-[10px]">
                  {t("admin.users.phoneHelperHint")}
                </span>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="edit-user-role"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <Shield className="size-3.5" />
              <span>{t("admin.users.roleLabel")}</span>
            </label>
            <NativeSelect
              id="edit-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              variant="pill"
            >
              <option value="SELLER">{t("admin.users.roleSeller")}</option>
              <option value="ADMIN">{t("admin.users.roleAdmin")}</option>
              <option value="SUPERADMIN">
                {t("admin.users.roleSuperAdmin")}
              </option>
            </NativeSelect>
          </div>

          {/* Status Toggle */}
          <div className="border-border bg-muted/20 flex items-center justify-between rounded-lg border p-3">
            <div>
              <span className="text-foreground block font-bold">
                {t("admin.users.statusActiveTitle")}
              </span>
              <span className="text-foreground-secondary text-[11px]">
                {t("admin.users.statusActiveDesc")}
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label={t("admin.users.statusActiveTitle")}
            />
          </div>

          {/* Reset Password Optional */}
          <div className="border-border space-y-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-user-password"
                className="text-foreground-secondary flex items-center gap-1.5 font-bold"
              >
                <Lock className="size-3.5" />
                <span>{t("admin.users.resetPasswordLabel")}</span>
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="dark:text-wise-green flex cursor-pointer items-center gap-1 font-mono text-[11px] font-bold text-emerald-600 hover:underline"
              >
                <Sparkles className="size-3" />
                <span>{t("admin.users.generatePasswordBtn")}</span>
              </button>
            </div>
            <div className="relative">
              <Input
                id="edit-user-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("admin.users.passwordPlaceholder")}
                variant="pill"
                className="pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {password && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-3 shrink-0" />
                <span>
                  {t("admin.users.passwordOverwriteWarning")}{" "}
                  <code className="bg-muted rounded px-1 font-mono font-bold">
                    {password}
                  </code>
                </span>
              </span>
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
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || !name.trim() || !email.trim()}
            className="gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("admin.users.savingUserBtn")}</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>{t("admin.users.saveUserBtn")}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        <EditUserModalContent
          key={user.id}
          user={user}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
