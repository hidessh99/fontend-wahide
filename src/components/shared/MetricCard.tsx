import React from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon: React.ReactNode;
  iconClassName?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconClassName,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface space-y-2 rounded-xl border p-4 shadow-xs sm:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-foreground-muted text-xs font-bold tracking-wider uppercase">
          {title}
        </span>
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            iconClassName || "bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green"
          )}
        >
          {icon}
        </div>
      </div>
      <div className="text-foreground text-2xl font-black tracking-tight">{value}</div>
      {subtitle && <div className="text-[11px] font-semibold">{subtitle}</div>}
    </div>
  );
}
