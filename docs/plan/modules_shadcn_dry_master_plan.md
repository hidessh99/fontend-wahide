# 🏗️ MASTER IMPLEMENTATION PLAN: Refactoring `src/modules` Menggunakan Komponen Shadcn UI (Prinsip DRY & Clean Architecture)

**Author:** Senior Frontend & UX Performance Architect  
**Target Scope:** Direktori `G:\WEB2026\fontwahide\src\modules` (133 File)  
**Komponen Acuan:** `G:\WEB2026\fontwahide\src\components\ui` (63 Komponen Shadcn UI)  
**Estimasi Kode Duplikat Tereliminasi:** **~2.300+ baris kode**  
**Status:** Perencanaan Lengkap Detail — Menunggu Persetujuan (*Pending Approval*)

---

## 🎯 1. Latar Belakang & Sasaran Arsitektur

Saat ini pada direktori `src/modules`, banyak komponen dibuat secara terisolasi sehingga menghasilkan **duplikasi kode yang sangat masif**:
1. **30 Modal** menulis ulang kode overlay backdrop `fixed inset-0 z-50 bg-black/60 backdrop-blur-xs`, tombol silang `X`, dan listener keyboard `useEscapeKey`.
2. **25 File** menulis ulang fungsi lokal `renderStatusBadge` dengan class span panjang untuk warna aktif, pending, dan gagal.
3. **12 File** menulis manual blok `div` kosong saat data nihil (*empty state*), padahal komponen `empty.tsx` sudah ada.
4. **11 File** menulis ulang ~30 baris form pencarian lengkap dengan ikon search, tombol reset silang, dan tombol cari.

### 🌟 Sasaran yang Dicapai:
- **Prinsip DRY (Don't Repeat Yourself):** Seluruh styling dan perilaku UI dipusatkan pada `src/components/ui`.
- **Aksesibilitas Standar W3C (A11y):** Base UI / Radix menangani focus trap, Escape key, dan ARIA attributes secara native.
- **Ukuran File Lebih Ringkas:** Memangkas ribuan baris kode duplikat sehingga bundle JS lebih efisien dan mudah dirawat (*maintainable*).
- **Keseragaman Desain 100%:** Selaras dengan tema khas Wise Green.

---

## 📋 2. Rencana Detail Per Batch (Step-by-Step)

---

### 🟢 BATCH 1: Empty State (`empty.tsx`) & Status Badges (`badge.tsx`)
**Tingkat Risiko:** Sangat Rendah  
**Estimasi Baris Dieliminasi:** ~800 baris

#### A. Penyempurnaan Komponen UI:
1. **`src/components/ui/badge.tsx`**:
   Tambahkan varian status semantik yang selaras dengan tema Wise:
   - `success`: `border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-wise-green`
   - `warning`: `border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400`
   - `danger`: `border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400`
   - `info`: `border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400`
   - `neutral`: `border-border bg-muted/60 text-foreground-secondary`
2. **`src/components/ui/empty.tsx`**:
   Pastikan siap pakai dengan sub-komponen: `Empty`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`.

#### B. Daftar File yang Dimigrasikan (12 File):
1. [`src/modules/admin/components/activity/UserActivitiesTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/activity/UserActivitiesTable.tsx)
2. [`src/modules/admin/components/billing/BillingManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/billing/BillingManagementTable.tsx)
3. [`src/modules/admin/components/devices/DevicesManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/devices/DevicesManagementTable.tsx)
4. [`src/modules/admin/components/messages/MessageLogsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/messages/MessageLogsTable.tsx)
5. [`src/modules/admin/components/notifications/QueueMonitorTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/notifications/QueueMonitorTable.tsx)
6. [`src/modules/admin/components/plans/PlansManagementTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/plans/PlansManagementTable.tsx)
7. [`src/modules/admin/components/subscriptions/SubscriptionsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/subscriptions/SubscriptionsTable.tsx)
8. [`src/modules/admin/components/users/UsersTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/users/UsersTable.tsx)
9. [`src/modules/campaign/components/logs/MessageLogsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/logs/MessageLogsTable.tsx)
10. [`src/modules/campaign/components/broadcast/CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx)
11. [`src/modules/finance/components/invoices/InvoiceTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/finance/components/invoices/InvoiceTable.tsx)
12. [`src/modules/support/components/tickets/TicketList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/support/components/tickets/TicketList.tsx)

#### C. Contoh Perubahan Kode (Before vs After):
```tsx
// ❌ SEBELUM: Menulis div manual + helper lokal
<div className="space-y-2.5 p-10 text-center">
  <Activity className="text-foreground-muted mx-auto size-10" />
  <h3 className="text-foreground text-sm font-bold">Tidak Ada Aktivitas</h3>
  <p className="text-foreground-secondary text-xs">Belum ada rekaman...</p>
</div>

// ✅ SESUDAH: Menggunakan Shadcn Empty State
<Empty>
  <EmptyMedia><Activity className="size-8 text-foreground-muted" /></EmptyMedia>
  <EmptyHeader>
    <EmptyTitle>Tidak Ada Aktivitas</EmptyTitle>
    <EmptyDescription>Belum ada rekaman aktivitas pada sistem.</EmptyDescription>
  </EmptyHeader>
</Empty>
```

---

### 🟢 BATCH 2: Reusable SearchInput Toolbar
**Tingkat Risiko:** Rendah  
**Estimasi Baris Dieliminasi:** ~300 baris

#### A. Penyempurnaan Komponen UI:
Buat komponen baru terpadu di [`src/components/ui/search-input.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/search-input.tsx):
- Menggunakan [`input.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/input.tsx) dan [`button.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/button.tsx).
- Fitur otomatis:
  - Ikon kaca pembesar di sisi kiri input.
  - Tombol reset silang (X) yang hanya muncul saat input terisi.
  - Tombol aksi `Cari` (teks di desktop, ikon di layar mobile).
  - Handler submit `onSubmit` dan tombol clear `onClear`.

#### B. Daftar File yang Dimigrasikan (11 File):
1. `src/modules/admin/components/activity/UserActivitiesTable.tsx`
2. `src/modules/admin/components/billing/BillingManagementTable.tsx`
3. `src/modules/admin/components/devices/DevicesManagementTable.tsx`
4. `src/modules/admin/components/messages/MessageLogsTable.tsx`
5. `src/modules/admin/components/notifications/QueueMonitorTable.tsx`
6. `src/modules/admin/components/plans/PlansManagementTable.tsx`
7. `src/modules/admin/components/subscriptions/SubscriptionsTable.tsx`
8. `src/modules/admin/components/users/UsersTable.tsx`
9. `src/modules/finance/views/BillingView.tsx`
10. `src/modules/team/views/TeamView.tsx`
11. `src/modules/iam/components/activity/UserActivityForm.tsx`

#### C. Contoh Perubahan Kode (Before vs After):
```tsx
// ❌ SEBELUM: 30 baris form manual berulang di 11 tabel
<form onSubmit={handleSearchSubmit} className="relative flex-1">
  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 ..." />
  <input value={searchInput} onChange={...} className="rounded-full ..." />
  {searchInput && <button onClick={handleClear}><X /></button>}
  <Button type="submit">Cari</Button>
</form>

// ✅ SESUDAH: Cukup 1 baris deklaratif
<SearchInput
  value={searchInput}
  onChange={setSearchInput}
  onSearch={executeSearch}
  onClear={clearSearch}
  placeholder="Cari data..."
/>
```

---

### 🟡 BATCH 3: Standardisasi Modal Konfirmasi & Hapus (`alert-dialog.tsx`)
**Tingkat Risiko:** Sedang  
**Estimasi Baris Dieliminasi:** ~600 baris

#### A. Fokus Komponen:
Menggunakan [`src/components/ui/alert-dialog.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/alert-dialog.tsx):
- `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction`.

#### B. Daftar File yang Dimigrasikan (10 Modal Hapus/Konfirmasi):
1. [`DeleteActivityConfirmModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/activity/DeleteActivityConfirmModal.tsx)
2. [`DeleteDeviceModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/devices/DeleteDeviceModal.tsx)
3. [`DeleteMessageModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/messages/DeleteMessageModal.tsx)
4. [`DeleteQueueModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/notifications/DeleteQueueModal.tsx)
5. [`DeletePlanModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/plans/DeletePlanModal.tsx)
6. [`DeleteContactModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/contact/components/modals/DeleteContactModal.tsx)
7. [`DeleteTeamMemberModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/team/components/modals/DeleteTeamMemberModal.tsx)
8. [`ApiKeyConfirmModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/iam/components/settings/ApiKeyConfirmModal.tsx)
9. [`SessionConfirmModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/iam/components/settings/SessionConfirmModal.tsx)
10. [`ExpireSubscriptionModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/admin/components/subscriptions/ExpireSubscriptionModal.tsx)

#### C. Manfaat Teknis:
- Menghapus ketergantungan hook manual `useEscapeKey` di 10 file tersebut.
- Menghapus overlay manual `fixed inset-0 z-50 bg-black/60 backdrop-blur-xs`.
- Menghapus tombol silang (X) manual.
- Mendapatkan focus trapping otomatis (mencegah tab browser melompat ke elemen di belakang modal).

---

### 🟡 BATCH 4: Standardisasi Modal Formulir & Detail (`dialog.tsx`)
**Tingkat Risiko:** Sedang  
**Estimasi Baris Dieliminasi:** ~600 baris

#### A. Fokus Komponen:
Menggunakan [`src/components/ui/dialog.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/dialog.tsx):
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`.

#### B. Daftar File yang Dimigrasikan (20 Modal Formulir & Detail):
1. **Admin Module:**
   - `PlanFormModal.tsx` (Tambah/Edit Paket)
   - `EditUserModal.tsx` (Edit Pengguna)
   - `AdjustBalanceModal.tsx` (Sesuaikan Saldo)
   - `UpdateBillingStatusModal.tsx` (Update Status Billing)
   - `DeviceDetailModal.tsx` (Detail Perangkat)
   - `MessageDetailModal.tsx` (Detail Pesan)
   - `QueueDetailModal.tsx` (Detail Antrean)
   - `SubscriptionDetailModal.tsx` (Detail Langganan)
2. **Contact & Finance Module:**
   - `ContactModal.tsx` (Tambah/Edit Kontak)
   - `ImportCsvModal.tsx` (Import CSV Kontak)
   - `TopUpModal.tsx` (Isi Ulang Saldo)
   - `InvoiceReceiptModal.tsx` (Struk / Faktur)
3. **WhatsApp & Support Module:**
   - `AddDeviceModal.tsx` (Tambah Perangkat WhatsApp)
   - `LiveQRModal.tsx` (Modal QR Pairing WhatsApp)
   - `SendMessageModal.tsx` (Kirim Pesan WhatsApp)
   - `CreateTicketModal.tsx` (Buat Tiket Bantuan)
   - `UpdateTicketStatusModal.tsx` (Update Tiket)
   - `TicketThreadModal.tsx` (Thread Balasan Tiket)
   - `ConfirmUpgradeModal.tsx` (Konfirmasi Upgrade Paket)
   - `CampaignWizardModal.tsx` (Wizard Pembuatan Campaign)

---

## 🛡️ 3. Quality Gate & Protokol Keamanan

Untuk memastikan stabilitas total tanpa ada regresi:
1. **Setiap Batch diverifikasi secara independen:**
   - `bun x tsc --noEmit` $\to$ Wajib **0 errors**.
   - `bun run lint` $\to$ Wajib **0 errors, 0 warnings**.
   - `bun run format` $\to$ Seluruh file wajib 100% Prettier formatted.
2. **Aturan Mutlak Pengguna (*User Hard Constraints*):**
   - ❌ **`bun run build` TIDAK AKAN PERNAH DIJALANKAN**.
   - ❌ **Komponen apapun di `src/components/ui/` TIDAK AKAN DIHAPUS**.
