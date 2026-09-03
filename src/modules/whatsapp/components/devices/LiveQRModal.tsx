"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { useQRPairing } from "@/modules/whatsapp/hooks/useQRPairing";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useEscapeKey } from "@/hooks/useEscapeKey";
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
  const phoneNumber = customPhone !== null ? customPhone : authUserPhone;
  const [copied, setCopied] = useState<boolean>(false);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

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
    let raw = phoneNumber.trim().replace(/\D/g, "");
    if (!raw) return;
    if (raw.startsWith("0")) {
      raw = "62" + raw.slice(1);
    } else if (raw.startsWith("8")) {
      raw = "62" + raw;
    }
    await requestPairingCode(raw);
  };

  const handleCopyCode = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !device) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-md border shadow-2xl dark:bg-[#161715]">
        {/* Sticky Header */}
        <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="space-y-1">
            <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 mb-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold">
              <ShieldCheck className="size-3.5" />
              <span>Multi-Device End-to-End Encrypted</span>
            </div>
            <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Tautkan Perangkat WhatsApp
            </h2>
            <p className="text-foreground-secondary text-xs font-semibold">
              Slot:{" "}
              <span className="text-foreground font-bold">
                {device.push_name || device.pushName || device.name || "WhatsApp Device"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup Modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher: QR Code vs Phone Pairing Code */}
        {status !== "AUTHENTICATED" && (
          <div className="px-5 pt-4 pb-0 sm:px-6">
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
                <span>Pindai QR Code</span>
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
                <span>Kode Nomor Telepon</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
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
                <h3 className="text-foreground text-base font-bold">Gagal Memulai Pairing</h3>
                <p className="text-foreground-secondary max-w-xs text-xs font-semibold">
                  {errorMessage || "Terjadi kesalahan saat menghubungkan ke WhatsApp"}
                </p>
                <Button
                  variant="primaryPill"
                  size="sm"
                  onClick={retry}
                  className="mt-2 gap-2 text-xs font-bold"
                >
                  <RefreshCw className="size-3.5" />
                  <span>{t("whatsapp.qrRetry")}</span>
                </Button>
              </div>
            ) : pairMode === "QR" ? (
              /* TAB 1: QR CODE DISPLAY */
              qrCode ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative rounded-md border border-zinc-200 bg-white p-2.5 shadow-md">
                    {qrCode.startsWith("data:image") || qrCode.startsWith("http") ? (
                      <Image
                        src={qrCode}
                        alt="WhatsApp QR Code"
                        width={190}
                        height={190}
                        unoptimized
                        className="size-44 object-contain sm:size-48"
                      />
                    ) : (
                      <Image
                        src={`data:image/png;base64,${qrCode}`}
                        alt="WhatsApp QR Code"
                        width={190}
                        height={190}
                        unoptimized
                        className="size-44 object-contain sm:size-48"
                      />
                    )}
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
                      <span>QR Kedaluwarsa - Muat Ulang</span>
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
                      Masukkan 8 karakter kode berikut di aplikasi WhatsApp ponsel Anda:
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
                              Kode Tersalin!
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Salin Kode</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRequestCode} className="w-full space-y-3">
                    <div className="space-y-1 text-left">
                      <label className="text-foreground text-xs font-bold">
                        Nomor WhatsApp Ponsel
                      </label>
                      <div className="border-border bg-surface focus-within:ring-wise-green/40 flex overflow-hidden rounded-md border focus-within:ring-2">
                        <span className="bg-muted text-foreground-secondary border-border flex items-center border-r px-3 py-2 text-xs font-bold">
                          +62
                        </span>
                        <input
                          type="tel"
                          placeholder="81234567890"
                          value={phoneNumber}
                          onChange={(e) => setCustomPhone(e.target.value)}
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
                      disabled={isLoadingCode || !phoneNumber.trim()}
                      className="w-full gap-2 text-xs font-bold"
                    >
                      {isLoadingCode ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Menghubungkan ke WhatsApp...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="size-3.5" />
                          <span>Dapatkan Kode Pairing</span>
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
                  ? "Petunjuk Pemindaian QR di Ponsel:"
                  : "Petunjuk Memasukkan Kode di Ponsel:"}
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
                <li>
                  Buka WhatsApp di ponsel $\rightarrow$ Ketuk <b>Menu</b> (titik tiga) atau{" "}
                  <b>Pengaturan</b>.
                </li>
                <li>
                  Pilih <b>Perangkat Tertaut</b> $\rightarrow$ <b>Tautkan Perangkat</b>.
                </li>
                <li>
                  Pilih <b>Tautkan dengan nomor telepon saja</b> di bagian bawah layar.
                </li>
                <li>Masukkan 8 karakter kode pairing yang tertera di atas.</li>
              </ol>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-border bg-surface/50 flex shrink-0 justify-end border-t p-4 sm:p-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-6 text-xs font-bold"
          >
            {t("whatsapp.qrClose")}
          </Button>
        </div>
      </div>
    </div>
  );
}
