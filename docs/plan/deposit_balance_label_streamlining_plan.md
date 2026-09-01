# 🧭 Analisis & Rencana Pembaruan: Penyederhanaan Label "Saldo Deposit" pada Halaman Billing

Dokumen perencanaan teknis mengenai penyederhanaan label judul kartu saldo pada halaman Faktur & Tagihan ([`src/services/finance/components/BalanceCard.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/BalanceCard.tsx)) dari **"Saldo Deposit Pesan"** menjadi **"Saldo Deposit"**.

---

## 💡 1. Analisis & Rasionalisasi Desain UX

1. **Ringkas, Padat, & Bersih (*Concise Micro-Copy*)**:
   * Kata "Pesan" pada *"Saldo Deposit Pesan"* bersifat redundan karena platform Wahide secara keseluruhan adalah gateway WhatsApp.
   * Mengubahnya menjadi **"Saldo Deposit"** (ID) / **"Deposit Balance"** (EN) membuat tata letak visual kartu lebih proporsional, bersih, dan profesional.
2. **Kesesuaian dengan Dasbor Utama**:
   * Pada halaman Overview (`/dashboard`), istilah yang digunakan adalah *"Buku Kontak & Saldo"* dan *"Saldo: Rp ..."*. Dengan mengubahnya menjadi *"Saldo Deposit"*, seluruh terminologi keuangan menjadi seragam dan konsisten di seluruh modul.

---

## ⚡ 2. Rencana Implementasi

1. **Pembaruan Kamus Multi-Bahasa (`src/locales/`)**:
   * [`src/locales/id/billing.json`](file:///G:/WEB2026/fontwahide/src/locales/id/billing.json):
     * `"depositBalanceTitle"`: **`"Saldo Deposit"`** *(sebelumnya "Saldo Deposit Pesan")*
   * [`src/locales/en/billing.json`](file:///G:/WEB2026/fontwahide/src/locales/en/billing.json):
     * `"depositBalanceTitle"`: **`"Deposit Balance"`** *(sebelumnya "Message Deposit Balance")*

2. **Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
