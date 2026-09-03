"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserAddress } from "../../hooks/useUserAddress";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  MapPin,
  Building,
  Navigation,
  Globe,
  Mail,
  Loader2,
  Save,
  CheckCircle2,
  ShieldCheck,
  Info,
  ArrowLeft,
} from "lucide-react";

export function UserAddressForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const from = searchParams.get("from");
  const action = searchParams.get("action");

  const {
    provinces,
    cities,
    districts,
    formState,
    savedAddress,
    isLoadingInitial,
    isLoadingCities,
    isLoadingDistricts,
    isSaving,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleFieldChange,
    handleSubmit,
  } = useUserAddress();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && from === "billing") {
      toast.success(
        t("address.saveAndReturnToast") ||
          "Alamat berhasil disimpan! Mengalihkan ke transaksi Top-Up..."
      );
      setTimeout(() => {
        router.push(`/billing${action ? `?action=${action}` : ""}`);
      }, 500);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="border-border bg-surface space-y-4 rounded-xl border p-10 text-center shadow-xs dark:bg-[#161715]">
        <div className="dark:bg-wise-green/15 dark:text-wise-green mx-auto flex size-10 animate-spin items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
          <Loader2 className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-foreground text-sm font-bold">
            {t("address.title") || "Memuat Data Alamat & Wilayah"}
          </h3>
          <p className="text-foreground-secondary text-xs">
            {t("address.subtitle") ||
              "Mengambil data referensi wilayah Indonesia dan profil alamat Anda..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contextual Notice when redirected from Billing / TopUp */}
      {from === "billing" && (
        <div className="animate-in fade-in flex items-start gap-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-xs duration-200 sm:p-5 dark:bg-amber-500/5">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Info className="size-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-foreground text-xs font-bold sm:text-sm">
              {t("address.billingRequiredBannerTitle")}
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed">
              {t("address.billingRequiredBannerDesc")}
            </p>
          </div>
        </div>
      )}

      {/* Header Info Status Card */}
      <div className="border-border bg-surface rounded-xl border p-5 shadow-xs sm:p-6 dark:bg-[#161715]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <MapPin className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-foreground text-base font-bold sm:text-lg">
                  {t("address.title")}
                </h2>
                {savedAddress?.address ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    <span>{t("address.statusRegistered")}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                    <Info className="size-3" />
                    <span>{t("address.statusNotSet")}</span>
                  </span>
                )}
              </div>
              <p className="text-foreground-secondary max-w-2xl text-xs leading-relaxed">
                {t("address.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Address Form Container */}
      <form
        onSubmit={onFormSubmit}
        className="border-border bg-surface space-y-6 rounded-xl border p-5 shadow-xs sm:p-8 dark:bg-[#161715]"
      >
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
          {/* 1. Country / Negara */}
          <div className="space-y-2">
            <label className="text-foreground-secondary block text-xs font-bold tracking-wider uppercase">
              {t("address.countryLabel")}
            </label>
            <div className="relative">
              <Globe className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={formState.country}
                disabled
                readOnly
                className="bg-muted/50 text-foreground border-border/70 h-11 w-full cursor-not-allowed rounded-xl border pr-4 pl-10 text-xs font-semibold outline-none select-none sm:text-sm dark:bg-[#10110e]"
              />
            </div>
          </div>

          {/* 2. State / Provinsi */}
          <div className="space-y-2">
            <label className="text-foreground-secondary block text-xs font-bold tracking-wider uppercase">
              {t("address.provinceLabel")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <select
                value={formState.state}
                onChange={(e) => handleProvinceChange(e.target.value)}
                required
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full cursor-pointer appearance-none rounded-xl border pr-8 pl-10 text-xs font-semibold transition outline-none focus:ring-1 sm:text-sm dark:bg-[#10110e]"
              >
                <option value="">{t("address.provincePlaceholder")}</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.name}>
                    {prov.name}
                  </option>
                ))}
              </select>
              <div className="text-foreground-muted pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 3. City / Kota / Kabupaten */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground-secondary block text-xs font-bold tracking-wider uppercase">
                {t("address.cityLabel")} <span className="text-rose-500">*</span>
              </label>
              {isLoadingCities && (
                <span className="dark:text-wise-green inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Memuat...</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Navigation className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <select
                value={formState.city}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={!formState.state || isLoadingCities}
                required
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full cursor-pointer appearance-none rounded-xl border pr-8 pl-10 text-xs font-semibold transition outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:bg-[#10110e]"
              >
                <option value="">
                  {!formState.state
                    ? "Pilih provinsi terlebih dahulu"
                    : isLoadingCities
                      ? "Memuat kota..."
                      : t("address.cityPlaceholder")}
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <div className="text-foreground-muted pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 4. District / Kecamatan (UI Helper) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground-secondary block text-xs font-bold tracking-wider uppercase">
                {t("address.districtLabel")}
              </label>
              {isLoadingDistricts && (
                <span className="dark:text-wise-green inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Memuat...</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Building className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <select
                value={formState.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!formState.city || isLoadingDistricts}
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full cursor-pointer appearance-none rounded-xl border pr-8 pl-10 text-xs font-semibold transition outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:bg-[#10110e]"
              >
                <option value="">
                  {!formState.city
                    ? "Pilih kota terlebih dahulu"
                    : isLoadingDistricts
                      ? "Memuat kecamatan..."
                      : t("address.districtPlaceholder")}
                </option>
                {districts.map((dist) => (
                  <option key={dist.id} value={dist.name}>
                    {dist.name}
                  </option>
                ))}
              </select>
              <div className="text-foreground-muted pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 5. Postal Code / Kode Pos */}
          <div className="space-y-2">
            <label className="text-foreground-secondary block text-xs font-bold tracking-wider uppercase">
              {t("address.postalCodeLabel")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={formState.postal_code}
                onChange={(e) => handleFieldChange("postal_code", e.target.value)}
                placeholder={t("address.postalCodePlaceholder")}
                maxLength={10}
                required
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-xl border pr-4 pl-10 text-xs font-semibold transition outline-none focus:ring-1 sm:text-sm dark:bg-[#10110e]"
              />
            </div>
          </div>
        </div>

        {/* 6. Street Address / Alamat Lengkap */}
        <div className="space-y-2 pt-1">
          <label className="text-foreground-secondary block text-xs font-bold tracking-wider uppercase">
            {t("address.streetAddressLabel")} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={formState.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder={t("address.streetAddressPlaceholder")}
              required
              className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green w-full rounded-xl border p-3.5 text-xs leading-relaxed font-medium transition outline-none focus:ring-1 sm:text-sm dark:bg-[#10110e]"
            />
          </div>
          <p className="text-foreground-muted text-[11px]">{t("address.streetAddressHelp")}</p>
        </div>

        {/* Footer Security Notice & Action Button */}
        <div className="border-border/60 flex flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
          <div className="text-foreground-muted flex items-center gap-2 text-xs">
            <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
            <span>{t("address.securityNote")}</span>
          </div>

          <div className="flex items-center gap-3">
            {from === "billing" && (
              <Button
                type="button"
                variant="outlinePill"
                size="lg"
                onClick={() => router.push("/billing")}
                className="cursor-pointer gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="size-4" />
                <span>Batal & Kembali ke Tagihan</span>
              </Button>
            )}
            <Button
              type="submit"
              variant="primaryPill"
              size="lg"
              disabled={isSaving}
              className="w-full min-w-44 cursor-pointer gap-2 font-bold shadow-sm sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{t("address.saving")}</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>{t("address.saveBtn")}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
