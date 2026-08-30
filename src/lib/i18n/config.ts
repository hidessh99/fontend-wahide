export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "id";

export const LOCALE_LABELS: Record<Locale, { label: string; code: string }> = {
  id: { label: "Bahasa Indonesia", code: "ID" },
  en: { label: "English", code: "EN" },
};
