"use client";

import React, { useState } from "react";
import { SubscriptionPlan, TenantSubscription } from "@/modules/subscription/types/subscription.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Check, Sparkles, Loader2, ArrowUpRight, Lock, Calendar } from "lucide-react";
import { ConfirmUpgradeModal } from "./ConfirmUpgradeModal";

interface PlanCardGridProps {
  plans: SubscriptionPlan[];
  currentSubscription: TenantSubscription | null;
  userBalance?: number | null;
  onUpgradePlan: (planId: string) => Promise<unknown>;
}

export function PlanCardGrid({
  plans,
  currentSubscription,
  userBalance,
  onUpgradePlan,
}: PlanCardGridProps) {
  const { t } = useI18n();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SubscriptionPlan | null>(null);
  const [isModalUpgrading, setIsModalUpgrading] = useState(false);

  // Determine active subscription price dynamically (0 if free/starter or inactive)
  const currentActivePrice = (currentSubscription?.isActive && currentSubscription?.planId)
    ? (currentSubscription.planPrice || (plans.find((p) => p.id === currentSubscription.planId)?.priceMonthly ?? 0))
    : 0;

  const handleSelectPlanClick = async (plan: SubscriptionPlan) => {
    // Free tier: direct upgrade without balance deduction
    if (plan.priceMonthly === 0) {
      setLoadingPlanId(plan.id);
      try {
        await onUpgradePlan(plan.id);
      } finally {
        setLoadingPlanId(null);
      }
      return;
    }

    // Paid tier: open confirmation modal with balance verification
    setSelectedPlanForUpgrade(plan);
  };

  const handleConfirmModalUpgrade = async () => {
    if (!selectedPlanForUpgrade) return;
    setIsModalUpgrading(true);
    try {
      await onUpgradePlan(selectedPlanForUpgrade.id);
      setSelectedPlanForUpgrade(null);
    } finally {
      setIsModalUpgrading(false);
    }
  };

  const safePlans = Array.isArray(plans) && plans.length > 0 ? plans : [];

  return (
    <div className="space-y-6">
      {/* Active Subscription Expiry Info Banner for Paid Active Plans */}
      {currentSubscription && currentSubscription.isActive && currentActivePrice > 0 && currentSubscription.expiresAt && (
        <div className="p-3.5 sm:p-4 rounded-xl border border-wise-green/30 bg-light-mint/50 dark:bg-wise-green/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-foreground font-semibold">
            <div className="size-6 rounded-full bg-wise-green/20 text-emerald-800 dark:text-wise-green flex items-center justify-center shrink-0">
              <Calendar className="size-3.5" />
            </div>
            <div>
              <span>Paket <strong>{currentSubscription.planName}</strong> Anda aktif hingga{" "}</span>
              <strong className="text-emerald-700 dark:text-wise-green">
                {new Date(currentSubscription.expiresAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </div>
          </div>
          <span className="text-[11px] text-foreground-muted font-medium">
            💡 Anda dapat melakukan upgrade ke paket yang lebih tinggi kapan saja.
          </span>
        </div>
      )}

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
          // 1. Strict relational active plan matching by Primary Key ID
          const isCurrent = currentSubscription?.planId === plan.id;

          // 2. Strict upward migration logic purely based on mathematical price
          const isLowerTier =
            currentSubscription?.isActive &&
            currentActivePrice > 0 &&
            plan.priceMonthly < currentActivePrice;

          const canUpgrade = !isCurrent && (!isLowerTier || currentActivePrice === 0);
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
                      <div className="size-4 rounded-full bg-emerald-500/15 dark:bg-wise-green/20 text-emerald-700 dark:text-wise-green flex items-center justify-center shrink-0 mt-0.5">
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
                    className="w-full rounded-full text-xs font-bold border-border bg-muted/40 text-foreground-muted cursor-not-allowed"
                  >
                    {t("subscription.currentPlanBadge")}
                  </Button>
                ) : isLowerTier ? (
                  <div className="space-y-1.5">
                    <Button
                      variant="outline"
                      disabled
                      className="w-full rounded-full text-xs font-bold border-border bg-muted/20 text-foreground-muted cursor-not-allowed gap-1.5"
                    >
                      <Lock className="size-3" />
                      <span>Tier di Bawah Paket Aktif</span>
                    </Button>
                    <p className="text-[10px] text-center text-foreground-muted font-medium">
                      Downgrade dapat dilakukan setelah masa aktif berakhir.
                    </p>
                  </div>
                ) : (
                  <Button
                    variant={isPopular ? "primaryPill" : "outline"}
                    disabled={loadingPlanId === plan.id || !canUpgrade}
                    onClick={() => handleSelectPlanClick(plan)}
                    className={`w-full rounded-full text-xs font-bold gap-1.5 cursor-pointer ${
                      !isPopular ? "border-border hover:border-foreground-muted" : "shadow-sm"
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>{plan.priceMonthly === 0 ? t("subscription.choosePlan") : "Upgrade ke Paket Ini"}</span>
                        <ArrowUpRight className="size-3.5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation & Wallet Deduction Modal */}
      <ConfirmUpgradeModal
        plan={selectedPlanForUpgrade}
        balance={userBalance ?? null}
        isOpen={Boolean(selectedPlanForUpgrade)}
        onClose={() => setSelectedPlanForUpgrade(null)}
        onConfirm={handleConfirmModalUpgrade}
        isUpgrading={isModalUpgrading}
      />
    </div>
  );
}
