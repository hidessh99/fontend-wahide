"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutTemplate,
  Plus,
  Search,
  Code2,
  RefreshCw,
} from "lucide-react";
import {
  TelegramTemplateCard,
  TelegramTemplateItem,
} from "../../components/seller/TelegramTemplateCard";
import { useTemplates } from "@/modules/template/hooks/useTemplates";
import {
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "@/modules/template/types/template.types";

const TemplateEditorModal = dynamic(
  () =>
    import("@/modules/template/components/seller/TemplateEditorModal").then(
      (m) => m.TemplateEditorModal,
    ),
  { ssr: false },
);

const DEFAULT_TEMPLATES: TelegramTemplateItem[] = [
  {
    id: "tpl_tele_01",
    name: "Notifikasi Pembayaran Berhasil",
    category: "NOTIFICATION",
    parseMode: "HTML",
    content:
      "<b>Halo {nama}!</b>\n\nPembayaran untuk pesanan <code>#{order_id}</code> sebesar <b>Rp {nominal}</b> telah kami terima.\n\nTerima kasih atas pesanan Anda!",
    buttons: [
      {
        text: "📦 Cek Status Pesanan",
        url: "https://t.me/WahideBot?start=order_{order_id}",
      },
      { text: "💬 Hubungi CS", url: "https://t.me/WahideSupport" },
    ],
  },
  {
    id: "tpl_tele_02",
    name: "Promo Kilat Flash Sale",
    category: "PROMOTION",
    parseMode: "MarkdownV2",
    content:
      "*FLASH SALE EKSKLUSIF\\!*\n\nDapatkan diskon hingga *50%* untuk seluruh paket Wahide Omnichannel\\.\n\nGunakan kode: `TELEGRAM50`",
    buttons: [
      { text: "⚡ Klaim Promo Sekarang", url: "https://wahide.com/promo" },
    ],
  },
  {
    id: "tpl_tele_03",
    name: "Peringatan Keamanan Akun",
    category: "ALERT",
    parseMode: "HTML",
    content:
      "⚠️ <b>PERINGATAN KEAMANAN</b>\n\nTerdeteksi upaya login baru pada akun Anda dari IP <code>{ip_address}</code> pada {waktu}.\n\nJika ini bukan Anda, segera amankan akun Anda.",
    buttons: [
      { text: "🔒 Amankan Akun Saya", url: "https://wahide.com/security" },
    ],
  },
];

function mapTemplateToTelegramItem(t: Template): TelegramTemplateItem {
  let category: "NOTIFICATION" | "PROMOTION" | "ALERT" = "NOTIFICATION";
  if (t.category === "MARKETING") category = "PROMOTION";
  else if (t.category === "REMINDER" || t.category === "RESERVATION")
    category = "ALERT";

  const rawKeyboard = t.telegramDetail?.inlineKeyboard || [];
  const flattenedButtons = Array.isArray(rawKeyboard)
    ? rawKeyboard.flat().map((b) => ({
        text: b.text,
        url: b.url,
        callback_data: b.callback_data,
      }))
    : [];

  return {
    id: t.id,
    name: t.name,
    category,
    parseMode:
      t.telegramDetail?.parseMode === "MarkdownV2" ? "MarkdownV2" : "HTML",
    content: t.content,
    buttons: flattenedButtons,
  };
}

import { useI18n } from "@/lib/i18n/context";

export function TelegramTemplatesView() {
  const { t } = useI18n();
  const {
    templates,
    isLoading,
    search,
    handleSearchChange,
    createTemplate,
    updateTemplate,
    reload,
  } = useTemplates("TELEGRAM_BOT");

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Combine live templates with fallback starter presets if database is empty
  const displayItems: TelegramTemplateItem[] =
    templates.length > 0
      ? templates.map(mapTemplateToTelegramItem)
      : DEFAULT_TEMPLATES;

  const filteredTemplates = displayItems.filter(
    (tpl) =>
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.content.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenCreate = () => {
    setEditingTemplate({
      id: "",
      name: "",
      category: "UTILITY",
      channelType: "TELEGRAM_BOT",
      content:
        "<b>Halo {nama}!</b>\n\nBerikut adalah update mengenai pesanan Anda nomor <code>#{order_id}</code>.",
      mediaType: "NONE",
      variables: [],
      isFavorite: false,
      usageCount: 0,
      telegramDetail: {
        parseMode: "HTML",
        inlineKeyboard: [
          [
            {
              text: "📦 Lacak Pesanan",
              url: "https://t.me/WahideBot?start={order_id}",
            },
          ],
        ],
        disableWebPagePreview: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditorOpen(true);
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
              {t("telegram.templates.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("telegram.templates.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => reload()}
            disabled={isLoading}
            className="h-8 rounded-full border-border/80 px-3 text-xs font-semibold"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("telegram.templates.reload")}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="bg-wise-green text-dark-green hover:bg-wise-green/90 h-8 rounded-full px-3.5 text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="mr-1.5 size-3.5" />
            <span>{t("telegram.templates.createNew")}</span>
          </Button>
        </div>
      </div>

      {/* Formatting Guide Info Card */}
      <div className="border-border rounded-2xl border bg-muted/40 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Code2 className="size-4 text-wise-green" />
          <span>{t("telegram.templates.guideTitle")}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-border/60 bg-surface p-3 space-y-1 dark:bg-[#181917]">
            <p className="font-bold text-foreground">{t("telegram.templates.modeHtml")}</p>
            <p className="text-foreground-secondary text-[11px]">
              {t("telegram.templates.modeHtmlDesc")}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface p-3 space-y-1 dark:bg-[#181917]">
            <p className="font-bold text-foreground">{t("telegram.templates.modeMarkdown")}</p>
            <p className="text-foreground-secondary text-[11px]">
              {t("telegram.templates.modeMarkdownDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="text-foreground-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder={t("telegram.templates.searchPlaceholder")}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((tpl) => (
          <TelegramTemplateCard key={tpl.id} template={tpl} />
        ))}
      </div>

      {/* Template Editor Modal */}
      {isEditorOpen && (
        <TemplateEditorModal
          isOpen={isEditorOpen}
          lockChannel="TELEGRAM_BOT"
          onClose={() => {
            setIsEditorOpen(false);
            setEditingTemplate(null);
          }}
          onSubmit={async (data) => {
            if (editingTemplate && editingTemplate.id) {
              return await updateTemplate(
                editingTemplate.id,
                data as UpdateTemplateInput,
              );
            }
            return await createTemplate(data as CreateTemplateInput);
          }}
          initialData={editingTemplate}
        />
      )}
    </div>
  );
}

export default TelegramTemplatesView;
