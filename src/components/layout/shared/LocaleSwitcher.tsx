"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, ChevronDown } from "lucide-react";

function useIsMounted() {
  const subscribe = useCallback(() => () => {}, []);
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const isMounted = useIsMounted();
  const currentLocale = isMounted ? locale : "id";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-surface hover:border-border border-border flex cursor-pointer items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition outline-none dark:hover:bg-[#161715]"
        aria-label="Pilih Bahasa / Select Language"
      >
        <Globe className="text-dark-green dark:text-wise-green size-3.5" />
        <span>{currentLocale.toUpperCase()}</span>
        <ChevronDown className="text-foreground-muted size-3" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6} className="w-52 p-1.5 shadow-xl">
        <DropdownMenuItem
          onClick={() => setLocale("id")}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🇮🇩</span>
            <span className={currentLocale === "id" ? "text-foreground font-bold" : "text-foreground-secondary"}>
              {t("common.langIndonesian")}
            </span>
            <span className="text-foreground-muted text-[10px] font-bold">ID</span>
          </div>
          {currentLocale === "id" && (
            <Check className="text-dark-green dark:text-wise-green stroke-2.5 size-3.5" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🇬🇧</span>
            <span className={currentLocale === "en" ? "text-foreground font-bold" : "text-foreground-secondary"}>
              {t("common.langEnglish")}
            </span>
            <span className="text-foreground-muted text-[10px] font-bold">EN</span>
          </div>
          {currentLocale === "en" && (
            <Check className="text-dark-green dark:text-wise-green stroke-2.5 size-3.5" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
