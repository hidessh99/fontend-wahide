"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Calendar,
  Workflow,
  Trash2,
  Code,
  Copy,
  Check,
  ClipboardList,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowSubmission } from "../types/submission.types";
import { toast } from "sonner";

interface SubmissionDrawerProps {
  submission: FlowSubmission | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<boolean>;
}

export function SubmissionDrawer({
  submission,
  onClose,
  onDelete,
}: SubmissionDrawerProps) {
  const { t } = useI18n();
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!submission) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(submission.answers || {}, null, 2));
    setCopied(true);
    toast.success(t("common.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const ok = await onDelete(submission.id);
    setIsDeleting(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface border-border flex h-full w-full max-w-md flex-col border-l shadow-2xl dark:bg-[#151714] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-wise-green/10 p-2 text-wise-green">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-bold">
                {t("autoreply.submissions.drawer.title")}
              </h3>
              <p className="text-foreground-muted text-[10px] font-mono">
                {submission.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Customer Metadata Card */}
          <div className="border-border bg-background rounded-2xl border p-4 space-y-3">
            <h4 className="text-foreground text-xs font-bold uppercase tracking-wider text-[10px] text-foreground-muted">
              {t("autoreply.submissions.drawer.senderInfo")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-foreground-muted text-[10px] block">Nama</span>
                <span className="text-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                  <User className="size-3 text-wise-green" />
                  {submission.sender_name || "Pelanggan"}
                </span>
              </div>
              <div>
                <span className="text-foreground-muted text-[10px] block">No Handphone</span>
                <span className="text-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                  <Phone className="size-3 text-wise-green" />
                  {submission.sender_phone}
                </span>
              </div>
              <div>
                <span className="text-foreground-muted text-[10px] block">Flow Terpilih</span>
                <span className="text-foreground font-semibold flex items-center gap-1.5 mt-0.5 truncate">
                  <Workflow className="size-3 text-wise-green" />
                  {submission.flow_name || submission.flow_id}
                </span>
              </div>
              <div>
                <span className="text-foreground-muted text-[10px] block">Waktu Masuk</span>
                <span className="text-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                  <Calendar className="size-3 text-wise-green" />
                  {new Date(submission.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Captured Answers Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-foreground text-xs font-bold uppercase tracking-wider text-[10px] text-foreground-muted">
                {t("autoreply.submissions.drawer.formData")}
              </h4>
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="text-foreground-secondary hover:text-wise-green flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Code className="size-3" />
                <span>{showJson ? "Tampilan Kartu" : "Raw JSON"}</span>
              </button>
            </div>

            {showJson ? (
              <div className="relative rounded-2xl border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="absolute top-2.5 right-2.5 rounded-lg border border-border bg-surface p-1.5 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                  title="Salin JSON"
                >
                  {copied ? <Check className="size-3 text-wise-green" /> : <Copy className="size-3" />}
                </button>
                <pre>{JSON.stringify(submission.answers || {}, null, 2)}</pre>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.keys(submission.answers || {}).length === 0 ? (
                  <p className="text-foreground-muted text-xs py-4 text-center">
                    Tidak ada variabel yang tersimpan.
                  </p>
                ) : (
                  Object.entries(submission.answers || {}).map(([key, val]) => (
                    <div
                      key={key}
                      className="border-border bg-background flex items-center justify-between rounded-xl border p-3"
                    >
                      <span className="text-foreground-muted text-xs font-mono">
                        {key}
                      </span>
                      <span className="text-foreground text-xs font-bold text-right max-w-[60%] truncate">
                        {String(val)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-border flex items-center justify-between border-t p-4 bg-muted/10">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>{isDeleting ? "Menghapus..." : t("autoreply.submissions.drawer.deleteSubmission")}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border-border text-foreground-secondary hover:bg-muted rounded-xl border px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            {t("autoreply.submissions.drawer.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
