"use client";

import React, { useState, useMemo } from "react";
import { useSubscription } from "@/modules/subscription/hooks/useSubscription";
import {
  SubscriptionChannel,
  OrderCartItem,
  SubscriptionPlan,
} from "@/modules/subscription/types/subscription.types";
import { CHANNEL_PLANS } from "@/modules/subscription/api/subscription.api";
import { QuotaDialCard } from "@/modules/subscription/components/seller/QuotaDialCard";
import { TriChannelSelectorTabs } from "@/modules/subscription/components/seller/TriChannelSelectorTabs";
import { ChannelPlanCatalog } from "@/modules/subscription/components/seller/ChannelPlanCatalog";
import { OrderSummarySidebar } from "@/modules/subscription/components/seller/OrderSummarySidebar";
import { ConfirmUpgradeModal } from "@/modules/subscription/components/seller/ConfirmUpgradeModal";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

export function SubscriptionSellerPlansView() {
  const { t } = useI18n();
  const { subscription, plans, balance, upgradePlan } = useSubscription();

  // Active channel tab: Omnichannel, WhatsApp Web, Meta WABA, or Telegram Bot
  const [activeChannel, setActiveChannel] =
    useState<SubscriptionChannel>("OMNICHANNEL");

  // Cart state
  const [cartItems, setCartItems] = useState<OrderCartItem[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [pendingPlanForUpgrade, setPendingPlanForUpgrade] =
    useState<SubscriptionPlan | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Dynamic available plans computed from backend API with offline fallback
  const allAvailablePlans = useMemo(() => {
    if (Array.isArray(plans) && plans.length > 0) {
      return plans;
    }
    return [
      ...CHANNEL_PLANS.OMNICHANNEL,
      ...CHANNEL_PLANS.WHATSMEOW_UNOFFICIAL,
      ...CHANNEL_PLANS.META_WABA_OFFICIAL,
      ...CHANNEL_PLANS.TELEGRAM_BOT,
    ];
  }, [plans]);

  // Current channel plans filtered dynamically
  const currentChannelPlans = useMemo(() => {
    if (Array.isArray(plans) && plans.length > 0) {
      const filtered = plans.filter((p) => p.channelType === activeChannel);
      if (filtered.length > 0) return filtered;
    }
    return CHANNEL_PLANS[activeChannel] || [];
  }, [plans, activeChannel]);

  // Subscription status calculations for downgrade protection
  const isCurrentPaidActive = Boolean(
    subscription?.isActive &&
      (subscription?.planPrice ?? 0) > 0 &&
      subscription?.expiresAt &&
      new Date(subscription.expiresAt) > new Date(),
  );
  const currentPlanPrice = subscription?.planPrice ?? 0;
  const currentExpiresAt = subscription?.expiresAt;

  // Handle plan selection (add/replace in cart for the channel)
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    // Defensive guard: prevent downgrade while paid subscription is actively running
    if (
      isCurrentPaidActive &&
      subscription?.planId !== plan.id &&
      currentPlanPrice > plan.priceMonthly
    ) {
      toast.warning(t("subscription.toasts.downgradeForbidden"));
      return;
    }

    setCartItems((prev) => {
      // Filter out existing item for the same channel to avoid duplicates
      const filtered = prev.filter((item) => item.channelType !== activeChannel);
      return [
        ...filtered,
        {
          id: `cart_${activeChannel}_${plan.id}`,
          planId: plan.id,
          planName: plan.name,
          channelType: activeChannel,
          priceMonthly: plan.priceMonthly,
        },
      ];
    });

    toast.success(
      t("subscription.toasts.planAddedToCart", { name: plan.name }),
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Checkout handling
  const handleInitiateCheckout = async (planId: string) => {
    const foundPlan = allAvailablePlans.find((p) => p.id === planId);

    if (!foundPlan) {
      toast.error(t("subscription.toasts.planNotFound"));
      return;
    }

    if (foundPlan.priceMonthly === 0) {
      // Free plan upgrade directly
      setIsUpgrading(true);
      try {
        await upgradePlan(foundPlan.id);
        setCartItems([]);
      } finally {
        setIsUpgrading(false);
      }
      return;
    }

    setPendingPlanForUpgrade(foundPlan);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmModalUpgrade = async () => {
    if (!pendingPlanForUpgrade) return;
    setIsUpgrading(true);
    try {
      await upgradePlan(pendingPlanForUpgrade.id);
      setIsCheckoutModalOpen(false);
      setPendingPlanForUpgrade(null);
      setCartItems([]);
    } finally {
      setIsUpgrading(false);
    }
  };

  const selectedCartItemForChannel = cartItems.find(
    (item) => item.channelType === activeChannel,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
              <CreditCard className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("subscription.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("subscription.subtitle")}
          </p>
        </div>
      </div>

      <ErrorBoundary>
        {/* Active Subscription Quota Overview */}
        <QuotaDialCard subscription={subscription} />

        {/* 2-Column Order & Catalog Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* Left Column: Channels & Target Selector & Catalog */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Tri-Channel Selector Tabs */}
            <TriChannelSelectorTabs
              activeChannel={activeChannel}
              onSelectChannel={(ch) => setActiveChannel(ch)}
            />

            {/* 2. Channel-Specific Plan Catalog */}
            <ChannelPlanCatalog
              channelType={activeChannel}
              plans={currentChannelPlans}
              selectedPlanId={selectedCartItemForChannel?.planId || null}
              onSelectPlan={handleSelectPlan}
              currentPlanId={subscription?.planId}
              currentPlanPrice={currentPlanPrice}
              isCurrentPaidActive={isCurrentPaidActive}
              currentExpiresAt={currentExpiresAt}
            />
          </div>

          {/* Right Column: Order Summary Cart Sidebar */}
          <div className="lg:col-span-4">
            <OrderSummarySidebar
              cartItems={cartItems}
              onRemoveItem={handleRemoveCartItem}
              userBalance={balance}
              onCheckout={handleInitiateCheckout}
              isSubmitting={isUpgrading}
            />
          </div>
        </div>

        {/* Confirmation Modal for Checkout */}
        {isCheckoutModalOpen && pendingPlanForUpgrade && (
          <ConfirmUpgradeModal
            isOpen={isCheckoutModalOpen}
            onClose={() => {
              setIsCheckoutModalOpen(false);
              setPendingPlanForUpgrade(null);
            }}
            onConfirm={handleConfirmModalUpgrade}
            plan={pendingPlanForUpgrade}
            balance={balance}
            isUpgrading={isUpgrading}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default SubscriptionSellerPlansView;
