# 🎨 UI/UX Design & Implementation Plan: Format Waktu Lengkap, Indikator Jadwal, dan Modal Detail Kampanye

Dokumen ini merancang peningkatan antarmuka (UI) dan pengalaman pengguna (UX) untuk modul Kampanye Broadcast (`/campaigns`), mencakup format tanggal & jam yang presisi, visualisasi status terjadwal, dan modal detail interaktif saat kartu diklik.

---

## 1. 🎯 Analisis Kebutuhan & Pendekatan UI/UX

### A. Format Tanggal & Jam Lengkap
- **Masalah Saat Ini**: Kartu hanya menampilkan tanggal tanpa jam (`"Sep 3, 2026"`).
- **Solusi UX**: Tampilkan waktu lengkap yang jelas dan mudah dipindai, misalnya `03 Sep 2026, 23:28 WIB` dengan ikon `Calendar`.

### B. Indikator Kampanye Terjadwal (Scheduled Time)
- **Masalah Saat Ini**: Kampanye dengan jadwal (seperti "jgjg" pada pukul 23:28) tampak persis seperti Draft biasa tanpa ada penanda waktu eksekusinya.
- **Solusi UX**:
  1. **Badge Status Terjadwal**: Jika memiliki `scheduledAt` dan belum selesai, tampilkan badge `Terjadwal` (icon `Clock`, varian `info`/`warning`).
  2. **Banner Waktu Jadwal**: Tampilkan kotak/pill khusus di kartu dengan ikon jam:
     `⏰ Dijadwalkan: 03 Sep 2026, 23:28 WIB`.

### C. Klik Kartu untuk Membuka Detail Kampanye (`CampaignDetailModal`)
- **Masalah Saat Ini**: Kartu tidak dapat diklik dan informasi mendalam (daftar tag, detail anti-ban, konfigurasi waktu) terpotong.
- **Solusi UX**:
  - Kartu menjadi elemen interaktif yang dapat diklik (`cursor-pointer hover:border-wise-green/50 hover:shadow-sm`).
  - Tombol aksi cepat (Mulai, Jeda, Lanjutkan, Hapus) menggunakan `e.stopPropagation()` agar tidak bentrok dengan klik kartu.
  - Membuka popup **`CampaignDetailModal.tsx`** dengan arsitektur informasi terstruktur:
    1. **Header**: Nama kampanye, status badge, ID kampanye.
    2. **Grid Info Waktu & Perangkat**:
       - Waktu dibuat (tanggal + jam + detik).
       - Waktu jadwal kirim (jika disetel).
       - Slot perangkat WhatsApp pengirim.
    3. **Target Audiens & Tag**:
       - Tipe target (Semua Kontak, Tag Segmentasi, atau Nomor Kustom).
       - Badge tag yang dipilih (misal: `#belajar`, `#promo`).
    4. **Template Pesan & Spintax**:
       - Preview pesan lengkap dengan tombol salin (Copy).
    5. **Proteksi Anti-Ban**:
       - Jitter delay (misal: 3–7s).
       - Simulasi Human Typing (`Aktif` / `Nonaktif`).
    6. **Progress & Metrik**:
       - Total target, terkirim, gagal, dan persentase progress bar.
    7. **Aksi Langsung**:
       - Tombol Mulai Siaran (jika Draft), Jeda, Lanjutkan, atau Hapus.

---

## 2. 📁 Rencana Perubahan Berkas

### A. Berkas Baru
- **[NEW] [`fontwahide/src/modules/campaign/components/broadcast/CampaignDetailModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignDetailModal.tsx)**:
  Komponen modal popup untuk melihat seluruh spesifikasi kampanye dan kontrol tindakan langsung.

### B. Berkas yang Diperbarui
- **[MODIFY] [`fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx)**:
  - Format tanggal dibuat lengkap dengan jam (`HH:mm`).
  - Tampilkan banner pill jadwal jika `campaign.scheduledAt` terisi.
  - Hubungkan kartu ke `setSelectedCampaign(campaign)` untuk membuka `CampaignDetailModal`.
  - Gunakan `e.stopPropagation()` pada tombol aksi agar klik kartu terisolasi.
- **[MODIFY] [`fontwahide/src/locales/id/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/id/campaign.json) & [`en/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/en/campaign.json)**:
  - Kunci terjemahan untuk modal detail (detailTitle, scheduleInfo, antiBanSettings, copyTemplate, dll.).

---

## 3. 🧪 Quality Gate & Validasi

1. `bun x tsc --noEmit` di direktori `fontwahide` (0 error).
2. `bun run lint` di direktori `fontwahide` (0 error).
3. `bun run format` di direktori `fontwahide`.
4. 🛡️ Tidak menjalankan `bun run build` dan `git push` (kepatuhan aturan).
