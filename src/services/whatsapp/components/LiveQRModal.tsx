"use client";

import React from "react";
import Image from "next/image";
import { Device } from "../types/whatsapp.types";
import { useQRPairing } from "../hooks/useQRPairing";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

interface LiveQRModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (device: Device) => void;
}

export function LiveQRModal({
  device,
  isOpen,
  onClose,
  onSuccess,
}: LiveQRModalProps) {
  const { t } = useI18n();

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
    qrCode,
    status,
    errorMessage,
    countdown,
    retry,
  } = useQRPairing({
    deviceId: device?.id || null,
    isOpen,
    onSuccess: handlePairingSuccess,
  });

  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/15 text-wise-green mb-1">
              <ShieldCheck className="size-3.5" />
              <span>Multi-Device End-to-End Encrypted</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {t("whatsapp.qrModalTitle")}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-foreground-secondary">
              Slot: <span className="text-foreground font-bold">{device.name}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-6 rounded-md bg-zinc-100 dark:bg-[#10110e] border border-border/80 min-h-[280px]">
          {status === "AUTHENTICATED" ? (
            <div className="text-center space-y-3 py-6 animate-in zoom-in-95">
              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="size-10 animate-bounce" />
              </div>
              <h3 className="font-extrabold text-lg text-foreground">
                {t("whatsapp.qrSuccess")}
              </h3>
              <p className="text-xs text-foreground-secondary max-w-xs font-semibold">
                {t("whatsapp.qrSuccessDesc")}
              </p>
            </div>
          ) : status === "ERROR" ? (
            <div className="text-center space-y-3 py-4">
              <div className="size-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="size-7" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                {t("whatsapp.qrError")}
              </h3>
              <p className="text-xs text-foreground-secondary font-semibold max-w-xs">
                {errorMessage || t("whatsapp.qrErrorDesc")}
              </p>
              <Button
                variant="primaryPill"
                size="sm"
                onClick={retry}
                className="gap-2 text-xs font-bold mt-2"
              >
                <RefreshCw className="size-3.5" />
                <span>{t("whatsapp.qrRetry")}</span>
              </Button>
            </div>
          ) : qrCode ? (
            <div className="flex flex-col items-center space-y-3">
              {/* QR Image Container */}
              <div className="relative p-3 rounded-md bg-white shadow-md border border-zinc-200">
                {qrCode.startsWith("data:image") || qrCode.startsWith("http") ? (
                  <Image
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    width={200}
                    height={200}
                    unoptimized
                    className="size-48 sm:size-52 object-contain"
                  />
                ) : (
                  /* Fallback if Base64 raw string without prefix */
                  <Image
                    src={`data:image/png;base64,${qrCode}`}
                    alt="WhatsApp QR Code"
                    width={200}
                    height={200}
                    unoptimized
                    className="size-48 sm:size-52 object-contain"
                  />
                )}
              </div>

              {/* Countdown Indicator */}
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground-secondary">
                <RefreshCw className="size-3.5 animate-spin text-wise-green" />
                <span>
                  {t("whatsapp.qrExpiresIn", { seconds: countdown.toString() })}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 py-8">
              <Loader2 className="size-9 animate-spin text-wise-green mx-auto" />
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("whatsapp.qrWaiting")}
              </p>
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-2.5 rounded-md bg-surface dark:bg-[#1b1d1a] p-4 border border-border text-xs font-semibold">
          <div className="flex items-center gap-2 font-bold text-foreground mb-1">
            <Smartphone className="size-4 text-wise-green" />
            <span>Petunjuk Pemindaian di Ponsel:</span>
          </div>
          <ol className="space-y-1.5 text-foreground-secondary list-decimal list-inside leading-relaxed pl-1">
            <li>{t("whatsapp.qrInstructionsStep1")}</li>
            <li>{t("whatsapp.qrInstructionsStep2")}</li>
            <li>{t("whatsapp.qrInstructionsStep3")}</li>
          </ol>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full text-xs font-bold px-6 border-border hover:border-foreground-muted"
          >
            {t("whatsapp.qrClose")}
          </Button>
        </div>
      </div>
    </div>
  );
}
