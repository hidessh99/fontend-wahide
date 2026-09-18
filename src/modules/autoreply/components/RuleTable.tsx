"use client";

import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Bot,
  AlertTriangle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { AutoreplyRule } from "../types/autoreply.types";

interface RuleTableProps {
  rules: AutoreplyRule[];
  isLoading: boolean;
  onEdit: (rule: AutoreplyRule) => void;
  onDelete: (id: string) => Promise<boolean>;
  onToggle: (id: string, currentActive: boolean) => Promise<boolean>;
  onCreateNew: () => void;
}

export function RuleTable({
  rules,
  isLoading,
  onEdit,
  onDelete,
  onToggle,
  onCreateNew,
}: RuleTableProps) {
  const { t } = useI18n();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await onDelete(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="border-border bg-surface flex min-h-[300px] flex-col items-center justify-center rounded-2xl border p-8">
        <div className="border-wise-green h-8 w-8 animate-spin rounded-full border-3 border-t-transparent" />
        <p className="text-foreground-muted mt-3 text-xs font-medium">
          Memuat aturan autoreply...
        </p>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="border-border bg-surface flex min-h-[350px] flex-col items-center justify-center rounded-2xl border p-8 text-center">
        <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Bot className="size-8" />
        </div>
        <h4 className="text-foreground mt-4 text-sm font-bold">
          {t("autoreply.rules.empty")}
        </h4>
        <p className="text-foreground-muted mt-1 max-w-sm text-xs">
          Otomatisasi balasan pesan masuk dengan kata kunci instan Aho-Corasick.
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className="bg-wise-green text-dark-green hover:brightness-105 mt-5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          {t("autoreply.rules.addRule")}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-border bg-muted/40 text-foreground-muted border-b uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">{t("autoreply.rules.table.name")}</th>
                <th className="px-4 py-3.5">{t("autoreply.rules.table.channel")}</th>
                <th className="px-4 py-3.5">{t("autoreply.rules.table.keywords")}</th>
                <th className="px-4 py-3.5">{t("autoreply.rules.table.logic")}</th>
                <th className="px-4 py-3.5">{t("autoreply.rules.table.replyType")}</th>
                <th className="px-4 py-3.5">{t("autoreply.rules.table.priority")}</th>
                <th className="px-4 py-3.5 text-center">{t("autoreply.rules.table.status")}</th>
                <th className="px-5 py-3.5 text-right">{t("autoreply.rules.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {rules.map((rule) => {
                return (
                  <tr
                    key={rule.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">{rule.name}</span>
                      </div>
                      <span className="text-foreground-muted text-[10px] font-mono">
                        {rule.id.slice(0, 10)}...
                      </span>
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                          rule.channel_type === "whatsapp" &&
                            "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
                          rule.channel_type === "telegram" &&
                            "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
                          rule.channel_type === "waba" &&
                            "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
                        )}
                      >
                        {rule.channel_type}
                      </span>
                    </td>

                    {/* Keywords */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {rule.keywords?.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="bg-muted text-foreground-secondary rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                        {(rule.keywords?.length || 0) > 3 && (
                          <span className="text-foreground-muted text-[10px] self-center">
                            +{rule.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Match Logic */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="rounded-md bg-[#eef2eb] px-1.5 py-0.5 text-[10px] font-bold text-foreground-muted dark:bg-[#212320]">
                        {rule.match_logic}
                      </span>
                    </td>

                    {/* Reply Type & Preview */}
                    <td className="px-4 py-3.5 max-w-[240px]">
                      <span className="text-[10px] font-bold text-wise-green block">
                        {rule.reply_type}
                      </span>
                      <p className="text-foreground-muted truncate text-[11px]">
                        {rule.reply_type === "TEXT" && (rule.reply_text || "-")}
                        {rule.reply_type === "MEDIA" && (rule.media_url || "-")}
                        {rule.reply_type === "FLOW_TRIGGER" && `Flow: ${rule.flow_id}`}
                      </p>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-foreground-muted">
                      {rule.priority}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onToggle(rule.id, rule.is_active)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          rule.is_active ? "bg-wise-green" : "bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                            rule.is_active ? "translate-x-4" : "translate-x-0",
                          )}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(rule)}
                          className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors cursor-pointer"
                          title="Edit Aturan"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(rule.id)}
                          className="text-foreground-muted hover:text-destructive hover:bg-destructive/10 rounded-lg p-1.5 transition-colors cursor-pointer"
                          title="Hapus Aturan"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface border-border max-w-sm w-full rounded-2xl border p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2.5 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h4 className="text-foreground text-sm font-bold">
                  {t("autoreply.rules.deleteConfirmTitle")}
                </h4>
                <p className="text-foreground-muted text-xs mt-0.5">
                  {t("autoreply.rules.deleteConfirmDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="border-border text-foreground-secondary hover:bg-muted rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-white hover:bg-destructive/90 rounded-xl px-4 py-1.5 text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isDeleting ? t("common.deleting") : t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
