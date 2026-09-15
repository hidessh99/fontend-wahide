"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface VariableQuickInsertProps {
  onInsert: (variableName: string) => void;
  customVariables?: string[];
}

export function VariableQuickInsert({
  onInsert,
  customVariables,
}: VariableQuickInsertProps) {
  const { t } = useI18n();

  const defaultVariables = [
    { label: t("template.variables.name"), key: "nama" },
    { label: t("template.variables.phone"), key: "nomor" },
    { label: t("template.variables.email"), key: "email" },
    { label: t("template.variables.date"), key: "tanggal" },
    { label: t("template.variables.invoice"), key: "invoice" },
    { label: t("template.variables.link"), key: "link" },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span className="font-medium">
          {t("template.variables.quickTitle")}
        </span>
        <span className="text-[11px] opacity-75">
          {t("template.variables.format")}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 py-0.5">
        {defaultVariables.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => onInsert(v.key)}
            className="group/chip inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-all duration-150 hover:bg-primary/20 hover:scale-105 active:scale-95 cursor-pointer"
            title={`${t("template.variables.insertTooltip")} {{${v.key}}} (${v.label})`}
          >
            <Plus className="size-3 text-primary transition-transform group-hover/chip:rotate-90" />
            <span className="font-mono">{`{{${v.key}}}`}</span>
            <span className="text-[10px] text-foreground-muted font-normal">
              ({v.label})
            </span>
          </button>
        ))}
        {customVariables?.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onInsert(v)}
            className="group/chip inline-flex items-center gap-1 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-all duration-150 hover:bg-blue-500/20 hover:scale-105 active:scale-95 cursor-pointer"
            title={`${t("template.variables.insertTooltip")} {{${v}}}`}
          >
            <Plus className="size-3 text-blue-600 dark:text-blue-400 transition-transform group-hover/chip:rotate-90" />
            <span className="font-mono">{`{{${v}}}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
