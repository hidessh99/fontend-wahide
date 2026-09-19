"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Bot,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
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

  if (!isOpen) return null;

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
      const parts = keywordInput.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
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

    const success = await onSave(payload);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface border-border flex max-h-[92vh] sm:max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border shadow-2xl dark:bg-[#151714]">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Bot className="size-5" />
            </div>
            <div>
              <h3 className="text-foreground text-sm sm:text-base font-bold">
                {editingRule
                  ? t("autoreply.rules.modal.editTitle")
                  : t("autoreply.rules.modal.createTitle")}
              </h3>
              <p className="text-foreground-muted text-[11px] sm:text-xs">
                {t("autoreply.rules.subtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-foreground-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4 sm:space-y-5">
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
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("autoreply.rules.modal.namePlaceholder")}
              className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
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
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannelType(ch)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-all",
                    channelType === ch
                      ? "border-wise-green bg-wise-green/10 text-dark-green dark:text-wise-green font-bold shadow-sm"
                      : "border-border text-foreground-secondary hover:bg-muted",
                  )}
                >
                  <span className="capitalize">{ch}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Device Selector */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.rules.modal.deviceLabel")}
            </label>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
              required
            >
              <option value="">{t("autoreply.rules.modal.selectDevice")}</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name || d.phone || d.id} ({d.status})
                </option>
              ))}
            </select>
          </div>

          {/* Match Logic & Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.rules.modal.logicLabel")}
              </label>
              <select
                value={matchLogic}
                onChange={(e) => setMatchLogic(e.target.value as MatchLogic)}
                className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
              >
                <option value="CONTAINS">{t("autoreply.rules.logic.CONTAINS")}</option>
                <option value="EXACT">{t("autoreply.rules.logic.EXACT")}</option>
                <option value="STARTS_WITH">{t("autoreply.rules.logic.STARTS_WITH")}</option>
                <option value="REGEX">{t("autoreply.rules.logic.REGEX")}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.rules.modal.priorityLabel")}
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
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
                    className="text-foreground-muted hover:text-destructive ml-1"
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
                  <button
                    type="button"
                    onClick={() => {
                      const parts = keywordInput.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
                      const updated = [...keywords];
                      for (const p of parts) {
                        if (!updated.includes(p)) updated.push(p);
                      }
                      setKeywords(updated);
                      setKeywordInput("");
                    }}
                    className="bg-wise-green text-dark-green rounded-lg px-2.5 py-1 text-[11px] font-bold shrink-0 transition-opacity hover:opacity-90"
                  >
                    + Tambah
                  </button>
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
              <button
                type="button"
                onClick={() => setReplyType("TEXT")}
                className={cn(
                  "flex items-center justify-center rounded-xl border px-1.5 py-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-center leading-tight transition-all",
                  replyType === "TEXT"
                    ? "border-wise-green bg-wise-green/10 text-dark-green dark:text-wise-green"
                    : "border-border text-foreground-secondary hover:bg-muted",
                )}
              >
                {t("autoreply.rules.replyType.TEXT")}
              </button>
              <button
                type="button"
                onClick={() => setReplyType("MEDIA")}
                className={cn(
                  "flex items-center justify-center rounded-xl border px-1.5 py-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-center leading-tight transition-all",
                  replyType === "MEDIA"
                    ? "border-wise-green bg-wise-green/10 text-dark-green dark:text-wise-green"
                    : "border-border text-foreground-secondary hover:bg-muted",
                )}
              >
                {t("autoreply.rules.replyType.MEDIA")}
              </button>
              <button
                type="button"
                onClick={() => setReplyType("FLOW_TRIGGER")}
                className={cn(
                  "flex items-center justify-center rounded-xl border px-1.5 py-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-center leading-tight transition-all",
                  replyType === "FLOW_TRIGGER"
                    ? "border-wise-green bg-wise-green/10 text-dark-green dark:text-wise-green"
                    : "border-border text-foreground-secondary hover:bg-muted",
                )}
              >
                {t("autoreply.rules.replyType.FLOW_TRIGGER")}
              </button>
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
              <textarea
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
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={t("autoreply.rules.modal.mediaUrlPlaceholder")}
                  className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold">
                  Caption / Keterangan Teks (Opsional)
                </label>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Keterangan gambar atau brosur..."
                  className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
          )}

          {replyType === "FLOW_TRIGGER" && (
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.rules.modal.flowLabel")}
              </label>
              <select
                value={flowId}
                onChange={(e) => setFlowId(e.target.value)}
                className="bg-background border-border text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
                required
              >
                <option value="">{t("autoreply.rules.modal.selectFlow")}</option>
                {flows.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.canvas_graph?.nodes?.length || 0} nodes)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active Status Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-wise-green size-4 rounded"
            />
            <span className="text-foreground text-xs font-bold">
              {t("autoreply.rules.modal.activeLabel")}
            </span>
          </label>
        </form>

        {/* Footer */}
        <div className="border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 border-t px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-border text-foreground-secondary hover:bg-muted flex h-10 sm:h-9 w-full sm:w-auto items-center justify-center rounded-xl border px-4 text-xs font-bold transition-colors"
          >
            {t("autoreply.rules.modal.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-wise-green text-dark-green hover:brightness-105 flex h-10 sm:h-9 w-full sm:w-auto items-center justify-center rounded-xl px-5 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            {isSubmitting
              ? t("autoreply.rules.modal.saving")
              : t("autoreply.rules.modal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
