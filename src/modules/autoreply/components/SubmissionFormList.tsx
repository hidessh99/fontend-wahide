"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Tag,
  HelpCircle,
  Users,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowDefinition } from "../types/flow.types";

interface SubmissionFormListProps {
  forms: FlowDefinition[];
  isLoading: boolean;
  onCreateNew: () => void;
  onEditForm: (form: FlowDefinition) => void;
  onViewResponses: (flowId: string) => void;
  onDeleteForm: (id: string) => void;
}

export function SubmissionFormList({
  forms,
  isLoading,
  onCreateNew,
  onEditForm,
  onViewResponses,
  onDeleteForm,
}: SubmissionFormListProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="border-border bg-surface flex h-64 items-center justify-center rounded-2xl border p-8">
        <div className="border-wise-green h-8 w-8 animate-spin rounded-full border-3 border-t-transparent" />
        <p className="text-foreground-muted ml-3 text-xs font-medium">
          Memuat daftar formulir WhatsApp...
        </p>
      </div>
    );
  }

  // Empty State matching reference SaaS
  if (forms.length === 0) {
    return (
      <div className="border-border bg-surface/60 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
        <div className="rounded-2xl bg-muted/50 p-3.5 text-foreground-muted mb-3">
          <FileText className="size-8" />
        </div>
        <h3 className="text-foreground text-sm sm:text-base font-bold">
          {t("autoreply.submissions.forms.emptyTitle")}
        </h3>
        <p className="text-foreground-muted text-xs mt-1.5 max-w-md">
          {t("autoreply.submissions.forms.emptySubtitle")}
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className="mt-5 bg-foreground text-background hover:opacity-90 flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>{t("autoreply.submissions.forms.createButton")}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-sm sm:text-base font-bold">
            Daftar Formulir WhatsApp
          </h2>
          <p className="text-foreground-muted text-xs">
            {forms.length} formulir tanya-jawab aktif untuk mengumpulkan prospek pelanggan
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="bg-wise-green text-dark-green hover:brightness-105 flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>{t("autoreply.submissions.forms.createButton")}</span>
        </button>
      </div>

      {/* Grid of Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => {
          const questionNodes =
            form.canvas_graph?.nodes?.filter((n) => n.type === "question") || [];
          const questionCount = questionNodes.length;

          return (
            <div
              key={form.id}
              className="border-border bg-surface hover:border-border/80 flex flex-col justify-between rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Form Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-foreground text-sm font-bold truncate">
                      {form.name}
                    </h3>
                    <p className="text-foreground-muted text-[11px] line-clamp-1 mt-0.5">
                      {form.description || "Formulir pendaftaran interaktif"}
                    </p>
                  </div>
                  <span
                    className={
                      form.is_active
                        ? "rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shrink-0"
                        : "rounded-full bg-muted text-foreground-muted px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shrink-0"
                    }
                  >
                    {form.is_active ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <XCircle className="size-3" />
                    )}
                    {form.is_active
                      ? t("autoreply.submissions.forms.active")
                      : t("autoreply.submissions.forms.inactive")}
                  </span>
                </div>

                {/* Trigger Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Tag className="size-3 text-wise-green shrink-0" />
                  {form.trigger_keywords && form.trigger_keywords.length > 0 ? (
                    form.trigger_keywords.map((kw) => (
                      <span
                        key={kw}
                        className="bg-muted text-foreground rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-foreground-muted text-[10px]">
                      Tanpa kata kunci
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-1.5 text-foreground-muted text-xs">
                    <HelpCircle className="size-3.5 text-sky-500" />
                    <span>
                      {t("autoreply.submissions.forms.questionsCount", {
                        count: questionCount,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground-muted text-xs">
                    <Users className="size-3.5 text-wise-green" />
                    <span>
                      {t("autoreply.submissions.forms.submissionsCount", {
                        count: form.execution_count || 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-1 pt-4 mt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => onViewResponses(form.id)}
                  className="text-wise-green hover:underline flex items-center gap-1 text-xs font-bold cursor-pointer"
                >
                  <span>{t("autoreply.submissions.forms.viewResponses")}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditForm(form)}
                    className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors cursor-pointer"
                    title={t("autoreply.submissions.forms.editForm")}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <Link
                    href={`/autoreply/flow`}
                    className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors cursor-pointer"
                    title={t("autoreply.submissions.forms.openInDag")}
                  >
                    <ExternalLink className="size-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeleteForm(form.id)}
                    className="text-foreground-muted hover:text-destructive hover:bg-destructive/10 rounded-lg p-1.5 transition-colors cursor-pointer"
                    title={t("autoreply.submissions.forms.deleteForm")}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
