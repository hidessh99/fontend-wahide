"use client";

import React, { useState } from "react";
import { CreateCampaignInput } from "@/modules/campaign/types/campaign.types";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { useContacts } from "@/modules/contact/hooks/useContacts";
import { useSpintax } from "@/modules/campaign/hooks/useSpintax";
import { SpintaxVisualizer } from "@/modules/campaign/components/spintax/SpintaxVisualizer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import {
  Send,
  Smartphone,
  Users,
  MessageSquare,
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCampaignInput) => Promise<unknown>;
}

export function CampaignWizardModal({ isOpen, onClose, onSubmit }: CampaignWizardModalProps) {
  const { t } = useI18n();
  const { devices } = useDevices();
  const { contacts, allTags } = useContacts();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [targetType, setTargetType] = useState<"ALL" | "TAGS" | "CUSTOM">("ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customNumbersStr, setCustomNumbersStr] = useState("");
  const [jitterDelaySeconds, setJitterDelaySeconds] = useState(4);
  const [enableHumanTyping, setEnableHumanTyping] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { template, preview, setTemplate, randomize } = useSpintax(
    "{Halo|Hi|Selamat Siang} Kak {nama}, dapatkan penawaran spesial {diskon 50%|potongan harga} hari ini!"
  );

  const connectedDevices = devices.filter((d) => d.status === "CONNECTED");

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!name.trim()) {
        setError("Nama kampanye wajib diisi.");
        return;
      }
      if (!selectedDeviceId) {
        setError("Silakan pilih salah satu slot perangkat WhatsApp pengirim.");
        return;
      }
    } else if (step === 2) {
      if (targetType === "TAGS" && selectedTags.length === 0) {
        setError("Silakan pilih minimal satu kategori tag penerima.");
        return;
      }
      if (targetType === "CUSTOM") {
        const parsed = customNumbersStr
          .split("\n")
          .map((n) => n.trim().replace(/[^0-9]/g, ""))
          .filter(Boolean);
        if (parsed.length === 0) {
          setError("Silakan masukkan minimal satu nomor telepon tujuan yang valid.");
          return;
        }
      }
    } else if (step === 3) {
      if (!template.trim()) {
        setError("Isi template pesan broadcast wajib diisi.");
        return;
      }
    }
    setStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
  };

  const calculateTargetCount = (): number => {
    if (targetType === "ALL") return contacts.length;
    if (targetType === "TAGS") {
      return contacts.filter((c) => c.tags?.some((t) => selectedTags.includes(t))).length;
    }
    return customNumbersStr
      .split("\n")
      .map((n) => n.trim().replace(/[^0-9]/g, ""))
      .filter(Boolean).length;
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const targetNumbers =
        targetType === "CUSTOM"
          ? customNumbersStr
              .split("\n")
              .map((n) => n.trim().replace(/[^0-9]/g, ""))
              .filter(Boolean)
          : undefined;

      const payload: CreateCampaignInput = {
        name: name.trim(),
        deviceId: selectedDeviceId,
        messageTemplate: template.trim(),
        jitterDelaySeconds,
        enableHumanTyping,
        targetType,
        targetTags: targetType === "TAGS" ? selectedTags : undefined,
        targetNumbers,
        scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat kampanye broadcast.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const insertSpintaxSample = () => {
    const sample = "{Pemberitahuan|Kabar Baik|Info Penting} untuk Anda!";
    setTemplate(template + " " + sample);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[90vh] max-w-2xl gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        {/* Sticky Header with Step Tracker */}
        <DialogHeader className="border-border/80 shrink-0 space-y-3 border-b p-5 pb-3 text-left sm:p-6">
          <div>
            <DialogTitle className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("campaign.wizardTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("campaign.wizardSubtitle")}
            </DialogDescription>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-xs font-bold">
            {[
              { num: 1, label: t("campaign.step1Device"), icon: Smartphone },
              { num: 2, label: t("campaign.step2Audience"), icon: Users },
              { num: 3, label: t("campaign.step3Message"), icon: MessageSquare },
              { num: 4, label: t("campaign.step4Schedule"), icon: ShieldCheck },
            ].map(({ num, label, icon: Icon }) => (
              <div
                key={num}
                className={`flex items-center gap-1.5 border-b-2 pb-1 transition-all ${
                  step === num
                    ? "border-wise-green text-foreground font-black"
                    : step > num
                      ? "dark:text-wise-green border-emerald-600 text-emerald-700"
                      : "text-foreground-muted border-transparent"
                }`}
              >
                <div
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    step === num
                      ? "bg-wise-green font-black text-[#0e1708]"
                      : step > num
                        ? "dark:bg-wise-green/20 dark:text-wise-green bg-emerald-100 text-emerald-800"
                        : "bg-muted text-foreground-muted"
                  }`}
                >
                  {step > num ? "✓" : num}
                </div>
                <div className="hidden items-center gap-1 sm:flex">
                  <Icon className="size-3.5" />
                  <span className="truncate">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Scrollable Wizard Steps Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {error && (
            <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* STEP 1: Basic Info & Device Selection */}
          {step === 1 && (
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-foreground-secondary mb-1.5 block font-bold tracking-wider uppercase">
                  {t("campaign.campaignNameLabel")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("campaign.campaignNamePlaceholder")}
                  className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-md border px-4 font-semibold outline-none focus:ring-1 dark:bg-[#10110e]"
                  autoFocus
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-foreground-secondary font-bold tracking-wider uppercase">
                    {t("campaign.senderDeviceLabel")}
                  </label>
                  <span className="text-foreground-muted text-[11px]">
                    {connectedDevices.length} {t("campaign.connectedDevicesCount")}
                  </span>
                </div>

                {connectedDevices.length === 0 ? (
                  <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                    <p className="font-bold text-amber-700 dark:text-amber-400">
                      {t("campaign.noDeviceConnectedWarning")}
                    </p>
                    <p className="text-foreground-secondary mt-1 text-[11px]">
                      {t("campaign.pleaseConnectDeviceFirst")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {connectedDevices.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDeviceId(d.id)}
                        className={`border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-md border p-3.5 transition dark:bg-[#10110e] ${
                          selectedDeviceId === d.id
                            ? "border-wise-green ring-wise-green bg-light-mint/30 dark:bg-wise-green/10 ring-1"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full">
                            <Smartphone className="size-4" />
                          </div>
                          <div>
                            <span className="text-foreground block font-bold">
                              {d.push_name || d.name}
                            </span>
                            <span className="text-foreground-muted font-mono text-[11px]">
                              {d.phone ? `+${d.phone}` : "WhatsApp MD"}
                            </span>
                          </div>
                        </div>
                        {selectedDeviceId === d.id && (
                          <CheckCircle2 className="dark:text-wise-green size-4 shrink-0 text-emerald-700" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Target Audience */}
          {step === 2 && (
            <div className="space-y-4 text-xs font-semibold">
              <label className="text-foreground-secondary block font-bold tracking-wider uppercase">
                {t("campaign.audienceScopeLabel")}
              </label>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {[
                  {
                    type: "ALL" as const,
                    title: t("campaign.audienceAllTitle"),
                    desc: t("campaign.audienceAllDesc", { count: String(contacts.length) }),
                  },
                  {
                    type: "TAGS" as const,
                    title: t("campaign.audienceTagsTitle"),
                    desc: t("campaign.audienceTagsDesc"),
                  },
                  {
                    type: "CUSTOM" as const,
                    title: t("campaign.audienceCustomTitle"),
                    desc: t("campaign.audienceCustomDesc"),
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    onClick={() => setTargetType(item.type)}
                    className={`border-border bg-surface hover:border-foreground-muted flex cursor-pointer flex-col justify-between rounded-md border p-3.5 transition dark:bg-[#10110e] ${
                      targetType === item.type
                        ? "border-wise-green ring-wise-green bg-light-mint/30 dark:bg-wise-green/10 ring-1"
                        : ""
                    }`}
                  >
                    <div>
                      <span className="text-foreground block font-bold">{item.title}</span>
                      <p className="text-foreground-secondary mt-1 text-[11px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tag Selector if TAGS */}
              {targetType === "TAGS" && (
                <div className="space-y-2 pt-2">
                  <span className="text-foreground-secondary block text-[11px] font-bold uppercase">
                    {t("campaign.chooseTagsLabel")}
                  </span>
                  {allTags.length === 0 ? (
                    <p className="text-foreground-muted text-xs italic">
                      {t("campaign.noTagsFound")}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-xs font-bold transition ${
                              isSelected
                                ? "bg-dark-green text-light-mint dark:bg-wise-green dark:text-dark-green border-transparent"
                                : "border-border bg-surface text-foreground-secondary hover:text-foreground dark:bg-[#10110e]"
                            }`}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Custom Numbers Box */}
              {targetType === "CUSTOM" && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-foreground-secondary block text-[11px] font-bold uppercase">
                    {t("campaign.customNumbersLabel")}
                  </label>
                  <textarea
                    rows={4}
                    value={customNumbersStr}
                    onChange={(e) => setCustomNumbersStr(e.target.value)}
                    placeholder={"6281234567890\n6289876543210"}
                    className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green w-full rounded-md border p-3 font-mono text-xs font-semibold outline-none focus:ring-1 dark:bg-[#10110e]"
                  />
                  <span className="text-foreground-muted text-[11px]">
                    {t("campaign.customNumbersHint")}
                  </span>
                </div>
              )}

              {/* Summary of Audience Count */}
              <div className="bg-light-mint/50 dark:bg-wise-green/10 border-wise-green/30 flex items-center justify-between rounded-md border p-3">
                <span className="text-foreground font-semibold">
                  {t("campaign.estimatedTotalAudience")}:
                </span>
                <span className="dark:text-wise-green font-mono font-black text-emerald-800">
                  {calculateTargetCount()} {t("campaign.recipientsUnit")}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Spintax Message Template */}
          {step === 3 && (
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-foreground-secondary font-bold tracking-wider uppercase">
                    {t("campaign.spintaxTemplateLabel")}
                  </label>
                  <button
                    type="button"
                    onClick={insertSpintaxSample}
                    className="dark:text-wise-green cursor-pointer text-xs font-bold text-emerald-700 hover:underline"
                  >
                    + {t("campaign.insertSampleSpintax")}
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder={t("campaign.spintaxPlaceholder")}
                  className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green w-full rounded-md border p-3 text-xs font-semibold outline-none focus:ring-1 dark:bg-[#10110e]"
                />
                <div className="text-foreground-muted mt-1 flex justify-between text-[11px]">
                  <span>{t("campaign.spintaxSyntaxHint")}</span>
                  <span>Variabel: {"{nama}"}</span>
                </div>
              </div>

              {/* Live Spintax Visualizer */}
              <SpintaxVisualizer previewText={preview} onRandomize={randomize} />
            </div>
          )}

          {/* STEP 4: Anti-Ban Protection & Scheduling */}
          {step === 4 && (
            <div className="space-y-4 text-xs font-semibold">
              {/* Anti-ban controls */}
              <div className="border-border bg-muted/20 space-y-3 rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="dark:text-wise-green size-4 text-emerald-600" />
                  <span className="text-foreground font-bold tracking-wider uppercase">
                    {t("campaign.antiBanConfigTitle")}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-foreground-secondary font-semibold">
                        {t("campaign.jitterDelayLabel")}
                      </label>
                      <span className="dark:text-wise-green font-mono font-black text-emerald-700">
                        {jitterDelaySeconds} {t("campaign.secondsUnit")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={15}
                      value={jitterDelaySeconds}
                      onChange={(e) => setJitterDelaySeconds(Number(e.target.value))}
                      className="accent-wise-green dark:accent-wise-green mt-1 w-full"
                    />
                    <span className="text-foreground-muted text-[11px]">
                      {t("campaign.jitterDelayHint")}
                    </span>
                  </div>

                  <div className="border-border/50 flex items-center justify-between border-t pt-2.5">
                    <div>
                      <span className="text-foreground block font-bold">
                        {t("campaign.simulateTypingLabel")}
                      </span>
                      <span className="text-foreground-muted text-[11px]">
                        {t("campaign.simulateTypingHint")}
                      </span>
                    </div>
                    <Switch
                      checked={enableHumanTyping}
                      onCheckedChange={setEnableHumanTyping}
                      aria-label={t("campaign.simulateTypingLabel")}
                    />
                  </div>
                </div>
              </div>

              {/* Scheduling Section */}
              <div className="border-border bg-muted/20 space-y-3 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="text-foreground-secondary size-4" />
                    <span className="text-foreground font-bold tracking-wider uppercase">
                      {t("campaign.scheduleBroadcastLabel")}
                    </span>
                  </div>
                  <Switch
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                    aria-label={t("campaign.scheduleBroadcastLabel")}
                  />
                </div>

                {isScheduled && (
                  <div className="pt-1">
                    <label className="text-foreground-secondary mb-1 block text-[11px]">
                      {t("campaign.selectDateTimeLabel")}
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green h-10 w-full rounded-md border px-3 font-mono text-xs font-semibold outline-none dark:bg-[#10110e]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Navigation */}
        <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-between gap-2.5 rounded-none border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted cursor-pointer gap-1.5 rounded-full text-xs font-bold"
            >
              <ArrowLeft className="size-3.5" />
              <span>{t("campaign.btnBack")}</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted cursor-pointer rounded-full text-xs font-bold"
            >
              Batal
            </Button>
          )}

          {step < 4 ? (
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={handleNext}
              className="cursor-pointer gap-1.5 px-6 text-xs font-bold shadow-sm"
            >
              <span>{t("campaign.btnNext")}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              onClick={handleSubmit}
              className="cursor-pointer gap-1.5 px-6 text-xs font-bold shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("campaign.submitting")}</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>{t("campaign.btnSubmit")}</span>
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
