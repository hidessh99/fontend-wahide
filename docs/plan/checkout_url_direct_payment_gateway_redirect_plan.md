# 🧭 Analisis & Rencana Pembaruan: Direct Redirect ke Link Payment Gateway (checkout_url) pada Tombol Bayar Tagihan

Dokumen teknis investigasi dan solusi mengapa tombol **`[ 💳 Bayar ]`** pada riwayat faktur ([`src/services/finance/components/InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx)) membuka popup modal topup alih-alih langsung mengarahkan pengguna ke URL checkout payment gateway.

---

## 🔍 1. Akar Masalah (Root-Cause Analysis)

### 📌 Mengapa Terbuka Popup Top-Up?
1. **Missed Field Parsing di DTO Normalizer (`finance.api.ts`)**:
   * REST API payment gateway / backend Go mengembalikan URL pembayaran dengan kunci **`checkout_url`** (atau `redirect_url` / `gateway_url` / `qris_url`).
   * Pada fungsi `normalizeInvoice` dan `createTopUp` sebelumnya:
     ```ts
     // Kode Lama: Hanya mengecek payment_url dan invoice_url, TIDAK mengecek checkout_url
     const paymentUrl = raw.paymentUrl || raw.payment_url || raw.invoiceUrl || raw.invoice_url ? ... : undefined;
     ```
   * Akibatnya, properti `inv.paymentUrl` bernilai `undefined`.
2. **Fallback Salah di `BillingView.tsx`**:
   * Karena `inv.paymentUrl` bernilai `undefined`, logika di `BillingView.tsx` jatuh ke blok `else`:
     ```tsx
     // Kode Lama: Jika URL kosong, malah membuka popup topup baru
     onPay={(inv) => {
       if (inv.paymentUrl || inv.invoiceUrl) {
         window.open(inv.paymentUrl || inv.invoiceUrl, "_blank", "noopener,noreferrer");
       } else {
         setIsTopUpOpen(true); // ❌ Ini yang memicu popup topup terbuka lagi!
       }
     }}
     ```
   * Hal ini menyebabkan pengguna yang ingin membayar faktur lama malah membuka form pengisian nominal top-up baru.

---

## 🛠️ 2. Solusi Komprehensif

### A. Ekstraksi Lengkap Seluruh Kunci URL Payment Gateway di `finance.api.ts`:
Mendukung semua format respon gateway pembayaran:
```ts
const paymentUrl = String(
  raw.checkout_url ||
  raw.checkoutUrl ||
  raw.payment_url ||
  raw.paymentUrl ||
  raw.redirect_url ||
  raw.redirectUrl ||
  raw.invoice_url ||
  raw.invoiceUrl ||
  raw.gateway_url ||
  raw.gatewayUrl ||
  raw.qris_url ||
  raw.qrisUrl ||
  raw.pay_url ||
  raw.payUrl ||
  raw.url ||
  ""
).trim() || undefined;
```

### B. Perbaikan Handler `onPay` di `BillingView.tsx` & `InvoiceTable.tsx`:
* Jika `paymentUrl` / `checkout_url` tersedia: langsung buka tab baru ke link pembayaran gateway (`window.open(url, "_blank", "noopener,noreferrer")`).
* Jika URL pembayaran tidak tersimpan di database: tampilkan pesan toast instruksi pembayaran, **BUKAN** membuka modal top-up baru.

---

## ⚡ 3. Rencana Implementasi

1. **Pembaruan `normalizeInvoice` & `createTopUp` ([`src/services/finance/api/finance.api.ts`](file:///G:/WEB2026/fontwahide/src/services/finance/api/finance.api.ts))**:
   * Tambahkan ekstraksi `checkout_url`, `checkoutUrl`, `redirect_url`, `gateway_url`, `qris_url`.
2. **Pembaruan Handler `BillingView.tsx` & `InvoiceTable.tsx`**:
   * Hapus fallback pembukaan modal popup `setIsTopUpOpen(true)` saat klik bayar faktur yang sudah ada.
3. **Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
