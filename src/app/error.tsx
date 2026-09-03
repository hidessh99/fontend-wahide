"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { AlertTriangle, RefreshCw, Home, MessageSquare, ShieldAlert } from "lucide-react";

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    // Log exception to telemetry / console
    console.error("[Next.js App Error Caught]:", error);
  }, [error]);

  return (
    <div className="bg-background text-foreground flex min-h-[80vh] items-center justify-center p-6">
      <div className="border-border bg-surface animate-in fade-in zoom-in-95 w-full max-w-xl space-y-8 rounded-lg border p-8 text-center shadow-lg duration-200 sm:p-12 dark:bg-[#161715]">
        {/* Warning Icon & Badge */}
        <div className="space-y-3">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <ShieldAlert className="size-3.5" />
            <span>{t("common.errors.serverError.badge")}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            {t("common.errors.serverError.title")}
          </h1>
          <p className="text-foreground-secondary mx-auto max-w-md text-xs leading-relaxed font-semibold sm:text-sm">
            {t("common.errors.serverError.subtitle")}
          </p>
        </div>

        {/* Incident Digest Code */}
        {error?.digest && (
          <div className="bg-muted/40 border-border text-foreground-muted inline-block rounded-md border p-3 font-mono text-xs">
            <span className="text-foreground mr-1.5 font-sans font-bold">
              {t("common.errors.serverError.digestLabel")}
            </span>
            <code className="dark:text-wise-green font-bold text-emerald-700">{error.digest}</code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="primaryPill"
            size="default"
            onClick={() => reset()}
            className="gap-2 px-6 shadow-sm"
          >
            <RefreshCw className="size-4" />
            <span>{t("common.errors.serverError.retry")}</span>
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              size="default"
              className="border-border hover:border-foreground-muted gap-2 rounded-full px-6"
            >
              <Home className="size-4" />
              <span>{t("common.errors.serverError.backHome")}</span>
            </Button>
          </Link>
        </div>

        {/* Direct WhatsApp CS Report */}
        <div className="border-border/80 text-foreground-muted border-t pt-6 text-xs font-semibold">
          <span>Membutuhkan bantuan darurat? </span>
          <a
            href={`https://wa.me/62877111301818?text=Halo%20Tim%20Wahide,%20saya%20mengalami%20kendala%20aplikasi:%20${encodeURIComponent(
              error?.digest ? `Digest-${error.digest}` : "Runtime-Error"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dark:text-wise-green inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
          >
            <MessageSquare className="size-3" />
            <span>{t("common.errors.serverError.reportWhatsApp")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
