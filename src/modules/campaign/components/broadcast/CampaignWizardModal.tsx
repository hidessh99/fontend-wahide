"use client";

import React, { useState } from "react";
import { CreateCampaignInput } from "@/modules/campaign/types/campaign.types";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { useContacts } from "@/modules/contact/hooks/useContacts";
import { useSpintax } from "@/modules/campaign/hooks/useSpintax";
import { SpintaxVisualizer } from "@/modules/campaign/components/spintax/SpintaxVisualizer";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import {
  X,
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

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

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
      setStep(2);
    } else if (step === 2) {
      if (targetType === "TAGS" && selectedTags.length === 0) {
        setError("Pilih minimal satu tag segmentasi.");
        return;
      }
      if (targetType === "CUSTOM" && !customNumbersStr.trim()) {
        setError("Masukkan minimal satu nomor WhatsApp.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!template.trim()) {
        setError("Isi pesan WhatsApp wajib diisi.");
        return;
      }
      setStep(4);
    }
  };

  const handlePrev = () => {
    setError(null);
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const customNumbers = customNumbersStr
      .split(/[\n,]/)
      .map((n) => n.trim().replace(/[^0-9]/g, ""))
      .filter((n) => n.startsWith("62") && n.length >= 10);

    try {
      await onSubmit({
        name: name.trim(),
        deviceId: selectedDeviceId,
        messageTemplate: template,
        jitterDelaySeconds,
        enableHumanTyping,
        targetType,
        targetTags: targetType === "TAGS" ? selectedTags : undefined,
        targetNumbers: targetType === "CUSTOM" ? customNumbers : undefined,
        scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal meluncurkan kampanye";
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
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-md border shadow-2xl dark:bg-[#161715]">
        {/* Sticky Header with Step Tracker */}
        <div className="border-border/80 shrink-0 space-y-3 border-b p-5 pb-3 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                {t("campaign.wizardTitle")}
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                {t("campaign.wizardSubtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="Tutup"
            >
              <X className="size-4" />
            </button>
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
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "text-foreground-muted border-transparent"
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="hidden truncate sm:inline">{label}</span>
                <span className="sm:hidden">L{num}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Body Content per Step */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {/* Error Alert */}
          {error && (
            <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* STEP 1: Select Device */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("campaign.campaignNameLabel")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("campaign.campaignNamePlaceholder")}
                  className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-full border px-4 text-xs font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("campaign.selectDeviceLabel")}
                </label>
                {connectedDevices.length === 0 ? (
                  <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-4 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {t("campaign.noConnectedDevices")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {connectedDevices.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDeviceId(d.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-md border p-3.5 transition ${
                          selectedDeviceId === d.id
                            ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 shadow-sm"
                            : "border-border hover:border-foreground-muted bg-surface dark:bg-[#10110e]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Smartphone className="dark:text-wise-green size-4 text-emerald-700" />
                          <div>
                            <span className="text-foreground block max-w-36 truncate text-xs font-bold">
                              {d.name}
                            </span>
                            <span className="text-foreground-secondary font-mono text-[11px]">
                              +{d.phone || "No Number"}
                            </span>
                          </div>
                        </div>
                        {selectedDeviceId === d.id && (
                          <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-700" />
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
            <div className="space-y-4">
              <label className="text-foreground-secondary block text-xs font-semibold tracking-wider uppercase">
                {t("campaign.selectAudienceLabel")}
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setTargetType("ALL")}
                  className={`cursor-pointer rounded-md border p-3.5 text-left transition ${
                    targetType === "ALL"
                      ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 font-extrabold"
                      : "border-border bg-surface text-foreground-secondary dark:bg-[#10110e]"
                  }`}
                >
                  <Users className="dark:text-wise-green mb-1 size-4 text-emerald-700" />
                  <span className="text-foreground block text-xs">Semua Kontak</span>
                  <span className="text-foreground-muted block text-[10px]">
                    {contacts.length} nomor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType("TAGS")}
                  className={`cursor-pointer rounded-md border p-3.5 text-left transition ${
                    targetType === "TAGS"
                      ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 font-extrabold"
                      : "border-border bg-surface text-foreground-secondary dark:bg-[#10110e]"
                  }`}
                >
                  <Users className="mb-1 size-4 text-sky-500" />
                  <span className="text-foreground block text-xs">Segmen Tag</span>
                  <span className="text-foreground-muted block text-[10px]">
                    {allTags.length} tag dibuat
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType("CUSTOM")}
                  className={`cursor-pointer rounded-md border p-3.5 text-left transition ${
                    targetType === "CUSTOM"
                      ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 font-extrabold"
                      : "border-border bg-surface text-foreground-secondary dark:bg-[#10110e]"
                  }`}
                >
                  <Smartphone className="mb-1 size-4 text-amber-500" />
                  <span className="text-foreground block text-xs">Input Manual</span>
                  <span className="text-foreground-muted block text-[10px]">
                    Paste nomor langsung
                  </span>
                </button>
              </div>

              {targetType === "TAGS" && (
                <div className="border-border bg-muted/20 space-y-2 rounded-md border p-4">
                  <span className="text-foreground block text-xs font-bold">
                    Pilih Tag yang Diikutsertakan:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                          selectedTags.includes(tag)
                            ? "bg-wise-green text-dark-green border-wise-green"
                            : "bg-surface text-foreground border-border hover:border-foreground-muted dark:bg-[#10110e]"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {targetType === "CUSTOM" && (
                <div>
                  <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                    {t("campaign.customNumbersPlaceholder")}
                  </label>
                  <textarea
                    rows={4}
                    value={customNumbersStr}
                    onChange={(e) => setCustomNumbersStr(e.target.value)}
                    placeholder="6281234567890&#10;6289876543210"
                    className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green w-full rounded-md border p-3 font-mono text-xs transition outline-none focus:ring-2 dark:bg-[#10110e]"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Message & Spintax */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-foreground-secondary block text-xs font-semibold tracking-wider uppercase">
                    {t("campaign.messageContentLabel")}
                  </label>
                  <span className="text-foreground-muted font-mono text-[11px]">
                    {template.length} karakter
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder={t("campaign.messagePlaceholder")}
                  className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green w-full rounded-md border p-3 text-xs leading-relaxed font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
                />

                {/* Quick Insert Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTemplate(template + " {nama}")}
                    className="bg-muted hover:bg-muted/80 text-foreground-secondary border-border rounded-full border px-2.5 py-1 text-[11px] font-bold"
                  >
                    + {t("campaign.insertNameVar")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplate(template + " {phone}")}
                    className="bg-muted hover:bg-muted/80 text-foreground-secondary border-border rounded-full border px-2.5 py-1 text-[11px] font-bold"
                  >
                    + {t("campaign.insertPhoneVar")}
                  </button>
                  <button
                    type="button"
                    onClick={insertSpintaxSample}
                    className="bg-light-mint dark:bg-wise-green/15 hover:bg-light-mint/80 dark:hover:bg-wise-green/25 text-dark-green dark:text-wise-green border-wise-green/30 rounded-full border px-2.5 py-1 text-[11px] font-bold"
                  >
                    + {t("campaign.insertSpintax")}
                  </button>
                </div>
              </div>

              {/* Spintax Live Visualizer */}
              <SpintaxVisualizer previewText={preview} onRandomize={() => randomize()} />
            </div>
          )}

          {/* STEP 4: Anti-Ban Safeguards & Schedule */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Jitter Slider */}
              <div className="border-border bg-surface space-y-2 rounded-md border p-4 dark:bg-[#10110e]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-foreground block text-xs font-bold">
                      {t("campaign.jitterSliderLabel")}
                    </span>
                    <span className="text-foreground-muted text-[11px]">
                      {t("campaign.jitterSliderDesc")}
                    </span>
                  </div>
                  <span className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 rounded-full border px-3 py-1 text-xs font-black">
                    {jitterDelaySeconds} Detik
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={15}
                  step={1}
                  value={jitterDelaySeconds}
                  onChange={(e) => setJitterDelaySeconds(parseInt(e.target.value, 10))}
                  className="accent-wise-green w-full cursor-pointer"
                />
              </div>

              {/* Human Typing Switch */}
              <div className="border-border bg-surface flex items-center justify-between rounded-md border p-4 dark:bg-[#10110e]">
                <div>
                  <span className="text-foreground block text-xs font-bold">
                    {t("campaign.humanTypingLabel")}
                  </span>
                  <span className="text-foreground-muted text-[11px]">
                    {t("campaign.humanTypingDesc")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableHumanTyping(!enableHumanTyping)}
                  className={`h-6 w-12 cursor-pointer rounded-full p-0.5 transition-colors ${
                    enableHumanTyping ? "bg-wise-green" : "bg-muted"
                  }`}
                >
                  <div
                    className={`size-5 rounded-full bg-white transition-transform ${
                      enableHumanTyping ? "bg-dark-green translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Schedule Option */}
              <div className="border-border bg-surface space-y-3 rounded-md border p-4 dark:bg-[#10110e]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="text-foreground-muted size-4" />
                    <span className="text-foreground text-xs font-bold">Jadwalkan Pengiriman</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={`h-6 w-12 cursor-pointer rounded-full p-0.5 transition-colors ${
                      isScheduled ? "bg-wise-green" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`size-5 rounded-full bg-white transition-transform ${
                        isScheduled ? "bg-dark-green translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {isScheduled && (
                  <div>
                    <label className="text-foreground-secondary mb-1 block text-[11px] font-semibold">
                      {t("campaign.scheduleDateLabel")}
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="bg-surface text-foreground border-border focus:border-wise-green h-10 w-full rounded-md border px-3 text-xs font-semibold outline-none dark:bg-[#161715]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Modal Footer Controls */}
        <div className="border-border/80 bg-surface/90 flex shrink-0 items-center justify-between border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted cursor-pointer gap-1.5 rounded-full text-xs font-bold"
            >
              <ArrowLeft className="size-3.5" />
              <span>{t("campaign.btnPrev")}</span>
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
        </div>
      </div>
    </div>
  );
}
