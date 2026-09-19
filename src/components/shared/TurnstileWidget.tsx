"use client";

import React, { forwardRef } from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { env } from "@/lib/config/env";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export const TurnstileWidget = forwardRef<
  TurnstileInstance,
  TurnstileWidgetProps
>(function TurnstileWidget({ onVerify, onError, onExpire, className }, ref) {
  const { locale } = useI18n();

  const handleError = (error?: string | number) => {
    // Di environment development / testing automasi (MCP / Puppeteer), jika Turnstile gagal (e.g. Error 600010),
    // lakukan auto-verify dengan fallback token agar testing form tidak terblokir.
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Cloudflare Turnstile] Detected error ${error ?? "unknown"} in development. Auto-verifying fallback token for automation testing.`,
      );
      onVerify("dev-bypass-turnstile-token");
      return;
    }
    onError?.();
  };

  return (
    <div
      className={cn("flex min-h-16.25 w-full justify-center py-1", className)}
    >
      <Turnstile
        ref={ref}
        siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={onVerify}
        onError={handleError}
        onExpire={onExpire}
        options={{
          theme: "auto",
          language: locale === "en" ? "en" : "id",
          size: "normal",
          retry: "auto",
          refreshExpired: "auto",
        }}
      />
    </div>
  );
});
