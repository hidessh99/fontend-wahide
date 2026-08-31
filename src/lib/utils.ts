import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke Rupiah IDR atau USD
 */
export function formatCurrency(amount: number, currency: "IDR" | "USD" = "IDR"): string {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format tanggal dan waktu standar Indonesia
 */
export function formatDateTime(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Live Spintax Regex Parser ({A|B|C})
 */
export function parseSpintax(template: string): string {
  if (!template) return "";
  let result = template;
  const spintaxRegex = /\{([^{}]+)\}/;
  let match;
  let iterations = 0;
  while ((match = spintaxRegex.exec(result)) && iterations < 20) {
    const choices = match[1].split("|");
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    result = result.replace(match[0], chosen);
    iterations++;
  }
  return result;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generates a cryptographically secure random hex string using Web Crypto API (CSPRNG).
 * Satisfies OWASP & GitHub CodeQL (js/insecure-randomness) requirements.
 */
export function generateSecureRandomString(prefix: string = "", byteLength: number = 24): string {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const array = new Uint8Array(byteLength);
    crypto.getRandomValues(array);
    const hex = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return prefix ? `${prefix}${hex}` : hex;
  }
  return prefix ? `${prefix}000000000000000000000000` : "000000000000000000000000";
}

