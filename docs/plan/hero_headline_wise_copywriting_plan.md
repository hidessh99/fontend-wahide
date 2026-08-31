# 🧭 Rencana Arsitektur & Pelaksanaan: Penyelarasan Copywriting Judul Hero (Gaya Wise: Manfaat Langsung & Anti-Ban)

> **Tujuan**: Mengganti teks judul Hero lama (*"Infrastruktur WhatsApp Multi-Device Gateway Skala Industri"*) yang terkesan kaku/AI slop menjadi judul baru bergaya **Wise** yang berorientasi pada manfaat langsung (*action-oriented*), alami, dan berdaya konversi tinggi: **"Kirim Pesan WhatsApp Massal Lebih Cepat, Aman, dan Tanpa Blokir."**

---

## 📑 Rincian Perubahan Copywriting

### 1. 🇮🇩 Bahasa Indonesia (`src/locales/id/common.json`)
* **Key**: `hero.title`
* **Sebelumnya**: `"Infrastruktur WhatsApp Multi-Device Gateway Skala Industri"`
* **Menjadi**: `"Kirim Pesan WhatsApp Massal Lebih Cepat, Aman, dan Tanpa Blokir."`

---

### 2. 🇬🇧 English (`src/locales/en/common.json`)
* **Key**: `hero.title`
* **Sebelumnya**: `"Industrial-Grade Multi-Device WhatsApp Gateway Infrastructure"`
* **Menjadi**: `"Send Bulk WhatsApp Messages Faster, Safer, and Ban-Free."`

---

## 🗺️ Roadmap Pelaksanaan (2 Langkah)

1. **Langkah 1**: Memperbarui berkas lokalisasi `src/locales/id/common.json` dan `src/locales/en/common.json`.
2. **Langkah 2**: Menjalankan pengujian Quality Gates: `bun x tsc --noEmit` & `bun run lint` (0 error & 0 warning).

---

## 🔍 Hasil yang Diharapkan
* Judul landing page terasa jauh lebih manusiawi, punchy, ramah pengguna, serta langsung menjawab kebutuhan utama pebisnis (kecepatan & keamanan dari blokir) dalam 2 detik pertama saat halaman dimuat.
