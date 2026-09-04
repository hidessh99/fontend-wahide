"use client";

import React from "react";
import { TenantBalance } from "@/modules/finance/types/finance.types";
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
    <div className="border-border bg-surface flex flex-col justify-between gap-6 rounded-xl border p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
      <div className="flex items-center gap-4">
        <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-14 shrink-0 items-center justify-center rounded-full">
          <Wallet className="size-7" />
        </div>
        <div className="space-y-1">
          <span className="text-foreground-muted block text-xs font-bold tracking-wider uppercase">
            {t("billing.depositBalanceTitle")}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
              Rp {(balance?.amount || 0).toLocaleString("id-ID")}
            </span>
            <span className="text-dark-green dark:text-wise-green text-xs font-semibold">IDR</span>
          </div>
          <p className="text-foreground-secondary text-[11px] font-semibold">
            {t("billing.depositBalanceDesc")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="primaryPill"
          onClick={onOpenTopUp}
          className="gap-2 px-6 py-2.5 text-xs font-bold shadow-sm"
        >
          <Plus className="size-4" />
          <span>{t("billing.topUpBalance")}</span>
          <ArrowUpRight className="size-3.5 opacity-70" />
        </Button>
      </div>
    </div>
  );
}
