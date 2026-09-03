# 🌐 Rencana Teknis: Perbaikan i18n pada Halaman Billing (`/billing`)

Dokumen ini memetakan hasil audit terhadap kunci-kunci terjemahan (i18n) yang belum terdefinisi atau tidak cocok sehingga muncul sebagai teks mentah (raw keys) pada antarmuka halaman `http://localhost:3000/billing`.

---

## 1. 🔍 Hasil Audit Masalah

Pada modal **"Top-Up Deposit Balance"** ([`TopUpModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/balance/TopUpModal.tsx)) dan modul keuangan (`src/modules/finance`), ditemukan beberapa kunci terjemahan yang belum terdaftar di file lokalisasi:

### A. Kunci yang Tampak pada Tangkapan Layar Pengguna:
1. **`billing.selectAmountPreset`**:
   - Lokasi: [`src/modules/finance/components/balance/TopUpModal.tsx#L87`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/balance/TopUpModal.tsx#L87)
   - Penyebab: Di `billing.json` kunci ini dinamai `selectAmountLabel`, sedangkan di komponen dipanggil dengan `selectAmountPreset`.
2. **`billing.minimumTopUpNotice`**:
   - Lokasi: [`src/modules/finance/components/balance/TopUpModal.tsx#L142`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/balance/TopUpModal.tsx#L142)
   - Penyebab: Kunci belum ada di `id/billing.json` maupun `en/billing.json`.
3. **`billing.paymentMethod`**:
   - Lokasi: [`src/modules/finance/components/balance/TopUpModal.tsx#L149`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/balance/TopUpModal.tsx#L149)
   - Penyebab: Di `billing.json` dinamai `selectPaymentMethod`, sedangkan di komponen dipanggil dengan `paymentMethod`.

### B. Kunci Lain yang Ditemukan Hilang pada Modul Finance:
4. **`billing.prevPage`**: Tombol paginasi sebelumnya di [`InvoiceTable.tsx#L107`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/invoices/InvoiceTable.tsx#L107).
5. **`billing.nextPage`**: Tombol paginasi selanjutnya di [`InvoiceTable.tsx#L115`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/invoices/InvoiceTable.tsx#L115).
6. **`billing.toastTopUpError`**: Notifikasi gagal top-up di [`useBilling.ts#L86`](file:///g:/WEB2026/fontwahide/src/modules/finance/hooks/useBilling.ts#L86).
7. **`billing.addressRequiredForTopUp`**: Notifikasi peringatan alamat bisnis belum lengkap di [`BillingView.tsx#L105`](file:///g:/WEB2026/fontwahide/src/modules/finance/views/BillingView.tsx#L105).

---

## 2. 🛠️ Rencana Perbaikan

### A. Memperbarui `src/locales/id/billing.json` (Bahasa Indonesia)
Menambahkan seluruh kunci yang hilang:
```json
{
  "selectAmountPreset": "Pilih Nominal Top-Up",
  "minimumTopUpNotice": "Minimal nominal top-up saldo deposit adalah Rp 10.000.",
  "paymentMethod": "Metode Pembayaran",
  "prevPage": "Sebelumnya",
  "nextPage": "Selanjutnya",
  "toastTopUpError": "Gagal memproses transaksi top-up saldo deposit.",
  "addressRequiredForTopUp": "Lengkapi profil alamat bisnis Anda terlebih dahulu sebelum melakukan top-up."
}
```

### B. Memperbarui `src/locales/en/billing.json` (Bahasa Inggris)
Menambahkan padanan bahasa Inggris yang setara:
```json
{
  "selectAmountPreset": "Select Top-Up Amount",
  "minimumTopUpNotice": "Minimum deposit top-up amount is IDR 10,000.",
  "paymentMethod": "Payment Method",
  "prevPage": "Previous",
  "nextPage": "Next",
  "toastTopUpError": "Failed to process deposit top-up transaction.",
  "addressRequiredForTopUp": "Please complete your business address details before making a top-up."
}
```

---

## 3. 📋 Rencana Pengujian & Verifikasi

1. **Audit Kunci Otomatis**:
   - Menjalankan skrip validasi Node.js untuk memastikan `0 missing keys` pada namespace `billing` di `id/billing.json` dan `en/billing.json`.
2. **Type Check & Lint**:
   - `bun x tsc --noEmit`
   - `bun run lint`
   - `bun run format`
   *(Catatan: Mengikuti instruksi, `bun run build` TIDAK akan dijalankan otomatis)*.
3. **Verifikasi Visual**:
   - Membuka modal Top-Up di `/billing` memastikan teks `"Pilih Nominal Top-Up"`, `"Minimal nominal top-up..."`, dan `"Metode Pembayaran"` tampil rapi tanpa ada kunci mentah.
