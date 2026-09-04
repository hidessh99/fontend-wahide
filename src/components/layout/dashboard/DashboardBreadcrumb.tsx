"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const { t } = useI18n();
  const segments = pathname.split("/").filter(Boolean);

  const getSegmentTitle = (segment: string): string => {
    switch (segment.toLowerCase()) {
      case "dashboard":
        return t("common.breadcrumbDashboard");
      case "devices":
        return t("dashboardMenu.whatsappSlots");
      case "campaigns":
        return t("dashboardMenu.campaigns");
      case "contacts":
        return t("dashboardMenu.contacts");
      case "subscription":
        return t("dashboardMenu.subscription");
      case "billing":
        return t("dashboardMenu.billing");
      case "activities":
        return t("dashboardMenu.activities");
      case "settings":
        return t("dashboardMenu.settings");
      case "support":
        return t("dashboardMenu.support");
      case "team":
        return t("dashboardMenu.team");
      case "address":
        return t("address.title");
      case "api-key":
        return t("dashboardMenu.apiKey");
      case "users":
        return t("admin.usersTitle");
      case "plans":
        return t("admin.plansTitle");
      case "subscriptions":
        return t("admin.subscriptionsTitle");
      case "messages":
        return t("admin.messagesTitle");
      case "notifications":
        return t("admin.notificationsTitle");
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  return (
    <nav
      className="text-foreground-muted flex items-center gap-1.5 text-xs font-semibold"
      aria-label="Breadcrumb"
    >
      <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
        <Home className="size-3.5" />
        <span className="hidden sm:inline">{t("common.breadcrumbHome")}</span>
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const title = getSegmentTitle(segment);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="text-border size-3" />
            {isLast ? (
              <span className="text-foreground font-bold">{title}</span>
            ) : (
              <Link href={href} className="hover:text-foreground">
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
