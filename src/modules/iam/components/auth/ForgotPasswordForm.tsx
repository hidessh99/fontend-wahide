"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/modules/iam/schemas/auth.schema";
import { authApi } from "@/modules/iam/api/auth.api";
import { useI18n } from "@/lib/i18n/context";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

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
      setSuccessMessage(res.message || t("auth.forgotPassword.redirectingNotice"));

      // Auto redirect to /reset-password after 1.5s with safe cleanup
      if (redirectTimerRef.current !== null) {
        clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(result.data.email)}`);
      }, 1500);
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
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-4xl leading-[0.95] font-black tracking-tight">
          {t("auth.forgotPassword.title")}
        </h1>
        <p className="text-foreground-secondary text-sm font-semibold">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={() =>
                router.push(`/reset-password?email=${encodeURIComponent(formData.email)}`)
              }
              className="w-full text-xs font-bold"
            >
              {t("auth.forgotPassword.proceedToTokenButton")} →
            </Button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="text-foreground-secondary mb-2 block text-xs font-semibold tracking-wider uppercase">
            {t("auth.forgotPassword.emailLabel")}
          </label>
          <div className="relative">
            <Mail className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                setError(null);
              }}
              placeholder={t("auth.forgotPassword.emailPlaceholder")}
              disabled={isLoading}
              className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-13 w-full rounded-full border pr-4 pl-12 text-sm font-semibold transition outline-none focus:ring-2 dark:bg-[#161715]"
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

        <div className="space-y-2.5 pt-1 text-center text-xs font-semibold">
          <p className="text-foreground-secondary">
            {t("auth.forgotPassword.hasTokenPrompt")}{" "}
            <Link
              href={`/reset-password${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ""}`}
              className="text-foreground hover:text-wise-green underline"
            >
              {t("auth.forgotPassword.enterTokenLink")}
            </Link>
          </p>
          <div>
            <Link
              href="/login"
              className="text-foreground-secondary hover:text-foreground inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="size-3.5" />
              <span>{t("auth.forgotPassword.backToLogin")}</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
