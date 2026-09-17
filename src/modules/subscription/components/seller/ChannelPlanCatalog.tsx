"use client";

import React from "react";
import {
  SubscriptionPlan,
  SubscriptionChannel,
} from "../../types/subscription.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n/context";

interface ChannelPlanCatalogProps {
  channelType: SubscriptionChannel;
  plans: SubscriptionPlan[];
  selectedPlanId: string | null;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currentPlanId?: string;
  currentPlanPrice?: number;
  isCurrentPaidActive?: boolean;
  currentExpiresAt?: string;
}

export function ChannelPlanCatalog({
  plans,
  selectedPlanId,
  onSelectPlan,
  currentPlanId,
  currentPlanPrice = 0,
  isCurrentPaidActive = false,
  currentExpiresAt,
}: ChannelPlanCatalogProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          {t("subscription.catalog.title")}
        </h3>
        <span className="text-[11px] text-foreground-muted">
          {t("subscription.catalog.subtitle")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isCurrentActive = currentPlanId === plan.id;
          const isDowngrade = Boolean(
            isCurrentPaidActive && !isCurrentActive && currentPlanPrice > plan.priceMonthly,
          );
          const isUpgrade = Boolean(
            !isCurrentActive && currentPlanPrice < plan.priceMonthly,
          );

          return (
            <div
              key={plan.id}
              className={cn(
                "group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card shadow-2xs",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 shadow-xs"
                  : isDowngrade
                    ? "border-border/60 bg-muted/20 opacity-80"
                    : "border-border/80 hover:border-border hover:shadow-xs",
              )}
            >
              {/* Badges: Popular / Active / Downgrade Locked */}
              {isDowngrade ? (
                <div className="absolute -top-2.5 right-4 z-10">
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs gap-1"
                  >
                    <Lock className="size-2.5" />
                    <span>{t("subscription.catalog.downgradeLocked")}</span>
                  </Badge>
                </div>
              ) : isCurrentActive ? (
                <div className="absolute -top-2.5 right-4 z-10">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs gap-1"
                  >
                    <CheckCircle2 className="size-2.5" />
                    <span>{t("subscription.catalog.currentPlan")}</span>
                  </Badge>
                </div>
              ) : plan.isPopular ? (
                <div className="absolute -top-2.5 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs gap-1">
                    <Sparkles className="size-2.5" />
                    <span>{t("subscription.catalog.popular")}</span>
                  </Badge>
                </div>
              ) : null}

              <div>
                <div className="mb-2">
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    {plan.name}
                  </h4>
                  <p className="text-[11px] text-foreground-muted mt-0.5 font-medium">
                    {t("subscription.catalog.messagesPerMonth", {
                      count: plan.quotaMonthly.toLocaleString(),
                    })}
                  </p>
                </div>

                <div className="my-3 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    {plan.priceMonthly === 0
                      ? t("subscription.catalog.free")
                      : `Rp ${plan.priceMonthly.toLocaleString("id-ID")}`}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="text-xs text-foreground-muted font-medium">
                      {t("subscription.catalog.perMonth")}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs text-foreground-secondary my-4 border-t border-border/60 pt-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant={
                    isSelected
                      ? "default"
                      : isDowngrade
                        ? "secondary"
                        : "outline"
                  }
                  size="sm"
                  disabled={isDowngrade}
                  onClick={() => !isDowngrade && onSelectPlan(plan)}
                  className={cn(
                    "w-full rounded-xl text-xs font-bold h-9 transition",
                    isDowngrade
                      ? "opacity-60 cursor-not-allowed bg-muted text-muted-foreground border border-dashed border-border"
                      : isSelected
                        ? "cursor-pointer shadow-xs"
                        : "cursor-pointer border-border/80 hover:bg-primary/5 hover:text-primary hover:border-primary/40",
                  )}
                >
                  {isSelected
                    ? t("subscription.catalog.selectedPlan")
                    : isCurrentActive
                      ? t("subscription.catalog.renewPlan")
                      : isDowngrade
                        ? t("subscription.catalog.downgradeLockedBtn")
                        : isUpgrade
                          ? t("subscription.catalog.upgradeTo", {
                              name: plan.name,
                            })
                          : t("subscription.catalog.choosePlan")}
                </Button>

                {isDowngrade && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 text-center mt-1.5 font-medium flex items-center justify-center gap-1">
                    <Lock className="size-2.5 shrink-0" />
                    <span>
                      {t("subscription.catalog.downgradeNotice", {
                        date: currentExpiresAt
                          ? `(${new Date(currentExpiresAt).toLocaleDateString([], {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })})`
                          : "",
                      })}
                    </span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
