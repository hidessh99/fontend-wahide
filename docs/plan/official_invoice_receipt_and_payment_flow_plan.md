# 🧭 Rencana Arsitektur: Alur Pembayaran Tagihan & Modal Faktur Resmi (Print / Save as PDF)

Dokumen perencanaan teknis mengenai perombakan alur aksi riwayat tagihan pada halaman Faktur & Tagihan ([`src/services/finance/components/InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx)), mencakup tombol bayar langsung untuk tagihan berstatus **`PENDING`** dan **Modal Faktur Resmi Wahide (Print / Simpan PDF)** untuk tagihan berstatus **`PAID`**.

---

## 🔍 1. Logika Bisnis & Desain Interaksi (UX Specification)

```
┌───────────────────────────────┬─────────────────────────────────────────────────────────────┐
│ Status Faktur                 │ Tampilan & Perilaku Kolom AKSI                              │
├───────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🟡 Menunggu Pembayaran (PENDING)│ 👉 [ 💳 Bayar ] (Primary Pill)                              │
│                               │    Membuka tautan pembayaran QRIS / Checkout Gateway.       │
├───────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🟢 Lunas (PAID)               │ 👉 [ 📄 Faktur ] (Outline Pill / Icon FileText)             │
│                               │    Membuka Modal Faktur Resmi berstempel "LUNAS"            │
│                               │    dengan tombol [ 🖨️ Cetak / Simpan PDF ].                 │
├───────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ ⚪ Kedaluwarsa (EXPIRED)      │ 👉 "-" (Status dinonaktifkan, tanpa tombol bayar).          │
└───────────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 🎨 2. Spesifikasi Komponen Baru: `InvoiceReceiptModal.tsx`

Modal ini menampilkan kuitansi/faktur berstandar korporat:
1. **Kop Surat Resmi**:
   * Logo Wahide & Identitas Bisnis Gateway.
   * Alamat & Kontak Support.
2. **Metadata Transaksi**:
   * Nomor Faktur (contoh: `INV/2026/08/WAH-1482`).
   * Tanggal & Waktu Pembayaran.
   * Metode Pembayaran (QRIS Auto-Settlement).
   * Badge / Stempel Hijau: **`✓ LUNAS / PAID`**.
3. **Tabel Rincian Biaya**:
   * Deskripsi Layanan (misal: *Top-Up Saldo Deposit Rp 10.000*).
   * Subtotal, Biaya Transaksi (Rp 0), Total Pembayaran.
4. **Footer Aksi**:
   * Tombol **`[ 🖨️ Cetak / Simpan PDF ]`** (Memicu print dialog bawaan browser `window.print()` dengan layout A4 rapi).
   * Tombol **`[ Tutup ]`**.

---

## ⚡ 3. Rencana Implementasi

1. **Pembaruan Tipe Data ([`src/services/finance/types/finance.types.ts`](file:///G:/WEB2026/fontwahide/src/services/finance/types/finance.types.ts))**:
   * Menambahkan properti `paymentUrl?: string` dan `invoiceUrl?: string` pada tipe `Invoice`.

2. **Pembuatan Komponen Baru ([`src/services/finance/components/InvoiceReceiptModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceReceiptModal.tsx))**:
   * Desain modal faktur A4 profesional berstempel LUNAS, scrollable `max-h-[90vh]`, click-outside close, dan tombol `window.print()`.

3. **Pembaruan Komponen Tabel ([`src/services/finance/components/InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx))**:
   * Menyesuaikan kolom AKSI dengan logika kondisional `PENDING` $\to$ `[ Bayar ]`, `PAID` $\to$ `[ Faktur ]`, `EXPIRED` $\to$ `-`.

4. **Pembaruan View & Hook ([`BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx))**:
   * Menghubungkan state `selectedInvoice` untuk membuka `InvoiceReceiptModal`.

5. **Pembaruan Kamus Multi-Bahasa (`src/locales/`)**:
   * Menambahkan terjemahan tombol bayar, judul faktur, dan tombol cetak PDF di `billing.json` (ID & EN).

---

## 🔍 4. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 **0 errors (100% Type-Safe)**
* `eslint` ➔ 🟢 **0 errors, 0 warnings (100% Bersih & Kanonikal)**
