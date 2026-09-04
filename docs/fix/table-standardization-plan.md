# 📊 Blueprint Rencana Bertahap (Batch-by-Batch): Standardisasi Komponen Tabel ke Pola shadcn/ui Table

**Path**: `G:\WEB2026\fontwahide\docs\fix\table-standardization-plan.md`  
**Role**: Senior UX/UI Designer & Senior React Developer  
**Status**: ✅ **100% COMPLETED (All 5 Batches Successfully Migrated & Verified)**  
**Metodologi**: Eksekusi Bertahap (Batch Delivery) dengan Zero-Regression Quality Gate

---

## 1. 🎯 Strategi Eksekusi Per Batch (Why Batching?)

Memigrasikan 13 komponen tabel dalam satu waktu sekaligus memiliki risiko regresi tinggi. Oleh karena itu, migrasi dibagi ke dalam **5 Batch Bertahap** yang terisolasi rapi:
1. **Batch 0**: Menyiapkan fondasi komponen helper sorting (`DataTableColumnHeader`) dan hook `useTableSort`.
2. **Batch 1 (Finance, Contact & Team)**: Komponen fitur utama pengguna akhir yang paling sering diakses.
3. **Batch 2 (Campaign & Support)**: Komponen log broadcast dan tiket bantuan yang sarat interaksi.
4. **Batch 3 (Admin - User & Commercial)**: Tabel manajemen pengguna, langganan, paket harga, dan billing.
5. **Batch 4 (Admin - Telemetry & Infrastructure)**: Tabel monitoring perangkat WhatsApp, antrean notifikasi, aktivitas, dan log pesan platform.

Setiap batch **wajib lulus** pengujian mandiri:
- `bun x tsc --noEmit` (0 error)
- `bun run lint` (0 error, 0 warning)
- `bun run format` (100% formatted)

---

## 2. 📋 Rincian Eksekusi Setiap Batch

### 🧱 Batch 0: Fondasi Helper & Hook Reusable
*Tujuan: Menyiapkan alat bantu sorting & layout standar agar setiap tabel tidak menduplikasi kode.*

- **[NEW] `src/components/ui/data-table-column-header.tsx`**:
  - Komponen header tabel interaktif dengan label kolom, indikator arah urutan (`ArrowUpDown` / `ArrowUp` / `ArrowDown`), dan atribut aksesibilitas `aria-sort`.
- **[NEW] `src/hooks/useTableSort.ts`**:
  - Hook modular untuk mengelola state `sortKey` dan `sortDirection` ('asc' | 'desc' | null) secara client-side maupun parameter query server.

---

### 💼 Batch 1: Modul Keuangan, Kontak & Tim (3 Komponen)
*Fokus: Memigrasikan tabel pengguna bisnis dengan retensi TanStack Virtual dan seleksi baris.*

1. **[`InvoiceTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/invoices/InvoiceTable.tsx)**:
   - Migrasi dari CSS `grid grid-cols-12` ke shadcn/ui `<Table>`.
   - Menambahkan sorting pada No. Invoice, Tanggal (`createdAt`), dan Nominal (`amount`).
   - Menyempurnakan tampilan Card Mobile (`< 768px`) dengan status badge pill.
2. **[`ContactTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/contact/components/list/ContactTable.tsx)**:
   - Migrasi dari `grid grid-cols-12` ke shadcn/ui `<Table>`.
   - Mengintegrasikan TanStack Virtual rows dengan semantik `<TableBody>` dan `<TableRow>`.
   - Mempertahankan Checkbox Multi-Select (`selectedIds`) dan Select All.
   - Menambahkan sorting pada Nama (`name`) dan Nomor Telepon (`phone`).
3. **[`TeamView.tsx`](file:///g:/WEB2026/fontwahide/src/modules/team/views/TeamView.tsx)**:
   - Migrasi dari `grid grid-cols-12` ke shadcn/ui `<Table>`.
   - Menambahkan sorting pada Nama CS Agent, Peran/Role, dan Jumlah Perangkat Terhubung.

---

### 📣 Batch 2: Modul Kampanye & Dukungan (2 Komponen)
*Fokus: Tabel log berkapasitas tinggi dan manajemen tiket.*

4. **[`MessageLogsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/logs/MessageLogsTable.tsx)** (Campaign):
   - Migrasi dari `grid grid-cols-12` ke shadcn/ui `<Table>` yang kompatibel dengan TanStack Virtualizer.
   - Menambahkan sorting pada Waktu Kirim (`sentAt`) dan Status Pengiriman.
   - Menambahkan opsi seleksi baris untuk pengiriman ulang massal (*batch resend failed*).
5. **[`TicketList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/support/components/tickets/TicketList.tsx)**:
   - Migrasi dari `grid grid-cols-12` ke shadcn/ui `<Table>`.
   - Menambahkan sorting pada No. Tiket, Prioritas, Kategori, dan Waktu Pembaruan.
   - Card mobile yang ramah sentuhan untuk status resolver cepat.

---

### 👑 Batch 3: Modul Admin - User & Komersial (4 Komponen)
*Fokus: Migrasi tabel raw `<table>` ke shadcn Table dengan fitur multi-select dan sorting.*

6. **[`UsersTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/users/UsersTable.tsx)**:
   - Ganti elemen HTML `<table>` mentah dengan shadcn `<Table>`.
   - Tambahkan sorting pada Nama Lengkap (`name`), Saldo Dompet (`walletBalance`), dan Tanggal Registrasi.
   - Tambahkan Checkbox seleksi baris untuk aksi massal (misal: aktifkan/tangguhkan akun terpilih).
7. **[`SubscriptionsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/subscriptions/SubscriptionsTable.tsx)**:
   - Ganti elemen HTML `<table>` mentah dengan shadcn `<Table>`.
   - Tambahkan sorting pada Nama Tenant, Penggunaan Kuota (`currentMonthUsage`), dan Masa Berlaku.
   - Tambahkan seleksi baris untuk perpanjangan massal.
8. **[`PlansManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/plans/PlansManagementTable.tsx)**:
   - Ganti elemen HTML `<table>` mentah dengan shadcn `<Table>`.
   - Tambahkan sorting pada Harga Paket (`price`), Batas Kuota Pesan, dan Slot WhatsApp.
9. **[`BillingManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/billing/BillingManagementTable.tsx)**:
   - Ganti elemen HTML `<table>` mentah dengan shadcn `<Table>`.
   - Tambahkan sorting pada Nominal Topup (`amount`), Tanggal, dan Status.
   - Tambahkan Checkbox seleksi baris untuk verifikasi pembayaran massal.

---

### 📡 Batch 4: Modul Admin - Telemetri & Infrastruktur (4 Komponen)
*Fokus: Tabel operasional sistem dengan data real-time.*

10. **[`DevicesManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/devices/DevicesManagementTable.tsx)**:
    - Ganti elemen HTML `<table>` mentah dengan shadcn `<Table>`.
    - Tambahkan sorting pada Nama Perangkat (`pushName`), Trust Score (`trustScore`), dan Pesan Hari Ini (`dailySentCount`).
    - Tambahkan seleksi baris untuk pemeliharaan/disconnect massal.
11. **[`QueueMonitorTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/notifications/QueueMonitorTable.tsx)**:
    - Ganti elemen HTML `<table>` mentah dengan shadcn `<Table>`.
    - Tambahkan sorting pada Percobaan (`attempts`), Prioritas (`priority`), dan Waktu Eksekusi.
    - Tambahkan seleksi baris untuk retry tugas antrean secara massal.
12. **[`UserActivitiesTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/activity/UserActivitiesTable.tsx)**:
    - Ganti `grid grid-cols-12` dengan shadcn `<Table>`.
    - Tambahkan sorting pada Waktu Kejadian (`createdAt`) dan Nama Pengguna.
    - Tambahkan seleksi baris untuk hapus log massal.
13. **[`MessageLogsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/messages/MessageLogsTable.tsx)** (Admin):
    - Ganti elemen HTML `<table>` mentah dengan shadcn `<Table>`.
    - Tambahkan sorting pada Waktu Kirim (`createdAt`) dan Status Live.
    - Tambahkan seleksi baris untuk ekspor log terpilih.

---

## 3. 🧪 Protokol Verifikasi Setiap Batch

Setelah setiap batch selesai diimplementasikan, jalankan verifikasi:
```bash
# 1. Type Safety Verification
bun x tsc --noEmit

# 2. Linting & Formatting Check
bun run lint
bun run format
```
⚠️ **Aturan Ketat**:
- Jangan pernah menjalankan `bun run build`.
- Jangan pernah menjalankan `git push`.
