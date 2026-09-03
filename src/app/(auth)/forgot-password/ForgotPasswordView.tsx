"use client";

import React from "react";
import { ForgotPasswordForm } from "@/modules/iam/components/auth/ForgotPasswordForm";
import { AuthHeader } from "@/components/layout/auth/AuthHeader";
import { useI18n } from "@/lib/i18n/context";

export function ForgotPasswordView() {
  const { t } = useI18n();

  return (
    <main className="bg-background flex min-h-screen flex-col justify-between p-6 sm:p-12">
      <header className="mx-auto w-full max-w-xl">
        <AuthHeader />
      </header>

      <div className="mx-auto my-auto w-full max-w-md py-8">
        <ForgotPasswordForm />
      </div>

      <footer className="text-foreground-muted text-center text-xs font-semibold">
        {t("auth.layout.emergencySupport")}
      </footer>
    </main>
  );
}
