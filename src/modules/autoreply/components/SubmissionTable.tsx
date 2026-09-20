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
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowSubmission } from "../types/submission.types";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
    if (!deleteId || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="border-border bg-surface flex min-h-[300px] flex-col items-center justify-center rounded-2xl border p-8 shadow-xs">
        <div className="border-wise-green h-8 w-8 animate-spin rounded-full border-3 border-t-transparent" />
        <p className="text-foreground-muted mt-3 text-xs font-medium">
          Memuat data leads submission...
        </p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="border-border bg-surface rounded-2xl border p-2 shadow-xs">
        <EmptyState
          icon={<Inbox className="size-9 text-wise-green" />}
          title={t("autoreply.submissions.empty")}
          description="Jawaban formulir yang diisi oleh pelanggan lewat alur flow WhatsApp akan tersimpan otomatis di sini."
        />
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border bg-surface overflow-hidden rounded-2xl border p-0 gap-0 shadow-xs">
        <div className="overflow-x-auto">
          <Table className="w-full text-left text-xs">
            <TableHeader className="border-border bg-muted/40 text-foreground-muted border-b uppercase text-[10px] font-bold tracking-wider">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-3.5 font-bold">
                  {t("autoreply.submissions.table.date")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.submissions.table.flow")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.submissions.table.sender")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.submissions.table.phone")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.submissions.table.answers")}
                </TableHead>
                <TableHead className="px-5 py-3.5 text-right font-bold">
                  {t("autoreply.submissions.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-border divide-y">
              {submissions.map((subm) => {
                const answerEntries = Object.entries(subm.answers || {});

                return (
                  <TableRow
                    key={subm.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => onViewDetail(subm)}
                  >
                    {/* Date */}
                    <TableCell className="px-5 py-3.5 whitespace-nowrap text-foreground-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3 text-wise-green" />
                        <span>
                          {new Date(subm.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px]">
                          {new Date(subm.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>

                    {/* Flow Name */}
                    <TableCell className="px-4 py-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                        <Workflow className="size-3.5 text-wise-green" />
                        <span className="truncate">
                          {subm.flow_name || subm.flow_id}
                        </span>
                      </div>
                    </TableCell>

                    {/* Customer Sender */}
                    <TableCell className="px-4 py-3.5 text-foreground font-semibold">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3 text-foreground-muted" />
                        <span>{subm.sender_name || "Pelanggan"}</span>
                      </div>
                    </TableCell>

                    {/* Phone Number */}
                    <TableCell className="px-4 py-3.5 font-mono text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Phone className="size-3 text-emerald-500" />
                        <span>{subm.sender_phone}</span>
                      </div>
                    </TableCell>

                    {/* Answers Summary Preview */}
                    <TableCell className="px-4 py-3.5 max-w-[280px]">
                      <div className="flex flex-wrap gap-1">
                        {answerEntries.slice(0, 2).map(([k, v]) => (
                          <span
                            key={k}
                            className="bg-muted text-foreground-secondary rounded px-1.5 py-0.5 text-[10px] font-medium truncate max-w-[120px]"
                          >
                            <strong className="font-semibold">{k}:</strong>{" "}
                            {String(v)}
                          </span>
                        ))}
                        {answerEntries.length > 2 && (
                          <span className="text-foreground-muted text-[10px] self-center">
                            +{answerEntries.length - 2} lagi
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      className="px-5 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onViewDetail(subm)}
                          className="text-foreground-muted hover:text-foreground rounded-lg"
                          title="Lihat Detail"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setDeleteId(subm.id)}
                          className="text-foreground-muted hover:text-destructive rounded-lg"
                          title="Hapus Data"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="max-w-sm rounded-2xl p-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2.5 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div className="text-left">
                <AlertDialogTitle className="text-foreground text-sm font-bold">
                  {t("autoreply.submissions.deleteConfirmTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-foreground-muted text-xs mt-0.5">
                  {t("autoreply.submissions.deleteConfirmDesc")}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-2 pt-2 sm:justify-end">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl text-xs font-bold"
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90 rounded-xl text-xs font-bold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                  <span>{t("common.deleting")}</span>
                </>
              ) : (
                t("common.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
