"use client";

import React from "react";
import { TemplateSellerLibraryView } from "@/modules/template/views/seller/TemplateSellerLibraryView";

export function WhatsAppTemplatesView() {
  return (
    <TemplateSellerLibraryView
      lockChannel="WHATSMEOW_UNOFFICIAL"
      title="Template Pesan WhatsApp Web (Unofficial)"
      description="Kelola koleksi template pesan WhatsApp dengan variabel dinamis, spintax anti-ban, dan format tombol aksi."
    />
  );
}
