"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreateCampaignInput } from "@/modules/campaign/types/campaign.types";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { useContacts } from "@/modules/contact/hooks/useContacts";
import { useSpintax } from "@/modules/campaign/hooks/useSpintax";
import { SpintaxVisualizer } from "./SpintaxVisualizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { ApiError } from "@/lib/api/http-client";
import { normalizePhoneNumber, isValidE164 } from "@/lib/phone";
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
  Check,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCampaignInput) => Promise<unknown>;
}

const parseCustomNumbers = (raw: string): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of raw.split("\n")) {
    const normalized = normalizePhoneNumber(line);
    if (isValidE164(normalized) && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
};

export function CampaignWizardModal({
  isOpen,
  onClose,
  onSubmit,
}: CampaignWizardModalProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { devices } = useDevices();
  const { contacts, tags, total } = useContacts();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [targetType, setTargetType] = useState<"ALL" | "TAGS" | "CUSTOM">(
    "ALL",
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [customNumbersStr, setCustomNumbersStr] = useState("");
  const [jitterDelaySeconds, setJitterDelaySeconds] = useState(4);
  const [enableHumanTyping, setEnableHumanTyping] = useState(true);
  const [autoScrubDeadNumbers, setAutoScrubDeadNumbers] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { template, preview, setTemplate, randomize } = useSpintax(
    "{Halo|Hi|Selamat Siang} Kak {nama}, dapatkan penawaran spesial {diskon 50%|potongan harga} hari ini!",
  );

  const connectedDevices = devices.filter(
    (d) =>
      (d.status === "CONNECTED" || (d.status as string) === "ONLINE") &&
      !d.is_over_limit &&
      !d.isOverLimit,
  );

  if (!isOpen) return null;

  const handleToggleDevice = (id: string) => {
    setSelectedDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id],
    );
  };

  const handleToggleAllDevices = () => {
    if (selectedDeviceIds.length === connectedDevices.length) {
      setSelectedDeviceIds([]);
    } else {
      setSelectedDeviceIds(connectedDevices.map((d) => d.id));
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (connectedDevices.length === 0) {
        toast.error(t("campaign.noActiveDeviceRedirect"));
        onClose();
        router.push("/devices");
        return;
      }
      if (!name.trim()) {
        setError("Nama kampanye wajib diisi.");
        return;
      }
      if (selectedDeviceIds.length === 0) {
        setError(
          "Silakan pilih minimal satu slot perangkat WhatsApp pengirim.",
        );
        return;
      }
    } else if (step === 2) {
      if (targetType === "ALL" && total === 0 && contacts.length === 0) {
        setError(
          t("campaign.noTargetContactsSelected") ||
            "Target audiens kosong (0 penerima). Silakan tambahkan kontak terlebih dahulu atau gunakan input nomor manual.",
        );
        return;
      }
      if (targetType === "TAGS") {
        if (selectedTagIds.length === 0) {
          setError(t("campaign.errSelectTagRequired"));
          return;
        }
        if (total === 0 && contacts.length === 0) {
          setError(t("campaign.noTargetContactsSelected"));
          return;
        }
      }
      if (targetType === "CUSTOM") {
        const parsed = parseCustomNumbers(customNumbersStr);
        if (parsed.length === 0) {
          setError(
            "Silakan masukkan minimal satu nomor telepon tujuan yang valid (contoh: 08123456789 atau 628123456789).",
          );
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
    if (targetType === "ALL") return total || contacts.length;
    if (targetType === "TAGS") {
      if (selectedTagIds.length === 0) return 0;

      const selectedTagNames = tags
        .filter((tg) => selectedTagIds.includes(tg.id))
        .map((tg) => tg.name.toLowerCase());

      const clientMatches = contacts.filter((c) =>
        c.tags?.some((t) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyTag = t as any;
          const id =
            typeof t === "string"
              ? t
              : anyTag?.id || anyTag?.tag_id || anyTag?.tagId;
          const name = (
            typeof t === "string" ? t : anyTag?.name
          )?.toLowerCase();
          return (
            (id && selectedTagIds.includes(id)) ||
            (name && selectedTagNames.includes(name))
          );
        }),
      ).length;

      if (clientMatches > 0) return clientMatches;
      if (total > contacts.length) return total;
      return clientMatches;
    }
    return parseCustomNumbers(customNumbersStr).length;
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const targetNumbers =
        targetType === "CUSTOM"
          ? parseCustomNumbers(customNumbersStr)
          : undefined;

      const payload: CreateCampaignInput = {
        name: name.trim(),
        deviceId: selectedDeviceIds[0] || "",
        deviceIds: selectedDeviceIds,
        autoScrubDeadNumbers,
        messageTemplate: template.trim(),
        jitterDelaySeconds,
        enableHumanTyping,
        targetType,
        targetTags: targetType === "TAGS" ? selectedTagIds : undefined,
        targetNumbers,
        scheduledAt:
          isScheduled && scheduledAt
            ? new Date(scheduledAt).toISOString()
            : undefined,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      if (
        (err instanceof ApiError && err.code === "NO_AUDIENCE_FOUND") ||
        (err instanceof Error &&
          (err.message.includes("NO_AUDIENCE_FOUND") ||
            err.message.includes("no contacts found")))
      ) {
        setError(
          t("campaign.noTargetContactsSelected") ||
            "Tag yang dipilih tidak memiliki kontak aktif. Silakan pilih tag lain atau tambahkan kontak dengan tag ini terlebih dahulu.",
        );
      } else {
        const msg =
          err instanceof Error ? err.message : t("campaign.errCreateFailed");
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const insertSpintaxSample = () => {
    const sample = "{Pemberitahuan|Kabar Baik|Info Penting} untuk Anda!";
    setTemplate(template + " " + sample);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
    >
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {/* Sticky Header with Step Tracker */}
        <DialogHeader className="border-border/80 shrink-0 space-y-3 border-b p-4 pb-3 text-left sm:p-6">
          <div>
            <DialogTitle className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("campaign.wizardTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("campaign.wizardSubtitle")}
            </DialogDescription>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-4 gap-1.5 pt-1 text-xs font-bold sm:gap-2">
            {[
              { num: 1, label: t("campaign.step1Device"), icon: Smartphone },
              { num: 2, label: t("campaign.step2Audience"), icon: Users },
              {
                num: 3,
                label: t("campaign.step3Message"),
                icon: MessageSquare,
              },
              { num: 4, label: t("campaign.step4Schedule"), icon: ShieldCheck },
            ].map(({ num, label, icon: Icon }) => (
              <div
                key={num}
                className={`flex min-w-0 items-center gap-1.5 overflow-hidden border-b-2 pb-1 transition-all ${
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
                  {step > num ? <Check className="size-3 stroke-3" /> : num}
                </div>
                <div className="hidden min-w-0 items-center gap-1 overflow-hidden sm:flex">
                  <Icon className="size-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Scrollable Wizard Steps Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* STEP 1: Basic Info & Device Selection */}
          {step === 1 && (
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <Label className="text-foreground-secondary mb-1.5 block font-bold tracking-wider uppercase">
                  {t("campaign.campaignNameLabel")}
                </Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("campaign.campaignNamePlaceholder")}
                  variant="rounded"
                  className="h-11 font-semibold"
                  autoFocus
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label className="text-foreground-secondary font-bold tracking-wider uppercase">
                    {t("campaign.senderDeviceLabel")}
                  </Label>
                  <div className="flex items-center gap-2">
                    {connectedDevices.length > 1 && (
                      <button
                        type="button"
                        onClick={handleToggleAllDevices}
                        className="text-dark-green dark:text-wise-green hover:underline cursor-pointer text-[11px] font-bold"
                      >
                        {selectedDeviceIds.length === connectedDevices.length
                          ? t("campaign.deselectAllDevices")
                          : t("campaign.selectAllDevices")}
                      </button>
                    )}
                    <span className="text-foreground-muted text-[11px]">
                      {selectedDeviceIds.length}/{connectedDevices.length}{" "}
                      {t("campaign.connectedDevicesCount")}
                    </span>
                  </div>
                </div>

                {connectedDevices.length === 0 ? (
                  <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                    <p className="font-bold text-amber-700 dark:text-amber-400">
                      {t("campaign.noDeviceConnectedWarning")}
                    </p>
                    <p className="text-foreground-secondary mt-1 text-[11px]">
                      {t("campaign.pleaseConnectDeviceFirst")}
                    </p>
                    <Button
                      type="button"
                      variant="primaryPill"
                      size="sm"
                      onClick={() => {
                        onClose();
                        router.push("/devices");
                      }}
                      className="mt-3.5 gap-1.5 px-4 text-xs font-bold"
                    >
                      <Smartphone className="size-3.5" />
                      <span>{t("campaign.goToDevicesBtn")}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {connectedDevices.map((d) => {
                        const isSelected = selectedDeviceIds.includes(d.id);
                        return (
                          <div
                            key={d.id}
                            onClick={() => handleToggleDevice(d.id)}
                            className={`border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-md border p-3.5 transition dark:bg-[#10110e] ${
                              isSelected
                                ? "border-wise-green ring-wise-green bg-light-mint/30 dark:bg-wise-green/10 ring-1"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-full transition ${
                                  isSelected
                                    ? "bg-dark-green text-light-mint dark:bg-wise-green dark:text-dark-green"
                                    : "bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green"
                                }`}
                              >
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
                            {isSelected && (
                              <CheckCircle2 className="dark:text-wise-green size-4 shrink-0 text-emerald-700" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {selectedDeviceIds.length > 1 && (
                      <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-300">
                        <Zap className="dark:text-wise-green size-4 shrink-0 text-emerald-600 mt-0.5" />
                        <div>
                          <span className="font-bold">
                            {t("campaign.multiDeviceBannerTitle", {
                              count: String(selectedDeviceIds.length),
                            })}
                          </span>
                          <p className="text-foreground-secondary mt-0.5 text-[11px] leading-relaxed">
                            {t("campaign.multiDeviceBannerDesc", {
                              count: String(selectedDeviceIds.length),
                              percent: String(
                                Math.min(
                                  80,
                                  Math.round(
                                    (1 - 1 / selectedDeviceIds.length) * 100,
                                  ),
                                ),
                              ),
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Target Audience */}
          {step === 2 && (
            <div className="space-y-4 text-xs font-semibold">
              <Label className="text-foreground-secondary block font-bold tracking-wider uppercase">
                {t("campaign.audienceScopeLabel")}
              </Label>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {[
                  {
                    type: "ALL" as const,
                    title: t("campaign.audienceAllTitle"),
                    desc: t("campaign.audienceAllDesc", {
                      count: String(total || contacts.length),
                    }),
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
                      <span className="text-foreground block font-bold">
                        {item.title}
                      </span>
                      <p className="text-foreground-secondary mt-1 text-[11px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {total === 0 &&
                contacts.length === 0 &&
                targetType !== "CUSTOM" && (
                  <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:text-amber-300">
                    <div className="space-y-0.5">
                      <p className="font-bold">Buku Kontak Masih Kosong</p>
                      <p className="text-[11px] text-foreground-secondary">
                        Tambahkan kontak terlebih dahulu atau pilih opsi
                        &quot;Input Nomor Manual&quot;.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        router.push("/contacts");
                      }}
                      className="shrink-0 gap-1 text-[11px] font-bold border-amber-500/40 hover:bg-amber-500/20"
                    >
                      <span>Buka Kontak</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  </div>
                )}

              {/* Tag Selector if TAGS */}
              {targetType === "TAGS" && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary block text-[11px] font-bold uppercase">
                      {t("campaign.chooseTagsLabel")}
                    </span>
                    {selectedTagIds.length > 0 && (
                      <span className="text-foreground-muted text-[11px] font-mono">
                        {selectedTagIds.length} tag dipilih
                      </span>
                    )}
                  </div>
                  {tags.length === 0 ? (
                    <p className="text-foreground-muted text-xs italic">
                      {t("campaign.noTagsFound")}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => {
                        const isSelected = selectedTagIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-xs font-bold transition ${
                              isSelected
                                ? "bg-dark-green text-light-mint dark:bg-wise-green dark:text-dark-green border-transparent"
                                : "border-border bg-surface text-foreground-secondary hover:text-foreground dark:bg-[#10110e]"
                            }`}
                          >
                            #{tag.name}
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
                  <Label className="text-foreground-secondary block text-[11px] font-bold uppercase">
                    {t("campaign.customNumbersLabel")}
                  </Label>
                  <Textarea
                    rows={4}
                    value={customNumbersStr}
                    onChange={(e) => setCustomNumbersStr(e.target.value)}
                    placeholder={"081234567890\n6289876543210\n+60123456789"}
                    variant="rounded"
                    className="font-mono"
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-foreground-muted">
                      {t("campaign.customNumbersHint")} (otomatis normalisasi
                      08xx → 628xx & format internasional)
                    </span>
                    {parseCustomNumbers(customNumbersStr).length > 0 && (
                      <span className="dark:text-wise-green inline-flex items-center gap-1 font-bold text-emerald-700">
                        <Check className="size-3.5 shrink-0" />
                        <span>
                          {parseCustomNumbers(customNumbersStr).length} nomor
                          valid
                        </span>
                      </span>
                    )}
                  </div>
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
                  <Label className="text-foreground-secondary font-bold tracking-wider uppercase">
                    {t("campaign.spintaxTemplateLabel")}
                  </Label>
                  <button
                    type="button"
                    onClick={insertSpintaxSample}
                    className="dark:text-wise-green cursor-pointer text-xs font-bold text-emerald-700 hover:underline"
                  >
                    + {t("campaign.insertSampleSpintax")}
                  </button>
                </div>
                <Textarea
                  rows={5}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder={t("campaign.spintaxPlaceholder")}
                  variant="rounded"
                />
                <div className="text-foreground-muted mt-1 flex justify-between text-[11px]">
                  <span>{t("campaign.spintaxSyntaxHint")}</span>
                  <span>Variabel: {"{nama}"}</span>
                </div>
              </div>

              {/* Live Spintax Visualizer */}
              <SpintaxVisualizer
                previewText={preview}
                onRandomize={randomize}
              />
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
                      <Label className="text-foreground-secondary font-semibold">
                        {t("campaign.jitterDelayLabel")}
                      </Label>
                      <span className="dark:text-wise-green font-mono font-black text-emerald-700">
                        {jitterDelaySeconds} {t("campaign.secondsUnit")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={15}
                      value={jitterDelaySeconds}
                      onChange={(e) =>
                        setJitterDelaySeconds(Number(e.target.value))
                      }
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

                  {/* Pre-Blast USync Validation Switch */}
                  <div className="border-border/50 flex items-center justify-between border-t pt-2.5">
                    <div className="pr-4">
                      <span className="text-foreground block font-bold">
                        {t("campaign.autoScrubDeadNumbersLabel")}
                      </span>
                      <span className="text-foreground-muted text-[11px] leading-relaxed">
                        {t("campaign.autoScrubDeadNumbersHint")}
                      </span>
                    </div>
                    <Switch
                      checked={autoScrubDeadNumbers}
                      onCheckedChange={setAutoScrubDeadNumbers}
                      aria-label={t("campaign.autoScrubDeadNumbersLabel")}
                    />
                  </div>

                  {/* Smart Anti-Ban Warmup Engine Note */}
                  <div className="border-border/50 border-t pt-2.5">
                    <div className="flex items-center gap-1.5 text-foreground-secondary">
                      <ShieldCheck className="dark:text-wise-green size-3.5 text-emerald-600" />
                      <span className="font-bold text-[11px]">
                        {t("campaign.warmupEngineTitle")}
                      </span>
                    </div>
                    <p className="text-foreground-muted text-[11px] mt-1 leading-relaxed">
                      {t("campaign.warmupEngineDesc")}
                    </p>
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
                    <Label className="text-foreground-secondary mb-1 block text-[11px]">
                      {t("campaign.selectDateTimeLabel")}
                    </Label>
                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      variant="rounded"
                      className="font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Navigation */}
        <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-between gap-2.5 rounded-none border-t p-3.5 backdrop-blur-sm sm:p-5/90">
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
              {t("common.cancel")}
            </Button>
          )}

          {step < 4 ? (
            step === 1 && connectedDevices.length === 0 ? (
              <Button
                type="button"
                variant="primaryPill"
                size="sm"
                onClick={() => {
                  onClose();
                  router.push("/devices");
                }}
                className="cursor-pointer gap-1.5 px-5 text-xs font-bold shadow-sm"
              >
                <Smartphone className="size-3.5" />
                <span>{t("campaign.goToDevicesBtn")}</span>
              </Button>
            ) : (
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
            )
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
