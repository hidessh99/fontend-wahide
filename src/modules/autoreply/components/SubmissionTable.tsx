"use client";

import React, { useState } from "react";
import {
  Trash2,
  Inbox,
  User,
  Phone,
  AlertTriangle,
  Calendar,
  Workflow,
  Eye,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowSubmission } from "../types/submission.types";

interface SubmissionTableProps {
  submissions: FlowSubmission[];
  isLoading: boolean;
  onViewDetail: (subm: FlowSubmission) => void;
  onDelete: (id: string) => Promise<boolean>;
}

export function SubmissionTable({
  submissions,
  isLoading,
  onViewDetail,
  onDelete,
}: SubmissionTableProps) {
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
          Memuat data leads submission...
        </p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="border-border bg-surface flex min-h-[350px] flex-col items-center justify-center rounded-2xl border p-8 text-center">
        <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Inbox className="size-8" />
        </div>
        <h4 className="text-foreground mt-4 text-sm font-bold">
          {t("autoreply.submissions.empty")}
        </h4>
        <p className="text-foreground-muted mt-1 max-w-sm text-xs">
          Jawaban formulir yang diisi oleh pelanggan lewat alur flow WhatsApp akan tersimpan otomatis di sini.
        </p>
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
                <th className="px-5 py-3.5">{t("autoreply.submissions.table.date")}</th>
                <th className="px-4 py-3.5">{t("autoreply.submissions.table.flow")}</th>
                <th className="px-4 py-3.5">{t("autoreply.submissions.table.sender")}</th>
                <th className="px-4 py-3.5">{t("autoreply.submissions.table.phone")}</th>
                <th className="px-4 py-3.5">{t("autoreply.submissions.table.answers")}</th>
                <th className="px-5 py-3.5 text-right">{t("autoreply.submissions.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {submissions.map((subm) => {
                const answerEntries = Object.entries(subm.answers || {});

                return (
                  <tr
                    key={subm.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => onViewDetail(subm)}
                  >
                    {/* Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-foreground-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3 text-wise-green" />
                        <span>{new Date(subm.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px]">
                          {new Date(subm.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Flow Name */}
                    <td className="px-4 py-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                        <Workflow className="size-3.5 text-wise-green" />
                        <span className="truncate">{subm.flow_name || subm.flow_id}</span>
                      </div>
                    </td>

                    {/* Customer Sender */}
                    <td className="px-4 py-3.5 text-foreground font-semibold">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3 text-foreground-muted" />
                        <span>{subm.sender_name || "Pelanggan"}</span>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="px-4 py-3.5 font-mono text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Phone className="size-3 text-emerald-500" />
                        <span>{subm.sender_phone}</span>
                      </div>
                    </td>

                    {/* Answers Summary Preview */}
                    <td className="px-4 py-3.5 max-w-[280px]">
                      <div className="flex flex-wrap gap-1">
                        {answerEntries.slice(0, 2).map(([k, v]) => (
                          <span
                            key={k}
                            className="bg-muted text-foreground-secondary rounded px-1.5 py-0.5 text-[10px] font-medium truncate max-w-[120px]"
                          >
                            <strong className="font-semibold">{k}:</strong> {String(v)}
                          </span>
                        ))}
                        {answerEntries.length > 2 && (
                          <span className="text-foreground-muted text-[10px] self-center">
                            +{answerEntries.length - 2} lagi
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="px-5 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail(subm)}
                          className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(subm.id)}
                          className="text-foreground-muted hover:text-destructive hover:bg-destructive/10 rounded-lg p-1.5 transition-colors cursor-pointer"
                          title="Hapus Data"
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
                  {t("autoreply.submissions.deleteConfirmTitle")}
                </h4>
                <p className="text-foreground-muted text-xs mt-0.5">
                  {t("autoreply.submissions.deleteConfirmDesc")}
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
