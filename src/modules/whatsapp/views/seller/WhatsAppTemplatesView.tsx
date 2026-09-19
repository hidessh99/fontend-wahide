"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSellerLibraryView } from "@/modules/template/views/seller/TemplateSellerLibraryView";

export function WhatsAppTemplatesView() {
  const { t } = useI18n();
  return (
    <TemplateSellerLibraryView
      lockChannel="WHATSMEOW_UNOFFICIAL"
      title={t("whatsapp.templatesTitle")}
      description={t("whatsapp.templatesSubtitle")}
    />
  );
}
