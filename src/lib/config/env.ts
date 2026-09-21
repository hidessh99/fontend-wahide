import { z } from "zod";

const envSchema = z
  .object({
    NEXT_PUBLIC_APP_NAME: z.string().optional().default("Wahide"),
    NEXT_PUBLIC_APP_URL: z
      .string()
      .optional()
      .transform((val) =>
        val && val.trim() !== "" ? val : "https://wa.hidessh.com",
      ),
    NEXT_PUBLIC_API_BASE_URL: z
      .string()
      .optional()
      .transform((val) =>
        val && val.trim() !== "" ? val : "https://api-wa.hidessh.com/api/v1",
      ),
    NEXT_PUBLIC_IAM_API_URL: z.string().optional(),
    NEXT_PUBLIC_WHATSAPP_API_URL: z.string().optional(),
    NEXT_PUBLIC_CAMPAIGN_API_URL: z.string().optional(),
    NEXT_PUBLIC_FINANCE_API_URL: z.string().optional(),
    NEXT_PUBLIC_TEMPLATE_API_URL: z.string().optional(),
    NEXT_PUBLIC_REMINDER_API_URL: z.string().optional(),
    NEXT_PUBLIC_RESERVATION_API_URL: z.string().optional(),
    NEXT_PUBLIC_FORM_API_URL: z.string().optional(),
    NEXT_PUBLIC_WS_GATEWAY_URL: z.string().optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z
      .string()
      .optional()
      .transform((val) => {
        // Di mode production build, hindari kebocoran dummy testing key Cloudflare (1x000000...)
        if (
          process.env.NODE_ENV === "production" &&
          val &&
          val.startsWith("1x000000")
        ) {
          return "0x4AAAAAADOgaNLRGt1f6A6-";
        }
        return val && val.trim() !== "" ? val : "0x4AAAAAADOgaNLRGt1f6A6-";
      })
      .default("0x4AAAAAADOgaNLRGt1f6A6-"),
  })
  .transform((data) => {
    const baseApi = data.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "");
    return {
      ...data,
      NEXT_PUBLIC_IAM_API_URL: data.NEXT_PUBLIC_IAM_API_URL || baseApi,
      NEXT_PUBLIC_WHATSAPP_API_URL:
        data.NEXT_PUBLIC_WHATSAPP_API_URL || baseApi,
      NEXT_PUBLIC_CAMPAIGN_API_URL:
        data.NEXT_PUBLIC_CAMPAIGN_API_URL || baseApi,
      NEXT_PUBLIC_FINANCE_API_URL: data.NEXT_PUBLIC_FINANCE_API_URL || baseApi,
      NEXT_PUBLIC_TEMPLATE_API_URL:
        data.NEXT_PUBLIC_TEMPLATE_API_URL || baseApi,
      NEXT_PUBLIC_REMINDER_API_URL:
        data.NEXT_PUBLIC_REMINDER_API_URL || baseApi,
      NEXT_PUBLIC_RESERVATION_API_URL:
        data.NEXT_PUBLIC_RESERVATION_API_URL || baseApi,
      NEXT_PUBLIC_FORM_API_URL: data.NEXT_PUBLIC_FORM_API_URL || baseApi,
      NEXT_PUBLIC_WS_GATEWAY_URL:
        data.NEXT_PUBLIC_WS_GATEWAY_URL ||
        baseApi.replace(/^http/i, "ws").replace(/\/api\/v1\/?$/, "/ws"),
    };
  });

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_IAM_API_URL: process.env.NEXT_PUBLIC_IAM_API_URL,
  NEXT_PUBLIC_WHATSAPP_API_URL: process.env.NEXT_PUBLIC_WHATSAPP_API_URL,
  NEXT_PUBLIC_CAMPAIGN_API_URL: process.env.NEXT_PUBLIC_CAMPAIGN_API_URL,
  NEXT_PUBLIC_FINANCE_API_URL: process.env.NEXT_PUBLIC_FINANCE_API_URL,
  NEXT_PUBLIC_TEMPLATE_API_URL: process.env.NEXT_PUBLIC_TEMPLATE_API_URL,
  NEXT_PUBLIC_REMINDER_API_URL: process.env.NEXT_PUBLIC_REMINDER_API_URL,
  NEXT_PUBLIC_RESERVATION_API_URL: process.env.NEXT_PUBLIC_RESERVATION_API_URL,
  NEXT_PUBLIC_FORM_API_URL: process.env.NEXT_PUBLIC_FORM_API_URL,
  NEXT_PUBLIC_WS_GATEWAY_URL: process.env.NEXT_PUBLIC_WS_GATEWAY_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
});
