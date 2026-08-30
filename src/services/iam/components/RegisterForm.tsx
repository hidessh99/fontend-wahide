"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { registerSchema, RegisterInput } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { Eye, EyeOff, Lock, Mail, Phone, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

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
    clearError();
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    try {
      await register(result.data);
      router.push("/dashboard");
    } catch {
      turnstileRef.current?.reset();
      setFormData((prev) => ({ ...prev, turnstileToken: "" }));
    }
  };

  return (
    <div className="space-y-5 w-full max-w-md">
      <div className="space-y-1.5">
        <h1 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
          {t("auth.register.title")}
        </h1>
        <p className="text-sm font-semibold text-foreground-secondary">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-3 rounded-md bg-rose-50 dark:bg-rose-950/40 p-4 text-sm font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("auth.register.nameLabel")}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("auth.register.namePlaceholder")}
                disabled={isLoading}
                className={`w-full h-12 pl-12 pr-4 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border ${
                  fieldErrors.name
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green"
                } outline-none transition text-sm`}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("auth.register.emailLabel")}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("auth.register.emailPlaceholder")}
                disabled={isLoading}
                className={`w-full h-12 pl-12 pr-4 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border ${
                  fieldErrors.email
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green"
                } outline-none transition text-sm`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("auth.register.phoneLabel")}
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("auth.register.phonePlaceholder")}
                disabled={isLoading}
                className={`w-full h-12 pl-12 pr-4 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border ${
                  fieldErrors.phone
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green"
                } outline-none transition text-sm`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("auth.register.passwordLabel")}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("auth.register.passwordPlaceholder")}
                disabled={isLoading}
                className={`w-full h-12 pl-12 pr-12 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border ${
                  fieldErrors.password
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green"
                } outline-none transition text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-9 flex items-center justify-center rounded-full text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("auth.register.confirmPasswordLabel")}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("auth.register.confirmPasswordPlaceholder")}
                disabled={isLoading}
                className={`w-full h-12 pl-12 pr-12 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border ${
                  fieldErrors.confirmPassword
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green"
                } outline-none transition text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-9 flex items-center justify-center rounded-full text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
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
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="size-4 mt-0.5 rounded accent-wise-green cursor-pointer"
            />
            <span className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              {t("auth.register.agreeTerms")}
            </span>
          </label>
          {fieldErrors.agreeTerms && (
            <p className="mt-1 ml-6 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {fieldErrors.agreeTerms}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile CAPTCHA Protection */}
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
              <Loader2 className="size-5 animate-spin" />
              <span>{t("auth.register.loadingButton")}</span>
            </>
          ) : (
            <>
              <span>{t("auth.register.submitButton")}</span>
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>

        <div className="text-center pt-1">
          <p className="text-sm font-semibold text-foreground-secondary">
            {t("auth.register.haveAccountPrompt")}{" "}
            <Link
              href="/login"
              className="font-bold text-dark-green dark:text-wise-green hover:underline"
            >
              {t("auth.register.loginLink")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
