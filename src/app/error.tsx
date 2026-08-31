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
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-xl w-full text-center space-y-8 p-8 sm:p-12 rounded-lg border border-border bg-surface dark:bg-[#161715] shadow-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Warning Icon & Badge */}
        <div className="space-y-3">
          <div className="size-16 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="size-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldAlert className="size-3.5" />
            <span>{t("common.errors.serverError.badge")}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {t("common.errors.serverError.title")}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed max-w-md mx-auto">
            {t("common.errors.serverError.subtitle")}
          </p>
        </div>

        {/* Incident Digest Code */}
        {error?.digest && (
          <div className="p-3 rounded-md bg-muted/40 border border-border text-xs font-mono text-foreground-muted inline-block">
            <span className="font-sans font-bold text-foreground mr-1.5">
              {t("common.errors.serverError.digestLabel")}
            </span>
            <code className="text-wise-green font-bold">{error.digest}</code>
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
            <Button variant="outline" size="default" className="rounded-full gap-2 px-6 border-border hover:border-foreground-muted">
              <Home className="size-4" />
              <span>{t("common.errors.serverError.backHome")}</span>
            </Button>
          </Link>
        </div>

        {/* Direct WhatsApp CS Report */}
        <div className="pt-6 border-t border-border/80 text-xs font-semibold text-foreground-muted">
          <span>Membutuhkan bantuan darurat? </span>
          <a
            href={`https://wa.me/62877111301818?text=Halo%20Tim%20Wahide,%20saya%20mengalami%20kendala%20aplikasi:%20${encodeURIComponent(
              error?.digest ? `Digest-${error.digest}` : "Runtime-Error"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-wise-green font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageSquare className="size-3" />
            <span>{t("common.errors.serverError.reportWhatsApp")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
