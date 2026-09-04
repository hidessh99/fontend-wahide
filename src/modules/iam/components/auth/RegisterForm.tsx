"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { TurnstileWidget } from "@/components/shared/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { registerSchema, RegisterInput } from "@/modules/iam/schemas/auth.schema";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
  const turnstileRef = useRef<TurnstileInstance>(null);

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

    const result = registerSchema.safeParse(formData);
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
                placeholder={t("auth.register.emailPlaceholder")}
                disabled={isLoading}
                className={`bg-surface text-foreground h-12 w-full rounded-full border pr-4 pl-12 font-semibold ${
                  fieldErrors.email
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green focus:ring-2"
                } text-sm transition outline-none`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("auth.register.phoneLabel")}
            </label>
            <div className="relative">
              <Phone className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("auth.register.phonePlaceholder")}
                disabled={isLoading}
                className={`bg-surface text-foreground h-12 w-full rounded-full border pr-4 pl-12 font-semibold ${
                  fieldErrors.phone
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green focus:ring-2"
                } text-sm transition outline-none`}
              />
            </div>
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
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
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
                {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
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
              {t("auth.register.agreeTerms")}
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
          onVerify={(token) => setFormData((prev) => ({ ...prev, turnstileToken: token }))}
          onError={() => setFormData((prev) => ({ ...prev, turnstileToken: "" }))}
          onExpire={() => setFormData((prev) => ({ ...prev, turnstileToken: "" }))}
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
