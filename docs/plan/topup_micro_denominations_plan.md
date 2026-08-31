# 🧭 Analisis & Rencana Pembaruan: Penyesuaian Pilihan Nominal Top-Up & Batas Minimum Rp 10.000

Dokumen perencanaan teknis mengenai pembaruan nominal preset deposit menjadi pecahan mikro (**Rp 10.000, Rp 20.000, Rp 50.000, Rp 100.000**) dan penyesuaian validasi batas minimum deposit menjadi **Rp 10.000** pada modal top-up ([`src/services/finance/components/TopUpModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/TopUpModal.tsx)).

---

## 💡 1. Analisis & Keunggulan Bisnis

1. **Aksesibilitas Pengguna (*Low Barrier to Entry*)**:
   * Nominal awal Rp 10.000 dan Rp 20.000 sangat ramah bagi pengguna baru / UMKM yang ingin menguji coba pengiriman beberapa puluh/ratus pesan WhatsApp blast terlebih dahulu sebelum melakukan deposit besar.
2. **Kesesuaian dengan Ekosistem QRIS**:
   * Standar QRIS nasional mendukung transaksi mikro mulai dari Rp 1.000. Oleh karena itu, batas minimum Rp 10.000 sangat ideal dan proses auto-settlement berlangsung instan (0 detik).

---

## ⚡ 2. Rencana Implementasi

1. **Pembaruan Konfigurasi Preset & Default State ([`TopUpModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/TopUpModal.tsx))**:
   * `PRESET_AMOUNTS = [10000, 20000, 50000, 100000]`
   * Default `selectedAmount`: `20000` (atau `10000`)
   * Validasi batas minimum: `if (!finalAmount || finalAmount < 10000) { setError("Nominal top-up minimum Rp 10.000."); return; }`
   * Atribut input kustom: `min={10000}` dan `step={5000}`.

2. **Pembaruan Kamus Multi-Bahasa (`src/locales/`)**:
   * [`src/locales/id/billing.json`](file:///G:/WEB2026/fontwahide/src/locales/id/billing.json):
     * `"customAmountPlaceholder": "Min. Rp 10.000"`
   * [`src/locales/en/billing.json`](file:///G:/WEB2026/fontwahide/src/locales/en/billing.json):
     * `"customAmountPlaceholder": "Min. IDR 10,000"`

3. **Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
