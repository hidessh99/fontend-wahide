"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseSpintax } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { Sparkles, RefreshCw } from "lucide-react";

const DEFAULT_SPINTAX_INPUT =
  "{Halo|Hai|Selamat Pagi} {Bpk/Ibu|Kak}, pesanan #{1001|1002|1003} sedang {diproses|dikemas}.";
const DEFAULT_SPINTAX_OUTPUT = "Halo Kak, pesanan #1001 sedang diproses.";

export function SpintaxSandbox() {
  const { t } = useI18n();
  const [spintaxInput, setSpintaxInput] = useState(DEFAULT_SPINTAX_INPUT);
  const [spintaxOutput, setSpintaxOutput] = useState(DEFAULT_SPINTAX_OUTPUT);

  const handleRandomizeSpintax = () => {
    setSpintaxOutput(parseSpintax(spintaxInput));
  };

  return (
    <div className="border-border bg-surface space-y-6 rounded-lg border p-6 shadow-sm sm:p-8 dark:bg-[#161715]">
      <div className="max-w-xl space-y-2">
        <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
          <Sparkles className="size-3.5" />
          <span>{t("common.spintaxSection.badge")}</span>
        </div>
        <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
          {t("common.spintaxSection.title")}
        </h2>
        <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
          {t("common.spintaxSection.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="spintax-template-input"
            className="text-foreground-muted block text-xs font-bold tracking-wider uppercase"
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
            className="border-border bg-background text-foreground focus:border-wise-green focus:ring-wise-green w-full rounded-md border p-4 font-mono text-xs font-medium outline-none focus:ring-1"
          />
        </div>

        <div className="flex flex-col justify-between space-y-2">
          <div className="space-y-2">
            <label
              htmlFor="spintax-result-output"
              className="text-foreground-muted block text-xs font-bold tracking-wider uppercase"
            >
              {t("common.spintaxSection.resultLabel")}
            </label>
            <div
              id="spintax-result-output"
              aria-live="polite"
              className="border-border bg-background text-foreground flex min-h-24 items-center rounded-md border p-4 text-xs font-semibold"
            >
              &quot;{spintaxOutput}&quot;
            </div>
          </div>

          <Button
            variant="primaryPill"
            size="default"
            onClick={handleRandomizeSpintax}
            className="gap-2 self-start text-xs font-bold"
          >
            <RefreshCw className="size-3.5" />
            <span>{t("common.spintaxSection.randomizeBtn")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
