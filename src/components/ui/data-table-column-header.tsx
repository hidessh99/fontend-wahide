"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortOrder = "asc" | "desc" | null;

export interface DataTableColumnHeaderProps {
  title: string;
  columnKey: string;
  currentSortKey?: string | null;
  currentSortOrder?: SortOrder;
  onSort?: (key: string) => void;
  className?: string;
  align?: "left" | "center" | "right";
}

export function DataTableColumnHeader({
  title,
  columnKey,
  currentSortKey,
  currentSortOrder,
  onSort,
  className,
  align = "left",
}: DataTableColumnHeaderProps) {
  if (!onSort) {
    return (
      <div
        className={cn(
          "text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none",
          align === "center" && "text-center",
          align === "right" && "text-right",
          className
        )}
      >
        {title}
      </div>
    );
  }

  const isSorted = currentSortKey === columnKey;

  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      aria-label={`Urutkan berdasarkan ${title}`}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase transition-colors outline-none select-none",
        align === "center" && "mx-auto justify-center",
        align === "right" && "ml-auto justify-end",
        isSorted
          ? "dark:text-wise-green font-black text-emerald-700"
          : "text-foreground-muted hover:text-foreground",
        className
      )}
    >
      <span>{title}</span>
      <span className="flex size-4 shrink-0 items-center justify-center">
        {isSorted ? (
          currentSortOrder === "asc" ? (
            <ArrowUp className="dark:text-wise-green size-3.5 text-emerald-600" />
          ) : (
            <ArrowDown className="dark:text-wise-green size-3.5 text-emerald-600" />
          )
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40 transition group-hover:opacity-100" />
        )}
      </span>
    </button>
  );
}
