"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { loginSchema, LoginInput } from "@/modules/iam/schemas/auth.schema";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { clearAllAuthStorage } from "@/lib/storage/cookies";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const isSessionExpired = searchParams.get("session_expired") === "1" || searchParams.get("session_expired") === "true";

  const { login, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Auto purge all residual auth cookies & reset Zustand session when redirected on session expired
  useEffect(() => {
    if (isSessionExpired) {
      clearAllAuthStorage();
      useAuth.getState().logout().catch(() => null);
    }
  }, [isSessionExpired]);

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
    rememberMe: true,
    turnstileToken: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

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

    const result = loginSchema.safeParse(formData);
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
      await login(result.data);
      router.push("/dashboard");
    } catch {
      turnstileRef.current?.reset();
      setFormData((prev) => ({ ...prev, turnstileToken: "" }));
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
          {t("auth.login.title")}
        </h1>
        <p className="text-sm font-semibold text-foreground-secondary">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistered && !error && (
          <div className="flex items-center gap-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{t("auth.login.registrationSuccess")}</span>
          </div>
        )}

        {isSessionExpired && !error && !isRegistered && (
          <div className="flex items-center gap-3 rounded-md bg-amber-50 dark:bg-amber-950/40 p-4 text-sm font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
            <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{t("auth.login.sessionExpiredNotice")}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-md bg-rose-50 dark:bg-rose-950/40 p-4 text-sm font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2">
              {t("auth.login.emailLabel")}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("auth.login.emailPlaceholder")}
                disabled={isLoading}
                className={`w-full h-13 pl-12 pr-4 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border ${
                  fieldErrors.email
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green"
                } outline-none transition text-sm`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1.5 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                {t("auth.login.passwordLabel")}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-dark-green dark:text-wise-green hover:underline"
              >
                {t("auth.login.forgotPasswordLink")}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("auth.login.passwordPlaceholder")}
                disabled={isLoading}
                className={`w-full h-13 pl-12 pr-12 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border ${
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
              <p className="mt-1.5 ml-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {fieldErrors.password}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="size-4 rounded accent-wise-green cursor-pointer"
            />
            <span className="text-xs font-semibold text-foreground-secondary">
              {t("auth.login.rememberMe")}
            </span>
          </label>
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
              <span>{t("auth.login.loadingButton")}</span>
            </>
          ) : (
            <>
              <span>{t("auth.login.submitButton")}</span>
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>

        <div className="text-center pt-1">
          <p className="text-sm font-semibold text-foreground-secondary">
            {t("auth.login.noAccountPrompt")}{" "}
            <Link
              href="/register"
              className="font-bold text-dark-green dark:text-wise-green hover:underline"
            >
              {t("auth.login.registerLink")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
