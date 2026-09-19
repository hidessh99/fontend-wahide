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
      case "wa":
        return t("dashboardMenu.channelWaUnofficial");
      case "waba":
        return t("dashboardMenu.channelWabaOfficial");
      case "tele":
      case "telegram":
        return t("dashboardMenu.channelTelegram");
      case "devices":
      case "device":
        return t("dashboardMenu.channelDevices");
      case "bots":
      case "bot":
        return t("dashboardMenu.channelBots");
      case "logs":
      case "log":
        return t("dashboardMenu.channelLogs");
      case "stats":
      case "statistics":
        return t("dashboardMenu.channelStats");
      case "campaigns":
        return t("dashboardMenu.campaigns");
      case "contacts":
        return t("dashboardMenu.contacts");
      case "templates":
        return t("dashboardMenu.templates");
      case "reminders":
        return t("dashboardMenu.reminders");
      case "reservations":
        return t("dashboardMenu.reservations");
      case "forms":
        return t("dashboardMenu.forms");
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
        return t("dashboardMenu.messages");
      case "send":
        return t("dashboardMenu.groupSend");
      case "message":
        return t("dashboardMenu.sendQuickMessage");
      case "broadcast":
        return t("dashboardMenu.sendBroadcast");
      case "reminder":
        return t("dashboardMenu.sendReminder");
      case "reservation":
        return t("dashboardMenu.sendReservation");
      case "autoreply":
        return t("dashboardMenu.groupAutoreply");
      case "flow":
        return t("dashboardMenu.autoreplyFlow");
      case "submission":
        return t("dashboardMenu.autoreplySubmission");
      case "spreadsheet":
        return t("dashboardMenu.autoreplySpreadsheet");
      case "new":
        return t("common.new");
      case "notifications":
        return t("admin.notificationsTitle");
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  const activeTitle =
    segments.length > 0
      ? getSegmentTitle(segments[segments.length - 1])
      : t("common.breadcrumbDashboard");

  return (
    <div className="flex min-w-0 items-center">
      {/* Mobile Single Page Title (< sm) */}
      <div className="flex min-w-0 items-center sm:hidden">
        <h1 className="text-foreground max-w-47.5 truncate text-sm font-bold tracking-tight xs:max-w-[240px]">
          {activeTitle}
        </h1>
      </div>

      {/* Desktop / Tablet Breadcrumb Trail (≥ sm) */}
      <nav
        className="text-foreground-muted hidden min-w-0 items-center gap-1.5 text-xs font-semibold sm:flex"
        aria-label="Breadcrumb"
      >
        <Link
          href="/dashboard"
          className="hover:text-foreground flex shrink-0 items-center gap-1"
        >
          <Home className="size-3.5" />
          <span>{t("common.breadcrumbHome")}</span>
        </Link>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const title = getSegmentTitle(segment);

          return (
            <React.Fragment key={href}>
              <ChevronRight className="text-border size-3 shrink-0" />
              {isLast ? (
                <span className="text-foreground max-w-40 truncate font-bold md:max-w-60 lg:max-w-none">
                  {title}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-foreground max-w-25 truncate md:max-w-35"
                >
                  {title}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}
