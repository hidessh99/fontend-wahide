"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { ShieldAlert, RefreshCw } from "lucide-react";

export default function AdminSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[Admin Portal Segment Error]:", error);
  }, [error]);

  return (
    <div className="p-6 sm:p-10 rounded-md border border-rose-500/20 bg-rose-500/5 text-center space-y-4 my-6 animate-in fade-in">
      <div className="size-12 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <ShieldAlert className="size-6" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h2 className="text-lg font-black text-foreground">
          {t("common.errorBoundary.defaultTitle")}
        </h2>
        <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
          {error.message || t("common.errorBoundary.defaultDesc")}
        </p>
      </div>

      {error?.digest && (
        <div className="text-[11px] font-mono text-foreground-muted">
          Digest: <code className="text-emerald-700 dark:text-wise-green font-bold">{error.digest}</code>
        </div>
      )}

      <div className="pt-2">
        <Button
          variant="primaryPill"
          size="sm"
          onClick={() => reset()}
          className="gap-2 px-5 shadow-sm"
        >
          <RefreshCw className="size-3.5" />
          <span>{t("common.errorBoundary.retryBtn")}</span>
        </Button>
      </div>
    </div>
  );
}
