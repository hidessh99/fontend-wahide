"use client";

import React from "react";
import { ForgotPasswordForm } from "@/services/iam/components/auth/ForgotPasswordForm";
import { AuthHeader } from "@/components/layout/auth/AuthHeader";
import { useI18n } from "@/lib/i18n/context";

export function ForgotPasswordView() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen flex flex-col justify-between p-6 sm:p-12 bg-background">
      <header className="max-w-xl w-full mx-auto">
        <AuthHeader />
      </header>

      <div className="my-auto py-8 max-w-md w-full mx-auto">
        <ForgotPasswordForm />
      </div>

      <footer className="text-center text-xs font-semibold text-foreground-muted">
        {t("auth.layout.emergencySupport")}
      </footer>
    </main>
  );
}
