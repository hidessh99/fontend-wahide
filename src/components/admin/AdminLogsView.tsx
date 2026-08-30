"use client";

import React from "react";
import { AuditLogsTable } from "@/services/admin/components/AuditLogsTable";
import { ShieldCheck } from "lucide-react";

export function AdminLogsView() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <div className="size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">Audit &amp; Keamanan Sistem</h1>
          <p className="text-xs font-semibold text-foreground-secondary">
            Inspeksi log autentikasi, akses API, dan audit trail operasional server.
          </p>
        </div>
      </div>

      <AuditLogsTable />
    </div>
  );
}
