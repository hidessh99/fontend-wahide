"use client";

import React from "react";
import {
  FileSpreadsheet,
  FileCheck2,
  Inbox,
  Pencil,
  Trash2,
  Calendar,
  UserPlus,
  FileText,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Form, FormType } from "../../types/form.types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";

interface FormCardProps {
  form: Form;
  onEdit: (form: Form) => void;
  onDelete: (form: Form) => void;
  onViewSubmissions: (form: Form) => void;
}

const getTypeBadge = (type: FormType, t: (key: string) => string) => {
  switch (type) {
    case "RESERVATION":
      return {
        label: t("form.typeReservation"),
        icon: <Calendar className="w-3 h-3 mr-1" />,
        variant: "success" as const,
      };
    case "LEAD":
      return {
        label: t("form.typeLead"),
        icon: <UserPlus className="w-3 h-3 mr-1" />,
        variant: "warning" as const,
      };
    default:
      return {
        label: t("form.typeStandard"),
        icon: <FileText className="w-3 h-3 mr-1" />,
        variant: "info" as const,
      };
  }
};

export function FormCard({
  form,
  onEdit,
  onDelete,
  onViewSubmissions,
}: FormCardProps) {
  const { t } = useI18n();
  const typeBadge = getTypeBadge(form.type, t);

  return (
    <Card className="flex flex-col justify-between p-5 hover:shadow-md transition-shadow duration-200">
      <div>
        {/* Top Header: Type Badge & Private Security Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={typeBadge.variant}
            className="text-xs font-medium px-2 py-0.5 flex items-center"
          >
            {typeBadge.icon}
            {typeBadge.label}
          </Badge>

          <Badge
            variant="outline"
            className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30 gap-1 px-2 py-0.5"
          >
            <Lock className="size-3" />
            <span>{t("form.preview.officialBadge")}</span>
          </Badge>
        </div>

        {/* Title & Description */}
        <h3
          className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base line-clamp-2 leading-snug wrap-break-words sm:line-clamp-1 mb-1"
          title={form.title}
        >
          {form.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-8 mb-3">
          {form.description || t("form.noDescription")}
        </p>

        {/* Identifier Internal Box */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 mb-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-hidden text-xs text-slate-600 dark:text-slate-300 font-mono">
            <span className="text-slate-400 text-[11px]">ID:</span>
            <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
              {form.slug}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t("form.protectedAccess")}</span>
          </div>
        </div>

        {/* Anti-N+1 Fast Aggregated Metrics (Private Form Focus) */}
        <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center mb-4">
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
              <FileCheck2 className="w-3 h-3 text-primary" />
              <span>{t("form.stats.totalSubmissions")}</span>
            </div>
            <span className="font-bold text-primary text-sm">
              {form.submissionCount.toLocaleString()}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
              <FileSpreadsheet className="w-3 h-3 text-slate-500" />
              <span>{t("form.cardQuestions")}</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {form.fields?.length || 0} {t("form.cardFields")}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div>
        <Separator className="mb-3" />
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="flex-1 h-8 text-xs font-medium min-w-0 cursor-pointer"
            onClick={() => onViewSubmissions(form)}
          >
            <Inbox className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            <span className="truncate">{t("form.viewSubmissions")}</span>
            {form.submissionCount > 0 && (
              <Badge
                variant="outline"
                className="ml-1.5 text-[10px] px-1.5 py-0 font-bold border-primary/20 text-primary shrink-0"
              >
                {form.submissionCount}
              </Badge>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 text-slate-600 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
            onClick={() => onEdit(form)}
            title={t("common.edit")}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            onClick={() => onDelete(form)}
            title={t("common.delete")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
