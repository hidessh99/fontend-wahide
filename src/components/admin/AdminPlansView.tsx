"use client";

import React from "react";
import { PlansManagementTable } from "@/services/admin/components/PlansManagementTable";
import { CreditCard } from "lucide-react";

export function AdminPlansView() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <div className="size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <CreditCard className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">Kelola Paket &amp; Kuota</h1>
          <p className="text-xs font-semibold text-foreground-secondary">
            Pengaturan batasan tiering langganan platform Wahide SaaS.
          </p>
        </div>
      </div>

      <PlansManagementTable />
    </div>
  );
}
