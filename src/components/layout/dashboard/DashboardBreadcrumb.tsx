"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted" aria-label="Breadcrumb">
      <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
        <Home className="size-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const title = segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="size-3 text-border" />
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
