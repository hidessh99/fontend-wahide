import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Wahide"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().default("http://localhost:3030/api/v1"),
  NEXT_PUBLIC_IAM_API_URL: z.string().default("http://localhost:3030/api/v1"),
  NEXT_PUBLIC_WHATSAPP_API_URL: z.string().default("http://localhost:3030/api/v1"),
  NEXT_PUBLIC_CAMPAIGN_API_URL: z.string().default("http://localhost:3030/api/v1"),
  NEXT_PUBLIC_FINANCE_API_URL: z.string().default("http://localhost:3030/api/v1"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default("0x4AAAAAADOgaNLRGt1f6A6-"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_IAM_API_URL: process.env.NEXT_PUBLIC_IAM_API_URL,
  NEXT_PUBLIC_WHATSAPP_API_URL: process.env.NEXT_PUBLIC_WHATSAPP_API_URL,
  NEXT_PUBLIC_CAMPAIGN_API_URL: process.env.NEXT_PUBLIC_CAMPAIGN_API_URL,
  NEXT_PUBLIC_FINANCE_API_URL: process.env.NEXT_PUBLIC_FINANCE_API_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
});
