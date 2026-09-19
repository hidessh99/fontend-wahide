"use client";

import React, { useState } from "react";
import {
  Template,
  TemplateCategory,
  TemplateMediaType,
  TemplateButton,
  TemplateChannelType,
  TelegramParseMode,
  TelegramInlineRow,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "../../types/template.types";
import { WhatsAppPhoneMockup } from "./WhatsAppPhoneMockup";
import { VariableQuickInsert } from "./VariableQuickInsert";
import { TelegramInlineKeyboardBuilder } from "./TelegramInlineKeyboardBuilder";
import { TelegramChatPreview } from "./TelegramChatPreview";
import {
  Plus,
  Trash2,
  Layers,
  Smartphone,
  Check,
  LayoutTemplate,
  ArrowRight,
  RefreshCw,
  Bot,
  Globe,
} from "lucide-react";
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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateTemplateInput | UpdateTemplateInput,
  ) => Promise<boolean>;
  initialData?: Template | null;
  lockChannel?: TemplateChannelType;
}

function TemplateEditorContent({
  onClose,
  onSubmit,
  initialData,
  lockChannel,
}: {
  onClose: () => void;
  onSubmit: (
    data: CreateTemplateInput | UpdateTemplateInput,
  ) => Promise<boolean>;
  initialData?: Template | null;
  lockChannel?: TemplateChannelType;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<TemplateCategory>(
    initialData?.category || "MARKETING",
  );
  const [content, setContent] = useState(
    initialData !== undefined && initialData !== null
      ? initialData.content
      : "Halo {{nama}}, terima kasih telah menghubungi kami! Berikut adalah konfirmasi pesanan Anda dengan nomor {{invoice}}.",
  );
  const [mediaType, setMediaType] = useState<TemplateMediaType>(
    initialData?.mediaType || "NONE",
  );
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || "");
  const [buttons, setButtons] = useState<TemplateButton[]>(
    initialData?.buttons || [],
  );
  const [channelType, setChannelType] = useState<TemplateChannelType>(
    lockChannel || initialData?.channelType || "ALL",
  );
  const [parseMode, setParseMode] = useState<TelegramParseMode>(
    initialData?.telegramDetail?.parseMode || "HTML",
  );
  const [inlineKeyboard, setInlineKeyboard] = useState<TelegramInlineRow[]>(
    initialData?.telegramDetail?.inlineKeyboard || [],
  );
  const [disableWebPagePreview, setDisableWebPagePreview] = useState<boolean>(
    initialData?.telegramDetail?.disableWebPagePreview || false,
  );
  const [previewChannel, setPreviewChannel] = useState<"WHATSAPP" | "TELEGRAM">(
    (lockChannel === "TELEGRAM_BOT" || (!lockChannel && initialData?.channelType === "TELEGRAM_BOT"))
      ? "TELEGRAM"
      : "WHATSAPP",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const handleInsertVariable = (varName: string) => {
    setContent((prev) => `${prev} {{${varName}}}`);
  };

  const handleAddButton = () => {
    if (buttons.length >= 3) return; // WhatsApp allows up to 3 quick reply / CTA buttons
    setButtons((prev) => [
      ...prev,
      { type: "QUICK_REPLY", text: "Balas Cepat", value: "" },
    ]);
  };

  const handleRemoveButton = (index: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateButton = (
    index: number,
    field: keyof TemplateButton,
    value: string,
  ) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === index ? { ...btn, [field]: value } : btn)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const payload: CreateTemplateInput | UpdateTemplateInput = {
      name: name.trim(),
      category,
      channelType,
      content: content.trim(),
      mediaType,
      mediaUrl: mediaUrl.trim() || undefined,
      buttons: buttons.length > 0 ? buttons : undefined,
      isFavorite: initialData?.isFavorite || false,
      telegramDetail:
        channelType === "TELEGRAM_BOT" || channelType === "ALL"
          ? {
              parseMode,
              inlineKeyboard:
                inlineKeyboard.length > 0 ? inlineKeyboard : undefined,
              disableWebPagePreview,
            }
          : undefined,
    };

    const success = await onSubmit(payload);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={true}
        className="flex max-h-[92dvh] w-[96vw] sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col overflow-hidden rounded-3xl p-0 border border-border shadow-2xl bg-surface"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border/60 px-5 sm:px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LayoutTemplate className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground sm:text-lg">
                {initialData
                  ? t("template.editor.editTitle")
                  : t("template.editor.createTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-foreground-muted">
                {t("template.editor.subtitle")}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-7">
            {/* Mobile Tab Toggle (Visible only on < lg screens) */}
            <div className="lg:hidden">
              <Tabs
                value={mobileTab}
                onValueChange={(v) => setMobileTab(v as "form" | "preview")}
              >
                <TabsList className="h-8 p-0.5 bg-muted rounded-lg">
                  <TabsTrigger
                    value="form"
                    className="text-xs gap-1 px-2.5 py-1"
                  >
                    <Layers className="size-3.5" />
                    <span>{t("template.editor.tabForm")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="text-xs gap-1 px-2.5 py-1"
                  >
                    <Smartphone className="size-3.5" />
                    <span>{t("template.editor.tabPreview")}</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body: Split Layout */}
        <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">
          {/* Left Column: Form Controls */}
          <div
            className={cn(
              "w-full lg:w-7/12 xl:w-3/5 overflow-y-auto p-5 sm:p-6 space-y-5 border-border/60 lg:border-r flex flex-col",
              mobileTab === "form" ? "block" : "hidden lg:block",
            )}
          >
            <form
              id="template-editor-form"
              onSubmit={handleSubmit}
              className="space-y-4 flex-1"
            >
              {/* Template Name & Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="template-name">
                    {t("template.editor.nameLabel")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="template-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("template.editor.namePlaceholder")}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="template-category">
                    {t("template.editor.categoryLabel")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <NativeSelect
                    id="template-category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as TemplateCategory)
                    }
                    className="h-10 text-xs rounded-xl"
                  >
                    <NativeSelectOption value="MARKETING">
                      {t("template.categories.marketing")}
                    </NativeSelectOption>
                    <NativeSelectOption value="UTILITY">
                      {t("template.categories.utility")}
                    </NativeSelectOption>
                    <NativeSelectOption value="REMINDER">
                      {t("template.categories.reminder")}
                    </NativeSelectOption>
                    <NativeSelectOption value="RESERVATION">
                      {t("template.categories.reservation")}
                    </NativeSelectOption>
                    <NativeSelectOption value="QUICK_REPLY">
                      {t("template.categories.quickReply")}
                    </NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>

              {/* Target Channel Selector (Only visible if channel is not locked) */}
              {!lockChannel && (
                <div className="space-y-1.5">
                  <Label>{t("template.channels.targetChannelLabel")}</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { id: "ALL", label: t("template.channels.allShort"), icon: Globe },
                      { id: "WHATSMEOW_UNOFFICIAL", label: t("template.channels.whatsappShort"), icon: Smartphone },
                      { id: "META_WABA_OFFICIAL", label: t("template.channels.waba"), icon: Check },
                      { id: "TELEGRAM_BOT", label: t("template.channels.telegram"), icon: Bot },
                    ].map((ch) => {
                      const Icon = ch.icon;
                      const isSelected = channelType === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            setChannelType(ch.id as TemplateChannelType);
                            if (ch.id === "TELEGRAM_BOT") setPreviewChannel("TELEGRAM");
                            else if (
                              ch.id === "WHATSMEOW_UNOFFICIAL" ||
                              ch.id === "META_WABA_OFFICIAL"
                            )
                              setPreviewChannel("WHATSAPP");
                          }}
                          className={cn(
                            "flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/70 bg-card hover:bg-muted text-foreground-secondary",
                          )}
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span className="truncate">{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Media Header Section */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    {t("template.editor.mediaLabel")}
                  </span>
                  <div className="flex items-center gap-1 rounded-xl bg-muted p-0.5">
                    {(["NONE", "IMAGE", "DOCUMENT"] as TemplateMediaType[]).map(
                      (m) => (
                        <Button
                          key={m}
                          type="button"
                          variant={mediaType === m ? "default" : "ghost"}
                          size="xs"
                          onClick={() => setMediaType(m)}
                          className="rounded-lg text-[11px] cursor-pointer"
                        >
                          {m === "NONE" && t("template.mediaTypes.none")}
                          {m === "IMAGE" && t("template.mediaTypes.image")}
                          {m === "DOCUMENT" &&
                            t("template.mediaTypes.document")}
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                {mediaType !== "NONE" && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <Label htmlFor="template-media-url" className="text-[11px]">
                      {t("template.mediaUrlLabel")}
                    </Label>
                    <Input
                      id="template-media-url"
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder={t("template.mediaUrlPlaceholder")}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Message Content Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="template-content">
                    {t("template.editor.contentLabel")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-foreground-muted">
                    {t("template.charCount", { count: content.length })}
                  </span>
                </div>

                <Textarea
                  id="template-content"
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("template.editor.contentPlaceholder")}
                  className="rounded-2xl p-3.5 text-xs leading-relaxed resize-none"
                />

                {/* WhatsApp Formatting Helper */}
                <div className="flex items-center justify-between text-[11px] text-foreground-muted px-1">
                  <span>{t("template.editor.formatHint")}</span>
                  <span className="hidden lg:inline-flex items-center gap-1 text-[10px] bg-muted/80 text-foreground-muted px-2 py-0.5 rounded-full font-medium">
                    <span>{t("template.editor.livePreviewSide")}</span>
                    <ArrowRight className="size-2.5" />
                  </span>
                </div>

                {/* Variable Quick Insert Chips */}
                <VariableQuickInsert onInsert={handleInsertVariable} />
              </div>

              {/* Interactive Buttons Builder */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground">
                      {t("template.editor.buttonsTitle")}
                    </span>
                    <p className="text-[11px] text-foreground-muted">
                      {t("template.editor.buttonsDesc")}
                    </p>
                  </div>

                  {buttons.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddButton}
                      className="h-7 gap-1 rounded-xl text-xs cursor-pointer"
                    >
                      <Plus className="size-3" />
                      {t("template.editor.addButton")}
                    </Button>
                  )}
                </div>

                {buttons.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-2.5 sm:flex-row sm:items-center"
                      >
                        <NativeSelect
                          value={btn.type}
                          onChange={(e) =>
                            handleUpdateButton(idx, "type", e.target.value)
                          }
                          className="h-8 rounded-lg text-xs w-32"
                        >
                          <NativeSelectOption value="QUICK_REPLY">
                            Quick Reply
                          </NativeSelectOption>
                          <NativeSelectOption value="URL">
                            {t("template.editor.btnUrl")}
                          </NativeSelectOption>
                          <NativeSelectOption value="CALL">
                            {t("template.editor.btnCall")}
                          </NativeSelectOption>
                        </NativeSelect>

                        <Input
                          type="text"
                          required
                          value={btn.text}
                          onChange={(e) =>
                            handleUpdateButton(idx, "text", e.target.value)
                          }
                          placeholder={t("template.editor.btnTextPlaceholder")}
                          className="h-8 flex-1 rounded-lg text-xs"
                        />

                        {btn.type !== "QUICK_REPLY" && (
                          <Input
                            type="text"
                            value={btn.value || ""}
                            onChange={(e) =>
                              handleUpdateButton(idx, "value", e.target.value)
                            }
                            placeholder={
                              btn.type === "URL"
                                ? "https://link.com"
                                : "+628123456789"
                            }
                            className="h-8 flex-1 rounded-lg text-xs"
                          />
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveButton(idx)}
                          className="text-destructive hover:bg-destructive/10 cursor-pointer self-end sm:self-auto"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Telegram Specific Configuration Block */}
              {(channelType === "TELEGRAM_BOT" || channelType === "ALL") && (
                <div className="space-y-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-3.5 dark:bg-sky-950/10">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400">
                      <Bot className="size-3.5" />
                    </div>
                    <div>
                      <h4 className="text-foreground text-xs font-bold">
                        {t("template.telegram.settingsTitle")}
                      </h4>
                      <p className="text-foreground-secondary text-[11px]">
                        {t("template.telegram.settingsDesc")}
                      </p>
                    </div>
                  </div>

                  {/* Parse Mode Switcher */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-foreground-secondary text-xs font-semibold">
                      {t("template.telegram.parseMode")}
                    </span>
                    <div className="flex items-center gap-1 rounded-xl bg-muted p-0.5">
                      {(["HTML", "MarkdownV2", "PLAIN"] as TelegramParseMode[]).map(
                        (mode) => (
                          <Button
                            key={mode}
                            type="button"
                            variant={parseMode === mode ? "default" : "ghost"}
                            size="xs"
                            onClick={() => setParseMode(mode)}
                            className="rounded-lg text-[11px] cursor-pointer"
                          >
                            {mode}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Disable Web Page Preview Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-2.5 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">
                        {t("template.telegram.disableWebPreviewTitle")}
                      </p>
                      <p className="text-[11px] text-foreground-muted">
                        {t("template.telegram.disableWebPreviewDesc")}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={disableWebPagePreview}
                      onChange={(e) =>
                        setDisableWebPagePreview(e.target.checked)
                      }
                      className="size-4 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  {/* Inline Keyboard Builder */}
                  <TelegramInlineKeyboardBuilder
                    value={inlineKeyboard}
                    onChange={setInlineKeyboard}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Live Mockup Preview */}
          <div
            className={cn(
              "w-full lg:w-5/12 xl:w-2/5 overflow-y-auto p-5 sm:p-6 bg-slate-50/70 dark:bg-zinc-950/40 flex flex-col items-center justify-center min-h-105",
              mobileTab === "preview" ? "flex" : "hidden lg:flex",
            )}
          >
            {/* Channel Preview Switcher (Only visible if channel is not locked) */}
            {!lockChannel && (
              <div className="mb-3 flex items-center gap-1 rounded-full border border-border/80 bg-background/80 p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setPreviewChannel("WHATSAPP")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                    previewChannel === "WHATSAPP"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "text-foreground-muted hover:text-foreground",
                  )}
                >
                  <Smartphone className="size-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewChannel("TELEGRAM")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                    previewChannel === "TELEGRAM"
                      ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                      : "text-foreground-muted hover:text-foreground",
                  )}
                >
                  <Bot className="size-3.5" />
                  <span>Telegram Bot</span>
                </button>
              </div>
            )}

            <div className="w-full max-w-85 my-auto">
              {previewChannel === "WHATSAPP" ? (
                <WhatsAppPhoneMockup
                  name={name}
                  category={category}
                  content={content}
                  mediaType={mediaType}
                  mediaUrl={mediaUrl}
                  buttons={buttons}
                />
              ) : (
                <TelegramChatPreview
                  name={name}
                  category={category}
                  content={content}
                  parseMode={parseMode}
                  mediaType={mediaType}
                  mediaUrl={mediaUrl}
                  inlineKeyboard={inlineKeyboard}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 sm:px-6 py-3.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-foreground-muted">
            <RefreshCw className="size-3.5 text-foreground-muted" />
            <span>{t("template.editor.liveSyncHint")}</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full cursor-pointer px-4"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              form="template-editor-form"
              disabled={isSubmitting || !name.trim() || !content.trim()}
              size="sm"
              className="cursor-pointer px-5 font-bold shadow-xs"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("saving")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Check className="size-4" />
                  {initialData?.id
                    ? t("template.editor.saveChanges")
                    : t("template.editor.createSubmit")}
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TemplateEditorModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  lockChannel,
}: TemplateEditorModalProps) {
  if (!isOpen) return null;

  return (
    <TemplateEditorContent
      key={
        initialData?.id
          ? initialData.id
          : initialData
          ? `preset_${initialData.name}_${initialData.category}`
          : "new"
      }
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      lockChannel={lockChannel}
    />
  );
}
