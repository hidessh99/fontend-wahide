"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

interface AuthBannerProps {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  scaleTag?: string;
}

export function AuthBanner({ badgeText, headline, subheadline, scaleTag }: AuthBannerProps) {
  const { t } = useI18n();
  const pathname = usePathname();

  const isRegister = pathname?.includes("register");
  const isForgotPassword = pathname?.includes("forgot-password");

  const defaultBadge = isRegister
    ? t("auth.banner.register.badge")
    : isForgotPassword
      ? t("auth.banner.forgotPassword.badge")
      : t("auth.banner.login.badge");

  const defaultHeadline = isRegister
    ? t("auth.banner.register.headline")
    : isForgotPassword
      ? t("auth.banner.forgotPassword.headline")
      : t("auth.banner.login.headline");

  const defaultSubheadline = isRegister
    ? t("auth.banner.register.subheadline")
    : isForgotPassword
      ? t("auth.banner.forgotPassword.subheadline")
      : t("auth.banner.login.subheadline");

  const defaultScaleTag = isRegister
    ? t("auth.banner.register.scaleTag")
    : isForgotPassword
      ? t("auth.banner.forgotPassword.scaleTag")
      : t("auth.banner.login.scaleTag");

  const displayBadge = badgeText || defaultBadge;
  const displayHeadline = headline || defaultHeadline;
  const displaySubheadline = subheadline || defaultSubheadline;
  const displayScaleTag = scaleTag || defaultScaleTag;

  return (
    <div className="bg-near-black text-foreground relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
      {/* Subtle Green Glow Ring */}
      <div className="bg-wise-green/20 pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-wise-green/10 pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl" />

      <div className="z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-wise-green h-4 w-4 animate-pulse rounded-full" />
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Wahide<span className="text-wise-green">.</span>
          </span>
        </Link>
        <span className="rounded-full border border-white/10 bg-[#1b1d1a] px-3 py-1 text-xs font-semibold tracking-widest text-[#868685] uppercase">
          {displayBadge}
        </span>
      </div>

      <div className="z-10 my-auto max-w-lg space-y-6">
        <div className="text-wise-green inline-flex items-center gap-2 rounded-full bg-[rgba(159,232,112,0.15)] px-4 py-1.5 text-xs font-bold">
          <span className="bg-wise-green size-1.5 rounded-full" />
          <span>{displayScaleTag}</span>
        </div>
        <h1 className="text-5xl leading-[0.95] font-black tracking-tight text-white">
          {displayHeadline}
        </h1>
        <p className="text-lg leading-relaxed font-semibold text-[#c2c5be]">{displaySubheadline}</p>
      </div>

      <div className="z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs font-semibold text-[#868685]">
        <span>
          &copy; {new Date().getFullYear()} {t("auth.banner.rightsNote")}
        </span>
        <span>{t("auth.banner.antiBanNote")}</span>
      </div>
    </div>
  );
}
