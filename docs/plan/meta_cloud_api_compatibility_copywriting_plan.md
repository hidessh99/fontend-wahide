# 🧭 Rencana Arsitektur & Pelaksanaan: Penambahan Pesan Kompatibilitas Drop-in Meta Facebook Cloud API

> **Tujuan**: Menambahkan kartu informasi / callout profesional pada section **Developer First & REST API** yang menjelaskan bahwa Wahide mendukung struktur payload standar **Meta (Facebook) WhatsApp Cloud API** secara *drop-in*, sehingga developer yang sudah memiliki integrasi eksisting dapat langsung beralih hanya dengan mengganti Base URL tanpa perlu mengubah struktur kode backend mereka.

---

## 📑 Rincian Copywriting & Pesan Kompatibilitas

### 1. 🇮🇩 Bahasa Indonesia (`src/locales/id/common.json`)
* **`common.landing.apiSandbox.metaCompatBadge`**:
  `"Drop-in Replacement"`
* **`common.landing.apiSandbox.metaCompatTitle`**:
  `"Migrasi Instan dari Meta WhatsApp Cloud API — Cukup Ganti Base URL"`
* **`common.landing.apiSandbox.metaCompatDesc`**:
  `"Sudah menggunakan integrasi REST API Meta Facebook? Wahide mendukung struktur payload standar Meta Cloud API secara drop-in. Anda tidak perlu merombak logika backend aplikasi Anda—cukup ubah Base URL endpoint ke Wahide Gateway untuk langsung mulai beroperasi."`

---

### 2. 🇬🇧 English (`src/locales/en/common.json`)
* **`common.landing.apiSandbox.metaCompatBadge`**:
  `"Drop-in Replacement"`
* **`common.landing.apiSandbox.metaCompatTitle`**:
  `"Instant Migration from Meta WhatsApp Cloud API — Simply Switch the Base URL"`
* **`common.landing.apiSandbox.metaCompatDesc`**:
  `"Already integrated with Meta Facebook Cloud API? Wahide provides drop-in compatibility with standard Meta payload structures. Keep your existing backend architecture intact—simply update your Base URL endpoint to Wahide Gateway."`

---

## 🎨 Penempatan & Desain UI/UX pada [`ApiCodeSandbox.tsx`](file:///G:/WEB2026/fontwahide/src/components/home/ApiCodeSandbox.tsx)

* Ditampilkan sebagai **Bento Callout Card** yang elegan dan kontras tinggi di bagian bawah blok kode (atau di antara header dan editor kode).
* Menggunakan ikon arsitektur `Workflow` / `ArrowLeftRight` dengan aksen latar `bg-surface dark:bg-[#161715]` dan border `border-border`.
* Memastikan rasio kontras warna memenuhi standar **WCAG 2.2 Level AAA** dan tanpa emoji informal (*strict Tier-1 SaaS aesthetic*).

---

## 🗺️ Roadmap Pelaksanaan (3 Langkah)

1. **Langkah 1**: Menambahkan key lokalisasi `metaCompatBadge`, `metaCompatTitle`, dan `metaCompatDesc` pada `src/locales/id/common.json` dan `src/locales/en/common.json`.
2. **Langkah 2**: Memperbarui komponen [`ApiCodeSandbox.tsx`](file:///G:/WEB2026/fontwahide/src/components/home/ApiCodeSandbox.tsx) dengan callout banner kompatibilitas Meta.
3. **Langkah 3**: Menjalankan pengujian Quality Gates: `bun x tsc --noEmit` & `bun run lint` (0 error & 0 warning).
