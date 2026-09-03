"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  MessageSquare,
  FileText,
  KeyRound,
  MousePointerClick,
  ListFilter,
  CheckCheck,
  Send,
  Smartphone,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

type MessageType = "TEXT" | "MEDIA" | "OTP" | "BUTTON" | "LIST";

export function MessageSimulator() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<MessageType>("TEXT");
  const [isSimulating, setIsSimulating] = useState(false);
  const [showDelivered, setShowDelivered] = useState(true);

  const handleSimulate = () => {
    setIsSimulating(true);
    setShowDelivered(false);
    setTimeout(() => {
      setIsSimulating(false);
      setShowDelivered(true);
    }, 400);
  };

  return (
    <div className="border-border bg-surface space-y-8 rounded-lg border p-6 shadow-sm sm:p-10 dark:bg-[#161715]">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
        <div className="max-w-2xl space-y-2">
          <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Smartphone className="size-3.5" />
            <span>{t("common.landing.showcase.badge")}</span>
          </div>
          <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            {t("common.landing.showcase.title")}
          </h2>
          <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
            {t("common.landing.showcase.subtitle")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSimulate}
          disabled={isSimulating}
          className="border-border hover:border-foreground-muted shrink-0 gap-2 rounded-full text-xs font-bold"
        >
          <Send className="text-dark-green dark:text-wise-green size-3.5" />
          <span>{t("common.landing.showcase.sendSample")}</span>
        </Button>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          {
            id: "TEXT" as MessageType,
            label: t("common.landing.showcase.tabText"),
            icon: MessageSquare,
          },
          {
            id: "MEDIA" as MessageType,
            label: t("common.landing.showcase.tabMedia"),
            icon: FileText,
          },
          { id: "OTP" as MessageType, label: t("common.landing.showcase.tabOtp"), icon: KeyRound },
          {
            id: "BUTTON" as MessageType,
            label: t("common.landing.showcase.tabButton"),
            icon: MousePointerClick,
          },
          {
            id: "LIST" as MessageType,
            label: t("common.landing.showcase.tabList"),
            icon: ListFilter,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 rounded-md border p-3 text-xs transition ${
                isActive
                  ? "bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/50 font-black shadow-xs"
                  : "bg-muted/40 text-foreground-secondary border-border hover:border-foreground-muted font-semibold"
              }`}
            >
              <Icon
                className={`size-3.5 ${isActive ? "text-dark-green dark:text-wise-green" : "text-foreground-muted"}`}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Simulator Device Screen Mockup */}
      <div className="border-wise-green/20 mx-auto max-w-md space-y-4 rounded-lg border bg-[#0c140d] p-4 font-sans text-white shadow-xl sm:p-6 dark:bg-[#070b07]">
        {/* WhatsApp Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="bg-wise-green flex size-8 items-center justify-center rounded-full text-xs font-black text-[#0c140d]">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight font-bold text-white">
                <span>Wahide Official Store</span>
                <ShieldCheck className="text-wise-green inline size-3" />
              </div>
              <div className="font-mono text-[10px] text-white/80">
                {isSimulating ? "mengetik pesan..." : "+62 877-1113-01818 • Online"}
              </div>
            </div>
          </div>
          <div className="font-mono text-[10px] text-white/75">Gateway Node 01</div>
        </div>

        {/* Message Bubble Content based on activeTab */}
        <div className="flex min-h-40 flex-col justify-end">
          {showDelivered && (
            <div className="border-wise-green/30 animate-in fade-in slide-in-from-bottom-2 max-w-[92%] space-y-2.5 rounded-xl rounded-tl-none border bg-[#1b2b1d] p-3.5 shadow-md duration-200">
              {activeTab === "TEXT" && (
                <div className="space-y-1 text-xs leading-relaxed text-white/95">
                  <p>
                    Halo <strong>Budi Santoso</strong>! Pesanan #INV-9821 telah kami konfirmasi dan
                    saat ini dalam proses pengemasan.
                  </p>
                  <p className="text-[11px] text-white/85">
                    Estimasi pengiriman tiba besok sore via JNE Reguler. Terima kasih telah
                    berbelanja!
                  </p>
                </div>
              )}

              {activeTab === "MEDIA" && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3 rounded border border-white/10 bg-black/40 p-3">
                    <FileText className="size-7 shrink-0 text-rose-400" />
                    <div className="overflow-hidden">
                      <div className="truncate text-[11px] font-bold text-white">
                        Invoice_INV-9821_Wahide.pdf
                      </div>
                      <div className="font-mono text-[10px] text-white/75">
                        142 KB • Dokumen PDF
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/95">
                    Berikut kami lampirkan salinan resmi faktur pembayaran Anda.
                  </p>
                </div>
              )}

              {activeTab === "OTP" && (
                <div className="space-y-2 text-xs">
                  <p className="text-white/90">Kode Verifikasi Keamanan Akun Anda:</p>
                  <div className="border-wise-green/40 text-wise-green rounded border bg-black/60 p-2.5 text-center font-mono text-lg font-black tracking-widest">
                    849 - 201
                  </div>
                  <p className="text-[10px] text-white/80">
                    Jangan bagikan kode ini kepada siapa pun termasuk staf Wahide. Berlaku 5 menit.
                  </p>
                </div>
              )}

              {activeTab === "BUTTON" && (
                <div className="space-y-2.5 text-xs">
                  <p className="text-white/95">
                    Tiket bantuan #TKT-4412 telah selesai diproses oleh tim CS. Silakan pilih
                    tindakan selanjutnya:
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <button className="text-wise-green flex h-8 w-full items-center justify-center gap-1.5 rounded border border-white/10 bg-white/10 px-3 text-[11px] font-bold transition hover:bg-white/15">
                      <CheckCheck className="size-3.5" />
                      <span>Konfirmasi Masalah Selesai</span>
                    </button>
                    <button className="flex h-8 w-full items-center justify-center gap-1.5 rounded border border-white/10 bg-white/10 px-3 text-[11px] font-bold text-white/95 transition hover:bg-white/15">
                      <ExternalLink className="size-3.5" />
                      <span>Lihat Rincian Tiket Online</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "LIST" && (
                <div className="space-y-2.5 text-xs">
                  <p className="text-white/95">
                    Selamat datang di Bot Otomasi Wahide! Silakan pilih opsi layanan:
                  </p>
                  <div className="space-y-1.5 rounded border border-white/10 bg-black/40 p-2">
                    <div className="text-[10px] font-bold tracking-wider text-white/80 uppercase">
                      PILIHAN MENU:
                    </div>
                    <div className="border-wise-green border-l-2 pl-1 text-[11px] font-semibold text-white/95">
                      1. Cek Kuota Pesan Gateway
                    </div>
                    <div className="border-l-2 border-transparent pl-1 text-[11px] font-semibold text-white/95">
                      2. Status Perangkat WhatsApp
                    </div>
                    <div className="border-l-2 border-transparent pl-1 text-[11px] font-semibold text-white/95">
                      3. Sambungkan ke Agen CS Manusia
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamp & Double Blue Ticks */}
              <div className="flex items-center justify-end gap-1 pt-1 font-mono text-[10px] text-white/75">
                <span>10:42 WIB</span>
                <CheckCheck className="size-3.5 text-[#53bdeb]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
