"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  HelpCircle,
  Calendar,
  UserPlus,
  FileText,
  Smartphone,
  Layers,
  Lock,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { FormPhoneMockup } from "./FormPhoneMockup";
import {
  Form,
  FormField,
  FormFieldType,
  FormType,
  CreateFormInput,
  UpdateFormInput,
} from "../../types/form.types";

interface FormBuilderModalProps {
  form: Form | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (input: CreateFormInput) => Promise<Form | null>;
  onSubmitUpdate: (id: string, input: UpdateFormInput) => Promise<Form | null>;
}

export function FormBuilderModal({
  form,
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: FormBuilderModalProps) {
  const { t } = useI18n();
  const isEdit = Boolean(form);

  const fieldTypes: { value: FormFieldType; label: string }[] = useMemo(
    () => [
      { value: "text", label: t("form.fieldTypeText") },
      { value: "textarea", label: t("form.fieldTypeTextarea") },
      { value: "number", label: t("form.fieldTypeNumber") },
      { value: "email", label: t("form.fieldTypeEmail") },
      { value: "phone", label: t("form.fieldTypePhone") },
      { value: "date", label: t("form.fieldTypeDate") },
      { value: "time", label: t("form.fieldTypeTime") },
      { value: "select", label: t("form.fieldTypeSelect") },
    ],
    [t],
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FormType>("STANDARD");
  const [fields, setFields] = useState<FormField[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  // Initialize or reset form state on open/change
  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setSlug(form.slug);
      setDescription(form.description || "");
      setType(form.type || "STANDARD");
      setFields(form.fields || []);
      setSuccessMessage(form.successMessage || "");
      setRedirectUrl(form.redirectUrl || "");
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setType("STANDARD");
      setFields([
        {
          id: "f_notes",
          label: t("form.defaultFields.complaintNotes"),
          name: "notes",
          fieldType: "textarea",
          required: false,
          placeholder: t("form.defaultFields.notesPlaceholder"),
        },
      ]);
      setSuccessMessage(t("form.defaultFields.successPlaceholder"));
      setRedirectUrl("");
    }
  }, [form, isOpen, t]);

  // Generate slug automatically when creating new form
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
    }
  };

  // Add custom field
  const handleAddField = () => {
    const newId = "f_" + Date.now().toString(36);
    const newField: FormField = {
      id: newId,
      label: t("form.newQuestion"),
      name: `field_${fields.length + 1}`,
      fieldType: "text",
      required: false,
      placeholder: "",
    };
    setFields([...fields, newField]);
  };

  // Update field property
  const handleUpdateField = (
    index: number,
    key: keyof FormField,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val: any,
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: val };
    setFields(updated);
  };

  // Remove field
  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // Quick preset templates
  const applyReservationPreset = () => {
    setType("RESERVATION");
    if (!title) setTitle(t("form.presetReservationTitle"));
    if (!slug && !isEdit) setSlug("booking-jadwal");
    setFields([
      {
        id: "f_date",
        label: t("form.defaultFields.bookingDate"),
        name: "booking_date",
        fieldType: "date",
        required: true,
      },
      {
        id: "f_time",
        label: t("form.presetBookingTime"),
        name: "booking_time",
        fieldType: "time",
        required: false,
        placeholder: "Contoh: 10:00",
      },
      {
        id: "f_service",
        label: t("form.presetService"),
        name: "service",
        fieldType: "select",
        required: true,
        options: ["Konsultasi Umum", "Paket Premium", "Perawatan Standar"],
      },
      {
        id: "f_notes",
        label: t("form.defaultFields.complaintNotes"),
        name: "notes",
        fieldType: "textarea",
        required: false,
        placeholder: t("form.defaultFields.notesPlaceholder"),
      },
    ]);
  };

  const applyLeadPreset = () => {
    setType("LEAD");
    if (!title) setTitle(t("form.presetLeadTitle"));
    if (!slug && !isEdit) setSlug("daftar-penawaran");
    setFields([
      {
        id: "f_email",
        label: t("form.presetEmail"),
        name: "email",
        fieldType: "email",
        required: true,
        placeholder: "nama@perusahaan.com",
      },
      {
        id: "f_company",
        label: t("form.presetCompany"),
        name: "company",
        fieldType: "text",
        required: false,
        placeholder: "PT Contoh Sukses",
      },
      {
        id: "f_needs",
        label: t("form.presetNeeds"),
        name: "needs",
        fieldType: "textarea",
        required: false,
        placeholder: t("form.presetNeedsPlaceholder"),
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEdit && form) {
        const res = await onSubmitUpdate(form.id, {
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          type,
          fields,
          successMessage: successMessage.trim(),
          redirectUrl: redirectUrl.trim() || undefined,
          isActive: false,
        });
        if (res) onClose();
      } else {
        const res = await onSubmitCreate({
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          type,
          fields,
          successMessage: successMessage.trim(),
          redirectUrl: redirectUrl.trim() || undefined,
          isActive: false,
        });
        if (res) onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border/70 bg-surface flex max-h-[92dvh] w-[96vw] sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col gap-0 overflow-hidden rounded-3xl p-0 shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full min-h-0 flex-1"
        >
          <DialogHeader className="border-border/70 flex shrink-0 flex-row items-center justify-between border-b px-5 py-4 text-left sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground sm:text-lg">
                  {isEdit ? t("form.editTitle") : t("form.createTitle")}
                </DialogTitle>
                <p className="text-xs text-foreground-muted">
                  {t("form.viewSubtitle")}
                </p>
              </div>
            </div>

            {/* Mobile Tab Toggle (Visible only on < xl screens) */}
            <div className="xl:hidden mr-6">
              <Tabs
                value={mobileTab}
                onValueChange={(v) => setMobileTab(v as "form" | "preview")}
              >
                <TabsList className="h-8 p-0.5 bg-muted rounded-lg border border-border/60">
                  <TabsTrigger
                    value="form"
                    className="text-xs gap-1 px-2.5 py-1"
                  >
                    <Layers className="size-3.5" />
                    <span>{t("form.preview.tabForm")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="text-xs gap-1 px-2.5 py-1"
                  >
                    <Smartphone className="size-3.5" />
                    <span>{t("form.tabPreview")}</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </DialogHeader>

          {/* Modal Body: Split Layout */}
          <div className="flex flex-1 min-h-0 flex-col xl:flex-row overflow-hidden">
            {/* Left Column: Form Editor Controls */}
            <div
              className={cn(
                "w-full xl:w-7/12 2xl:w-3/5 overflow-y-auto p-5 sm:p-6 space-y-5 border-border/60 xl:border-r flex flex-col",
                mobileTab === "form" ? "block" : "hidden xl:block",
              )}
            >
              {/* Quick Preset Buttons (Create only) */}
              {!isEdit && (
                <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-muted/30 border border-border/70">
                  <span className="text-xs font-semibold text-foreground-muted">
                    {t("form.quickPresets")}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7.5 rounded-xl text-xs gap-1.5 cursor-pointer"
                    onClick={applyReservationPreset}
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {t("form.presetReservation")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7.5 rounded-xl text-xs gap-1.5 cursor-pointer"
                    onClick={applyLeadPreset}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                    {t("form.presetLead")}
                  </Button>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="form-title" className="text-xs font-medium">
                    {t("form.fieldTitle")} *
                  </Label>
                  <Input
                    id="form-title"
                    placeholder={t("form.titlePlaceholder")}
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="form-slug" className="text-xs font-medium">
                    {t("form.fieldSlug")} *
                  </Label>
                  <div className="flex items-center rounded-xl border border-border/70 px-3 bg-muted/40">
                    <span className="text-xs text-foreground-muted select-none font-mono">
                      internal/
                    </span>
                    <input
                      id="form-slug"
                      className="w-full bg-transparent py-2 pl-1 text-xs outline-none text-foreground font-mono"
                      placeholder="workshop-bisnis"
                      value={slug}
                      onChange={(e) =>
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Type & Private Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="space-y-1.5">
                  <Label htmlFor="form-type" className="text-xs font-medium">
                    {t("form.fieldType")}
                  </Label>
                  <NativeSelect
                    id="form-type"
                    value={type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setType(e.target.value as FormType)
                    }
                    className="text-sm h-9"
                  >
                    <NativeSelectOption value="STANDARD">
                      {t("form.typeStandardFull")}
                    </NativeSelectOption>
                    <NativeSelectOption value="RESERVATION">
                      {t("form.typeReservationFull")}
                    </NativeSelectOption>
                    <NativeSelectOption value="LEAD">
                      {t("form.typeLeadFull")}
                    </NativeSelectOption>
                  </NativeSelect>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/70 bg-muted/30">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>{t("form.accessPrivateInternal")}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                        {t("form.mustBePrivate")}
                      </span>
                    </div>
                    <div className="text-[11px] text-foreground-muted">
                      {t("form.privateNotice")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="form-desc" className="text-xs font-medium">
                  {t("form.fieldDescription")}
                </Label>
                <Textarea
                  id="form-desc"
                  placeholder={t("form.descPlaceholder")}
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Form Fields Builder */}
              <div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-primary" />
                      {t("form.fieldBuilderTitle")}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t("form.systemAutoFieldsNotice")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                    className="text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t("form.addQuestion")}
                  </Button>
                </div>

                {/* Field Cards */}
                <div className="space-y-3 mt-3">
                  {fields.map((f, idx) => (
                    <div
                      key={f.id || idx}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-rose-500 hover:text-rose-700"
                          onClick={() => handleRemoveField(idx)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2 space-y-1">
                          <Label
                            htmlFor={`f-label-${idx}`}
                            className="text-[11px] font-medium"
                          >
                            {t("form.questionLabel")}
                          </Label>
                          <Input
                            id={`f-label-${idx}`}
                            value={f.label}
                            onChange={(e) =>
                              handleUpdateField(idx, "label", e.target.value)
                            }
                            placeholder={t(
                              "form.defaultFields.locationPlaceholder",
                            )}
                            className="text-xs h-8"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`f-type-${idx}`}
                            className="text-[11px] font-medium"
                          >
                            {t("form.inputType")}
                          </Label>
                          <NativeSelect
                            id={`f-type-${idx}`}
                            value={f.fieldType}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>,
                            ) =>
                              handleUpdateField(
                                idx,
                                "fieldType",
                                e.target.value as FormFieldType,
                              )
                            }
                            className="text-xs h-8"
                          >
                            {fieldTypes.map((ft) => (
                              <NativeSelectOption
                                key={ft.value}
                                value={ft.value}
                              >
                                {ft.label}
                              </NativeSelectOption>
                            ))}
                          </NativeSelect>
                        </div>
                      </div>

                      {/* Field key (name) & Required */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                        <div className="sm:col-span-2 space-y-1">
                          <Label
                            htmlFor={`f-name-${idx}`}
                            className="text-[11px] font-medium flex items-center gap-1"
                          >
                            {t("form.fieldName")}
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <span className="cursor-help inline-flex items-center" />
                                }
                              >
                                <HelpCircle className="w-3 h-3 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                {t("form.fieldNameTooltip")}
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id={`f-name-${idx}`}
                            value={f.name}
                            onChange={(e) =>
                              handleUpdateField(
                                idx,
                                "name",
                                e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9_]/g, ""),
                              )
                            }
                            placeholder="contoh: booking_date"
                            className="text-xs h-8 font-mono"
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                          <Switch
                            checked={f.required}
                            onCheckedChange={(val) =>
                              handleUpdateField(idx, "required", val)
                            }
                            id={`req-${idx}`}
                          />
                          <Label
                            htmlFor={`req-${idx}`}
                            className="text-xs font-medium cursor-pointer"
                          >
                            {t("form.requiredField")}
                          </Label>
                        </div>
                      </div>

                      {/* Select options editor */}
                      {f.fieldType === "select" && (
                        <div className="space-y-1 pt-1">
                          <Label
                            htmlFor={`f-opts-${idx}`}
                            className="text-[11px] font-medium"
                          >
                            {t("form.selectOptionsLabel")}
                          </Label>
                          <Input
                            id={`f-opts-${idx}`}
                            value={f.options?.join(", ") || ""}
                            onChange={(e) =>
                              handleUpdateField(
                                idx,
                                "options",
                                e.target.value.split(",").map((s) => s.trim()),
                              )
                            }
                            placeholder={t("form.selectOptionsPlaceholder")}
                            className="text-xs h-8"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Post-submit behavior */}
              <div>
                <Separator className="my-3" />
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="success-msg"
                      className="text-xs font-medium"
                    >
                      {t("form.fieldSuccessMsg")}
                    </Label>
                    <Input
                      id="success-msg"
                      value={successMessage}
                      onChange={(e) => setSuccessMessage(e.target.value)}
                      placeholder={t("form.defaultFields.successPlaceholder")}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="redirect-url"
                      className="text-xs font-medium"
                    >
                      {t("form.fieldRedirectUrl")}
                    </Label>
                    <Input
                      id="redirect-url"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder="https://tokoanda.com/terima-kasih"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Smartphone Mockup Preview */}
            <div
              className={cn(
                "w-full xl:w-5/12 2xl:w-2/5 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 dark:bg-zinc-950/40 flex flex-col items-center justify-center min-h-110",
                mobileTab === "preview" ? "flex" : "hidden xl:flex",
              )}
            >
              <FormPhoneMockup
                title={title}
                slug={slug}
                description={description}
                type={type}
                fields={fields}
                successMessage={successMessage}
                redirectUrl={redirectUrl}
              />
            </div>
          </div>

          <DialogFooter className="border-border/70 bg-muted/20 flex shrink-0 items-center justify-between border-t p-4 sm:px-6">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-foreground-muted">
              <RefreshCw className="size-3.5 text-foreground-muted" />
              <span>{t("form.preview.liveSyncHint")}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-9 rounded-xl border-border/70 px-4 text-xs cursor-pointer"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={isSubmitting}
                className="h-9 px-5 text-xs font-bold shadow-xs cursor-pointer"
              >
                {isSubmitting
                  ? t("common.saving")
                  : isEdit
                    ? t("form.saveChanges")
                    : t("form.createSubmit")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
