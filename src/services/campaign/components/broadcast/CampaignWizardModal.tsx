"use client";

import React, { useState, useEffect } from "react";
import { CreateCampaignInput } from "@/services/campaign/types/campaign.types";
import { useDevices } from "@/services/whatsapp/hooks/useDevices";
import { useContacts } from "@/services/contact/hooks/useContacts";
import { useSpintax } from "@/services/campaign/hooks/useSpintax";
import { SpintaxVisualizer } from "@/services/campaign/components/spintax/SpintaxVisualizer";
import { Button } from "@/components/ui/button";
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

export function CampaignWizardModal({
  isOpen,
  onClose,
  onSubmit,
}: CampaignWizardModalProps) {
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

  const {
    template,
    preview,
    setTemplate,
    randomize,
  } = useSpintax("{Halo|Hi|Selamat Siang} Kak {nama}, dapatkan penawaran spesial {diskon 50%|potongan harga} hari ini!");

  // Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Header with Step Tracker */}
        <div className="p-5 sm:p-6 pb-3 border-b border-border/80 shrink-0 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {t("campaign.wizardTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("campaign.wizardSubtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0"
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
                className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all ${
                  step === num
                    ? "border-wise-green text-foreground font-black"
                    : step > num
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-foreground-muted"
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="truncate hidden sm:inline">{label}</span>
                <span className="sm:hidden">L{num}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Body Content per Step */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* STEP 1: Select Device */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("campaign.campaignNameLabel")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("campaign.campaignNamePlaceholder")}
                  className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("campaign.selectDeviceLabel")}
                </label>
                {connectedDevices.length === 0 ? (
                  <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {t("campaign.noConnectedDevices")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {connectedDevices.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDeviceId(d.id)}
                        className={`p-3.5 rounded-md border transition cursor-pointer flex items-center justify-between ${
                          selectedDeviceId === d.id
                            ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 shadow-sm"
                            : "border-border hover:border-foreground-muted bg-surface dark:bg-[#10110e]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Smartphone className="size-4 text-wise-green" />
                          <div>
                            <span className="font-bold text-xs text-foreground block truncate max-w-36">
                              {d.name}
                            </span>
                            <span className="text-[11px] text-foreground-secondary font-mono">
                              +{d.phone || "No Number"}
                            </span>
                          </div>
                        </div>
                        {selectedDeviceId === d.id && (
                          <CheckCircle2 className="size-4 text-wise-green" />
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                {t("campaign.selectAudienceLabel")}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetType("ALL")}
                  className={`p-3.5 rounded-md border text-left transition cursor-pointer ${
                    targetType === "ALL"
                      ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 font-extrabold"
                      : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary"
                  }`}
                >
                  <Users className="size-4 text-wise-green mb-1" />
                  <span className="text-xs block text-foreground">Semua Kontak</span>
                  <span className="text-[10px] text-foreground-muted block">{contacts.length} nomor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType("TAGS")}
                  className={`p-3.5 rounded-md border text-left transition cursor-pointer ${
                    targetType === "TAGS"
                      ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 font-extrabold"
                      : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary"
                  }`}
                >
                  <Users className="size-4 text-sky-500 mb-1" />
                  <span className="text-xs block text-foreground">Segmen Tag</span>
                  <span className="text-[10px] text-foreground-muted block">{allTags.length} tag dibuat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType("CUSTOM")}
                  className={`p-3.5 rounded-md border text-left transition cursor-pointer ${
                    targetType === "CUSTOM"
                      ? "border-wise-green bg-wise-green/10 dark:bg-wise-green/5 font-extrabold"
                      : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary"
                  }`}
                >
                  <Smartphone className="size-4 text-amber-500 mb-1" />
                  <span className="text-xs block text-foreground">Input Manual</span>
                  <span className="text-[10px] text-foreground-muted block">Paste nomor langsung</span>
                </button>
              </div>

              {targetType === "TAGS" && (
                <div className="p-4 rounded-md border border-border bg-muted/20 space-y-2">
                  <span className="text-xs font-bold text-foreground block">Pilih Tag yang Diikutsertakan:</span>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                          selectedTags.includes(tag)
                            ? "bg-wise-green text-dark-green border-wise-green"
                            : "bg-surface dark:bg-[#10110e] text-foreground border-border hover:border-foreground-muted"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                    {t("campaign.customNumbersPlaceholder")}
                  </label>
                  <textarea
                    rows={4}
                    value={customNumbersStr}
                    onChange={(e) => setCustomNumbersStr(e.target.value)}
                    placeholder="6281234567890&#10;6289876543210"
                    className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-mono text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Message & Spintax */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                    {t("campaign.messageContentLabel")}
                  </label>
                  <span className="text-[11px] text-foreground-muted font-mono">{template.length} karakter</span>
                </div>

                <textarea
                  rows={5}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder={t("campaign.messagePlaceholder")}
                  className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition leading-relaxed"
                />

                {/* Quick Insert Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTemplate(template + " {nama}")}
                    className="px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-[11px] font-bold text-foreground-secondary border border-border"
                  >
                    + {t("campaign.insertNameVar")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplate(template + " {phone}")}
                    className="px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-[11px] font-bold text-foreground-secondary border border-border"
                  >
                    + {t("campaign.insertPhoneVar")}
                  </button>
                  <button
                    type="button"
                    onClick={insertSpintaxSample}
                    className="px-2.5 py-1 rounded-full bg-light-mint dark:bg-wise-green/15 hover:bg-light-mint/80 dark:hover:bg-wise-green/25 text-[11px] font-bold text-dark-green dark:text-wise-green border border-wise-green/30"
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
              <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#10110e] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {t("campaign.jitterSliderLabel")}
                    </span>
                    <span className="text-[11px] text-foreground-muted">
                      {t("campaign.jitterSliderDesc")}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green font-black text-xs border border-wise-green/30">
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
                  className="w-full accent-wise-green cursor-pointer"
                />
              </div>

              {/* Human Typing Switch */}
              <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#10110e] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    {t("campaign.humanTypingLabel")}
                  </span>
                  <span className="text-[11px] text-foreground-muted">
                    {t("campaign.humanTypingDesc")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableHumanTyping(!enableHumanTyping)}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    enableHumanTyping ? "bg-wise-green" : "bg-muted"
                  }`}
                >
                  <div
                    className={`size-5 rounded-full bg-white transition-transform ${
                      enableHumanTyping ? "translate-x-6 bg-dark-green" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Schedule Option */}
              <div className="p-4 rounded-md border border-border bg-surface dark:bg-[#10110e] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-foreground-muted" />
                    <span className="text-xs font-bold text-foreground">Jadwalkan Pengiriman</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                      isScheduled ? "bg-wise-green" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`size-5 rounded-full bg-white transition-transform ${
                        isScheduled ? "translate-x-6 bg-dark-green" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {isScheduled && (
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground-secondary mb-1">
                      {t("campaign.scheduleDateLabel")}
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#161715] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Modal Footer Controls */}
        <div className="p-4 sm:p-6 pt-3 border-t border-border/80 bg-surface/90 dark:bg-[#161715]/90 backdrop-blur-sm flex items-center justify-between shrink-0">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={isLoading}
              className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer"
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
              className="rounded-full text-xs font-bold border-border hover:border-foreground-muted cursor-pointer"
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
              className="text-xs font-bold gap-1.5 px-6 shadow-sm cursor-pointer"
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
              className="text-xs font-bold gap-1.5 px-6 shadow-sm cursor-pointer"
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
