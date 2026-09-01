"use client";

import React from "react";
import { DeviceList } from "@/services/whatsapp/components/devices/DeviceList";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { Smartphone } from "lucide-react";

export function DevicesView() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
              <Smartphone className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {t("whatsapp.title")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("whatsapp.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content Component with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Node Sesi WhatsApp">
        <DeviceList />
      </ErrorBoundary>
    </div>
  );
}
