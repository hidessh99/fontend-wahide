"use client";

import React from "react";
import { UserAddressForm } from "@/modules/iam/components/address/UserAddressForm";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { MapPin } from "lucide-react";

export function AddressView() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
              <MapPin className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("address.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("address.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content Form */}
      <ErrorBoundary>
        <UserAddressForm />
      </ErrorBoundary>
    </div>
  );
}
