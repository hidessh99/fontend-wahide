"use client";

import React, { useState } from "react";
import { SubscriptionPlan, TenantSubscription } from "../types/subscription.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Check, Sparkles, Loader2 } from "lucide-react";

interface PlanCardGridProps {
  plans: SubscriptionPlan[];
  currentSubscription: TenantSubscription | null;
  onUpgradePlan: (planId: string) => Promise<unknown>;
}

export function PlanCardGrid({
  plans,
  currentSubscription,
  onUpgradePlan,
}: PlanCardGridProps) {
  const { t } = useI18n();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
      await onUpgradePlan(planId);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const safePlans = Array.isArray(plans) && plans.length > 0 ? plans : [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          {t("subscription.plansTitle")}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-foreground-secondary">
          {t("subscription.plansSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {safePlans.map((plan) => {
          const isCurrent = currentSubscription?.planId === plan.id;
          const isPopular = Boolean(plan.isPopular);
          const priceMonthly = Number(plan.priceMonthly ?? 0);
          const features = Array.isArray(plan.features) ? plan.features : [];

          return (
            <div
              key={plan.id}
              className={`relative rounded-md border p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all ${
                isPopular
                  ? "border-wise-green bg-surface dark:bg-[#161715] shadow-xl ring-2 ring-wise-green/30"
                  : "border-border bg-surface dark:bg-[#161715] hover:border-foreground-muted/50"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-wise-green text-dark-green shadow-sm">
                  <Sparkles className="size-3" />
                  <span>Paling Populer</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Plan Title & Badge */}
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                    {plan.name || "Paket Langganan"}
                  </h3>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30">
                      Aktif
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    Rp {priceMonthly.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs font-semibold text-foreground-muted">
                    {t("subscription.perMonth")}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-4 border-t border-border/80">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-foreground-secondary">
                      <div className="size-4 rounded-full bg-wise-green/20 text-wise-green flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-2.5 stroke-3" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCurrent ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full rounded-full text-xs font-bold border-border bg-muted/40 text-foreground-muted"
                  >
                    {t("subscription.currentPlanBadge")}
                  </Button>
                ) : (
                  <Button
                    variant={isPopular ? "primaryPill" : "outline"}
                    disabled={loadingPlanId === plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full rounded-full text-xs font-bold gap-2 ${
                      !isPopular ? "border-border hover:border-foreground-muted" : "shadow-sm"
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <span>{t("subscription.choosePlan")}</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
