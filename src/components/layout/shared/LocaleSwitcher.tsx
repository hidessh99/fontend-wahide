"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Locale } from "@/lib/i18n/config";
import { Globe } from "lucide-react";

function useIsMounted() {
  const subscribe = useCallback(() => () => {}, []);
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  const isMounted = useIsMounted();

  const toggleLocale = () => {
    const nextLocale: Locale = locale === "id" ? "en" : "id";
    setLocale(nextLocale);
  };

  const currentLocale = isMounted ? locale : "id";

  return (
    <Button
      variant="secondaryPill"
      size="sm"
      onClick={toggleLocale}
      className="gap-1.5 text-xs font-bold uppercase tracking-wider"
      aria-label="Switch Language"
    >
      <Globe className="size-3.5 text-dark-green dark:text-wise-green" />
      <span>{currentLocale.toUpperCase()}</span>
    </Button>
  );
}
