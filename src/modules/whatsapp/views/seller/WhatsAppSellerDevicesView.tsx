"use client";

import React from "react";
import { DeviceList } from "@/modules/whatsapp/components/seller/DeviceList";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { Smartphone, RefreshCw } from "lucide-react";

export function WhatsAppSellerDevicesView() {
  const { t } = useI18n();
  const deviceState = useDevices();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="flex items-start justify-between gap-3 sm:block">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
                <Smartphone className="size-4 sm:size-5" />
              </div>
              <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                {t("whatsapp.title")}
              </h1>
            </div>
            <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
              {t("whatsapp.subtitle")}
            </p>
          </div>

          {/* Mobile-Only Header Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => deviceState.fetchDevices()}
            disabled={deviceState.isLoading}
            className="border-border/70 text-xs size-9 shrink-0 cursor-pointer rounded-full sm:hidden"
            title={t("whatsapp.refreshListBtn")}
            aria-label={t("whatsapp.refreshListBtn")}
          >
            <RefreshCw
              className={`size-3.5 ${deviceState.isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Desktop-Only Refresh Button */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => deviceState.fetchDevices()}
            disabled={deviceState.isLoading}
            className="border-border/70 text-xs h-9 cursor-pointer gap-1.5 rounded-full px-4"
          >
            <RefreshCw
              className={`size-3.5 ${deviceState.isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("common.refresh")}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Component with Error Boundary */}
      <ErrorBoundary>
        <DeviceList deviceState={deviceState} />
      </ErrorBoundary>
    </div>
  );
}

export default WhatsAppSellerDevicesView;
