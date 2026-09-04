"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { TurnstileWidget } from "@/components/shared/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { resetPasswordSchema, ResetPasswordInput } from "@/modules/iam/schemas/auth.schema";
import { authApi } from "@/modules/iam/api/auth.api";
import { useI18n } from "@/lib/i18n/context";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

export function ResetPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [formData, setFormData] = useState<ResetPasswordInput>({
    token: tokenParam,
    password: "",
    confirmPassword: "",
    turnstileToken: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Data konfirmasi tidak valid");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword(result.data);
      setSuccessMessage(res.message || t("auth.resetPassword.successNotice"));

      // Auto redirect to /login after 2 seconds with safe cleanup
      if (redirectTimerRef.current !== null) {
        clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      turnstileRef.current?.reset();
      setFormData((prev) => ({ ...prev, turnstileToken: "" }));
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Gagal mereset password. Pastikan token verifikasi Anda valid dan belum kadaluarsa."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-4xl leading-[0.95] font-black tracking-tight">
          {t("auth.resetPassword.title")}
        </h1>
        <p className="text-foreground-secondary text-sm font-semibold">
          {t("auth.resetPassword.subtitle")}
        </p>
      </div>

      {/* Target Email Hint Badge */}
      {emailParam && (
        <div className="bg-surface border-border text-foreground-secondary flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-semibold shadow-2xs">
          <Mail className="text-wise-green size-4 shrink-0" />
          <p>
            {t("auth.resetPassword.emailHint")}:{" "}
            <span className="text-foreground font-bold">{emailParam}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <Alert variant="success">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{successMessage}</span>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </Alert>
        )}

        {/* Token Input */}
        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("auth.resetPassword.tokenLabel")}
          </label>
          <div className="relative">
            <KeyRound className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
            <input
              type="text"
              value={formData.token}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, token: e.target.value.trim() }));
                setError(null);
              }}
              placeholder={t("auth.resetPassword.tokenPlaceholder")}
              disabled={isLoading}
              className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-12 w-full rounded-full border pr-4 pl-12 font-mono text-xs font-semibold transition outline-none focus:ring-2 sm:text-sm"
            />
          </div>
        </div>

        {/* New Password Input */}
        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("auth.resetPassword.newPasswordLabel")}
          </label>
          <div className="relative">
            <Lock className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                setError(null);
              }}
              placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
              disabled={isLoading}
              className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-12 w-full rounded-full border pr-12 pl-12 text-sm font-semibold transition outline-none focus:ring-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-foreground-muted hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("auth.resetPassword.confirmPasswordLabel")}
          </label>
          <div className="relative">
            <ShieldCheck className="text-foreground-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                setError(null);
              }}
              placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
              disabled={isLoading}
              className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-12 w-full rounded-full border pr-12 pl-12 text-sm font-semibold transition outline-none focus:ring-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-foreground-muted hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {/* Turnstile Protection */}
        <TurnstileWidget
          ref={turnstileRef}
          onVerify={(token: string) => setFormData((prev) => ({ ...prev, turnstileToken: token }))}
          onError={() => setFormData((prev) => ({ ...prev, turnstileToken: "" }))}
          onExpire={() => setFormData((prev) => ({ ...prev, turnstileToken: "" }))}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primaryPill"
          size="default"
          disabled={isLoading}
          className="h-12 w-full text-sm font-bold shadow-sm"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-4" />
              <span>{t("auth.resetPassword.loadingButton")}</span>
            </div>
          ) : (
            <span>{t("auth.resetPassword.submitButton")}</span>
          )}
        </Button>
      </form>

      {/* Resend & Back to Login Links */}
      <div className="space-y-3 pt-2 text-center text-xs font-semibold">
        <p className="text-foreground-secondary">
          {t("auth.resetPassword.resendPrompt")}{" "}
          <Link href="/forgot-password" className="text-foreground hover:text-wise-green underline">
            {t("auth.resetPassword.resendLink")}
          </Link>
        </p>
        <Link
          href="/login"
          className="text-foreground-secondary hover:text-foreground inline-flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("auth.resetPassword.backToLogin")}</span>
        </Link>
      </div>
    </div>
  );
}
