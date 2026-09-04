"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { useQRPairing } from "@/modules/whatsapp/hooks/useQRPairing";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useClipboard } from "@/hooks/useClipboard";
import { Button } from "@/components/ui/button";
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
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  ShieldCheck,
  QrCode,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";

interface LiveQRModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (device: Device) => void;
}

export function LiveQRModal({ device, isOpen, onClose, onSuccess }: LiveQRModalProps) {
  const { t } = useI18n();
  const authUserPhone = useAuth((s) => s.user?.phone || "");
  const [customPhone, setCustomPhone] = useState<string | null>(null);

  // Normalisasi nomor lokal: hapus karakter non-digit dan buang awalan 62 / +62 / 0
  const cleanSubscriberNumber = (val: string): string => {
    let clean = val.replace(/\D/g, "");
    if (clean.startsWith("62")) {
      clean = clean.slice(2);
    } else if (clean.startsWith("0")) {
      clean = clean.slice(1);
    }
    return clean;
  };

  const rawPhone = customPhone !== null ? customPhone : authUserPhone;
  const subscriberPhone = cleanSubscriberNumber(rawPhone);
  const { isCopied: copied, copy } = useClipboard();

  const handlePairingSuccess = () => {
    if (device) {
      onSuccess({
        ...device,
        status: "CONNECTED",
        lastSeenAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  const {
    pairMode,
    setPairMode,
    qrCode,
    pairingCode,
    status,
    errorMessage,
    countdown,
    isLoadingCode,
    requestPairingCode,
    retry,
  } = useQRPairing({
    deviceId: device?.id || null,
    isOpen,
    onSuccess: handlePairingSuccess,
  });

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberPhone.trim()) return;
    const fullE164Phone = `62${subscriberPhone.trim()}`;
    await requestPairingCode(fullE164Phone);
  };

  const handleCopyCode = async () => {
    if (pairingCode) {
      await copy(pairingCode);
    }
  };

  if (!device) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
        {/* Sticky Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-start justify-between border-b p-5 pb-4 text-left sm:p-6">
          <div className="space-y-1">
            <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 mb-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold">
              <ShieldCheck className="size-3.5" />
              <span>Multi-Device End-to-End Encrypted</span>
            </div>
            <DialogTitle className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("whatsapp.qrModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("whatsapp.slotLabel")}{" "}
              <span className="text-foreground font-bold">
                {device.push_name || device.pushName || device.name || "WhatsApp Device"}
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Tab Switcher: QR Code vs Phone Pairing Code */}
        {status !== "AUTHENTICATED" && (
          <div className="shrink-0 px-5 pt-4 pb-0 sm:px-6">
            <div className="bg-muted/60 border-border grid grid-cols-2 rounded-md border p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPairMode("QR")}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded py-2 transition ${
                  pairMode === "QR"
                    ? "bg-surface text-foreground font-extrabold shadow-sm"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                <QrCode className="size-3.5" />
                <span>{t("whatsapp.scanQRTab")}</span>
              </button>
              <button
                type="button"
                onClick={() => setPairMode("PHONE")}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded py-2 transition ${
                  pairMode === "PHONE"
                    ? "bg-surface text-foreground font-extrabold shadow-sm"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>{t("whatsapp.phoneCodeTab")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* Main Presentation Box */}
          <div className="border-border/80 flex min-h-60 flex-col items-center justify-center rounded-md border bg-zinc-100 p-5 dark:bg-[#10110e]">
            {status === "AUTHENTICATED" ? (
              <div className="animate-in zoom-in-95 space-y-3 py-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="size-10 animate-bounce" />
                </div>
                <h3 className="text-foreground text-lg font-extrabold">
                  {t("whatsapp.qrSuccess")}
                </h3>
                <p className="text-foreground-secondary max-w-xs text-xs font-semibold">
                  {t("whatsapp.qrSuccessDesc")}
                </p>
              </div>
            ) : status === "ERROR" ? (
              <div className="space-y-3 py-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                  <AlertCircle className="size-7" />
                </div>
                <h3 className="text-foreground text-base font-bold">{t("whatsapp.qrError")}</h3>
                <p className="text-foreground-secondary max-w-xs text-xs font-semibold">
                  {errorMessage || t("whatsapp.qrErrorDesc")}
                </p>
                <Button
                  variant="primaryPill"
                  size="sm"
                  onClick={retry}
                  className="cursor-pointer gap-2 rounded-full px-5 text-xs font-bold"
                >
                  <RefreshCw className="size-3.5" />
                  <span>{t("whatsapp.qrRetry")}</span>
                </Button>
              </div>
            ) : pairMode === "QR" ? (
              /* TAB 1: QR SCANNER */
              qrCode ? (
                <div className="flex flex-col items-center space-y-3.5">
                  <div className="border-border/80 flex size-52 items-center justify-center rounded-md border bg-white p-3 shadow-md sm:size-56">
                    <Image
                      src={qrCode}
                      alt="WhatsApp QR Code"
                      width={190}
                      height={190}
                      unoptimized
                      className="size-44 object-contain sm:size-48"
                    />
                  </div>

                  {/* Countdown Indicator or Expired Refresh */}
                  {countdown > 0 ? (
                    <div className="text-foreground-secondary flex items-center gap-2 text-xs font-semibold">
                      <RefreshCw className="dark:text-wise-green size-3.5 animate-spin text-emerald-700" />
                      <span>{t("whatsapp.qrExpiresIn", { seconds: countdown.toString() })}</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retry}
                      className="border-border hover:border-foreground-muted cursor-pointer gap-1.5 rounded-full text-xs font-bold"
                    >
                      <RefreshCw className="dark:text-wise-green size-3.5 text-emerald-700" />
                      <span>{t("whatsapp.qrExpiredReload")}</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 py-8 text-center">
                  <Loader2 className="dark:text-wise-green mx-auto size-9 animate-spin text-emerald-700" />
                  <p className="text-foreground-secondary text-xs font-semibold">
                    {t("whatsapp.qrWaiting")}
                  </p>
                </div>
              )
            ) : (
              /* TAB 2: PHONE PAIRING CODE */
              <div className="flex w-full max-w-sm flex-col items-center space-y-4">
                {pairingCode ? (
                  <div className="animate-in zoom-in-95 w-full space-y-3 text-center">
                    <p className="text-foreground-secondary text-xs font-semibold">
                      {t("whatsapp.enterPairingCodeInstruction")}
                    </p>

                    {/* Big Monospace OTP Boxes */}
                    <div className="border-wise-green/40 inline-flex items-center justify-center gap-1.5 rounded-md border bg-white p-3 shadow-inner dark:bg-[#1f211d]">
                      {pairingCode.split("").map((char, idx) => (
                        <span
                          key={idx}
                          className={`font-mono text-xl font-black sm:text-2xl ${
                            char === "-"
                              ? "text-foreground-muted px-1"
                              : "bg-muted/60 text-foreground border-border flex size-8 items-center justify-center rounded border sm:size-9"
                          }`}
                        >
                          {char}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                        className="border-border hover:border-wise-green cursor-pointer gap-2 rounded-full text-xs font-bold"
                      >
                        {copied ? (
                          <>
                            <Check className="text-dark-green dark:text-wise-green size-3.5" />
                            <span className="text-dark-green dark:text-wise-green font-bold">
                              {t("whatsapp.codeCopied")}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>{t("whatsapp.copyCode")}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRequestCode} className="w-full space-y-3">
                    <div className="space-y-1 text-left">
                      <label className="text-foreground text-xs font-bold">
                        {t("whatsapp.phoneLabel")}
                      </label>
                      <div className="border-border bg-surface focus-within:ring-wise-green/40 flex overflow-hidden rounded-md border focus-within:ring-2">
                        <span className="bg-muted text-foreground-secondary border-border flex items-center border-r px-3 py-2 text-xs font-bold">
                          +62
                        </span>
                        <input
                          type="tel"
                          placeholder="81234567890"
                          value={subscriberPhone}
                          onChange={(e) => setCustomPhone(cleanSubscriberNumber(e.target.value))}
                          className="text-foreground flex-1 bg-transparent px-3 py-2 text-xs font-semibold focus:outline-none"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primaryPill"
                      size="sm"
                      disabled={isLoadingCode || !subscriberPhone.trim()}
                      className="w-full gap-2 text-xs font-bold"
                    >
                      {isLoadingCode ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>{t("whatsapp.connecting")}</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="size-3.5" />
                          <span>{t("whatsapp.getPairingCode")}</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-surface border-border space-y-2 rounded-md border p-4 text-xs font-semibold dark:bg-[#1b1d1a]">
            <div className="text-foreground mb-1 flex items-center gap-2 font-bold">
              <Smartphone className="dark:text-wise-green size-4 text-emerald-700" />
              <span>
                {pairMode === "QR"
                  ? t("whatsapp.qrInstructionsTitle")
                  : t("whatsapp.phoneCodeInstructionsTitle")}
              </span>
            </div>
            {pairMode === "QR" ? (
              <ol className="text-foreground-secondary list-inside list-decimal space-y-1.5 pl-1 leading-relaxed">
                <li>{t("whatsapp.qrInstructionsStep1")}</li>
                <li>{t("whatsapp.qrInstructionsStep2")}</li>
                <li>{t("whatsapp.qrInstructionsStep3")}</li>
              </ol>
            ) : (
              <ol className="text-foreground-secondary list-inside list-decimal space-y-1.5 pl-1 leading-relaxed">
                <li>{t("whatsapp.phoneStep1")}</li>
                <li>{t("whatsapp.phoneStep2")}</li>
                <li>{t("whatsapp.phoneStep3")}</li>
                <li>{t("whatsapp.phoneStep4")}</li>
              </ol>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <DialogFooter className="border-border bg-surface/50 m-0 flex shrink-0 flex-row justify-end rounded-none border-t p-4 sm:p-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-6 text-xs font-bold"
          >
            {t("whatsapp.qrClose")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
