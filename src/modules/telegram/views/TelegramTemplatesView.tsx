"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LayoutTemplate,
  Plus,
  Search,
  Code2,
  ExternalLink,
  Bot,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface TelegramTemplateMock {
  id: string;
  name: string;
  category: "NOTIFICATION" | "PROMOTION" | "ALERT";
  parseMode: "HTML" | "MarkdownV2";
  content: string;
  buttons: Array<{ text: string; url?: string; callback_data?: string }>;
}

const DEFAULT_TEMPLATES: TelegramTemplateMock[] = [
  {
    id: "tpl_tele_01",
    name: "Notifikasi Pembayaran Berhasil",
    category: "NOTIFICATION",
    parseMode: "HTML",
    content: "<b>Halo {nama}!</b>\n\nPembayaran untuk pesanan <code>#{order_id}</code> sebesar <b>Rp {nominal}</b> telah kami terima.\n\nTerima kasih atas pesanan Anda!",
    buttons: [
      { text: "📦 Cek Status Pesanan", url: "https://t.me/WahideBot?start=order_{order_id}" },
      { text: "💬 Hubungi CS", url: "https://t.me/WahideSupport" },
    ],
  },
  {
    id: "tpl_tele_02",
    name: "Promo Kilat Flash Sale",
    category: "PROMOTION",
    parseMode: "MarkdownV2",
    content: "*FLASH SALE EKSKLUSIF\\!*\n\nDapatkan diskon hingga *50%* untuk seluruh paket Wahide Omnichannel\\.\n\nGunakan kode: `TELEGRAM50`",
    buttons: [
      { text: "⚡ Klaim Promo Sekarang", url: "https://wahide.com/promo" },
    ],
  },
  {
    id: "tpl_tele_03",
    name: "Peringatan Keamanan Akun",
    category: "ALERT",
    parseMode: "HTML",
    content: "⚠️ <b>PERINGATAN KEAMANAN</b>\n\nTerdeteksi upaya login baru pada akun Anda dari IP <code>{ip_address}</code> pada {waktu}.\n\nJika ini bukan Anda, segera amankan akun Anda.",
    buttons: [
      { text: "🔒 Amankan Akun Saya", url: "https://wahide.com/security" },
    ],
  },
];

export function TelegramTemplatesView() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = DEFAULT_TEMPLATES.filter((tpl) =>
    tpl.name.toLowerCase().includes(search.toLowerCase()) ||
    tpl.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Konten template disalin ke clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <LayoutTemplate className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Template Pesan Telegram
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Format pesan bot kaya fitur dengan dukungan HTML / MarkdownV2 dan tombol interaktif inline keyboard.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => toast.info("Fitur pembuatan kustom template Telegram segera aktif!")}
          className="bg-wise-green text-dark-green hover:bg-wise-green/90 text-xs font-bold shadow-sm"
        >
          <Plus className="mr-1.5 size-3.5" />
          <span>Buat Template Baru</span>
        </Button>
      </div>

      {/* Formatting Guide Info Card */}
      <div className="border-border rounded-2xl border bg-muted/40 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Code2 className="size-4 text-wise-green" />
          <span>Format & Parse Mode Telegram yang Didukung:</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-border/60 bg-surface p-3 space-y-1 dark:bg-[#181917]">
            <p className="font-bold text-foreground">Mode HTML (Direkomendasikan)</p>
            <p className="text-foreground-secondary text-[11px]">
              Gunakan tag standar seperti <code className="bg-muted px-1 rounded">&lt;b&gt;tebal&lt;/b&gt;</code>, <code className="bg-muted px-1 rounded">&lt;code&gt;kode&lt;/code&gt;</code>, dan <code className="bg-muted px-1 rounded">&lt;a href=&quot;...&quot;&gt;tautan&lt;/a&gt;</code>.
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface p-3 space-y-1 dark:bg-[#181917]">
            <p className="font-bold text-foreground">Mode MarkdownV2</p>
            <p className="text-foreground-secondary text-[11px]">
              Gunakan <code className="bg-muted px-1 rounded">*tebal*</code>, <code className="bg-muted px-1 rounded">_miring_</code>, dan <code className="bg-muted px-1 rounded">`inline`</code>. Karakter khusus wajib di-escape dengan backslash.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="text-foreground-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Cari template bot..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-surface border-border flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-150 hover:shadow-md dark:bg-[#151614]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-400">
                  {tpl.parseMode}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {tpl.category}
                </Badge>
              </div>

              <h3 className="text-foreground text-sm font-bold tracking-tight">
                {tpl.name}
              </h3>

              {/* Message Bubble Preview */}
              <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                  <Bot className="size-3 text-sky-500" />
                  <span>Pratinjau Balon Chat</span>
                </div>
                <pre className="font-mono text-xs whitespace-pre-wrap break-words text-foreground bg-surface p-2.5 rounded-lg border border-border/40 dark:bg-[#181917]">
                  {tpl.content}
                </pre>

                {/* Inline Buttons Layout */}
                {tpl.buttons && tpl.buttons.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {tpl.buttons.map((btn, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 py-1.5 px-3 text-xs font-semibold text-sky-700 dark:text-sky-400 cursor-pointer hover:bg-sky-100/60 dark:hover:bg-sky-950/40 transition"
                      >
                        <span>{btn.text}</span>
                        {btn.url && <ExternalLink className="size-3" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-border/60 flex items-center justify-between border-t pt-3 mt-4">
              <span className="text-[11px] text-foreground-muted font-mono">{tpl.buttons.length} tombol inline</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(tpl.id, tpl.content)}
                className="text-xs h-8 rounded-full"
              >
                {copiedId === tpl.id ? (
                  <>
                    <Check className="mr-1.5 size-3 text-emerald-500" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 size-3" />
                    <span>Salin Format</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
