# 🧭 Analisis & Rencana Pembaruan: Aksi Faktur Kondisional & Tautan Pembayaran Tagihan Pending

Dokumen perencanaan teknis mengenai implementasi tombol aksi dinamis pada tabel Riwayat Faktur Pembayaran ([`src/services/finance/components/InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx)) berdasarkan status faktur (`PENDING` vs `PAID` vs `EXPIRED`).

---

## 💡 1. Analisis & Rasionalisasi Desain UX

Berdasarkan laporan pengguna pada gambar riwayat faktur tagihan:

### 📌 Kondisi Saat Ini vs Kebutuhan Pengguna:
* **Kondisi Saat Ini**: Kolom **"AKSI"** hanya menampilkan tombol unduh ikon kecil (`Download`), terlepas dari apakah faktur tersebut sudah lunas atau belum dibayar.
* **Kebutuhan Pengguna**:
  1. Saat status **`"Menunggu Pembayaran"` (`PENDING`)**: Pengguna membutuhkan tombol aksi utama **`[ 💳 Bayar ]`** yang langsung membuka tautan pembayaran (*checkout/payment URL*) gateway QRIS/Invoice agar tagihan bisa segera dilunasi.
  2. Saat status **`"Lunas"` (`PAID`)**: Tagihan sudah selesai dibayar, sehingga tombol bayar **dihilangkan total** dan digantikan murni oleh tombol **`[ 📥 Unduh Faktur PDF ]`**.
  3. Saat status **`"Kedaluwarsa"` (`EXPIRED`)**: Tagihan sudah tidak berlaku, tombol bayar dinonaktifkan / disembunyikan.

---

## 🎨 2. Spesifikasi UI/UX Kolom AKSI

```
┌────────────────────────┬─────────────────────────────────────────────────┐
│ Status Faktur          │ Tampilan Kolom Aksi (AKSI)                      │
├────────────────────────┼─────────────────────────────────────────────────┤
│ 🟡 Menunggu Pembayaran │ [ 💳 Bayar ] (Primary Pill) + [ 📥 Unduh ]      │
│ 🟢 Lunas               │ [ 📥 Unduh Faktur ] (Outline Circle)            │
│ ⚪ Kedaluwarsa         │ [ 📥 Unduh ] / Disabled                         │
└────────────────────────┴─────────────────────────────────────────────────┘
```

### Keuntungan UX:
1. **Kejelasan Aksi (*Clear Call-to-Action*)**: Pengguna tidak akan bingung bagaimana cara membayar tagihan yang baru dibuat.
2. **Pencegahan Pembayaran Ganda**: Begitu status berubah menjadi `PAID`, tombol bayar otomatis hilang sehingga mencegah transaksi berulang.

---

## ⚡ 3. Rencana Implementasi

1. **Pembaruan Tipe Data ([`src/services/finance/types/finance.types.ts`](file:///G:/WEB2026/fontwahide/src/services/finance/types/finance.types.ts))**:
   * Tambahkan properti opsional `paymentUrl?: string` dan `invoiceUrl?: string` pada antarmuka `Invoice`.

2. **Pembaruan Komponen Tabel ([`src/services/finance/components/InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx))**:
   * Implementasikan fungsi render kondisional pada kolom aksi:
     * Jika `status === "PENDING"`: Render tombol `[ Bayar ]` (primary pill dengan `<ExternalLink className="size-3" />`) yang membuka `inv.paymentUrl || inv.invoiceUrl` di tab baru.
     * Jika `status === "PAID"`: Render murni tombol unduh faktur (`<Download />`).

3. **Pembaruan Kamus Multi-Bahasa (`src/locales/`)**:
   * [`src/locales/id/billing.json`](file:///G:/WEB2026/fontwahide/src/locales/id/billing.json): `"payNow": "Bayar"`
   * [`src/locales/en/billing.json`](file:///G:/WEB2026/fontwahide/src/locales/en/billing.json): `"payNow": "Pay"`

4. **Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
