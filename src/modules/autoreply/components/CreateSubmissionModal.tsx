"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Tag,
  HelpCircle,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  LinearSubmissionFormInput,
  FormQuestionItem,
  FormQuestionType,
} from "../types/submission.types";
import { compileLinearFormToFlow } from "../utils/formCompiler";
import { flowApi } from "../api/flow.api";

interface CreateSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LinearSubmissionFormInput | null;
  onSuccess: () => void;
}

export function CreateSubmissionModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: CreateSubmissionModalProps) {
  const { t } = useI18n();
  const isMountedRef = useRef(true);

  const [name, setName] = useState("");
  const [triggerKeywords, setTriggerKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [questions, setQuestions] = useState<FormQuestionItem[]>([]);
  const [completionMessage, setCompletionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setTriggerKeywords(initialData.trigger_keywords || []);
      setWelcomeMessage(initialData.welcome_message || "");
      setQuestions(
        initialData.questions?.length > 0
          ? initialData.questions
          : [
              {
                id: "q_1",
                question: t("autoreply.submissions.forms.modal.defaultQ1"),
                variableName: "nama_lengkap",
                type: "text",
              },
            ],
      );
      setCompletionMessage(
        initialData.completion_message ||
          t("autoreply.submissions.forms.modal.defaultCompletion"),
      );
    } else {
      setName("");
      setTriggerKeywords(["DAFTAR"]);
      setWelcomeMessage(
        t("autoreply.submissions.forms.modal.defaultWelcome"),
      );
      setQuestions([
        {
          id: "q_1",
          question: t("autoreply.submissions.forms.modal.defaultQ1"),
          variableName: "nama_lengkap",
          type: "text",
        },
        {
          id: "q_2",
          question: t("autoreply.submissions.forms.modal.defaultQ2"),
          variableName: "nomor_telepon",
          type: "phone",
        },
      ]);
      setCompletionMessage(
        t("autoreply.submissions.forms.modal.defaultCompletion"),
      );
    }
  }, [initialData, isOpen, t]);

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().toUpperCase();
      if (val && !triggerKeywords.includes(val)) {
        setTriggerKeywords([...triggerKeywords, val]);
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setTriggerKeywords(triggerKeywords.filter((k) => k !== kw));
  };

  const handleAddQuestion = () => {
    const newIdx = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: `q_${Date.now()}`,
        question: "",
        variableName: `jawaban_${newIdx}`,
        type: "text",
      },
    ]);
  };

  const handleUpdateQuestion = (
    id: string,
    field: keyof FormQuestionItem,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        const updated = { ...q, [field]: value };
        // Auto slugify variable name if user is typing question and variableName is generic
        if (
          field === "question" &&
          (!q.variableName || q.variableName.startsWith("jawaban_"))
        ) {
          const autoVar = value
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/_+/g, "_")
            .slice(0, 20);
          if (autoVar) {
            updated.variableName = autoVar;
          }
        }
        return updated;
      }),
    );
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) {
      toast.error(t("autoreply.submissions.forms.modal.errorMinQuestions"));
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      toast.error(t("autoreply.submissions.forms.modal.errorNameRequired"));
      return;
    }

    if (triggerKeywords.length === 0) {
      toast.error(t("autoreply.submissions.forms.modal.errorKeywordRequired"));
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(
          t("autoreply.submissions.forms.modal.errorQuestionEmpty", {
            num: i + 1,
          }),
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formInput: LinearSubmissionFormInput = {
        id: initialData?.id,
        name: name.trim(),
        trigger_keywords: triggerKeywords,
        welcome_message: welcomeMessage.trim(),
        questions,
        completion_message: completionMessage.trim(),
        is_active: initialData?.is_active ?? true,
      };

      const flowPayload = compileLinearFormToFlow(formInput);

      if (initialData?.id) {
        await flowApi.updateFlow(initialData.id, flowPayload);
        toast.success(t("autoreply.submissions.forms.modal.updateSuccess"));
      } else {
        await flowApi.createFlow(flowPayload);
        toast.success(t("autoreply.submissions.forms.modal.createSuccess"));
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("autoreply.submissions.forms.modal.saveFailed");
      toast.error(msg);
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex h-[90vh] sm:h-[85vh] w-[95vw] sm:max-w-2xl flex-col rounded-3xl p-0 shadow-2xl dark:bg-[#141613] overflow-hidden gap-0">
        {/* Modal Header */}
        <DialogHeader className="border-border flex flex-row items-center justify-between border-b px-5 py-4 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-wise-green/10 text-dark-green dark:text-wise-green p-2">
              <FileText className="size-4 sm:size-5" />
            </div>
            <div>
              <DialogTitle className="text-foreground text-sm sm:text-base font-bold">
                {initialData
                  ? t("autoreply.submissions.forms.modal.titleEdit")
                  : t("autoreply.submissions.forms.modal.titleCreate")}
              </DialogTitle>
              <DialogDescription className="text-foreground-muted text-[11px] sm:text-xs">
                {t("autoreply.submissions.forms.modal.desc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form
          id="submission-form-builder"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs"
        >
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.submissions.forms.modal.formName")} *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(
                  "autoreply.submissions.forms.modal.formNamePlaceholder",
                )}
                variant="rounded"
                required
              />
            </div>

            {/* Trigger Keywords */}
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold flex items-center justify-between">
                <span>{t("autoreply.submissions.forms.modal.keywords")} *</span>
                <span className="text-foreground-muted text-[10px] font-normal">
                  {t("autoreply.submissions.forms.modal.enterToAdd")}
                </span>
              </label>
              <div className="border-border bg-background flex flex-wrap items-center gap-1.5 rounded-xl border p-2 min-h-[42px]">
                <Tag className="size-3.5 text-wise-green ml-1" />
                {triggerKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-wise-green/15 text-dark-green dark:text-wise-green rounded-lg px-2 py-1 text-[11px] font-bold flex items-center gap-1"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  placeholder={
                    triggerKeywords.length === 0
                      ? t(
                          "autoreply.submissions.forms.modal.keywordsPlaceholder",
                        )
                      : t(
                          "autoreply.submissions.forms.modal.addKeywordPlaceholder",
                        )
                  }
                  className="bg-transparent text-foreground placeholder:text-foreground-muted flex-1 min-w-[120px] text-xs focus:outline-none px-1"
                />
              </div>
            </div>

            {/* Optional Welcome Message */}
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.submissions.forms.modal.welcomeMsg")}
              </label>
              <Textarea
                rows={2}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder={t(
                  "autoreply.submissions.forms.modal.welcomePlaceholder",
                )}
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border p-3 text-xs font-medium focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Questions List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="size-4 text-sky-500" />
                <h4 className="text-foreground text-xs font-bold">
                  {t("autoreply.submissions.forms.modal.questionsTitle")} (
                  {questions.length})
                </h4>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddQuestion}
                className="text-wise-green hover:underline gap-1 text-xs font-bold p-0 h-auto"
              >
                <Plus className="size-3.5" />
                <span>
                  {t("autoreply.submissions.forms.modal.addQuestion")}
                </span>
              </Button>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border-border bg-muted/20 hover:border-border/80 rounded-2xl border p-3.5 space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 text-[10px] font-bold">
                      {t("autoreply.submissions.forms.modal.questionNum", {
                        num: idx + 1,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="text-foreground-muted hover:text-destructive rounded-lg transition-colors cursor-pointer"
                      title={t(
                        "autoreply.submissions.forms.modal.deleteQuestion",
                      )}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground-muted text-[11px] font-medium">
                      {t("autoreply.submissions.forms.modal.questionText")} *
                    </label>
                    <Input
                      type="text"
                      value={q.question}
                      onChange={(e) =>
                        handleUpdateQuestion(q.id, "question", e.target.value)
                      }
                      placeholder={t(
                        "autoreply.submissions.forms.modal.questionPlaceholder",
                      )}
                      variant="rounded"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-foreground-muted text-[11px] font-medium">
                        {t("autoreply.submissions.forms.modal.varName")}
                      </label>
                      <Input
                        type="text"
                        value={q.variableName}
                        onChange={(e) =>
                          handleUpdateQuestion(
                            q.id,
                            "variableName",
                            e.target.value,
                          )
                        }
                        placeholder={t(
                          "autoreply.submissions.forms.modal.varPlaceholder",
                        )}
                        className="font-mono"
                        variant="rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-foreground-muted text-[11px] font-medium block">
                        {t("autoreply.submissions.forms.modal.valType")}
                      </label>
                      <NativeSelect
                        value={q.type}
                        onChange={(e) =>
                          handleUpdateQuestion(
                            q.id,
                            "type",
                            e.target.value as FormQuestionType,
                          )
                        }
                        variant="rounded"
                        className="w-full"
                      >
                        <NativeSelectOption value="text">
                          {t("autoreply.submissions.forms.modal.typeText")}
                        </NativeSelectOption>
                        <NativeSelectOption value="phone">
                          {t("autoreply.submissions.forms.modal.typePhone")}
                        </NativeSelectOption>
                        <NativeSelectOption value="email">
                          {t("autoreply.submissions.forms.modal.typeEmail")}
                        </NativeSelectOption>
                        <NativeSelectOption value="number">
                          {t("autoreply.submissions.forms.modal.typeNumber")}
                        </NativeSelectOption>
                      </NativeSelect>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Completion Message */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-wise-green" />
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.submissions.forms.modal.completionMsg")}
              </label>
            </div>
            <Textarea
              rows={2}
              value={completionMessage}
              onChange={(e) => setCompletionMessage(e.target.value)}
              placeholder={t(
                "autoreply.submissions.forms.modal.completionPlaceholder",
              )}
              className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border p-3 text-xs font-medium focus:ring-2 focus:outline-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="border-border flex items-center justify-end gap-3 border-t p-4 bg-muted/10 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full px-4 text-xs font-bold"
          >
            {t("autoreply.submissions.forms.modal.cancel")}
          </Button>
          <Button
            type="submit"
            form="submission-form-builder"
            variant="primaryPill"
            size="sm"
            disabled={isSubmitting}
            className="gap-2 px-5 text-xs font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("autoreply.submissions.forms.modal.saving")}</span>
              </>
            ) : (
              <span>{t("autoreply.submissions.forms.modal.save")}</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
