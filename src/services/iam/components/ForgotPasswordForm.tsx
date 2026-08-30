"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { forgotPasswordSchema, ForgotPasswordInput } from "../schemas/auth.schema";
import { authApi } from "../api/auth.api";
import { useI18n } from "@/lib/i18n/context";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [formData, setFormData] = useState<ForgotPasswordInput>({
    email: "",
    turnstileToken: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Format email tidak valid");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: result.data.email });
      setSuccessMessage(res.message || "Tautan pemulihan password telah dikirim ke email Anda.");
    } catch (err: unknown) {
      turnstileRef.current?.reset();
      setFormData((prev) => ({ ...prev, turnstileToken: "" }));
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal mengirim email reset password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-black tracking-tight leading-[0.95] text-foreground">
          {t("auth.forgotPassword.title")}
        </h1>
        <p className="text-sm font-semibold text-foreground-secondary">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <div className="flex items-center gap-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-md bg-rose-50 dark:bg-rose-950/40 p-4 text-sm font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-2">
            {t("auth.forgotPassword.emailLabel")}
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-muted" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                setError(null);
              }}
              placeholder={t("auth.forgotPassword.emailPlaceholder")}
              disabled={isLoading}
              className="w-full h-13 pl-12 pr-4 rounded-full bg-surface dark:bg-[#161715] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-sm"
            />
          </div>
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
              <span>{t("auth.forgotPassword.loadingButton")}</span>
            </>
          ) : (
            <span>{t("auth.forgotPassword.submitButton")}</span>
          )}
        </Button>

        <div className="text-center pt-1">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>{t("auth.forgotPassword.backToLogin")}</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
