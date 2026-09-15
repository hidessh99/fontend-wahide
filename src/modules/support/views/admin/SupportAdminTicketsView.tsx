"use client";

import React from "react";
import { TicketList } from "@/modules/support/components/seller/TicketList";
import { useSupport } from "@/modules/support/hooks/useSupport";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { LifeBuoy, RefreshCw } from "lucide-react";

export function SupportAdminTicketsView() {
  const { t } = useI18n();
  const supportState = useSupport();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="flex items-start justify-between gap-3 sm:block">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
                <LifeBuoy className="size-4 sm:size-5" />
              </div>
              <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                {t("support.title")} (Admin Helpdesk)
              </h1>
            </div>
            <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
              {t("support.subtitle")}
            </p>
          </div>

          {/* Mobile-Only Header Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => supportState.fetchTickets()}
            disabled={supportState.isLoading}
            className="border-border/70 text-xs size-9 shrink-0 cursor-pointer rounded-full sm:hidden"
            title={t("support.refreshAria")}
            aria-label={t("support.refreshAria")}
          >
            <RefreshCw
              className={`size-3.5 ${supportState.isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Desktop-Only Refresh Button */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => supportState.fetchTickets()}
            disabled={supportState.isLoading}
            className="border-border/70 text-xs h-9 cursor-pointer gap-1.5 rounded-full px-4"
          >
            <RefreshCw
              className={`size-3.5 ${supportState.isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("common.refresh")}</span>
          </Button>
        </div>
      </div>

      {/* Main Ticket List Component with Error Boundary */}
      <ErrorBoundary>
        <TicketList supportState={supportState} />
      </ErrorBoundary>
    </div>
  );
}

export default SupportAdminTicketsView;
