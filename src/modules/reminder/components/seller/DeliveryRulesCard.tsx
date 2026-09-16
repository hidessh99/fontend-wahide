"use client";

import React, { useState, useEffect } from "react";
import {
  ReminderRule,
  DripRuleItem,
  UpdateReminderRuleInput,
  ReminderChannelType,
} from "../../types/reminder.types";
import { VariableInsertChips } from "./VariableInsertChips";
import { ReminderChannelSelector } from "./ReminderChannelSelector";
import {
  ReminderWabaTemplatePicker,
  DEFAULT_REMINDER_WABA_TEMPLATES,
} from "./ReminderWabaTemplatePicker";
import { useOmnichannelSenders } from "@/modules/omnichannel/hooks/useOmnichannelSenders";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Smartphone,
  ShieldCheck,
  Bot,
  MessageSquare,
  Layers,
  Save,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface DeliveryRulesCardProps {
  initialRule: ReminderRule;
  onSave: (input: UpdateReminderRuleInput) => Promise<boolean>;
  isSaving: boolean;
}

export function DeliveryRulesCard({
  initialRule,
  onSave,
  isSaving,
}: DeliveryRulesCardProps) {
  const { t } = useI18n();

  const {
    activeDevices,
    activeWabaAccounts,
    activeTelegramBots,
    activeCounts,
    isLoading: isLoadingSenders,
  } = useOmnichannelSenders();

  const [channelType, setChannelType] = useState<ReminderChannelType>(
    initialRule.channelType || "WHATSAPP_WEB"
  );
  const [deviceId, setDeviceId] = useState(initialRule.deviceId || "");
  const [sendTime, setSendTime] = useState(initialRule.sendTime || "09:00");
  const [showInChat, setShowInChat] = useState(initialRule.showInChat ?? true);
  const [rules, setRules] = useState<DripRuleItem[]>(initialRule.rules || []);
  const [activeTabOffset, setActiveTabOffset] = useState<number>(-1);

  // Sync state if initialRule updates
  useEffect(() => {
    setChannelType(initialRule.channelType || "WHATSAPP_WEB");
    setDeviceId(initialRule.deviceId || "");
    setSendTime(initialRule.sendTime || "09:00");
    setShowInChat(initialRule.showInChat ?? true);
    if (initialRule.rules && initialRule.rules.length > 0) {
      setRules(initialRule.rules);
    }
  }, [initialRule]);

  // Auto-select valid sender when channel changes if deviceId is empty or not in active list
  useEffect(() => {
    if (channelType === "WHATSAPP_WEB") {
      const exists = activeDevices.some((d) => d.id === deviceId);
      if (!exists && activeDevices.length > 0) {
        setDeviceId(activeDevices[0].id);
      }
    } else if (channelType === "WHATSAPP_OFFICIAL") {
      const exists = activeWabaAccounts.some((w) => w.id === deviceId);
      if (!exists && activeWabaAccounts.length > 0) {
        setDeviceId(activeWabaAccounts[0].id);
      }
    } else if (channelType === "TELEGRAM") {
      const exists = activeTelegramBots.some((b) => b.id === deviceId);
      if (!exists && activeTelegramBots.length > 0) {
        setDeviceId(activeTelegramBots[0].id);
      }
    }
  }, [channelType, activeDevices, activeWabaAccounts, activeTelegramBots, deviceId]);

  // Active drip rule item
  const activeRuleIndex = rules.findIndex(
    (r) => r.daysOffset === activeTabOffset,
  );
  const activeRule = activeRuleIndex >= 0 ? rules[activeRuleIndex] : null;

  const handleUpdateActiveRule = (field: keyof DripRuleItem, val: unknown) => {
    if (activeRuleIndex < 0) return;
    setRules((prev) => {
      const updated = [...prev];
      updated[activeRuleIndex] = {
        ...updated[activeRuleIndex],
        [field]: val,
      };
      return updated;
    });
  };

  const handleInsertVariable = (varName: string) => {
    if (!activeRule) return;
    const newTemplate = `${activeRule.template} {{${varName}}}`;
    handleUpdateActiveRule("template", newTemplate);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      deviceId,
      channelType,
      sendTime,
      showInChat,
      rules,
    });
  };

  const activePhaseChannel: ReminderChannelType =
    activeRule?.channelType || channelType;

  return (
    <Card className="p-5">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Clock className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <span>{t("reminder.rules.title") || "Aturan Pengiriman Pengingat Otomatis"}</span>
              <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30">
                Omnichannel
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              {t("reminder.rules.subtitle") || "Konfigurasi saluran pengiriman utama, jam pengiriman harian, dan template drip otomatis."}
            </CardDescription>
          </div>
        </div>

        <Button
          type="button"
          variant="primaryPill"
          onClick={handleFormSubmit}
          disabled={isSaving}
          className="h-9 gap-1.5 px-4 text-xs font-bold self-start sm:self-auto shadow-xs cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              {t("reminder.rules.saving") || "Menyimpan..."}
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              {t("reminder.rules.saveRules") || "Simpan Aturan"}
            </>
          )}
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Section 1: Default Omnichannel Selector */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                <span>Saluran Utama Pengingat (Default Channel)</span>
              </Label>
              <ReminderChannelSelector
                selectedChannel={channelType}
                onSelectChannel={setChannelType}
                activeCounts={activeCounts}
                variant="pills"
              />
            </div>
            <p className="text-[11px] text-foreground-muted">
              Pilih saluran transmisi standar untuk seluruh jadwal pengingat. Setiap fase offset (H-1, Hari H, dll.) juga dapat di-override dengan kanal khusus di bawah.
            </p>
          </div>

          {/* Section 2: Core Settings: Sender & Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Dynamic Sender Selector based on channelType */}
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <Label htmlFor="rem-device" className="text-xs font-semibold flex items-center gap-1.5">
                {channelType === "WHATSAPP_WEB" ? (
                  <Smartphone className="size-3.5 text-emerald-500" />
                ) : channelType === "WHATSAPP_OFFICIAL" ? (
                  <ShieldCheck className="size-3.5 text-sky-500" />
                ) : (
                  <Bot className="size-3.5 text-blue-500" />
                )}
                <span>
                  {channelType === "WHATSAPP_WEB"
                    ? "Perangkat WhatsApp Socket"
                    : channelType === "WHATSAPP_OFFICIAL"
                    ? "Akun Meta WABA Resmi"
                    : "Bot Telegram Pengirim"}
                </span>
              </Label>

              <NativeSelect
                id="rem-device"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                disabled={isSaving || isLoadingSenders}
                className="h-10 text-xs rounded-xl"
              >
                <NativeSelectOption value="">
                  {channelType === "WHATSAPP_WEB"
                    ? "-- Pilih Perangkat Handphone --"
                    : channelType === "WHATSAPP_OFFICIAL"
                    ? "-- Pilih Akun Meta WABA --"
                    : "-- Pilih Bot Telegram --"}
                </NativeSelectOption>

                {channelType === "WHATSAPP_WEB" &&
                  activeDevices.map((d) => {
                    const isOver = Boolean(d.is_over_limit || d.isOverLimit);
                    return (
                      <NativeSelectOption
                        key={d.id}
                        value={d.id}
                        disabled={isOver}
                      >
                        {d.name} {d.phone ? `(${d.phone})` : ""} [{d.status}]
                      </NativeSelectOption>
                    );
                  })}

                {channelType === "WHATSAPP_OFFICIAL" &&
                  activeWabaAccounts.map((w) => (
                    <NativeSelectOption key={w.id} value={w.id}>
                      {w.verified_name || w.phone_number} ({w.phone_number}) [Centang Hijau]
                    </NativeSelectOption>
                  ))}

                {channelType === "TELEGRAM" &&
                  activeTelegramBots.map((b) => (
                    <NativeSelectOption key={b.id} value={b.id}>
                      {b.first_name || b.username} (@{b.username}) [Aktif]
                    </NativeSelectOption>
                  ))}
              </NativeSelect>

              {channelType === "WHATSAPP_WEB" && activeDevices.length === 0 && !isLoadingSenders && (
                <p className="text-[11px] text-amber-500 flex items-center gap-1">
                  <AlertCircle className="size-3" /> Belum ada perangkat WhatsApp terhubung.
                </p>
              )}
              {channelType === "WHATSAPP_OFFICIAL" && activeWabaAccounts.length === 0 && !isLoadingSenders && (
                <p className="text-[11px] text-amber-500 flex items-center gap-1">
                  <AlertCircle className="size-3" /> Belum ada akun Meta WABA resmi aktif.
                </p>
              )}
              {channelType === "TELEGRAM" && activeTelegramBots.length === 0 && !isLoadingSenders && (
                <p className="text-[11px] text-amber-500 flex items-center gap-1">
                  <AlertCircle className="size-3" /> Belum ada bot Telegram aktif.
                </p>
              )}
            </div>

            {/* Send Time */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rem-send-time" className="text-xs font-semibold flex items-center gap-1.5">
                <Clock className="size-3.5 text-blue-500" />
                <span>{t("reminder.rules.sendTime") || "Waktu Kirim Harian"}</span>
              </Label>
              <Input
                id="rem-send-time"
                type="time"
                value={sendTime}
                onChange={(e) => setSendTime(e.target.value)}
                disabled={isSaving}
                className="h-10 text-xs rounded-xl"
                required
              />
              <span className="text-[10px] text-foreground-muted">
                Jadwal otomatis dievaluasi setiap hari pada jam ini.
              </span>
            </div>

            {/* Show in Chat Switch */}
            <div className="flex flex-col justify-center gap-2 rounded-xl border border-border/50 bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
                  <MessageSquare className="size-3.5 text-emerald-500" />
                  <span>{t("reminder.rules.chatVisibility") || "Tampilkan di Riwayat Chat"}</span>
                </Label>
                <Switch
                  checked={showInChat}
                  onCheckedChange={setShowInChat}
                  disabled={isSaving}
                />
              </div>
              <span className="text-[11px] text-foreground-muted">
                {t("reminder.rules.chatVisibilityDesc") || "Munculkan pesan pengingat di inbox obrolan pelanggan setelah terkirim."}
              </span>
            </div>
          </div>

          {/* Section 3: Drip Rules Tabs & Adaptive Editor */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Layers className="size-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-foreground block">
                    {t("reminder.rules.dripPhases") || "Fase Pengingat Otomatis (Drip Phases)"}
                  </span>
                  <span className="text-[11px] text-foreground-muted">
                    Atur konten pesan dan saluran untuk masing-masing fase waktu jadwal.
                  </span>
                </div>
              </div>
              <Tabs
                value={String(activeTabOffset)}
                onValueChange={(v) => setActiveTabOffset(Number(v))}
                className="w-full sm:w-auto"
              >
                <TabsList className="h-10 sm:h-11 p-1 rounded-xl bg-slate-200/80 dark:bg-muted/60 border border-border/70 shadow-2xs flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
                  {rules.map((r) => {
                    const isCurrentActive = activeTabOffset === r.daysOffset;
                    return (
                      <TabsTrigger
                        key={r.daysOffset}
                        value={String(r.daysOffset)}
                        className={cn(
                          "h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium gap-2 rounded-lg cursor-pointer transition-all shrink-0 flex-1 sm:flex-initial justify-center",
                          "text-muted-foreground hover:text-foreground",
                          "data-active:bg-white dark:data-active:bg-card data-active:text-foreground data-active:font-bold data-active:shadow-xs",
                          "border border-transparent data-active:border-border/80 data-active:ring-1 data-active:ring-black/5 dark:data-active:ring-white/10",
                        )}
                      >
                        <span
                          className={cn(
                            "size-2 rounded-full transition-all shrink-0",
                            r.isEnabled
                              ? "bg-emerald-500 ring-2 ring-emerald-500/25"
                              : "bg-muted-foreground/30",
                          )}
                        />
                        <span>
                          {r.daysOffset < 0
                            ? `H${r.daysOffset}`
                            : r.daysOffset === 0
                              ? "Hari H"
                              : `H+${r.daysOffset}`}
                        </span>
                        {r.isEnabled ? (
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors hidden sm:inline-block",
                              isCurrentActive
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            ON
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors hidden sm:inline-block",
                              isCurrentActive
                                ? "bg-muted text-muted-foreground"
                                : "bg-muted/50 text-muted-foreground/60",
                            )}
                          >
                            OFF
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>

            {activeRule && (
              <div className="space-y-4 pt-2">
                {/* Active Phase Header & Channel Override */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/30 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground">
                        {activeRule.name}
                      </h3>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {activePhaseChannel}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-foreground-muted mt-0.5">
                      {activeRule.daysOffset < 0
                        ? `Dikirim ${Math.abs(activeRule.daysOffset)} hari sebelum tanggal target jadwal`
                        : activeRule.daysOffset === 0
                          ? "Dikirim pada tanggal target jadwal acara/janji temu"
                          : `Dikirim ${activeRule.daysOffset} hari setelah tanggal target (follow-up)`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {/* Per-Phase Channel Override Selector */}
                    <div className="flex items-center gap-1.5">
                      <Label className="text-[11px] text-foreground-muted font-medium">
                        Kanal Fase:
                      </Label>
                      <NativeSelect
                        value={activeRule.channelType || ""}
                        onChange={(e) =>
                          handleUpdateActiveRule(
                            "channelType",
                            e.target.value ? (e.target.value as ReminderChannelType) : undefined
                          )
                        }
                        className="h-8 text-xs py-0 px-2 rounded-lg"
                      >
                        <NativeSelectOption value="">
                          (Default: {channelType})
                        </NativeSelectOption>
                        <NativeSelectOption value="WHATSAPP_WEB">
                          WhatsApp Web
                        </NativeSelectOption>
                        <NativeSelectOption value="WHATSAPP_OFFICIAL">
                          Meta WABA Official
                        </NativeSelectOption>
                        <NativeSelectOption value="TELEGRAM">
                          Telegram Bot
                        </NativeSelectOption>
                      </NativeSelect>
                    </div>

                    {/* Enable Phase Switch */}
                    <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-1.5 border border-border/60">
                      <Label className="text-xs font-semibold text-foreground cursor-pointer">
                        {t("reminder.rules.enablePhase") || "Fase Aktif"}
                      </Label>
                      <Switch
                        checked={activeRule.isEnabled}
                        onCheckedChange={(c) =>
                          handleUpdateActiveRule("isEnabled", c)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Adaptive Content Editor Based on Phase Channel */}
                {activePhaseChannel === "WHATSAPP_OFFICIAL" ? (
                  <div className="p-3.5 rounded-2xl border border-sky-300 dark:border-sky-900 bg-sky-50/20 dark:bg-sky-950/10 space-y-3">
                    <ReminderWabaTemplatePicker
                      selectedTemplateId={activeRule.templateId || DEFAULT_REMINDER_WABA_TEMPLATES[0].id}
                      initialParams={activeRule.templateParams}
                      onSelectTemplate={(tplId, params) => {
                        handleUpdateActiveRule("templateId", tplId);
                        handleUpdateActiveRule("templateParams", params);
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {activePhaseChannel === "TELEGRAM" ? (
                          <Bot className="size-3.5 text-blue-500" />
                        ) : (
                          <Smartphone className="size-3.5 text-emerald-500" />
                        )}
                        <span>{t("reminder.rules.phaseTemplate") || "Template Pesan"}</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        {activePhaseChannel === "TELEGRAM" && (
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-foreground-muted">Format:</span>
                            <NativeSelect
                              value={activeRule.telegramParseMode || "HTML"}
                              onChange={(e) =>
                                handleUpdateActiveRule(
                                  "telegramParseMode",
                                  e.target.value as "HTML" | "MarkdownV2"
                                )
                              }
                              className="h-6 text-[10px] py-0 px-1 rounded-md"
                            >
                              <NativeSelectOption value="HTML">HTML</NativeSelectOption>
                              <NativeSelectOption value="MarkdownV2">MarkdownV2</NativeSelectOption>
                            </NativeSelect>
                          </div>
                        )}
                        <span className="text-[10px] text-foreground-muted">
                          {activeRule.template.length}{" "}
                          {t("reminder.rules.characters") || "karakter"}
                        </span>
                      </div>
                    </div>

                    <Textarea
                      rows={4}
                      value={activeRule.template}
                      onChange={(e) =>
                        handleUpdateActiveRule("template", e.target.value)
                      }
                      placeholder={
                        activePhaseChannel === "TELEGRAM"
                          ? "<b>Halo {{nama}}</b>, mengingatkan besok {{tanggal}} ada jadwal: {{catatan}}."
                          : t("reminder.rules.templatePlaceholder") || "Ketik template pesan pengingat..."
                      }
                      className="rounded-xl p-3 text-xs leading-relaxed"
                    />

                    {/* Dynamic Variable Chips */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <VariableInsertChips onInsert={handleInsertVariable} />
                      <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                        <Sparkles className="size-3 text-amber-500" />
                        Variabel otomatis diganti dengan data janji temu pelanggan.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
