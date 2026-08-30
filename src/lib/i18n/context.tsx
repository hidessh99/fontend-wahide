"use client";

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from "react";
import { Locale, DEFAULT_LOCALE } from "./config";

// Preload dictionaries synchronously to avoid flicker and latency
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

const dictionaries = {
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

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function useIsClient() {
  const subscribe = React.useCallback(() => () => {}, []);
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("wahide_locale") as Locale;
      if (savedLocale === "id" || savedLocale === "en") {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("wahide_locale", newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const parts = path.split(".");
    const currentDict = dictionaries[isClient ? locale : DEFAULT_LOCALE] as Record<string, unknown>;

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
      // Fallback ke ID jika tidak ditemukan
      let fallbackResult: unknown = dictionaries.id as Record<string, unknown>;
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
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export const useTranslation = useI18n;
