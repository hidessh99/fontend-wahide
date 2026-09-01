"use client";

import React from "react";
import { AuditLogsTable } from "@/services/admin/components/AuditLogsTable";
import { useI18n } from "@/lib/i18n/context";
import { ShieldCheck } from "lucide-react";

export function AdminLogsView() {
  const { t } = useI18n();
  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <div className="size-8 sm:size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="size-4 sm:size-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground">{t("admin.logsTitle")}</h1>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary">
            {t("admin.logsSubtitle")}
          </p>
        </div>
      </div>

      <AuditLogsTable />
    </div>
  );
}
