"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { ShieldCheck, Lock, FileText, Mail, MapPin, Phone } from "lucide-react";

export function PrivacyView() {
  const { t } = useI18n();

  return (
    <div className="space-y-12 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-6 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
          <ShieldCheck className="size-3.5" />
          <span>{t("legal.privacyBadge")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          {t("legal.privacyTitle")}
        </h1>
        <p className="text-sm font-semibold text-foreground-secondary leading-relaxed">
          {t("legal.privacySubtitle")}
        </p>
        <div className="text-xs font-semibold text-foreground-muted font-mono pt-1">
          {t("legal.privacyLastUpdated")}
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
              <span>Pengelola</span>
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

      {/* Privacy Articles */}
      <div className="space-y-8 text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">1</span>
            <span>Landasan Hukum &amp; Kepatuhan Regulasi</span>
          </h2>
          <p>
            Kebijakan Privasi ini disusun berdasarkan kepatuhan mutlak terhadap <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong> serta prinsip tata kelola data global <em>General Data Protection Regulation (GDPR)</em>. Hide Group bertindak sebagai Pengendali Data dan Prosesor Data yang bertanggung jawab atas pengelolaan informasi yang Anda percayakan.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">2</span>
            <span>Data yang Kami Kumpulkan</span>
          </h2>
          <p>Dalam menyediakan layanan gateway WhatsApp Wahide, kami mengumpulkan kategori data berikut:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Data Akun:</strong> Nama lengkap, alamat email bisnis, nomor telepon terverifikasi, dan kata sandi terenkripsi (bcrypt).</li>
            <li><strong>Data Sesi WhatsApp:</strong> Kunci sesi enkripsi (Noise Protocol / Signal Protocol keys) yang dihasilkan saat proses scan QR Code pairing.</li>
            <li><strong>Data Transaksi:</strong> Riwayat invoice tagihan, kuota pesan yang digunakan, dan bukti transfer pembayaran top-up.</li>
            <li><strong>Data Log Teknis:</strong> Alamat IP, user-agent browser, timestamp login, dan log audit keamanan sistem.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">3</span>
            <span>Kerahasiaan Pesan &amp; Enkripsi End-to-End</span>
          </h2>
          <p>
            Hide Group memegang prinsip privasi tingkat tinggi:
          </p>
          <div className="p-4 rounded-md bg-wise-green/10 dark:bg-wise-green/5 border border-wise-green/20 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs">
              <Lock className="size-4 text-dark-green dark:text-wise-green" />
              <span>Zero-Plaintext WhatsApp Message Storage</span>
            </div>
            <p className="text-xs text-foreground-secondary">
              Kami <strong>TIDAK PERNAH</strong> membaca, menyimpan, atau menjual isi konten pesan percakapan WhatsApp pribadi Anda kepada pihak mana pun. Pesan dikirim secara transparan melalui protokol enkripsi WhatsApp langsung ke penerima.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">4</span>
            <span>Keamanan Data &amp; Isolasi Multi-Tenant</span>
          </h2>
          <p>
            Seluruh infrastruktur basis data dipartisi secara ketat berdasarkan <code>tenant_id</code>. Seluruh token sesi disimpan menggunakan standar enkripsi simetris <strong>AES-GCM 256-bit</strong>. Akses antar tenant dibatasi secara ketat di tingkat arsitektur backend Go sehingga tidak ada kebocoran data antar pengguna.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">5</span>
            <span>Hak Subjek Data (*Data Subject Rights*)</span>
          </h2>
          <p>Sebagai pemilik data pribadi, Anda memiliki hak-hak yang dijamin oleh undang-undang:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Hak Akses &amp; Portabilitas:</strong> Hak untuk melihat dan mengunduh seluruh data kontak dan riwayat pengiriman Anda.</li>
            <li><strong>Hak Koreksi:</strong> Hak untuk memperbarui data profil akun kapan saja melalui dasbor pengaturan.</li>
            <li><strong>Hak Penghapusan Permanen (*Right to be Forgotten*):</strong> Hak untuk meminta penghapusan permanen seluruh akun, database kontak, dan sesi WhatsApp dari server kami.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">6</span>
            <span>Kebijakan Cookie &amp; Layanan Pihak Ketiga</span>
          </h2>
          <p>
            Kami menggunakan Cookie terbatas untuk mengingat preferensi bahasa (<code>NEXT_LOCALE</code>) dan mengintegrasikan Cloudflare Turnstile untuk proteksi keamanan dari serangan bot tanpa melacak riwayat penjelajahan pribadi Anda.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-4 p-6 rounded-md border border-border bg-surface dark:bg-[#161715]">
          <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <span className="size-6 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center text-xs font-mono font-bold">7</span>
            <span>{t("legal.contactDpoTitle")}</span>
          </h2>
          <p>{t("legal.contactDpoDesc")}</p>
          <div className="p-4 rounded-md bg-muted/30 border border-border text-xs space-y-1">
            <div><strong>Tim Kepatuhan Data (DPO Desk):</strong> Hide Group</div>
            <div><strong>Email:</strong> <a href="mailto:admin@hidessh.com" className="text-dark-green dark:text-wise-green font-bold hover:underline">admin@hidessh.com</a></div>
            <div><strong>WhatsApp Hotline:</strong> 0877111301818</div>
            <div><strong>Alamat:</strong> Jl. Kampung Baris No.391, Karangturi, Kec. Semarang Tim., Kota Semarang, Jawa Tengah 50124</div>
          </div>
        </section>
      </div>
    </div>
  );
}
