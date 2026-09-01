# 🧭 Analisis UX & Rencana Perbaikan: Standardisasi Call-to-Action "Hubungkan" pada Kartu Slot WhatsApp

Dokumen telaah UX (*User Experience & Product Strategy*) mengenai penggantian tombol CTA **"Scan QR Code"** menjadi **"Hubungkan"** (*Connect*) pada kartu perangkat WhatsApp, keselarasan semantik antarmuka, dan rencana implementasi multi-bahasa.

---

## 💡 1. Analisis & Pendapat Senior Lead UX / Software Architect

Usulan penggantian teks tombol dari **"Scan QR Code"** menjadi **"Hubungkan"** adalah **KEPUTUSAN UX YANG SANGAT TEPAT, PROFESIONAL, DAN BERSTANDAR TIER-1 B2B SAAS!**

### Alasan & Rasionalisasi Desain:
1. **Fokus pada Tujuan Pengguna (*Action-Oriented Intent vs Mechanism*)**:
   * Pengguna datang ke menu perangkat dengan niat: *"Saya ingin mengaktifkan / menghubungkan nomor WhatsApp bisnis saya"*.
   * *"Scan QR Code"* hanyalah *metode teknis* di dalam modal, sedangkan **"Hubungkan" (*Connect*)** adalah *hasil yang ingin dicapai*.
2. **Simetri & Keselarasan Semantik Status**:
   * Status perangkat saat ini berbunyi: `Terputus` (*Disconnected*).
   * Tombol aksi penyelesainya secara logis harus berbunyi: **`Hubungkan`** (*Connect*).
   * Ketika perangkat sudah `Terhubung` (*Connected*), tombol aksinya adalah **`Putuskan Koneksi`** (*Disconnect*).
   * Ini menciptakan pasangan semantik yang sangat harmonis:
     * Status **Terputus** ➔ Tombol **Hubungkan**
     * Status **Terhubung** ➔ Tombol **Putuskan Koneksi**
3. **Standar Industri Global (WhatsApp Web / Twilio / WATI / Respond.io)**:
   * Seluruh platform gateway enterprise menggunakan label CTA **"Connect / Hubungkan"** pada kartu channel, lalu di dalam modal dialog barulah memberikan instruksi pemindaian QR code.

---

## ⚡ 2. Rencana Implementasi

1. **Pembaruan Kamus i18n (`src/locales/`)**:
   * [`src/locales/id/whatsapp.json`](file:///G:/WEB2026/fontwahide/src/locales/id/whatsapp.json):
     * `"scanQr": "Hubungkan"` (atau `"connect": "Hubungkan"`)
   * [`src/locales/en/whatsapp.json`](file:///G:/WEB2026/fontwahide/src/locales/en/whatsapp.json):
     * `"scanQr": "Connect"` (atau `"connect": "Connect"`)
2. **Pembaruan Komponen Kartu Perangkat ([`DeviceCard.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/DeviceCard.tsx))**:
   * Tombol CTA utama pada status `DISCONNECTED` / `PENDING` menampilkan label **`Hubungkan`** (*Connect*) dengan ikon `<QrCode className="size-4" />` yang tetap memberikan petunjuk visual bahwa proses koneksi menggunakan QR pairing.
3. **Verifikasi Kualitas**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
