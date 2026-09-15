"use client";

import React, { useState, useEffect } from "react";
import {
  ReminderRule,
  DripRuleItem,
  UpdateReminderRuleInput,
} from "../../types/reminder.types";
import { VariableInsertChips } from "./VariableInsertChips";
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
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import {
  Clock,
  Smartphone,
  MessageSquare,
  Layers,
  Save,
  Loader2,
  AlertCircle,
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
  const [deviceId, setDeviceId] = useState(initialRule.deviceId || "");
  const [sendTime, setSendTime] = useState(initialRule.sendTime || "09:00");
  const [showInChat, setShowInChat] = useState(initialRule.showInChat ?? true);
  const [rules, setRules] = useState<DripRuleItem[]>(initialRule.rules || []);
  const [activeTabOffset, setActiveTabOffset] = useState<number>(-1);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  // Sync state if initialRule updates
  useEffect(() => {
    setDeviceId(initialRule.deviceId || "");
    setSendTime(initialRule.sendTime || "09:00");
    setShowInChat(initialRule.showInChat ?? true);
    if (initialRule.rules && initialRule.rules.length > 0) {
      setRules(initialRule.rules);
    }
  }, [initialRule]);

  // Load WhatsApp devices for device selector
  useEffect(() => {
    let isMounted = true;
    const loadDevices = async () => {
      try {
        const list = await whatsappApi.getDevices();
        if (isMounted) {
          setDevices(list);
          // If no device selected and list has devices, auto select first connected device that is within limit
          if (!deviceId && list.length > 0) {
            const connected = list.find(
              (d) =>
                d.status === "CONNECTED" && !d.is_over_limit && !d.isOverLimit,
            );
            setDeviceId(connected?.id || list[0].id);
          }
        }
      } catch {
        // Silently handle if devices fail to load
      } finally {
        if (isMounted) setIsLoadingDevices(false);
      }
    };
    loadDevices();
    return () => {
      isMounted = false;
    };
  }, [deviceId]);

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
      sendTime,
      showInChat,
      rules,
    });
  };

  return (
    <Card className="p-5">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Clock className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">
              {t("reminder.rules.title")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("reminder.rules.subtitle")}
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
              {t("reminder.rules.saving")}
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              {t("reminder.rules.saveRules")}
            </>
          )}
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Core Settings: Device & Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Device Selector */}
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <Label htmlFor="rem-device" className="text-xs">
                <Smartphone className="size-3.5 text-primary" />
                <span>{t("reminder.rules.senderDevice")}</span>
              </Label>
              <NativeSelect
                id="rem-device"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                disabled={isSaving || isLoadingDevices}
                className="h-10 text-xs rounded-xl"
              >
                <NativeSelectOption value="">
                  {t("reminder.rules.selectDevice")}
                </NativeSelectOption>
                {devices.map((d) => {
                  const isOver = Boolean(d.is_over_limit || d.isOverLimit);
                  return (
                    <NativeSelectOption
                      key={d.id}
                      value={d.id}
                      disabled={isOver}
                    >
                      {d.name} {d.phone ? `(${d.phone})` : ""} - [
                      {isOver ? "OVER LIMIT" : d.status}]
                    </NativeSelectOption>
                  );
                })}
              </NativeSelect>
              {devices.length === 0 && !isLoadingDevices && (
                <p className="text-[11px] text-amber-500 flex items-center gap-1">
                  <AlertCircle className="size-3" />{" "}
                  {t("reminder.rules.noDevices")}
                </p>
              )}
            </div>

            {/* Send Time */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rem-send-time" className="text-xs">
                <Clock className="size-3.5 text-blue-500" />
                <span>{t("reminder.rules.sendTime")}</span>
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
            </div>

            {/* Show in Chat Switch */}
            <div className="flex flex-col justify-center gap-2 rounded-xl border border-border/50 bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
                  <MessageSquare className="size-3.5 text-emerald-500" />
                  <span>{t("reminder.rules.chatVisibility")}</span>
                </Label>
                <Switch
                  checked={showInChat}
                  onCheckedChange={setShowInChat}
                  disabled={isSaving}
                />
              </div>
              <span className="text-[11px] text-foreground-muted">
                {t("reminder.rules.chatVisibilityDesc")}
              </span>
            </div>
          </div>

          {/* Drip Rules Tabs & Editor */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Layers className="size-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-foreground block">
                    {t("reminder.rules.dripPhases")}
                  </span>
                  <span className="text-[11px] text-foreground-muted">
                    {t("reminder.rules.dripPhasesDesc")}
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
                          title={
                            r.isEnabled
                              ? t("reminder.rules.phaseActive")
                              : t("reminder.rules.phaseInactive")
                          }
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground">
                      {activeRule.name}
                    </h3>
                    <p className="text-[11px] text-foreground-muted">
                      {activeRule.daysOffset < 0
                        ? `Dikirim ${Math.abs(activeRule.daysOffset)} hari sebelum tanggal target jadwal`
                        : activeRule.daysOffset === 0
                          ? "Dikirim pada tanggal target jadwal acara/janji temu"
                          : `Dikirim ${activeRule.daysOffset} hari setelah tanggal target (follow-up)`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-1.5 border border-border/60 self-start sm:self-auto">
                    <Label className="text-xs font-semibold text-foreground cursor-pointer">
                      {t("reminder.rules.enablePhase")}
                    </Label>
                    <Switch
                      checked={activeRule.isEnabled}
                      onCheckedChange={(c) =>
                        handleUpdateActiveRule("isEnabled", c)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground-muted">
                      {t("reminder.rules.phaseTemplate")}
                    </Label>
                    <span className="text-[10px] text-foreground-muted">
                      {activeRule.template.length}{" "}
                      {t("reminder.rules.characters")}
                    </span>
                  </div>

                  <Textarea
                    rows={4}
                    value={activeRule.template}
                    onChange={(e) =>
                      handleUpdateActiveRule("template", e.target.value)
                    }
                    placeholder={t("reminder.rules.templatePlaceholder")}
                    className="rounded-xl p-3 text-xs leading-relaxed"
                  />

                  {/* Dynamic Variable Chips */}
                  <VariableInsertChips onInsert={handleInsertVariable} />
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
