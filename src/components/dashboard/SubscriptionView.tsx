"use client";

import React from "react";
import { useSubscription } from "@/services/subscription/hooks/useSubscription";
import { PlanCardGrid } from "@/services/subscription/components/PlanCardGrid";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { CreditCard } from "lucide-react";

export function SubscriptionView() {
  const { t } = useI18n();
  const { subscription, plans, upgradePlan } = useSubscription();

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <CreditCard className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("subscription.title")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("subscription.subtitle")}
          </p>
        </div>
      </div>

      {/* Subscription Plans Grid with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Daftar Paket Langganan">
        <PlanCardGrid
          plans={plans}
          currentSubscription={subscription}
          onUpgradePlan={upgradePlan}
        />
      </ErrorBoundary>
    </div>
  );
}
