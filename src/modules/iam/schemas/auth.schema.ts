import { z } from "zod";
import { normalizePhoneNumber, isValidE164 } from "@/lib/phone";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  rememberMe: z.boolean().default(true),
  turnstileToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Canonical list of allowed email domains for registration.
 * Temporary email providers, disposable inboxes, and non-whitelisted domains are strictly rejected.
 */
export const ALLOWED_REGISTER_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "outlook.co.id",
  "hotmail.com",
  "live.com",
  "msn.com",
] as const;

export function isAllowedRegisterEmailDomain(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return false;
  }
  const domain = trimmed.slice(atIndex + 1);

  if ((ALLOWED_REGISTER_EMAIL_DOMAINS as readonly string[]).includes(domain)) {
    return true;
  }

  // Support international regional outlook domains (e.g. outlook.co.uk, outlook.fr, outlook.de)
  if (/^outlook\.[a-z]{2,3}(\.[a-z]{2})?$/.test(domain)) {
    return true;
  }

  // Support international regional hotmail domains (e.g. hotmail.co.id, hotmail.co.uk)
  if (/^hotmail\.[a-z]{2,3}(\.[a-z]{2})?$/.test(domain)) {
    return true;
  }

  return false;
}

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama bisnis / pengguna minimal 3 karakter")
      .max(60),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid")
      .refine((val) => isAllowedRegisterEmailDomain(val), {
        message:
          "Pendaftaran hanya menerima email resmi Gmail atau Outlook (@gmail.com, @outlook.com). Email sementara (temp-mail) tidak diizinkan.",
      }),
    phone: z
      .string()
      .transform((val) => normalizePhoneNumber(val))
      .refine((val) => isValidE164(val), {
        message:
          "Format nomor WhatsApp tidak valid (contoh: 081234567890 atau format internasional 6281234567890)",
      }),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "Anda wajib menyetujui Syarat dan Ketentuan layanan",
    }),
    turnstileToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  turnstileToken: z.string().optional(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token verifikasi wajib diisi"),
    password: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string(),
    turnstileToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Password lama minimal 6 karakter"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password baru tidak cocok",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
