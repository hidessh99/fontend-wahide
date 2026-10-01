"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { TurnstileWidget } from "@/components/shared/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import {
  registerSchema,
  RegisterInput,
  isAllowedRegisterEmailDomain,
} from "@/modules/iam/schemas/auth.schema";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { CountryCodeSelector } from "@/components/shared/CountryCodeSelector";
import { PhoneWarningNotice } from "@/components/shared/PhoneWarningNotice";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
  checkPhoneInputWarning,
  type PhoneWarningResult,
} from "@/lib/countryCodes";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [selectedCountry, setSelectedCountry] =
    useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [phoneWarning, setPhoneWarning] = useState<PhoneWarningResult>({
    hasWarning: false,
    suggestedValue: "",
  });
  const [formData, setFormData] = useState<RegisterInput>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    turnstileToken: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) clearError();
  };

  const handleEmailBlur = () => {
    const email = formData.email.trim();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors((prev) => ({
        ...prev,
        email:
          t("auth.register.emailInvalidError") || "Format email tidak valid",
      }));
      return;
    }

    if (!isAllowedRegisterEmailDomain(email)) {
      setFieldErrors((prev) => ({
        ...prev,
        email:
          t("auth.register.emailDomainError") ||
          "Pendaftaran hanya menerima email resmi Gmail atau Outlook (@gmail.com, @outlook.com). Email sementara (temp-mail) tidak diizinkan.",
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Detect country if user pasted international format (+...)
    if (val.includes("+")) {
      const detected = detectCountryFromPhone(val);
      if (detected.country) {
        setSelectedCountry(detected.country);
      }
      val = detected.subscriberNumber;
    }

    // Keep numeric characters (do not silently strip leading 0 or dialCode)
    val = val.replace(/[^0-9]/g, "");

    // Check smart warning for leading 0 or duplicate dialCode
    const warning = checkPhoneInputWarning(val, selectedCountry.dialCode);
    setPhoneWarning(warning);

    setFormData((prev) => ({ ...prev, phone: val }));
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: "" }));
    }
    if (error) clearError();
  };

  const handleFixPhone = (suggestedValue: string) => {
    setFormData((prev) => ({ ...prev, phone: suggestedValue }));
    setPhoneWarning({ hasWarning: false, suggestedValue: "" });
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSelectCountry = (country: CountryCodeItem) => {
    setSelectedCountry(country);
    const warning = checkPhoneInputWarning(formData.phone, country.dialCode);
    setPhoneWarning(warning);
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!formData.turnstileToken) {
      setFieldErrors((prev) => ({
        ...prev,
        turnstile: "Silakan selesaikan verifikasi Cloudflare Turnstile.",
      }));
      return;
    }

    // Option 2: Blokir proses submit dan tampilkan pesan error jika masih ada awalan 0 atau duplikasi dial code
    const warning = checkPhoneInputWarning(
      formData.phone,
      selectedCountry.dialCode,
    );
    if (warning.hasWarning) {
      setFieldErrors((prev) => ({
        ...prev,
        phone:
          warning.message ||
          "Harap perbaiki format nomor WhatsApp terlebih dahulu.",
      }));
      return;
    }

    const cleanDigits = formData.phone.replace(/[^0-9]/g, "");
    const fullPhone = cleanDigits
      ? `${selectedCountry.dialCode}${cleanDigits}`
      : "";

    const payloadToValidate = {
      ...formData,
      phone: fullPhone,
    };

    const result = registerSchema.safeParse(payloadToValidate);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    try {
      await register(result.data);
      router.push("/login?registered=true");
    } catch {
      turnstileRef.current?.reset();
      setFormData((prev) => ({ ...prev, turnstileToken: "" }));
    }
  };

  return (
    <div className="w-full max-w-md space-y-5">
      <div className="space-y-1.5">
        <h1 className="text-foreground text-4xl leading-[0.95] font-black tracking-tight">
          {t("auth.register.title")}
        </h1>
        <p className="text-foreground-secondary text-sm font-semibold">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </Alert>
        )}

        <div className="space-y-3.5">
          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("auth.register.nameLabel")}
            </label>
            <div className="relative">
              <User className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("auth.register.namePlaceholder")}
                disabled={isLoading}
                className={`bg-surface text-foreground h-12 w-full rounded-full border pr-4 pl-12 font-semibold ${
                  fieldErrors.name
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green focus:ring-2"
                } text-sm transition outline-none`}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("auth.register.emailLabel")}
            </label>
            <div className="relative">
              <Mail className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                autoComplete="email"
                placeholder={t("auth.register.emailPlaceholder")}
                disabled={isLoading}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={
                  fieldErrors.email
                    ? "register-email-error"
                    : "register-email-hint"
                }
                className={`bg-surface text-foreground h-12 w-full rounded-full border pr-4 pl-12 font-semibold ${
                  fieldErrors.email
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green focus:ring-2"
                } text-sm transition outline-none`}
              />
            </div>
            {fieldErrors.email ? (
              <p
                id="register-email-error"
                className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400"
              >
                {fieldErrors.email}
              </p>
            ) : (
              <p
                id="register-email-hint"
                className="mt-1 ml-4 text-[11px] font-medium text-foreground-muted"
              >
                {t("auth.register.emailDomainHint") ||
                  "Hanya menerima email resmi @gmail.com atau @outlook.com (temp-mail ditolak)."}
              </p>
            )}
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("auth.register.phoneLabel")}
            </label>
            <div
              className={`flex h-12 w-full items-center rounded-full border bg-surface transition shadow-xs ${
                fieldErrors.phone
                  ? "border-rose-500 ring-1 ring-rose-500"
                  : "border-border hover:border-foreground-muted focus-within:border-wise-green focus-within:ring-2 focus-within:ring-wise-green"
              }`}
            >
              <CountryCodeSelector
                selectedCountry={selectedCountry}
                onSelectCountry={handleSelectCountry}
                disabled={isLoading}
                variant="pill"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder={
                  selectedCountry.formatHint ||
                  t("auth.register.phonePlaceholder") ||
                  "812 3456 7890"
                }
                disabled={isLoading}
                autoComplete="tel"
                className="bg-transparent text-foreground h-full flex-1 pr-4 pl-3 text-sm font-semibold outline-none placeholder:text-foreground-muted/60"
              />
            </div>
            <PhoneWarningNotice warning={phoneWarning} onFix={handleFixPhone} />
            {fieldErrors.phone && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("auth.register.passwordLabel")}
            </label>
            <div className="relative">
              <Lock className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("auth.register.passwordPlaceholder")}
                disabled={isLoading}
                className={`bg-surface text-foreground h-12 w-full rounded-full border pr-12 pl-12 font-semibold ${
                  fieldErrors.password
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green focus:ring-2"
                } text-sm transition outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground-muted hover:text-foreground hover:bg-muted absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("auth.register.confirmPasswordLabel")}
            </label>
            <div className="relative">
              <Lock className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("auth.register.confirmPasswordPlaceholder")}
                disabled={isLoading}
                className={`bg-surface text-foreground h-12 w-full rounded-full border pr-12 pl-12 font-semibold ${
                  fieldErrors.confirmPassword
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green focus:ring-2"
                } text-sm transition outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-foreground-muted hover:text-foreground hover:bg-muted absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition"
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi kata sandi"
                    : "Tampilkan konfirmasi kata sandi"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="pt-0.5">
          <label className="flex cursor-pointer items-start gap-2.5 select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="accent-wise-green mt-0.5 size-4 cursor-pointer rounded"
            />
            <span className="text-foreground-secondary text-xs leading-relaxed font-semibold">
              {t("auth.register.agreeTermsPrefix")}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-dark-green dark:text-wise-green font-bold hover:underline"
              >
                {t("auth.register.termsLink")}
              </Link>
              {t("auth.register.agreeTermsAnd")}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-dark-green dark:text-wise-green font-bold hover:underline"
              >
                {t("auth.register.privacyLink")}
              </Link>
              {t("auth.register.agreeTermsSuffix")}
            </span>
          </label>
          {fieldErrors.agreeTerms && (
            <p className="mt-1 ml-6 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {fieldErrors.agreeTerms}
            </p>
          )}
        </div>

        {/* Turnstile Protection */}
        <TurnstileWidget
          ref={turnstileRef}
          onVerify={(token) =>
            setFormData((prev) => ({ ...prev, turnstileToken: token }))
          }
          onError={() =>
            setFormData((prev) => ({ ...prev, turnstileToken: "" }))
          }
          onExpire={() =>
            setFormData((prev) => ({ ...prev, turnstileToken: "" }))
          }
        />

        <Button
          type="submit"
          variant="primaryPill"
          size="lg"
          disabled={isLoading}
          className="w-full gap-2 text-base font-bold shadow-sm"
        >
          {isLoading ? (
            <>
              <Spinner className="size-5" />
              <span>{t("auth.register.loadingButton")}</span>
            </>
          ) : (
            <>
              <span>{t("auth.register.submitButton")}</span>
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>

        <div className="pt-1 text-center">
          <p className="text-foreground-secondary text-sm font-semibold">
            {t("auth.register.haveAccountPrompt")}{" "}
            <Link
              href="/login"
              className="text-dark-green dark:text-wise-green font-bold hover:underline"
            >
              {t("auth.register.loginLink")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
