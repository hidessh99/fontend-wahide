# 🧭 Analisis & Laporan Perbaikan: Error TypeError `Cannot read properties of undefined (reading 'toLocaleString')` pada InvoiceTable

Dokumen teknis investigasi akar masalah (*root-cause analysis*) dan solusi perbaikan komprehensif atas error `TypeError: Cannot read properties of undefined (reading 'toLocaleString')` pada baris nominal tagihan di halaman Billing.

---

## 🔍 1. Akar Masalah (Root-Cause Analysis)

### 📌 Penyebab Error:
1. **Perbedaan Skema Naming (Go Backend `snake_case` vs Frontend `camelCase`)**:
   * API microservice Go (`/billing/invoices` atau `/billing/topup`) mengembalikan JSON dengan format kunci database/backend seperti:
     * `amount` atau `total_price` atau `gross_amount`
     * `invoice_number` (bukan `invoiceNumber`)
     * `created_at` (bukan `createdAt`)
     * `payment_url` / `invoice_url` (bukan `paymentUrl` / `invoiceUrl`)
2. **Ketiadaan DTO Normalizer**:
   * Pada `finance.api.ts`, data respon API langsung dikembalikan tanpa transformasi:
     ```ts
     // Kode Lama: Tidak melakukan normalisasi snake_case
     return res.payload || DEFAULT_INVOICES;
     ```
   * Akibatnya, properti `inv.amount` bernilai `undefined`.
3. **Pemanggilan Method Langsung Tanpa Nilai Pengaman**:
   * Di `InvoiceTable.tsx:101`:
     ```tsx
     // Kode Lama: Langsung memanggil .toLocaleString() pada properti yang undefined
     Rp {inv.amount.toLocaleString("id-ID")}
     ```
   * JavaScript melempar `TypeError: Cannot read properties of undefined (reading 'toLocaleString')` yang memutus siklus render React.

---

## 🛠️ 2. Solusi Komprehensif yang Diterapkan

1. **DTO Normalizer Otomatis ([`src/services/finance/api/finance.api.ts`](file:///G:/WEB2026/fontwahide/src/services/finance/api/finance.api.ts))**:
   * Membuat fungsi `normalizeInvoice` dan `normalizeBalance` yang memetakan seluruh variasi kunci dari backend (`snake_case` maupun `camelCase`):
     ```ts
     export function normalizeInvoice(raw: Record<string, unknown>): Invoice {
       const amount = Number(raw.amount ?? raw.total_price ?? raw.gross_amount ?? raw.price ?? 0);
       const invoiceNumber = String(raw.invoiceNumber || raw.invoice_number || raw.ref || raw.id || `INV/...`);
       // ...
       return { id, invoiceNumber, description, amount, status, paymentMethod, paymentUrl, invoiceUrl, paidAt, createdAt };
     }
     ```

2. **Defensive Rendering di Komponen ([`InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx) & [`InvoiceReceiptModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceReceiptModal.tsx))**:
   * Menggunakan variabel pengaman `Number(inv.amount ?? 0)` sebelum memanggil `.toLocaleString("id-ID")`:
     ```tsx
     const safeAmount = Number(inv.amount ?? 0);
     <span>Rp {safeAmount.toLocaleString("id-ID")}</span>
     ```

---

## 🔍 3. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 **0 errors (100% Type-Safe)**
* `eslint` ➔ 🟢 **0 errors, 0 warnings (100% Bersih & Kanonikal)**
