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
    <div className="rounded-lg border border-border bg-surface dark:bg-[#161715] p-6 sm:p-10 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
            <Smartphone className="size-3.5" />
            <span>{t("common.landing.showcase.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {t("common.landing.showcase.title")}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
            {t("common.landing.showcase.subtitle")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSimulate}
          disabled={isSimulating}
          className="rounded-full text-xs font-bold gap-2 border-border hover:border-foreground-muted shrink-0"
        >
          <Send className="size-3.5 text-dark-green dark:text-wise-green" />
          <span>{t("common.landing.showcase.sendSample")}</span>
        </Button>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: "TEXT" as MessageType, label: t("common.landing.showcase.tabText"), icon: MessageSquare },
          { id: "MEDIA" as MessageType, label: t("common.landing.showcase.tabMedia"), icon: FileText },
          { id: "OTP" as MessageType, label: t("common.landing.showcase.tabOtp"), icon: KeyRound },
          { id: "BUTTON" as MessageType, label: t("common.landing.showcase.tabButton"), icon: MousePointerClick },
          { id: "LIST" as MessageType, label: t("common.landing.showcase.tabList"), icon: ListFilter },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-md text-xs transition border flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/50 shadow-xs font-black"
                  : "bg-muted/40 text-foreground-secondary border-border hover:border-foreground-muted font-semibold"
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? "text-dark-green dark:text-wise-green" : "text-foreground-muted"}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Simulator Device Screen Mockup */}
      <div className="max-w-md mx-auto p-4 sm:p-6 rounded-lg bg-[#0c140d] dark:bg-[#070b07] border border-wise-green/20 text-white font-sans space-y-4 shadow-xl">
        {/* WhatsApp Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-wise-green text-[#0c140d] font-black flex items-center justify-center text-xs">
              W
            </div>
            <div>
              <div className="font-bold text-white leading-tight flex items-center gap-1.5">
                <span>Wahide Official Store</span>
                <ShieldCheck className="size-3 text-wise-green inline" />
              </div>
              <div className="text-[10px] text-white/80 font-mono">
                {isSimulating ? "mengetik pesan..." : "+62 877-1113-01818 • Online"}
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-white/75">Gateway Node 01</div>
        </div>

        {/* Message Bubble Content based on activeTab */}
        <div className="min-h-40 flex flex-col justify-end">
          {showDelivered && (
            <div className="bg-[#1b2b1d] border border-wise-green/30 p-3.5 rounded-xl rounded-tl-none space-y-2.5 max-w-[92%] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              {activeTab === "TEXT" && (
                <div className="space-y-1 text-xs leading-relaxed text-white/95">
                  <p>
                    Halo <strong>Budi Santoso</strong>! Pesanan #INV-9821 telah kami konfirmasi dan saat ini dalam proses pengemasan.
                  </p>
                  <p className="text-[11px] text-white/85">
                    Estimasi pengiriman tiba besok sore via JNE Reguler. Terima kasih telah berbelanja!
                  </p>
                </div>
              )}

              {activeTab === "MEDIA" && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded bg-black/40 border border-white/10 flex items-center gap-3">
                    <FileText className="size-7 text-rose-400 shrink-0" />
                    <div className="overflow-hidden">
                      <div className="font-bold text-white text-[11px] truncate">Invoice_INV-9821_Wahide.pdf</div>
                      <div className="text-[10px] text-white/75 font-mono">142 KB • Dokumen PDF</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/95 leading-relaxed">
                    Berikut kami lampirkan salinan resmi faktur pembayaran Anda.
                  </p>
                </div>
              )}

              {activeTab === "OTP" && (
                <div className="space-y-2 text-xs">
                  <p className="text-white/90">Kode Verifikasi Keamanan Akun Anda:</p>
                  <div className="p-2.5 rounded bg-black/60 border border-wise-green/40 text-center font-mono font-black text-lg tracking-widest text-wise-green">
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
                    Tiket bantuan #TKT-4412 telah selesai diproses oleh tim CS. Silakan pilih tindakan selanjutnya:
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <button className="w-full h-8 px-3 rounded bg-white/10 hover:bg-white/15 text-[11px] font-bold text-wise-green flex items-center justify-center gap-1.5 border border-white/10 transition">
                      <CheckCheck className="size-3.5" />
                      <span>Konfirmasi Masalah Selesai</span>
                    </button>
                    <button className="w-full h-8 px-3 rounded bg-white/10 hover:bg-white/15 text-[11px] font-bold text-white/95 flex items-center justify-center gap-1.5 border border-white/10 transition">
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
                  <div className="p-2 rounded bg-black/40 border border-white/10 space-y-1.5">
                    <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">PILIHAN MENU:</div>
                    <div className="text-[11px] font-semibold text-white/95 pl-1 border-l-2 border-wise-green">
                      1. Cek Kuota Pesan Gateway
                    </div>
                    <div className="text-[11px] font-semibold text-white/95 pl-1 border-l-2 border-transparent">
                      2. Status Perangkat WhatsApp
                    </div>
                    <div className="text-[11px] font-semibold text-white/95 pl-1 border-l-2 border-transparent">
                      3. Sambungkan ke Agen CS Manusia
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamp & Double Blue Ticks */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-white/75 font-mono pt-1">
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
