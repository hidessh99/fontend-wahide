"use client";

import React, { createContext, useCallback } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Locale, DEFAULT_LOCALE } from "./config";

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

function resolvePath(dict: Record<string, unknown>, parts: string[]): string | undefined {
  let result: unknown = dict;
  for (const part of parts) {
    if (result && typeof result === "object" && part in result) {
      result = (result as Record<string, unknown>)[part];
    } else {
      result = undefined;
      break;
    }
  }
  if (typeof result === "string") return result;

  // Check in 'common' namespace if not found at root
  if (dict.common && typeof dict.common === "object") {
    let commonResult: unknown = dict.common;
    for (const part of parts) {
      if (commonResult && typeof commonResult === "object" && part in commonResult) {
        commonResult = (commonResult as Record<string, unknown>)[part];
      } else {
        commonResult = undefined;
        break;
      }
    }
    if (typeof commonResult === "string") return commonResult;
  }

  return undefined;
}

export function useI18n() {
  const { locale, setLocale } = useI18nStore();

  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const parts = path.split(".");
      const currentDict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];

      let text = resolvePath(currentDict, parts);

      // Fallback to Indonesian (id)
      if (!text && locale !== "id") {
        text = resolvePath(dictionaries.id, parts);
      }

      if (!text) {
        return path;
      }

      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          text = text?.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
        });
      }

      return text;
    },
    [locale]
  );

  return {
    locale,
    setLocale,
    t,
  };
}

const I18nContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useI18nStore();
  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
