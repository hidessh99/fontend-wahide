"use client";

import React from "react";
import { useAdmin } from "@/services/admin/hooks/useAdmin";
import { GlobalMetricsGrid } from "@/services/admin/components/overview/GlobalMetricsGrid";
import { useI18n } from "@/lib/i18n/context";
import { ShieldAlert } from "lucide-react";

export function AdminOverviewView() {
  const { t } = useI18n();
  const { metrics } = useAdmin();

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("admin.title")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("admin.subtitle")}
          </p>
        </div>
      </div>

      {/* Global Metrics Grid */}
      <GlobalMetricsGrid metrics={metrics} />
    </div>
  );
}
