"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSellerLibraryView } from "@/modules/template/views/seller/TemplateSellerLibraryView";

export function TelegramTemplatesView() {
  const { t } = useI18n();
  return (
    <TemplateSellerLibraryView
      lockChannel="TELEGRAM_BOT"
      title={t("telegram.templates.title")}
      description={t("telegram.templates.subtitle")}
    />
  );
}

export default TelegramTemplatesView;
