"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreateCampaignInput,
  CampaignChannelType,
} from "@/modules/campaign/types/campaign.types";
import { useOmnichannelSenders } from "@/modules/omnichannel/hooks/useOmnichannelSenders";
import { useContacts } from "@/modules/contact/hooks/useContacts";
import { useSpintax } from "@/modules/campaign/hooks/useSpintax";
import { SpintaxVisualizer } from "./SpintaxVisualizer";
import { CampaignChannelSelector } from "./CampaignChannelSelector";
import {
  WabaTemplateCampaignPicker,
  DEFAULT_CAMPAIGN_WABA_TEMPLATES,
} from "./WabaTemplateCampaignPicker";
import {
  TelegramKeyboardCampaignPicker,
  TelegramButton,
} from "./TelegramKeyboardCampaignPicker";
import { WABATemplateMock } from "@/modules/whatsapp/views/seller/WABATemplatesView";
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
  Bot,
  Layers,
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
    const trimmed = line.trim();
    if (!trimmed) continue;
    const normalized = normalizePhoneNumber(trimmed);
    if (isValidE164(normalized) && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
};

const parseCustomTelegramIds = (raw: string): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
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

  // Omnichannel Senders
  const {
    activeDevices,
    activeWabaAccounts,
    activeTelegramBots,
    activeCounts,
  } = useOmnichannelSenders();

  const { contacts, tags, total } = useContacts();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");

  // Channel Type State
  const [channelType, setChannelType] =
    useState<CampaignChannelType>("WHATSMEOW_UNOFFICIAL");

  // Sender selections
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [selectedWabaAccountId, setSelectedWabaAccountId] = useState<string>("");
  const [selectedTelegramBotId, setSelectedTelegramBotId] = useState<string>("");

  // Audience State
  const [targetType, setTargetType] = useState<"ALL" | "TAGS" | "CUSTOM">("ALL");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [customNumbersStr, setCustomNumbersStr] = useState("");
  const [customChatIdsStr, setCustomChatIdsStr] = useState("");

  // WhatsApp Web Spintax
  const { template, preview, setTemplate, randomize } = useSpintax(
    "{Halo|Hi|Selamat Siang} Kak {nama}, dapatkan penawaran spesial {diskon 50%|potongan harga} hari ini!",
  );

  // WABA Config
  const [selectedWabaTemplate, setSelectedWabaTemplate] = useState<WABATemplateMock>(
    DEFAULT_CAMPAIGN_WABA_TEMPLATES[0],
  );
  const [wabaParamsMapping, setWabaParamsMapping] = useState<Record<string, string>>(
    DEFAULT_CAMPAIGN_WABA_TEMPLATES[0].exampleValues || {},
  );

  // Telegram Config
  const [telegramMessage, setTelegramMessage] = useState(
    "<b>Halo Pelanggan Setia!</b>\n\nDapatkan promo spesial hari ini. Klik tautan di bawah untuk informasi selengkapnya.",
  );
  const [telegramParseMode, setTelegramParseMode] = useState<"HTML" | "MarkdownV2">(
    "HTML",
  );
  const [telegramButtons, setTelegramButtons] = useState<TelegramButton[]>([
    { text: "Klaim Promo", url: "https://wahide.id/promo" },
  ]);

  // Dispatch & Anti-Ban Config
  const [jitterDelaySeconds, setJitterDelaySeconds] = useState(4);
  const [enableHumanTyping, setEnableHumanTyping] = useState(true);
  const [autoScrubDeadNumbers, setAutoScrubDeadNumbers] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-set initial active sender when channel changes
  useEffect(() => {
    if (channelType === "WHATSMEOW_UNOFFICIAL" && activeDevices.length > 0) {
      if (selectedDeviceIds.length === 0) {
        setSelectedDeviceIds([activeDevices[0].id]);
      }
    } else if (channelType === "META_WABA_OFFICIAL" && activeWabaAccounts.length > 0) {
      if (!selectedWabaAccountId) {
        setSelectedWabaAccountId(activeWabaAccounts[0].id);
      }
    } else if (channelType === "TELEGRAM_BOT" && activeTelegramBots.length > 0) {
      if (!selectedTelegramBotId) {
        setSelectedTelegramBotId(activeTelegramBots[0].id);
      }
    }
  }, [
    channelType,
    activeDevices,
    activeWabaAccounts,
    activeTelegramBots,
    selectedDeviceIds.length,
    selectedWabaAccountId,
    selectedTelegramBotId,
  ]);

  // Auto-default channel based on available senders
  useEffect(() => {
    if (activeCounts.whatsmeow > 0) {
      setChannelType("WHATSMEOW_UNOFFICIAL");
    } else if (activeCounts.waba > 0) {
      setChannelType("META_WABA_OFFICIAL");
    } else if (activeCounts.telegram > 0) {
      setChannelType("TELEGRAM_BOT");
    }
  }, [activeCounts.whatsmeow, activeCounts.waba, activeCounts.telegram]);

  if (!isOpen) return null;

  const handleToggleDevice = (id: string) => {
    setSelectedDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id],
    );
  };

  const handleToggleAllDevices = () => {
    if (selectedDeviceIds.length === activeDevices.length) {
      setSelectedDeviceIds([]);
    } else {
      setSelectedDeviceIds(activeDevices.map((d) => d.id));
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!name.trim()) {
        setError("Nama kampanye wajib diisi.");
        return;
      }

      if (channelType === "WHATSMEOW_UNOFFICIAL") {
        if (activeDevices.length === 0) {
          toast.error("Tidak ada perangkat WhatsApp aktif.");
          return;
        }
        if (selectedDeviceIds.length === 0) {
          setError("Silakan pilih minimal satu perangkat WhatsApp pengirim.");
          return;
        }
      } else if (channelType === "META_WABA_OFFICIAL") {
        if (activeWabaAccounts.length === 0) {
          toast.error("Tidak ada akun Meta WABA aktif.");
          return;
        }
        if (!selectedWabaAccountId) {
          setError("Silakan pilih akun Meta WABA pengirim.");
          return;
        }
      } else if (channelType === "TELEGRAM_BOT") {
        if (activeTelegramBots.length === 0) {
          toast.error("Tidak ada bot Telegram aktif.");
          return;
        }
        if (!selectedTelegramBotId) {
          setError("Silakan pilih Bot Telegram pengirim.");
          return;
        }
      }
    } else if (step === 2) {
      if (channelType === "TELEGRAM_BOT") {
        if (targetType === "CUSTOM") {
          const parsed = parseCustomTelegramIds(customChatIdsStr);
          if (parsed.length === 0) {
            setError("Silakan masukkan minimal satu Telegram Chat ID / Username valid.");
            return;
          }
        }
      } else {
        if (targetType === "ALL" && total === 0 && contacts.length === 0) {
          setError(
            t("campaign.noTargetContactsSelected") ||
              "Target audiens kosong (0 penerima). Silakan tambahkan kontak terlebih dahulu atau gunakan input nomor manual.",
          );
          return;
        }
        if (targetType === "TAGS" && selectedTagIds.length === 0) {
          setError(t("campaign.errSelectTagRequired") || "Pilih minimal satu tag audiens.");
          return;
        }
        if (targetType === "CUSTOM") {
          const parsed = parseCustomNumbers(customNumbersStr);
          if (parsed.length === 0) {
            setError("Silakan masukkan minimal satu nomor telepon tujuan yang valid (+E.164).");
            return;
          }
        }
      }
    } else if (step === 3) {
      if (channelType === "WHATSMEOW_UNOFFICIAL") {
        if (!template.trim()) {
          setError("Isi template pesan broadcast wajib diisi.");
          return;
        }
      } else if (channelType === "META_WABA_OFFICIAL") {
        if (!selectedWabaTemplate.name) {
          setError("Pilih template resmi Meta WABA.");
          return;
        }
      } else if (channelType === "TELEGRAM_BOT") {
        if (!telegramMessage.trim()) {
          setError("Isi pesan siaran Telegram wajib diisi.");
          return;
        }
      }
    }

    setStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
  };

  const calculateTargetCount = (): number => {
    if (channelType === "TELEGRAM_BOT") {
      if (targetType === "CUSTOM") {
        return parseCustomTelegramIds(customChatIdsStr).length;
      }
      return total || contacts.length;
    }

    if (targetType === "ALL") return total || contacts.length;
    if (targetType === "TAGS") {
      if (selectedTagIds.length === 0) return 0;
      return total || contacts.length;
    }
    return parseCustomNumbers(customNumbersStr).length;
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      let finalTemplate = template.trim();
      if (channelType === "META_WABA_OFFICIAL") {
        finalTemplate = selectedWabaTemplate.bodyText;
      } else if (channelType === "TELEGRAM_BOT") {
        finalTemplate = telegramMessage.trim();
      }

      const targetNumbers =
        targetType === "CUSTOM" && channelType !== "TELEGRAM_BOT"
          ? parseCustomNumbers(customNumbersStr)
          : undefined;

      const targetChatIds =
        targetType === "CUSTOM" && channelType === "TELEGRAM_BOT"
          ? parseCustomTelegramIds(customChatIdsStr)
          : undefined;

      const payload: CreateCampaignInput = {
        name: name.trim(),
        channelType,
        deviceId:
          channelType === "WHATSMEOW_UNOFFICIAL"
            ? selectedDeviceIds[0] || ""
            : undefined,
        deviceIds:
          channelType === "WHATSMEOW_UNOFFICIAL"
            ? selectedDeviceIds
            : undefined,
        wabaAccountId:
          channelType === "META_WABA_OFFICIAL"
            ? selectedWabaAccountId
            : undefined,
        telegramBotId:
          channelType === "TELEGRAM_BOT"
            ? selectedTelegramBotId
            : undefined,
        wabaConfig:
          channelType === "META_WABA_OFFICIAL"
            ? {
                templateId: selectedWabaTemplate.id,
                templateName: selectedWabaTemplate.name,
                languageCode: selectedWabaTemplate.language,
                conversationCategory: selectedWabaTemplate.category,
                parametersMapping: wabaParamsMapping,
              }
            : undefined,
        telegramConfig:
          channelType === "TELEGRAM_BOT"
            ? {
                parseMode: telegramParseMode,
                inlineButtons: telegramButtons,
              }
            : undefined,
        messageTemplate: finalTemplate,
        autoScrubDeadNumbers:
          channelType === "WHATSMEOW_UNOFFICIAL"
            ? autoScrubDeadNumbers
            : false,
        jitterDelaySeconds:
          channelType === "WHATSMEOW_UNOFFICIAL"
            ? jitterDelaySeconds
            : 0,
        enableHumanTyping:
          channelType === "WHATSMEOW_UNOFFICIAL"
            ? enableHumanTyping
            : false,
        targetType,
        targetTags: targetType === "TAGS" ? selectedTagIds : undefined,
        targetNumbers,
        targetChatIds,
        scheduledAt:
          isScheduled && scheduledAt
            ? new Date(scheduledAt).toISOString()
            : undefined,
      };

      await onSubmit(payload);
      toast.success("Kampanye siaran omnichannel berhasil dibuat!");
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("campaign.errCreateFailed");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
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
      <DialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {/* Sticky Header with Step Tracker */}
        <DialogHeader className="border-border/80 shrink-0 space-y-3 border-b p-4 pb-3 text-left sm:p-6">
          <div>
            <DialogTitle className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Buat Kampanye Siaran Omnichannel
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              Kirim pesan massal terpadu via WhatsApp Web, Meta WABA Official, atau Telegram Bot.
            </DialogDescription>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-4 gap-1.5 pt-1 text-xs font-bold sm:gap-2">
            {[
              { num: 1, label: "Saluran & Pengirim", icon: Layers },
              { num: 2, label: "Target Audiens", icon: Users },
              { num: 3, label: "Konten Pesan", icon: MessageSquare },
              { num: 4, label: "Safeguard & Jadwal", icon: ShieldCheck },
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

          {/* STEP 1: Saluran & Pengirim */}
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
                  placeholder="Contoh: Flash Sale Gajian Omnichannel"
                  variant="rounded"
                  className="h-10 font-semibold"
                  autoFocus
                />
              </div>

              {/* Channel Selector */}
              <div>
                <Label className="text-foreground-secondary mb-2 block font-bold tracking-wider uppercase">
                  Pilih Saluran Pengiriman Siaran
                </Label>
                <CampaignChannelSelector
                  selectedChannel={channelType}
                  onSelectChannel={(ch) => setChannelType(ch)}
                  activeCounts={activeCounts}
                />
              </div>

              {/* Dynamic Senders Based on Channel */}
              <div className="border-t border-border/80 pt-3">
                {/* 1. WHATSAPP WEB SENDERS */}
                {channelType === "WHATSMEOW_UNOFFICIAL" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground-secondary font-bold tracking-wider uppercase">
                        Pilih Perangkat WhatsApp Terhubung (Multi-Device Pooling)
                      </Label>
                      {activeDevices.length > 1 && (
                        <button
                          type="button"
                          onClick={handleToggleAllDevices}
                          className="text-emerald-700 dark:text-wise-green hover:underline cursor-pointer text-[11px] font-bold"
                        >
                          {selectedDeviceIds.length === activeDevices.length
                            ? "Batalkan Semua"
                            : "Pilih Semua Perangkat"}
                        </button>
                      )}
                    </div>

                    {activeDevices.length === 0 ? (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                        <p className="font-bold text-amber-700 dark:text-amber-400">
                          Tidak ada slot perangkat WhatsApp Web terhubung
                        </p>
                        <p className="text-foreground-secondary mt-1 text-[11px]">
                          Silakan hubungkan perangkat WhatsApp via scan QR di menu Perangkat.
                        </p>
                        <Button
                          type="button"
                          variant="primaryPill"
                          size="sm"
                          onClick={() => {
                            onClose();
                            router.push("/wa/devices");
                          }}
                          className="mt-3 gap-1.5 px-4 text-xs font-bold"
                        >
                          <Smartphone className="size-3.5" />
                          <span>Buka Menu Perangkat WA</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {activeDevices.map((d) => {
                          const isSelected = selectedDeviceIds.includes(d.id);
                          return (
                            <div
                              key={d.id}
                              onClick={() => handleToggleDevice(d.id)}
                              className={`border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-xl border p-3 transition dark:bg-[#10110e] ${
                                isSelected
                                  ? "border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-500/5"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition ${
                                    isSelected
                                      ? "bg-emerald-600 text-white"
                                      : "bg-emerald-500/10 text-emerald-600"
                                  }`}
                                >
                                  <Smartphone className="size-4" />
                                </div>
                                <div className="truncate">
                                  <span className="text-foreground block font-bold truncate">
                                    {d.name || d.pushName || "Perangkat WA"}
                                  </span>
                                  <span className="text-foreground-muted font-mono text-[11px]">
                                    {d.phone ? `+${d.phone.replace(/^\+/, "")}` : "Socket MD"}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. META WABA OFFICIAL SENDERS */}
                {channelType === "META_WABA_OFFICIAL" && (
                  <div className="space-y-2.5">
                    <Label className="text-foreground-secondary font-bold tracking-wider uppercase">
                      Pilih Akun Nomor Bisnis Resmi Meta
                    </Label>
                    {activeWabaAccounts.length === 0 ? (
                      <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-center">
                        <p className="font-bold text-sky-700 dark:text-sky-300">
                          Belum ada akun Meta WABA terhubung
                        </p>
                        <p className="text-foreground-secondary mt-1 text-[11px]">
                          Hubungkan akun WhatsApp Business Official Anda melalui Meta Cloud API.
                        </p>
                        <Button
                          type="button"
                          variant="primaryPill"
                          size="sm"
                          onClick={() => {
                            onClose();
                            router.push("/waba/devices");
                          }}
                          className="mt-3 gap-1.5 px-4 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white"
                        >
                          <ShieldCheck className="size-3.5" />
                          <span>Hubungkan Meta WABA</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {activeWabaAccounts.map((w) => {
                          const isSelected = selectedWabaAccountId === w.id;
                          return (
                            <div
                              key={w.id}
                              onClick={() => setSelectedWabaAccountId(w.id)}
                              className={`border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-xl border p-3 transition dark:bg-[#10110e] ${
                                isSelected
                                  ? "border-sky-500 ring-1 ring-sky-500/30 bg-sky-500/5"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition ${
                                    isSelected
                                      ? "bg-sky-600 text-white"
                                      : "bg-sky-500/10 text-sky-600"
                                  }`}
                                >
                                  <ShieldCheck className="size-4" />
                                </div>
                                <div className="truncate">
                                  <span className="text-foreground block font-bold truncate">
                                    {w.verified_name || w.name || "Akun Meta WABA"}
                                  </span>
                                  <span className="text-foreground-muted font-mono text-[11px]">
                                    +{w.phone_number?.replace(/^\+/, "") || w.phone_number_id}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="size-4 shrink-0 text-sky-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TELEGRAM BOT SENDERS */}
                {channelType === "TELEGRAM_BOT" && (
                  <div className="space-y-2.5">
                    <Label className="text-foreground-secondary font-bold tracking-wider uppercase">
                      Pilih Bot Telegram Pengirim Siaran
                    </Label>
                    {activeTelegramBots.length === 0 ? (
                      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-center">
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          Belum ada Bot Telegram aktif
                        </p>
                        <p className="text-foreground-secondary mt-1 text-[11px]">
                          Hubungkan bot Telegram dari @BotFather di menu Bot Telegram.
                        </p>
                        <Button
                          type="button"
                          variant="primaryPill"
                          size="sm"
                          onClick={() => {
                            onClose();
                            router.push("/tele/devices");
                          }}
                          className="mt-3 gap-1.5 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Bot className="size-3.5" />
                          <span>Hubungkan Bot Telegram</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {activeTelegramBots.map((b) => {
                          const isSelected = selectedTelegramBotId === b.id;
                          return (
                            <div
                              key={b.id}
                              onClick={() => setSelectedTelegramBotId(b.id)}
                              className={`border-border bg-surface hover:border-foreground-muted flex cursor-pointer items-center justify-between rounded-xl border p-3 transition dark:bg-[#10110e] ${
                                isSelected
                                  ? "border-blue-500 ring-1 ring-blue-500/30 bg-blue-500/5"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition ${
                                    isSelected
                                      ? "bg-blue-600 text-white"
                                      : "bg-blue-500/10 text-blue-600"
                                  }`}
                                >
                                  <Bot className="size-4" />
                                </div>
                                <div className="truncate">
                                  <span className="text-foreground block font-bold truncate">
                                    {b.name}
                                  </span>
                                  <span className="text-foreground-muted font-mono text-[11px]">
                                    @{b.username}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Target Audiens */}
          {step === 2 && (
            <div className="space-y-4 text-xs font-semibold">
              <Label className="text-foreground-secondary block font-bold tracking-wider uppercase">
                {t("campaign.audienceScopeLabel")}
              </Label>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {[
                  {
                    type: "ALL" as const,
                    title: "Semua Kontak Pelanggan",
                    desc: `Menjangkau seluruh ${total || contacts.length} kontak di buku alamat`,
                  },
                  {
                    type: "TAGS" as const,
                    title: "Berdasarkan Tag",
                    desc: "Targetkan grup spesifik seperti VIP, Grosir, atau Leads",
                  },
                  {
                    type: "CUSTOM" as const,
                    title:
                      channelType === "TELEGRAM_BOT"
                        ? "Input Chat ID Manual"
                        : "Input Nomor Manual",
                    desc:
                      channelType === "TELEGRAM_BOT"
                        ? "Ketik atau paste daftar Telegram Chat ID / Username"
                        : "Ketik atau paste daftar nomor WhatsApp langsung",
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    onClick={() => setTargetType(item.type)}
                    className={`border-border bg-surface hover:border-foreground-muted flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition dark:bg-[#10110e] ${
                      targetType === item.type
                        ? "border-wise-green ring-1 ring-wise-green bg-emerald-500/5 dark:bg-wise-green/10"
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

              {/* Tag Selector if TAGS */}
              {targetType === "TAGS" && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary block text-[11px] font-bold uppercase">
                      Pilih Tag Audiens
                    </span>
                    {selectedTagIds.length > 0 && (
                      <span className="text-foreground-muted text-[11px] font-mono">
                        {selectedTagIds.length} tag dipilih
                      </span>
                    )}
                  </div>
                  {tags.length === 0 ? (
                    <p className="text-foreground-muted text-xs italic">
                      Belum ada tag kontak yang tersedia.
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

              {/* Custom Input Box */}
              {targetType === "CUSTOM" && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-foreground-secondary block text-[11px] font-bold uppercase">
                    {channelType === "TELEGRAM_BOT"
                      ? "Daftar Chat ID / Username Telegram (Pisahkan tiap baris)"
                      : "Daftar Nomor Telepon (Pisahkan tiap baris)"}
                  </Label>
                  {channelType === "TELEGRAM_BOT" ? (
                    <Textarea
                      rows={4}
                      value={customChatIdsStr}
                      onChange={(e) => setCustomChatIdsStr(e.target.value)}
                      placeholder={"987654321\n@username_pelanggan\n-1001234567890"}
                      variant="rounded"
                      className="font-mono text-xs"
                    />
                  ) : (
                    <Textarea
                      rows={4}
                      value={customNumbersStr}
                      onChange={(e) => setCustomNumbersStr(e.target.value)}
                      placeholder={"081234567890\n6289876543210\n+62811223344"}
                      variant="rounded"
                      className="font-mono text-xs"
                    />
                  )}
                </div>
              )}

              {/* Summary of Audience Count */}
              <div className="bg-emerald-500/5 border border-emerald-500/30 flex items-center justify-between rounded-xl p-3">
                <span className="text-foreground font-semibold">
                  Estimasi Total Penerima Siaran:
                </span>
                <span className="text-emerald-700 dark:text-wise-green font-mono font-black text-sm">
                  {calculateTargetCount()} Penerima
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Konten Pesan Adaptif */}
          {step === 3 && (
            <div className="space-y-4 text-xs font-semibold">
              {/* 1. WHATSAPP WEB CONTENT */}
              {channelType === "WHATSMEOW_UNOFFICIAL" && (
                <div className="space-y-3">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <Label className="text-foreground-secondary font-bold tracking-wider uppercase">
                        Template Pesan Spintax WhatsApp
                      </Label>
                      <button
                        type="button"
                        onClick={insertSpintaxSample}
                        className="text-emerald-700 dark:text-wise-green cursor-pointer text-xs font-bold hover:underline"
                      >
                        + Sisipkan Contoh Spintax
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
                      <span>Gunakan {"{Opsi A|Opsi B}"} untuk variasi anti-ban</span>
                      <span>Variabel: {"{nama}"}</span>
                    </div>
                  </div>

                  <SpintaxVisualizer
                    previewText={preview}
                    onRandomize={randomize}
                  />
                </div>
              )}

              {/* 2. META WABA CONTENT */}
              {channelType === "META_WABA_OFFICIAL" && (
                <WabaTemplateCampaignPicker
                  selectedTemplateName={selectedWabaTemplate.name}
                  onSelectTemplate={(tpl, params) => {
                    setSelectedWabaTemplate(tpl);
                    setWabaParamsMapping(params);
                  }}
                />
              )}

              {/* 3. TELEGRAM BOT CONTENT */}
              {channelType === "TELEGRAM_BOT" && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-foreground-secondary mb-1.5 block font-bold tracking-wider uppercase">
                      Isi Pesan Broadcast Telegram
                    </Label>
                    <Textarea
                      rows={4}
                      value={telegramMessage}
                      onChange={(e) => setTelegramMessage(e.target.value)}
                      placeholder="Ketik pesan siaran Telegram..."
                      variant="rounded"
                      className="font-mono text-xs"
                    />
                  </div>

                  <TelegramKeyboardCampaignPicker
                    buttons={telegramButtons}
                    onChangeButtons={setTelegramButtons}
                    parseMode={telegramParseMode}
                    onChangeParseMode={setTelegramParseMode}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Safeguard & Jadwal */}
          {step === 4 && (
            <div className="space-y-4 text-xs font-semibold">
              {/* WhatsApp Web Anti-ban controls */}
              {channelType === "WHATSMEOW_UNOFFICIAL" && (
                <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="dark:text-wise-green size-4 text-emerald-600" />
                    <span className="text-foreground font-bold tracking-wider uppercase">
                      Konfigurasi Anti-Ban WhatsApp Web
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground-secondary font-semibold">
                          Jitter Delay Acak Antar Pesan:
                        </Label>
                        <span className="dark:text-wise-green font-mono font-black text-emerald-700">
                          {jitterDelaySeconds} Detik
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
                        className="accent-wise-green mt-1 w-full"
                      />
                      <span className="text-foreground-muted text-[11px]">
                        Mencegah deteksi lonjakan blast robotik WhatsApp.
                      </span>
                    </div>

                    <div className="border-border/50 flex items-center justify-between border-t pt-2.5">
                      <div>
                        <span className="text-foreground block font-bold">
                          Simulasi Mengetik Manusia
                        </span>
                        <span className="text-foreground-muted text-[11px]">
                          Menampilkan status &quot;sedang mengetik...&quot; sebelum mengirim.
                        </span>
                      </div>
                      <Switch
                        checked={enableHumanTyping}
                        onCheckedChange={setEnableHumanTyping}
                      />
                    </div>

                    <div className="border-border/50 flex items-center justify-between border-t pt-2.5">
                      <div className="pr-4">
                        <span className="text-foreground block font-bold">
                          Otomatis Lewati Nomor Mati / Tak Terdaftar
                        </span>
                        <span className="text-foreground-muted text-[11px]">
                          Melindungi trust score nomor agar tidak drop saat kena nomor expired.
                        </span>
                      </div>
                      <Switch
                        checked={autoScrubDeadNumbers}
                        onCheckedChange={setAutoScrubDeadNumbers}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Meta WABA Speed & Cloud Safeguard */}
              {channelType === "META_WABA_OFFICIAL" && (
                <div className="border-sky-500/30 bg-sky-500/5 space-y-2 rounded-xl border p-4">
                  <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
                    <ShieldCheck className="size-4" />
                    <span className="font-bold tracking-wider uppercase">
                      Meta Cloud API Official Pipeline
                    </span>
                  </div>
                  <p className="text-foreground-secondary text-[11px] leading-relaxed">
                    Siaran WABA dikirim langsung melalui server resmi Meta dengan kapasitas throughput hingga 500 pesan/detik. Tidak memerlukan simulasi pengetikan atau delay jitter anti-ban.
                  </p>
                </div>
              )}

              {/* Telegram Bot Speed Safeguard */}
              {channelType === "TELEGRAM_BOT" && (
                <div className="border-blue-500/30 bg-blue-500/5 space-y-2 rounded-xl border p-4">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Bot className="size-4" />
                    <span className="font-bold tracking-wider uppercase">
                      Telegram Flood-Control Limiter (30 msg/sec)
                    </span>
                  </div>
                  <p className="text-foreground-secondary text-[11px] leading-relaxed">
                    Gateway Wahide menerapkan pembatasan otomatis 30 pesan per detik untuk mematuhi kebijakan anti-spam Telegram Bot API tanpa resiko error HTTP 429.
                  </p>
                </div>
              )}

              {/* Scheduling Section */}
              <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="text-foreground-secondary size-4" />
                    <span className="text-foreground font-bold tracking-wider uppercase">
                      Jadwalkan Pengiriman Siaran
                    </span>
                  </div>
                  <Switch
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                </div>

                {isScheduled && (
                  <div className="pt-1">
                    <Label className="text-foreground-secondary mb-1 block text-[11px]">
                      Pilih Tanggal & Waktu Siaran
                    </Label>
                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      variant="rounded"
                      className="font-mono text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Navigation */}
        <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-between gap-2.5 rounded-none border-t p-3.5 backdrop-blur-sm sm:p-5">
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
                  <span>Luncurkan Siaran</span>
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
