"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { useQRPairing } from "@/modules/whatsapp/hooks/useQRPairing";
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

export function LiveQRModal({
  device,
  isOpen,
  onClose,
  onSuccess,
}: LiveQRModalProps) {
  const { t } = useI18n();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-border shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30 mb-1">
              <ShieldCheck className="size-3.5" />
              <span>Multi-Device End-to-End Encrypted</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Tautkan Perangkat WhatsApp
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              Slot: <span className="text-foreground font-bold">{device.push_name || device.pushName || device.name || "WhatsApp Device"}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0"
            aria-label="Tutup Modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher: QR Code vs Phone Pairing Code */}
        {status !== "AUTHENTICATED" && (
          <div className="px-5 sm:px-6 pt-4 pb-0">
            <div className="grid grid-cols-2 p-1 rounded-md bg-muted/60 border border-border text-xs font-bold">
              <button
                type="button"
                onClick={() => setPairMode("QR")}
                className={`flex items-center justify-center gap-2 py-2 rounded transition cursor-pointer ${
                  pairMode === "QR"
                    ? "bg-surface text-foreground shadow-sm font-extrabold"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                <QrCode className="size-3.5" />
                <span>Pindai QR Code</span>
              </button>
              <button
                type="button"
                onClick={() => setPairMode("PHONE")}
                className={`flex items-center justify-center gap-2 py-2 rounded transition cursor-pointer ${
                  pairMode === "PHONE"
                    ? "bg-surface text-foreground shadow-sm font-extrabold"
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Main Presentation Box */}
          <div className="flex flex-col items-center justify-center p-5 rounded-md bg-zinc-100 dark:bg-[#10110e] border border-border/80 min-h-60">
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
                  Gagal Memulai Pairing
                </h3>
                <p className="text-xs text-foreground-secondary font-semibold max-w-xs">
                  {errorMessage || "Terjadi kesalahan saat menghubungkan ke WhatsApp"}
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
            ) : pairMode === "QR" ? (
              /* TAB 1: QR CODE DISPLAY */
              qrCode ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative p-2.5 rounded-md bg-white shadow-md border border-zinc-200">
                    {qrCode.startsWith("data:image") || qrCode.startsWith("http") ? (
                      <Image
                        src={qrCode}
                        alt="WhatsApp QR Code"
                        width={190}
                        height={190}
                        unoptimized
                        className="size-44 sm:size-48 object-contain"
                      />
                    ) : (
                      <Image
                        src={`data:image/png;base64,${qrCode}`}
                        alt="WhatsApp QR Code"
                        width={190}
                        height={190}
                        unoptimized
                        className="size-44 sm:size-48 object-contain"
                      />
                    )}
                  </div>

                  {/* Countdown Indicator or Expired Refresh */}
                  {countdown > 0 ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground-secondary">
                      <RefreshCw className="size-3.5 animate-spin text-emerald-700 dark:text-wise-green" />
                      <span>
                        {t("whatsapp.qrExpiresIn", { seconds: countdown.toString() })}
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retry}
                      className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer"
                    >
                      <RefreshCw className="size-3.5 text-emerald-700 dark:text-wise-green" />
                      <span>QR Kedaluwarsa - Muat Ulang</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3 py-8">
                  <Loader2 className="size-9 animate-spin text-emerald-700 dark:text-wise-green mx-auto" />
                  <p className="text-xs font-semibold text-foreground-secondary">
                    {t("whatsapp.qrWaiting")}
                  </p>
                </div>
              )
            ) : (
              /* TAB 2: PHONE PAIRING CODE */
              <div className="w-full max-w-sm flex flex-col items-center space-y-4">
                {pairingCode ? (
                  <div className="w-full text-center space-y-3 animate-in zoom-in-95">
                    <p className="text-xs font-semibold text-foreground-secondary">
                      Masukkan 8 karakter kode berikut di aplikasi WhatsApp ponsel Anda:
                    </p>
                    
                    {/* Big Monospace OTP Boxes */}
                    <div className="inline-flex items-center justify-center gap-1.5 p-3 rounded-md bg-white dark:bg-[#1f211d] border border-wise-green/40 shadow-inner">
                      {pairingCode.split("").map((char, idx) => (
                        <span
                          key={idx}
                          className={`font-mono text-xl sm:text-2xl font-black ${
                            char === "-"
                              ? "text-foreground-muted px-1"
                              : "size-8 sm:size-9 rounded bg-muted/60 flex items-center justify-center text-foreground border border-border"
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
                        className="gap-2 text-xs font-bold rounded-full border-border hover:border-wise-green cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="size-3.5 text-dark-green dark:text-wise-green" />
                            <span className="text-dark-green dark:text-wise-green font-bold">Kode Tersalin!</span>
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
                      <label className="text-xs font-bold text-foreground">
                        Nomor WhatsApp Ponsel
                      </label>
                      <div className="flex rounded-md border border-border bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-wise-green/40">
                        <span className="px-3 py-2 bg-muted text-foreground-secondary text-xs font-bold border-r border-border flex items-center">
                          +62
                        </span>
                        <input
                          type="tel"
                          placeholder="81234567890"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs font-semibold bg-transparent focus:outline-none text-foreground"
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
          <div className="space-y-2 rounded-md bg-surface dark:bg-[#1b1d1a] p-4 border border-border text-xs font-semibold">
            <div className="flex items-center gap-2 font-bold text-foreground mb-1">
              <Smartphone className="size-4 text-emerald-700 dark:text-wise-green" />
              <span>
                {pairMode === "QR"
                  ? "Petunjuk Pemindaian QR di Ponsel:"
                  : "Petunjuk Memasukkan Kode di Ponsel:"}
              </span>
            </div>
            {pairMode === "QR" ? (
              <ol className="space-y-1.5 text-foreground-secondary list-decimal list-inside leading-relaxed pl-1">
                <li>{t("whatsapp.qrInstructionsStep1")}</li>
                <li>{t("whatsapp.qrInstructionsStep2")}</li>
                <li>{t("whatsapp.qrInstructionsStep3")}</li>
              </ol>
            ) : (
              <ol className="space-y-1.5 text-foreground-secondary list-decimal list-inside leading-relaxed pl-1">
                <li>Buka WhatsApp di ponsel $\rightarrow$ Ketuk <b>Menu</b> (titik tiga) atau <b>Pengaturan</b>.</li>
                <li>Pilih <b>Perangkat Tertaut</b> $\rightarrow$ <b>Tautkan Perangkat</b>.</li>
                <li>Pilih <b>Tautkan dengan nomor telepon saja</b> di bagian bawah layar.</li>
                <li>Masukkan 8 karakter kode pairing yang tertera di atas.</li>
              </ol>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-border flex justify-end shrink-0 bg-surface/50">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full text-xs font-bold px-6 border-border hover:border-foreground-muted cursor-pointer"
          >
            {t("whatsapp.qrClose")}
          </Button>
        </div>
      </div>
    </div>
  );
}
