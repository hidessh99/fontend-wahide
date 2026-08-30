"use client";

import React from "react";
import { TenantBalance } from "../types/finance.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Wallet, Plus, ArrowUpRight } from "lucide-react";

interface BalanceCardProps {
  balance: TenantBalance | null;
  onOpenTopUp: () => void;
}

export function BalanceCard({ balance, onOpenTopUp }: BalanceCardProps) {
  const { t } = useI18n();

  return (
    <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
          <Wallet className="size-7" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted block">
            {t("billing.depositBalanceTitle")}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Rp {(balance?.amount || 0).toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-semibold text-wise-green">IDR</span>
          </div>
          <p className="text-[11px] font-semibold text-foreground-secondary">
            {t("billing.depositBalanceDesc")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="primaryPill"
          onClick={onOpenTopUp}
          className="gap-2 text-xs font-bold shadow-sm px-6 py-2.5"
        >
          <Plus className="size-4" />
          <span>{t("billing.topUpBalance")}</span>
          <ArrowUpRight className="size-3.5 opacity-70" />
        </Button>
      </div>
    </div>
  );
}
