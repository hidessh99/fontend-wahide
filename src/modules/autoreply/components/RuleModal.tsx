"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, AlertCircle, Tag, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
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
import { Switch } from "@/components/ui/switch";
import {
  AutoreplyRule,
  ChannelType,
  MatchLogic,
  ReplyType,
  CreateRuleInput,
  UpdateRuleInput,
} from "../types/autoreply.types";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { useFlows } from "../hooks/useFlows";

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateRuleInput | UpdateRuleInput) => Promise<boolean>;
  editingRule?: AutoreplyRule | null;
}

export function RuleModal({
  isOpen,
  onClose,
  onSave,
  editingRule,
}: RuleModalProps) {
  const { t } = useI18n();
  const { devices } = useDevices();
  const { flows } = useFlows();
  const isMountedRef = useRef(true);

  const [name, setName] = useState("");
  const [channelType, setChannelType] = useState<ChannelType>("whatsapp");
  const [deviceId, setDeviceId] = useState("");
  const [matchLogic, setMatchLogic] = useState<MatchLogic>("CONTAINS");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [replyType, setReplyType] = useState<ReplyType>("TEXT");
  const [replyText, setReplyText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [flowId, setFlowId] = useState("");
  const [priority, setPriority] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (editingRule) {
      setName(editingRule.name);
      setChannelType(editingRule.channel_type);
      setDeviceId(editingRule.device_id);
      setMatchLogic(editingRule.match_logic);
      setKeywords(editingRule.keywords || []);
      setReplyType(editingRule.reply_type);
      setReplyText(editingRule.reply_text || "");
      setMediaUrl(editingRule.media_url || "");
      setFlowId(editingRule.flow_id || "");
      setPriority(editingRule.priority ?? 10);
      setIsActive(editingRule.is_active);
    } else {
      setName("");
      setChannelType("whatsapp");
      setDeviceId(devices[0]?.id || "");
      setMatchLogic("CONTAINS");
      setKeywords([]);
      setReplyType("TEXT");
      setReplyText("");
      setMediaUrl("");
      setFlowId("");
      setPriority(10);
      setIsActive(true);
    }
    setErrorMsg(null);
  }, [editingRule, isOpen, devices]);

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().toLowerCase();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setKeywordInput("");
      }
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== kwToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setErrorMsg("Nama aturan wajib diisi");
      return;
    }
    if (!editingRule && !deviceId) {
      setErrorMsg("Pilih perangkat pengirim");
      return;
    }

    const finalKeywords = [...keywords];
    if (keywordInput.trim()) {
      const parts = keywordInput
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
      for (const p of parts) {
        if (!finalKeywords.includes(p)) {
          finalKeywords.push(p);
        }
      }
      setKeywords(finalKeywords);
      setKeywordInput("");
    }

    if (finalKeywords.length === 0) {
      setErrorMsg("Minimal tambahkan 1 kata kunci pemicu (tekan Enter)");
      return;
    }
    if (replyType === "TEXT" && !replyText.trim()) {
      setErrorMsg("Isi teks template balasan");
      return;
    }
    if (replyType === "FLOW_TRIGGER" && !flowId) {
      setErrorMsg("Pilih alur flow yang akan dipicu");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: CreateRuleInput = {
      name: name.trim(),
      channel_type: channelType,
      device_id: deviceId,
      match_logic: matchLogic,
      reply_type: replyType,
      reply_text: replyType === "TEXT" ? replyText.trim() : undefined,
      media_url: replyType === "MEDIA" ? mediaUrl.trim() : undefined,
      flow_id: replyType === "FLOW_TRIGGER" ? flowId : undefined,
      keywords: finalKeywords,
      priority,
      is_active: isActive,
    };

    try {
      const success = await onSave(payload);
      if (success) {
        onClose();
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-surface border-border flex max-h-[92vh] sm:max-h-[90vh] w-[95vw] sm:max-w-2xl flex-col rounded-2xl p-0 shadow-2xl dark:bg-[#151714] overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="border-border flex flex-row items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Bot className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-foreground text-sm sm:text-base font-bold">
                {editingRule
                  ? t("autoreply.rules.modal.editTitle")
                  : t("autoreply.rules.modal.createTitle")}
              </DialogTitle>
              <DialogDescription className="text-foreground-muted text-[11px] sm:text-xs">
                {t("autoreply.rules.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <form
          id="rule-modal-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4 sm:space-y-5"
        >
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-destructive text-xs font-semibold">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Rule Name */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.rules.modal.nameLabel")}
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("autoreply.rules.modal.namePlaceholder")}
              variant="rounded"
              required
            />
          </div>

          {/* Channel Selector */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.rules.modal.channelLabel")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["whatsapp", "waba", "telegram"] as ChannelType[]).map((ch) => (
                <Button
                  key={ch}
                  type="button"
                  variant={channelType === ch ? "primaryPill" : "outline"}
                  size="sm"
                  onClick={() => setChannelType(ch)}
                  className={cn(
                    "w-full capitalize text-xs h-9",
                    channelType === ch && "shadow-xs font-bold",
                  )}
                >
                  {ch}
                </Button>
              ))}
            </div>
          </div>

          {/* Device Selector */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold block">
              {t("autoreply.rules.modal.deviceLabel")}
            </label>
            <NativeSelect
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              variant="rounded"
              className="w-full"
              required
            >
              <NativeSelectOption value="">
                {t("autoreply.rules.modal.selectDevice")}
              </NativeSelectOption>
              {devices.map((d) => (
                <NativeSelectOption key={d.id} value={d.id}>
                  {d.name || d.phone || d.id} ({d.status})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {/* Match Logic & Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold block">
                {t("autoreply.rules.modal.logicLabel")}
              </label>
              <NativeSelect
                value={matchLogic}
                onChange={(e) => setMatchLogic(e.target.value as MatchLogic)}
                variant="rounded"
                className="w-full"
              >
                <NativeSelectOption value="CONTAINS">
                  {t("autoreply.rules.logic.CONTAINS")}
                </NativeSelectOption>
                <NativeSelectOption value="EXACT">
                  {t("autoreply.rules.logic.EXACT")}
                </NativeSelectOption>
                <NativeSelectOption value="STARTS_WITH">
                  {t("autoreply.rules.logic.STARTS_WITH")}
                </NativeSelectOption>
                <NativeSelectOption value="REGEX">
                  {t("autoreply.rules.logic.REGEX")}
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.rules.modal.priorityLabel")}
              </label>
              <Input
                type="number"
                min="0"
                max="1000"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                variant="rounded"
              />
            </div>
          </div>

          {/* Keywords Tag Input */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.rules.modal.keywordsLabel")}
            </label>
            <div className="border-border bg-background focus-within:ring-wise-green/30 focus-within:border-wise-green flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border p-2 focus-within:ring-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="bg-muted text-foreground flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
                >
                  <Tag className="size-3 text-wise-green" />
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-foreground-muted hover:text-destructive ml-1 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <div className="flex flex-1 items-center gap-1.5 min-w-[140px]">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  placeholder={
                    keywords.length === 0
                      ? t("autoreply.rules.modal.keywordsPlaceholder")
                      : ""
                  }
                  className="bg-transparent text-foreground flex-1 px-1 text-xs font-medium focus:outline-none min-w-[80px]"
                />
                {keywordInput.trim() && (
                  <Button
                    type="button"
                    variant="primaryPill"
                    size="xs"
                    onClick={() => {
                      const parts = keywordInput
                        .split(",")
                        .map((k) => k.trim().toLowerCase())
                        .filter(Boolean);
                      const updated = [...keywords];
                      for (const p of parts) {
                        if (!updated.includes(p)) updated.push(p);
                      }
                      setKeywords(updated);
                      setKeywordInput("");
                    }}
                    className="text-[11px] font-bold shrink-0"
                  >
                    + Tambah
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Reply Type Selection */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.rules.modal.replyTypeLabel")}
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <Button
                type="button"
                variant={replyType === "TEXT" ? "primaryPill" : "outline"}
                size="sm"
                onClick={() => setReplyType("TEXT")}
                className="text-[11px] sm:text-xs h-9 font-bold"
              >
                {t("autoreply.rules.replyType.TEXT")}
              </Button>
              <Button
                type="button"
                variant={replyType === "MEDIA" ? "primaryPill" : "outline"}
                size="sm"
                onClick={() => setReplyType("MEDIA")}
                className="text-[11px] sm:text-xs h-9 font-bold"
              >
                {t("autoreply.rules.replyType.MEDIA")}
              </Button>
              <Button
                type="button"
                variant={replyType === "FLOW_TRIGGER" ? "primaryPill" : "outline"}
                size="sm"
                onClick={() => setReplyType("FLOW_TRIGGER")}
                className="text-[11px] sm:text-xs h-9 font-bold"
              >
                {t("autoreply.rules.replyType.FLOW_TRIGGER")}
              </Button>
            </div>
          </div>

          {/* Reply Content based on type */}
          {replyType === "TEXT" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-foreground text-xs font-bold">
                  {t("autoreply.rules.modal.replyTextLabel")}
                </label>
                <span className="text-foreground-muted text-[10px]">
                  {replyText.length} karakter
                </span>
              </div>
              <Textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("autoreply.rules.modal.replyTextPlaceholder")}
                className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border p-3 text-xs font-medium focus:ring-2 focus:outline-none"
              />
              <p className="text-foreground-muted text-[11px]">
                {t("autoreply.rules.modal.replyTextHelp")}
              </p>
            </div>
          )}

          {replyType === "MEDIA" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold">
                  {t("autoreply.rules.modal.mediaUrlLabel")}
                </label>
                <Input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={t("autoreply.rules.modal.mediaUrlPlaceholder")}
                  variant="rounded"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold">
                  Caption / Keterangan Teks (Opsional)
                </label>
                <Input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Keterangan gambar atau brosur..."
                  variant="rounded"
                />
              </div>
            </div>
          )}

          {replyType === "FLOW_TRIGGER" && (
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold block">
                {t("autoreply.rules.modal.flowLabel")}
              </label>
              <NativeSelect
                value={flowId}
                onChange={(e) => setFlowId(e.target.value)}
                variant="rounded"
                className="w-full"
                required
              >
                <NativeSelectOption value="">
                  {t("autoreply.rules.modal.selectFlow")}
                </NativeSelectOption>
                {flows.map((f) => (
                  <NativeSelectOption key={f.id} value={f.id}>
                    {f.name} ({f.canvas_graph?.nodes?.length || 0} nodes)
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          )}

          {/* Active Status Switch */}
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div className="space-y-0.5">
              <span className="text-foreground text-xs font-bold block">
                {t("autoreply.rules.modal.activeLabel")}
              </span>
              <span className="text-foreground-muted text-[10px]">
                {isActive
                  ? "Aturan aktif dan akan merespons pesan masuk"
                  : "Aturan nonaktif sementara"}
              </span>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </form>

        {/* Footer */}
        <div className="border-border flex items-center justify-end gap-2 border-t p-4 bg-muted/10 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full px-4 text-xs font-bold"
          >
            {t("autoreply.rules.modal.cancel")}
          </Button>
          <Button
            type="submit"
            form="rule-modal-form"
            variant="primaryPill"
            size="sm"
            disabled={isSubmitting}
            className="gap-2 px-5 text-xs font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("autoreply.rules.modal.saving")}</span>
              </>
            ) : (
              <span>{t("autoreply.rules.modal.save")}</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
