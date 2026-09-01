# 🧭 Rencana Pembaruan Halaman Billing: Eliminasi Komisi Afiliasi & Modal Top-Up Murni QRIS Scrollable 100%

Dokumen perencanaan teknis mengenai penghapusan kartu hardcoded **"Komisi Afiliasi / Seller Pending"** pada halaman Faktur & Tagihan ([`src/components/dashboard/BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx)) serta restrukturisasi modal top-up deposit menjadi **Pembayaran Instan Murni QRIS dengan Scroll Internal Fleksibel 100% (*Anti-Clipping*)** ([`src/services/finance/components/TopUpModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/TopUpModal.tsx)).

---

## 🔍 1. Hasil Audit & Temuan Masalah

1. **Section Komisi Afiliasi (`BillingView.tsx`)**:
   * Memuat data hardcoded statis (`Rp 1.450.000` & `3 Transaksi Terverifikasi`) dan dummy alert yang tidak relevan dengan gateway WhatsApp B2B.
   * **Solusi**: Dihapus total.

2. **Masalah Scroll pada Modal Top-Up (`TopUpModal.tsx`)**:
   * **Akar Masalah**: Form modal berada di dalam kontainer dengan `p-6 sm:p-8` dan `overflow-hidden` tanpa kelas `overflow-y-auto flex-1` pada badan form.
   * Akibatnya, pada layar laptop/ponsel pendek, tombol submit di bagian bawah terpotong (*clipped*) dan isi form tidak bisa digulir (*unscrollable*).
   * **Solusi**: Terapkan arsitektur 3-layer Flex Column standar enterprise:
     * **Sticky Header**: Judul dan tombol 'X' terkunci di atas.
     * **Scrollable Body (`overflow-y-auto p-5 sm:p-6 flex-1`)**: Pilihan nominal, input custom, voucher, dan info QRIS dapat di-scroll dengan sangat halus.
     * **Sticky Footer**: Tombol *Batal* dan *Bayar Sekarang* terkunci di bawah dan selalu terlihat.

3. **Metode Pembayaran Murni QRIS Instan**:
   * Sesuai arahan: Pembayaran instan **hanya QRIS**.
   * Menghilangkan pilihan manual Virtual Account dan Kartu Kredit.
   * Menggantinya dengan banner resmi **QRIS Real-Time Auto-Settlement** (Mendukung scan instan via GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, BNI, dll.).

---

## ⚡ 2. Rencana Implementasi

```
┌────────────────────────────────────────────────────────────┐
│ Fixed Backdrop (overflow-y-auto, click-outside-to-close)   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ TopUpModal Container (max-h-[90vh], flex flex-col)   │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ 1. Sticky Header (Judul & Tombol 'X' Terkunci) │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │ 2. Scrollable Form Body (overflow-y-auto)      │  │  │
│  │  │    - 4 Pilihan Nominal Preset (Rp 100rb-1jt)   │  │  │
│  │  │    - Input Nominal Kustom                      │  │  │
│  │  │    - Input Kode Voucher Promo (Opsional)       │  │  │
│  │  │    - Banner QRIS Auto-Settlement (Semua Bank)  │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │ 3. Sticky Footer (Tombol Batal & Bayar Selalu) │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Rincian Perubahan File:
1. **[`src/components/dashboard/BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx)**:
   * Hapus JSX kartu `Seller Affiliate Commission Card` (baris 50–77).
2. **[`src/services/finance/components/TopUpModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/TopUpModal.tsx)**:
   * Restrukturisasi kontainer modal ke arsitektur Sticky Header + Scrollable Form Body (`overflow-y-auto flex-1`) + Sticky Footer.
   * Set metode pembayaran murni `"QRIS"`.
   * Bersihkan import `CreditCard` dan `Building`.
3. **Pembersihan Kamus i18n (`src/locales/`)**:
   * Hapus entri komisi yang usang di `billing.json` (ID & EN).

---

## 🔍 3. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 **0 errors (100% Type-Safe)**
* `eslint` ➔ 🟢 **0 errors, 0 warnings (100% Bersih & Kanonikal)**
