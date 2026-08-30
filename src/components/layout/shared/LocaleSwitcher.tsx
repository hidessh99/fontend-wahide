"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { LOCALE_LABELS, Locale } from "@/lib/i18n/config";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    const nextLocale: Locale = locale === "id" ? "en" : "id";
    setLocale(nextLocale);
  };

  return (
    <Button
      variant="secondaryPill"
      size="sm"
      onClick={toggleLocale}
      className="gap-1.5 text-xs font-bold uppercase"
      aria-label="Ganti Bahasa / Switch Language"
    >
      <Globe className="size-3.5 text-[#163300] dark:text-[#9fe870]" />
      <span>{locale.toUpperCase()}</span>
      <span className="text-xs">{LOCALE_LABELS[locale].flag}</span>
    </Button>
  );
}
