"use client";

import React from "react";
import { DeviceList } from "@/services/whatsapp/components/DeviceList";
import { useI18n } from "@/lib/i18n/context";
import { Smartphone } from "lucide-react";

export function DevicesView() {
  const { t } = useI18n();

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Smartphone className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("whatsapp.title")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("whatsapp.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content Component */}
      <DeviceList />
    </div>
  );
}
