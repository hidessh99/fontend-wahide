"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
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

const localeListeners = new Set<() => void>();

function subscribeLocale(callback: () => void) {
  localeListeners.add(callback);
  return () => {
    localeListeners.delete(callback);
  };
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = localStorage.getItem("wahide_locale") as Locale;
    if (saved === "id" || saved === "en") return saved;
  } catch {
    return DEFAULT_LOCALE;
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, getStoredLocale, () => DEFAULT_LOCALE);

  const setLocale = (newLocale: Locale) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("wahide_locale", newLocale);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // Abaikan storage error di mode private
      }
      localeListeners.forEach((listener) => listener());
    }
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const parts = path.split(".");
    const currentDict = dictionaries[locale] as Record<string, unknown>;

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
