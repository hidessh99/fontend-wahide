"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Calendar,
  Workflow,
  Trash2,
  Code,
  Copy,
  Check,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowSubmission } from "../types/submission.types";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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

  const isOpen = Boolean(submission);

  const handleCopyJson = () => {
    if (!submission) return;
    navigator.clipboard.writeText(
      JSON.stringify(submission.answers || {}, null, 2),
    );
    setCopied(true);
    toast.success(t("common.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!submission || isDeleting) return;
    setIsDeleting(true);
    try {
      const ok = await onDelete(submission.id);
      if (ok) onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md lg:max-w-lg p-0 gap-0"
      >
        {submission && (
          <>
            {/* Header */}
            <SheetHeader className="p-5 sm:p-6 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-wise-green/10 p-2 text-dark-green dark:text-wise-green">
                  <ClipboardList className="size-5" />
                </div>
                <div>
                  <SheetTitle className="text-foreground text-sm sm:text-base font-bold">
                    {t("autoreply.submissions.drawer.title")}
                  </SheetTitle>
                  <SheetDescription className="text-foreground-muted text-[10px] font-mono">
                    {submission.id}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Customer Metadata Card */}
              <div className="border-border bg-background rounded-2xl border p-4 space-y-3 shadow-xs">
                <h4 className="text-foreground text-xs font-bold uppercase tracking-wider text-[10px] text-foreground-muted">
                  {t("autoreply.submissions.drawer.senderInfo")}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-foreground-muted text-[10px] block">
                      {t("autoreply.submissions.drawer.name")}
                    </span>
                    <span className="text-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                      <User className="size-3 text-wise-green" />
                      {submission.sender_name ||
                        t("autoreply.submissions.table.defaultSender")}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted text-[10px] block">
                      {t("autoreply.submissions.drawer.phone")}
                    </span>
                    <span className="text-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                      <Phone className="size-3 text-wise-green" />
                      {submission.sender_phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted text-[10px] block">
                      {t("autoreply.submissions.drawer.flow")}
                    </span>
                    <span className="text-foreground font-semibold flex items-center gap-1.5 mt-0.5 truncate">
                      <Workflow className="size-3 text-wise-green" />
                      {submission.flow_name || submission.flow_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted text-[10px] block">
                      {t("autoreply.submissions.drawer.date")}
                    </span>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowJson(!showJson)}
                    className="h-auto p-1 gap-1 text-[11px] font-bold text-foreground-secondary hover:text-wise-green"
                  >
                    <Code className="size-3" />
                    <span>
                      {showJson
                        ? t("autoreply.submissions.drawer.cardView")
                        : t("autoreply.submissions.drawer.jsonView")}
                    </span>
                  </Button>
                </div>

                {showJson ? (
                  <div className="relative rounded-2xl border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={handleCopyJson}
                      className="absolute top-2.5 right-2.5 bg-surface text-foreground-muted hover:text-foreground cursor-pointer"
                      title={t("autoreply.submissions.drawer.copyJson")}
                    >
                      {copied ? (
                        <Check className="size-3 text-wise-green" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                    <pre>
                      {JSON.stringify(submission.answers || {}, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.keys(submission.answers || {}).length === 0 ? (
                      <p className="text-foreground-muted text-xs py-4 text-center">
                        {t("autoreply.submissions.drawer.noAnswers")}
                      </p>
                    ) : (
                      Object.entries(submission.answers || {}).map(
                        ([key, val]) => (
                          <div
                            key={key}
                            className="border-border bg-background flex items-center justify-between rounded-xl border p-3 shadow-xs"
                          >
                            <span className="text-foreground-muted text-xs font-mono">
                              {key}
                            </span>
                            <span className="text-foreground text-xs font-bold text-right max-w-[60%] truncate">
                              {String(val)}
                            </span>
                          </div>
                        ),
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <SheetFooter className="p-4 bg-muted/10">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-1.5 rounded-full text-xs font-bold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>{t("common.deleting")}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>
                      {t("autoreply.submissions.drawer.deleteSubmission")}
                    </span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-full px-4 text-xs font-bold"
              >
                {t("autoreply.submissions.drawer.close")}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
