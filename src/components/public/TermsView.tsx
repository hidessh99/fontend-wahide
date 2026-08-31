"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Scale, AlertTriangle, FileText, Mail, MapPin, Phone } from "lucide-react";

export function TermsView() {
  const { t } = useI18n();

  return (
    <div className="space-y-12 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-6 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
          <Scale className="size-3.5" />
          <span>{t("legal.termsBadge")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          {t("legal.termsTitle")}
        </h1>
        <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
          {t("legal.termsSubtitle")}
        </p>
        <div className="text-xs font-semibold text-foreground-muted font-mono pt-1">
          {t("legal.termsLastUpdated")}
        </div>
      </div>

      {/* Official Identity Card */}
      <div className="p-6 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-4 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-muted">
          {t("legal.companyInfoTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-foreground-secondary">
          <div className="space-y-1">
            <div className="text-foreground font-bold flex items-center gap-1.5">
              <FileText className="size-3.5 text-dark-green dark:text-wise-green" />
              <span>Penyedia Platform</span>
            </div>
            <div>Hide Group</div>
          </div>
          <div className="space-y-1">
            <div className="text-foreground font-bold flex items-center gap-1.5">
              <Mail className="size-3.5 text-dark-green dark:text-wise-green" />
              <span>Email Resmi</span>
            </div>
            <a href="mailto:admin@hidessh.com" className="text-dark-green dark:text-wise-green font-bold hover:underline">
              admin@hidessh.com
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-foreground font-bold flex items-center gap-1.5">
              <Phone className="size-3.5 text-dark-green dark:text-wise-green" />
              <span>WhatsApp / Hotline</span>
            </div>
            <div>0877111301818</div>
          </div>
        </div>
        <div className="pt-2 border-t border-border/80 text-xs text-foreground-muted flex items-start gap-1.5">
          <MapPin className="size-3.5 text-dark-green dark:text-wise-green shrink-0 mt-0.5" />
          <span>Jl. Kampung Baris No.391, Karangturi, Kec. Semarang Tim., Kota Semarang, Jawa Tengah 50124</span>
        </div>
      </div>

      {/* Terms Articles */}
      <div className="space-y-8 text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
        {/* Pasal 1 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">1</span>
            <span>Ketentuan Umum &amp; Penerimaan Perjanjian</span>
          </h2>
          <p>
            Dengan mendaftar, menggunakan, atau mengintegrasikan API Wahide, Anda menyatakan tunduk pada syarat dan ketentuan ini. Layanan ini ditujukan untuk entitas bisnis, profesional, dan pengembang yang membutuhkan otomasi perpesanan WhatsApp resmi.
          </p>
        </section>

        {/* Pasal 2 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-mono font-bold">2</span>
            <span>Kebijakan Penggunaan Wajar (AUP) &amp; Larangan Keras</span>
          </h2>
          <p>
            Pengguna <strong>DILARANG KERAS</strong> menggunakan platform Wahide untuk aktivitas:
          </p>
          <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
              <AlertTriangle className="size-4" />
              <span>Aktivitas Ilegal yang Mengakibatkan Pemblokiran Permanen:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-foreground-secondary">
              <li>Pengiriman spam massal tanpa izin penerima (unsolicited commercial messages).</li>
              <li>Aktivitas penipuan (phishing, social engineering, pencucian uang).</li>
              <li>Promosi perjudian daring, pornografi, ujaran kebencian, atau zat terlarang.</li>
              <li>Penyalahgunaan API untuk melakukan serangan denial-of-service (DDoS).</li>
            </ul>
          </div>
          <p className="text-xs text-foreground-muted">
            Hide Group berhak memutus akun dan membekukan sisa kuota tanpa pengembalian dana jika ditemukan pelanggaran terhadap pasal ini.
          </p>
        </section>

        {/* Pasal 3 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">3</span>
            <span>Kepatuhan terhadap Kebijakan WhatsApp / Meta</span>
          </h2>
          <p>
            Pengguna memahami bahwa nomor WhatsApp yang ditautkan ke gateway tetap terikat pada <em>WhatsApp Terms of Service</em>. Pengguna bertanggung jawab penuh atas reputasi nomor, konten pesan yang disiarkan, dan kepatuhan terhadap kebijakan privasi penerima pesan.
          </p>
        </section>

        {/* Pasal 4 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">4</span>
            <span>Komitmen SLA Ketersediaan Sistem (99.9% Uptime)</span>
          </h2>
          <p>
            Hide Group berkomitmen menjaga uptime infrastruktur gateway minimum <strong>99.9%</strong> setiap bulannya. Pemeliharaan terjadwal (*scheduled maintenance*) akan diumumkan minimum 24 jam sebelumnya melalui banner sistem di dasbor.
          </p>
        </section>

        {/* Pasal 5 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">5</span>
            <span>Paket Langganan, Deposit Saldo, &amp; Kebijakan Kuota</span>
          </h2>
          <p>
            Semua pembayaran kuota pesan dan langganan paket diproses secara transparan melalui faktur resmi. Kuota pesan bulanan diperbarui secara berkala sesuai siklus langganan aktif Anda.
          </p>
        </section>

        {/* Pasal 6 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">6</span>
            <span>Batasan Tanggung Jawab (*Limitation of Liability*)</span>
          </h2>
          <p>
            Dalam batasan maksimal yang diizinkan oleh hukum, Hide Group tidak bertanggung jawab atas kerugian tidak langsung, kehilangan keuntungan bisnis, atau sanksi pemblokiran nomor oleh pihak ketiga (WhatsApp/Meta) yang diakibatkan oleh kelalaian pengguna dalam mematuhi batas pengiriman wajar.
          </p>
        </section>

        {/* Pasal 7 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">7</span>
            <span>Hukum yang Berlaku &amp; Penyelesaian Sengketa</span>
          </h2>
          <p>
            Syarat &amp; Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia. Segala perselisihan yang timbul dari perjanjian ini akan diselesaikan secara musyawarah untuk mufakat, dan apabila tidak tercapai kesepakatan, akan diselesaikan melalui yurisdiksi <strong>Pengadilan Negeri Kota Semarang</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
