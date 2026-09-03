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
    <div className="animate-in fade-in my-6 space-y-4 rounded-md border border-rose-500/20 bg-rose-500/5 p-6 text-center sm:p-10">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
        <ShieldAlert className="size-6" />
      </div>

      <div className="mx-auto max-w-md space-y-1">
        <h2 className="text-foreground text-lg font-black">
          {t("common.errorBoundary.defaultTitle")}
        </h2>
        <p className="text-foreground-secondary text-xs leading-relaxed font-semibold">
          {error.message || t("common.errorBoundary.defaultDesc")}
        </p>
      </div>

      {error?.digest && (
        <div className="text-foreground-muted font-mono text-[11px]">
          Digest:{" "}
          <code className="dark:text-wise-green font-bold text-emerald-700">{error.digest}</code>
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
