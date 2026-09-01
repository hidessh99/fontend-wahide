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
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] p-10 text-center space-y-4 shadow-xs">
        <div className="size-10 rounded-full bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green flex items-center justify-center mx-auto animate-spin">
          <Loader2 className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-foreground">
            {t("address.title") || "Memuat Data Alamat & Wilayah"}
          </h3>
          <p className="text-xs text-foreground-secondary">
            {t("address.subtitle") || "Mengambil data referensi wilayah Indonesia dan profil alamat Anda..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contextual Notice when redirected from Billing / TopUp */}
      {from === "billing" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs animate-in fade-in duration-200">
          <div className="size-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="size-4" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xs sm:text-sm text-foreground">
              {t("address.billingRequiredBannerTitle")}
            </h3>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              {t("address.billingRequiredBannerDesc")}
            </p>
          </div>
        </div>
      )}

      {/* Header Info Status Card */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-full bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  {t("address.title")}
                </h2>
                {savedAddress?.address ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-3" />
                    <span>{t("address.statusRegistered")}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Info className="size-3" />
                    <span>{t("address.statusNotSet")}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed max-w-2xl">
                {t("address.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Address Form Container */}
      <form
        onSubmit={onFormSubmit}
        className="rounded-xl border border-border bg-surface dark:bg-[#161715] p-5 sm:p-8 shadow-xs space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Country / Negara */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground-secondary">
              {t("address.countryLabel")}
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={formState.country}
                disabled
                readOnly
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 dark:bg-[#10110e] text-foreground font-semibold border border-border/70 outline-none text-xs sm:text-sm cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* 2. State / Provinsi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground-secondary">
              {t("address.provinceLabel")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <select
                value={formState.state}
                onChange={(e) => handleProvinceChange(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-8 rounded-xl bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-1 focus:ring-wise-green outline-none transition text-xs sm:text-sm appearance-none cursor-pointer"
              >
                <option value="">{t("address.provincePlaceholder")}</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.name}>
                    {prov.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-muted text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 3. City / Kota / Kabupaten */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground-secondary">
                {t("address.cityLabel")} <span className="text-rose-500">*</span>
              </label>
              {isLoadingCities && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-wise-green">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Memuat...</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <select
                value={formState.city}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={!formState.state || isLoadingCities}
                required
                className="w-full h-11 pl-10 pr-8 rounded-xl bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-1 focus:ring-wise-green outline-none transition text-xs sm:text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-muted text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 4. District / Kecamatan (UI Helper) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground-secondary">
                {t("address.districtLabel")}
              </label>
              {isLoadingDistricts && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-wise-green">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Memuat...</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <select
                value={formState.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!formState.city || isLoadingDistricts}
                className="w-full h-11 pl-10 pr-8 rounded-xl bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-1 focus:ring-wise-green outline-none transition text-xs sm:text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-muted text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 5. Postal Code / Kode Pos */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground-secondary">
              {t("address.postalCodeLabel")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={formState.postal_code}
                onChange={(e) => handleFieldChange("postal_code", e.target.value)}
                placeholder={t("address.postalCodePlaceholder")}
                maxLength={10}
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-1 focus:ring-wise-green outline-none transition text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* 6. Street Address / Alamat Lengkap */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground-secondary">
            {t("address.streetAddressLabel")} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={formState.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder={t("address.streetAddressPlaceholder")}
              required
              className="w-full p-3.5 rounded-xl bg-surface dark:bg-[#10110e] text-foreground font-medium border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-1 focus:ring-wise-green outline-none transition text-xs sm:text-sm leading-relaxed"
            />
          </div>
          <p className="text-[11px] text-foreground-muted">
            {t("address.streetAddressHelp")}
          </p>
        </div>

        {/* Footer Security Notice & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>{t("address.securityNote")}</span>
          </div>

          <div className="flex items-center gap-3">
            {from === "billing" && (
              <Button
                type="button"
                variant="outlinePill"
                size="lg"
                onClick={() => router.push("/billing")}
                className="gap-1.5 text-xs font-bold cursor-pointer"
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
              className="w-full sm:w-auto min-w-44 gap-2 font-bold shadow-sm cursor-pointer"
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
