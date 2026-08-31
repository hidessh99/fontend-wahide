# 🧭 Audit Kompatibilitas Backend & Rencana Standarisasi Komponen Tabel per Fase

Dokumen audit mendalam mengenai kompatibilitas endpoint backend Go ([`wahide/internal/modules/`](file:///G:/WEB2026/wahide/internal/modules/)) dan rencana eksekusi bertahap (*Phase-by-Phase*) untuk standardisasi seluruh komponen tabel pada `fontwahide`.

---

## 🔍 1. Hasil Audit Kompatibilitas Backend Go

Setelah melakukan audit kode sumber di backend Go (`wahide`), seluruh modul utama **sudah mengadopsi Clean Architecture paginasi terstandarisasi (`RespondPaginated`)**:

| Modul Backend Go | Endpoint & Handler | Parameter Query yang Didukung | Status Backend |
| :--- | :--- | :--- | :--- |
| **Finance / Invoices** | `GET /billing/invoices`<br>([`InvoiceHandler.FindAll`](file:///G:/WEB2026/wahide/internal/modules/finance/delivery/http/invoice_handler.go#L210)) | `page`, `page_size`, `search`, `status`, `user_id` | 🟢 **100% Siap** (`RespondPaginated`) |
| **Finance / Billings** | `GET /billing`<br>([`BillingHandler.FindAll`](file:///G:/WEB2026/wahide/internal/modules/finance/delivery/http/billing_handler.go#L155)) | `page`, `page_size`, `search`, `user_id` | 🟢 **100% Siap** (`RespondPaginated`) |
| **Campaign Message Logs** | `GET /campaigns/logs`<br>([`CampaignHandler.ListMessageLogs`](file:///G:/WEB2026/wahide/internal/modules/campaign/delivery/http/campaign_handler.go#L149)) | `page`, `page_size`, `status`, `campaign_id` | 🟢 **100% Siap** (`RespondPaginated`) |
| **Support Tickets** | `GET /tickets`<br>([`TicketHandler.FindAll`](file:///G:/WEB2026/wahide/internal/modules/support/delivery/http/ticket_handler.go#L140)) | `page`, `page_size`, `search`, `status`, `priority` | 🟢 **100% Siap** (`RespondPaginated`) |
| **IAM / Users (Admin & Team)** | `GET /users`<br>([`UserHandler.FindAll`](file:///G:/WEB2026/wahide/internal/modules/iam/delivery/http/user_handler.go#L77)) | `page`, `page_size`, `search`, `role` | 🟢 **100% Siap** (`RespondPaginated`) |
| **Contacts & Audiences** | `GET /contacts`<br>([`ContactHandler.ListContacts`](file:///G:/WEB2026/wahide/internal/modules/contact/delivery/http/contact_handler.go#L125)) | `page`, `page_size`, `search` | 🟢 **100% Selesai & Aktif** |

---

## ⚡ 2. Roadmap Eksekusi Bertahap (Phase-by-Phase)

---

### 🚀 **FASE 1: Modul Finance / Billing (`InvoiceTable.tsx` & `BillingView.tsx`)**
* **Analisis**:
  * Backend Go `GET /billing/invoices` telah memiliki filter `search`, `status`, `page`, dan `page_size`.
  * Di frontend, `finance.api.ts` saat ini belum meneruskan parameter query `page` dan `search`.
* **Tindakan**:
  1. [`finance.api.ts`](file:///G:/WEB2026/fontwahide/src/services/finance/api/finance.api.ts): Tambahkan parsing query `page`, `pageSize`, `search`, `status` dan ekstrak `additional_info.total`.
  2. [`useBilling.ts`](file:///G:/WEB2026/fontwahide/src/services/finance/hooks/useBilling.ts): Tambahkan state paginasi `page`, `pageSize: 10`, `total`, `totalPages`, `nextPage`, `prevPage`, serta `executeSearch` & `clearSearch`.
  3. [`BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx): Tambahkan Search Form dengan tombol submit `[ 🔍 Cari ]` + filter status tab/dropdown.
  4. [`InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx): Pasang bilah paginasi Prev/Next dan perbesar tipografi deskripsi/nominal faktur ke `text-sm font-bold` & `text-sm font-mono`.

---

### 🚀 **FASE 2: Modul Campaign Message Logs (`MessageLogsTable.tsx` & `CampaignsView.tsx`)**
* **Analisis**:
  * Log pesan broadcast saat ini menggunakan virtual scroll dengan filter input `onChange` lokal.
* **Tindakan**:
  1. Pisahkan input draft `searchInput` dari eksekusi submit `[ 🔍 Cari ]` + `X` reset.
  2. Pasang bilah paginasi Prev/Next (10 data per halaman) dan status `Halaman X dari Y`.
  3. Naikkan ukuran font nomor penerima dan pesan ke `text-sm font-mono` yang mudah dibaca.

---

### 🚀 **FASE 3: Modul Support Tickets (`TicketList.tsx` & `SupportView.tsx`)**
* **Analisis**:
  * Backend `GET /tickets` sudah mendukung paginasi dan filter pencarian.
* **Tindakan**:
  1. [`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts) & [`useSupport.ts`](file:///G:/WEB2026/fontwahide/src/services/support/hooks/useSupport.ts): Sambungkan parameter `page`, `pageSize: 10`, dan query pencarian.
  2. [`TicketList.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketList.tsx): Terapkan Search Form submit `[ 🔍 Cari ]` + `X` dan bilah paginasi Prev/Next.
  3. Perbesar tipografi subjek tiket dan status badge.

---

### 🚀 **FASE 4: Modul Team CS & Operator (`TeamView.tsx`)**
* **Analisis**:
  * Hapus anggota tim masih menggunakan `confirm()` native browser.
* **Tindakan**:
  1. Buat modal dialog konfirmasi hapus anggota tim (`DeleteTeamMemberModal.tsx`).
  2. Tambahkan Search bar submit `[ 🔍 Cari ]` dan paginasi jika anggota tim > 10.

---

### 🚀 **FASE 5: Modul Admin Panel (`UsersTable.tsx` & `AuditLogsTable.tsx`)**
* **Analisis**:
  * Tabel admin pengguna dan audit logs platform perlu diselaraskan dengan standar emas yang sama.
* **Tindakan**:
  1. Terapkan Search Form submit `[ 🔍 Cari ]` + `X` reset.
  2. Pasang bilah paginasi Prev/Next (10 data/halaman) pada `UsersTable.tsx` dan `AuditLogsTable.tsx`.
  3. Tingkatkan skala tipografi desktop.

---

## 🔍 3. Verifikasi Quality Gates per Fase:
* Setiap penyelesaian fase akan diverifikasi dengan:
  ```bash
  $ bun x tsc --noEmit
  🟢 0 errors (100% Type-Safe)

  $ eslint
  🟢 0 errors, 0 warnings (100% Bersih & Kanonikal)
  ```
