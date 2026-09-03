# 📊 AUDIT & PLANNING: Migrasi Komponen Pagination Tabel ke Shadcn UI (`pagination.tsx`)
**Target Scope:** Seluruh Komponen Tabel di `G:\WEB2026\fontwahide\src`  
**Author:** Senior UX/UI Architect & Lead Frontend Engineer  
**Component Reference:** [`src/components/ui/pagination.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/pagination.tsx)  
**Status:** Planning & Ready for User Review

---

## 🧐 1. Hasil Audit: Apakah Tabel Bisa Memakai Komponen Pagination Shadcn?

### **JAWABAN: BISA, SANGAT DIREKOMENDASIKAN (100% COMPATIBLE)!**
Namun, terdapat **1 adaptasi arsitektural esensial** yang perlu disempurnakan pada komponen `src/components/ui/pagination.tsx` agar bekerja sempurna dengan aplikasi Next.js berbasis Client-Side State:

### ⚠️ Masalah pada Komponen Bawaan Shadcn Default:
- Komponen bawaan shadcn (`pagination.tsx`) secara default merender elemen anchor `<a href="..." />`.
- Ini dirancang untuk aplikasi *Server-Side Rendering (SSR)* tradisional di mana klik halaman akan memuat ulang URL seperti `/users?page=2`.
- Namun, pada tabel-tabel di aplikasi Wahide, pagination bekerja menggunakan **Client-Side State Callback** (`onPageChange(page: number)`, `onPrevPage()`, `onNextPage()`) tanpa me-reload browser.
- **Solusinya Sangat Elegan:**
  Kita sempurnakan `PaginationLink` di `pagination.tsx` agar bersifat **polimorfik**:
  - Jika ada prop `onClick`, render sebagai `<button type="button" onClick={...} disabled={disabled} />`.
  - Jika ada prop `href`, render sebagai link `<a href={...} />`.
  - Dilengkapi varian tema Wise Pill (`variant="primaryPill"` untuk halaman aktif, dan `variant="ghost"` / `variant="outline"` untuk halaman lainnya).

---

## 📋 2. Daftar 10 Tabel yang Menggunakan Pagination Saat Ini

| No | Modul | File Komponen Tabel | Gaya Pagination Saat Ini | Masalah / Kebutuhan Upgrade |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Contact** | [`ContactTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/contact/components/list/ContactTable.tsx) | Tombol Prev/Next + teks counter | Belum ada tombol nomor halaman & ellipsis. |
| 2 | **Finance** | [`InvoiceTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/invoices/InvoiceTable.tsx) | Tombol Prev/Next + teks counter | Belum ada tombol nomor halaman & ellipsis. |
| 3 | **Campaign** | [`MessageLogsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/logs/MessageLogsTable.tsx) | Tombol Prev/Next + nomor | Menggunakan tag `<button>` ad-hoc tanpa standar a11y. |
| 4 | **Admin Billing** | [`BillingManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/billing/BillingManagementTable.tsx) | Tombol Prev/Next + loop angka | Tag `<button>` manual dengan warna yang di-hardcode. |
| 5 | **Admin Devices** | [`DevicesManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/devices/DevicesManagementTable.tsx) | Tombol Prev/Next + loop angka | Tag `<button>` manual tanpa role `<nav>`. |
| 6 | **Admin Messages** | [`MessageLogsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/messages/MessageLogsTable.tsx) | Tombol Prev/Next + loop angka | Tombol ukuran 32px rawan misstap di mobile. |
| 7 | **Admin Queue** | [`QueueMonitorTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/notifications/QueueMonitorTable.tsx) | Tombol Prev/Next + loop angka | Tidak menggunakan semantik `aria-current="page"`. |
| 8 | **Admin Plans** | [`PlansManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/plans/PlansManagementTable.tsx) | Tombol Prev/Next + loop angka | Tidak memiliki indikator ellipsis jika halaman > 10. |
| 9 | **Admin Subscriptions** | [`SubscriptionsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/subscriptions/SubscriptionsTable.tsx) | Tombol Prev/Next + loop angka | Tombol angka tidak terpusat dalam satu komponen UI. |
| 10 | **Admin Users** | [`UsersTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/users/UsersTable.tsx) | Tombol Prev/Next + loop angka | Styling terpisah dari design system Shadcn. |

---

## 🌟 3. Keuntungan Migrasi ke Shadcn Pagination

1. **Aksesibilitas Standar W3C / WCAG 2.1 (A11y):**
   - Menggunakan elemen `<nav role="navigation" aria-label="pagination">`.
   - Menggunakan `<ul data-slot="pagination-content">` dan `<li>` yang ramah bagi pembaca layar (*screen readers*).
   - Menandai halaman aktif secara otomatis dengan `aria-current="page"`.
2. **Desain Terpadu (Consistent Design System):**
   - Halaman aktif menggunakan warna hijau Wise (`bg-wise-green text-dark-green font-bold`).
   - Tombol Prev/Next memiliki responsivitas cerdas: menampilkan ikon panah di smartphone dan teks lengkap (*"Sebelumnya"* / *"Berikutnya"*) di layar desktop.
3. **Dukungan Titik Tiga (Smart Ellipsis):**
   - Jika jumlah halaman banyak (misal: 1, 2, 3 ... 50), komponen `PaginationEllipsis` akan merapikan tampilan secara otomatis sehingga pagination tidak meluap (*overflow*) di layar HP.
4. **Maintenance Bersih (DRY - Don't Repeat Yourself):**
   - Menghapus ~40 baris kode duplikat navigasi halaman dari masing-masing 10 tabel.
   - Jika di masa depan ada perubahan desain pagination, cukup perbarui 1 file `src/components/ui/pagination.tsx`.

---

## 🛠️ 4. Langkah-Langkah Eksekusi (Step-by-Step)

### **Langkah 1: Penyempurnaan `src/components/ui/pagination.tsx`**
- Tambahkan dukungan event `onClick` dan prop `disabled` pada `PaginationLink`, `PaginationPrevious`, dan `PaginationNext`.
- Sesuaikan varian warna tombol agar selaras dengan tema Wise (`primaryPill` saat aktif, `outlinePill` / `ghost` saat tidak aktif).
- Buat helper komponen praktis: `DataTablePagination` yang siap menerima prop:
  ```tsx
  <DataTablePagination
    page={page}
    totalPages={totalPages}
    onPageChange={onPageChange}
    onPrevPage={onPrevPage}
    onNextPage={onNextPage}
  />
  ```

### **Langkah 2: Migrasi Bertahap pada 10 Tabel**
- **Batch 1 (User Dashboard):** `ContactTable.tsx`, `InvoiceTable.tsx`, `MessageLogsTable.tsx`.
- **Batch 2 (Admin Core):** `SubscriptionsTable.tsx`, `UsersTable.tsx`, `PlansManagementTable.tsx`.
- **Batch 3 (Admin Monitor):** `QueueMonitorTable.tsx`, `BillingManagementTable.tsx`, `DevicesManagementTable.tsx`, `MessageLogsTable.tsx`.

### **Langkah 3: Quality Gates & Verifikasi**
- `bun x tsc --noEmit` $\to$ Pastikan 0 errors tipe TypeScript.
- `bun run lint` $\to$ Pastikan 0 errors / 0 warnings ESLint.
- `bun run format` $\to$ Standardisasi format Prettier.
- *(Sesuai instruksi Anda: `bun run build` TIDAK AKAN dijalankan)*.
