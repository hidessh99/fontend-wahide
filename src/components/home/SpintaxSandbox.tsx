"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseSpintax } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { Sparkles, RefreshCw } from "lucide-react";

const DEFAULT_SPINTAX_INPUT =
  "{Halo|Hai|Selamat Pagi} {Bpk/Ibu|Kak}, pesanan #{1001|1002|1003} sedang {diproses|dikemas}.";
const DEFAULT_SPINTAX_OUTPUT =
  "Halo Kak, pesanan #1001 sedang diproses.";

export function SpintaxSandbox() {
  const { t } = useI18n();
  const [spintaxInput, setSpintaxInput] = useState(DEFAULT_SPINTAX_INPUT);
  const [spintaxOutput, setSpintaxOutput] = useState(DEFAULT_SPINTAX_OUTPUT);

  const handleRandomizeSpintax = () => {
    setSpintaxOutput(parseSpintax(spintaxInput));
  };

  return (
    <div className="p-6 sm:p-8 rounded-lg border border-border bg-surface dark:bg-[#161715] space-y-6 shadow-sm">
      <div className="space-y-2 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
          <Sparkles className="size-3.5" />
          <span>{t("common.spintaxSection.badge")}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {t("common.spintaxSection.title")}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
          {t("common.spintaxSection.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor="spintax-template-input"
            className="text-xs font-bold text-foreground-muted uppercase tracking-wider block"
          >
            {t("common.spintaxSection.templateLabel")}
          </label>
          <textarea
            id="spintax-template-input"
            name="spintaxTemplate"
            aria-label={t("common.spintaxSection.templateLabel")}
            value={spintaxInput}
            onChange={(e) => setSpintaxInput(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-border bg-background p-4 text-xs font-mono font-medium text-foreground focus:border-wise-green focus:ring-1 focus:ring-wise-green outline-none"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label
              htmlFor="spintax-result-output"
              className="text-xs font-bold text-foreground-muted uppercase tracking-wider block"
            >
              {t("common.spintaxSection.resultLabel")}
            </label>
            <div
              id="spintax-result-output"
              aria-live="polite"
              className="rounded-md border border-border bg-background p-4 text-xs font-semibold text-foreground min-h-24 flex items-center"
            >
              &quot;{spintaxOutput}&quot;
            </div>
          </div>

          <Button
            variant="primaryPill"
            size="default"
            onClick={handleRandomizeSpintax}
            className="gap-2 font-bold text-xs self-start"
          >
            <RefreshCw className="size-3.5" />
            <span>{t("common.spintaxSection.randomizeBtn")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
