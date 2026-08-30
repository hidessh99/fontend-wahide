"use client";

import React, { useCallback } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Locale, DEFAULT_LOCALE } from "./config";

// Preload dictionaries synchronously to avoid flicker and network delay
import idCommon from "@/locales/id/common.json";
import idAuth from "@/locales/id/auth.json";
import idWhatsapp from "@/locales/id/whatsapp.json";
import idCampaign from "@/locales/id/campaign.json";
import idBilling from "@/locales/id/billing.json";
import idSupport from "@/locales/id/support.json";

import enCommon from "@/locales/en/common.json";
import enAuth from "@/locales/en/auth.json";
import enWhatsapp from "@/locales/en/whatsapp.json";
import enCampaign from "@/locales/en/campaign.json";
import enBilling from "@/locales/en/billing.json";
import enSupport from "@/locales/en/support.json";

const dictionaries: Record<Locale, Record<string, unknown>> = {
  id: {
    common: idCommon,
    auth: idAuth,
    whatsapp: idWhatsapp,
    campaign: idCampaign,
    billing: idBilling,
    support: idSupport,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    whatsapp: enWhatsapp,
    campaign: enCampaign,
    billing: enBilling,
    support: enSupport,
  },
};

interface I18nStoreState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nStoreState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale: Locale) => {
        if (typeof document !== "undefined") {
          try {
            document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
          } catch {
            // Ignore cookie errors
          }
        }
        set({ locale });
      },
    }),
    {
      name: "wahide_locale_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useI18n() {
  const { locale, setLocale } = useI18nStore();

  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const parts = path.split(".");
      const currentDict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];

      let result: unknown = currentDict;
      for (const part of parts) {
        if (result && typeof result === "object" && part in result) {
          result = (result as Record<string, unknown>)[part];
        } else {
          result = undefined;
          break;
        }
      }

      if (typeof result !== "string") {
        // Fallback to Indonesian (id)
        let fallbackResult: unknown = dictionaries.id;
        for (const part of parts) {
          if (fallbackResult && typeof fallbackResult === "object" && part in fallbackResult) {
            fallbackResult = (fallbackResult as Record<string, unknown>)[part];
          } else {
            fallbackResult = undefined;
            break;
          }
        }
        if (typeof fallbackResult === "string") {
          result = fallbackResult;
        } else {
          return path;
        }
      }

      let text = result as string;
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          text = text.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
        });
      }

      return text;
    },
    [locale]
  );

  return { locale, setLocale, t };
}

export const useTranslation = useI18n;

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
