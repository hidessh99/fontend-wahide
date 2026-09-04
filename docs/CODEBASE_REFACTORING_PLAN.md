# 📋 Master Codebase Refactoring Plan: fontwahide
**Repository Path:** `G:\WEB2026\fontwahide\src`  
**Target Stack:** Next.js 16.3.3 (App Router + Turbopack), React 19.2.8, Bun 1.4.0, Tailwind CSS v4, Base UI  
**Document Purpose:** Panduan komprehensif rencana perbaikan dan restrukturisasi arsitektur kode untuk review manual pengguna (*Manual Audit & Approval*).

---

## 📑 Daftar Isi
1. [Ringkasan Eksekutif & Status Audit Baseline](#1-ringkasan-eksekutif--status-audit-baseline)
2. [Fase 1: Zero-Leak & Memory Lifecycle Safety (P0 - Kritis)](#fase-1-zero-leak--memory-lifecycle-safety-p0---kritis)
3. [Fase 2: Design System Purge & Token Normalization (P1 - Tinggi)](#fase-2-design-system-purge--token-normalization-p1---tinggi)
4. [Fase 3: Screaming Architecture & Penataan Direktori (P1 - Tinggi)](#fase-3-screaming-architecture--penataan-direktori-p1---tinggi)
5. [Fase 4: DOM Virtualization Skala Tinggi (P2 - Menengah)](#fase-4-dom-virtualization-skala-tinggi-p2---menengah)
6. [Fase 5: Runtime Schema Validation dengan Zod (P2 - Menengah)](#fase-5-runtime-schema-validation-dengan-zod-p2---menengah)
7. [Matriks Risiko & Rencana Mitigasi](#7-matriks-risiko--rencana-mitigasi)
8. [Rencana Pengujian & Verifikasi Kualitas](#8-rencana-pengujian--verifikasi-kualitas)
9. [Checklist Persetujuan Review Manual](#9-checklist-persetujuan-review-manual)

---

## 1. Ringkasan Eksekutif & Status Audit Baseline

Hasil pemindaian statis terhadap **330 file** di `src/` menunjukkan bahwa arsitektur dasar telah memiliki fondasi yang kokoh:
- **100% Rute (34/34 `page.tsx`)** adalah **Server Components murni (0 kB Client Bundle)**.
- **100% Kamus Bahasa (15 file ID, 15 file EN)** sinkron dengan **0 discrepancies**.
- **Kompilasi TypeScript (`tsc --noEmit`)** & **ESLint** saat ini dalam status **0 Error**.

Meskipun demikian, terdapat beberapa area inefisiensi dan celah runtime yang perlu distandarkan sebelum mencapai keandalan tingkat *High-Load Enterprise Production*:
- **14 komponen** memiliki potensi memory leak akibat `setTimeout` tanpa pembersihan saat unmount.
- **17 custom hooks** memicu request HTTP tanpa `AbortController` signal.
- **44 dari 65 komponen UI (67%)** adalah dead code (boilerplate `shadcn add` yang belum pernah dipakai).
- **97 file** menggunakan arbitrary hex colors (`dark:bg-[#161715]`) yang membypass variabel design token Tailwind v4.
- **0 tabel** yang memanfaatkan `@tanstack/react-virtual` meskipun paket tersebut sudah terpasang.

---

## Fase 1: Zero-Leak & Memory Lifecycle Safety (P0 - Kritis) — [SELESAI / DONE 100%]

> **Status Eksekusi**: ✅ **SELESAI (VERIFIED)**  
> - **14 Komponen Unhandled Timer**: 100% dimigrasikan ke `useClipboard` / timer cleanup ref.
> - **HTTP Client Signal & Timeout Cleanup**: 100% diimplementasikan di `src/lib/api/http-client.ts`.
> - **API Domain Signal**: 100% fungsi data-fetching menerima `signal?: AbortSignal`.
> - **21 Custom Data-Fetching Hooks**: 100% menggunakan `AbortController` dengan error filter `AbortError`.
> - **Hasil Audit Lifecycle**: `addEventListener` (7/7 cleaned), `setInterval` (1/1 cleaned), `setTimeout` (9/9 cleaned), unhandled timers (0).
> - **Hasil Verifikasi**: `bun x tsc --noEmit` (0 error), `bun run lint` (0 error/warning), `audit_locale_parity.js` (0 discrepancy).
Ketika tombol aksi "Salin ke Clipboard" atau timer delay dipicu dan komponen di-unmount dalam rentang waktu < 2.000 ms (misal: modal ditutup atau pengguna berpindah halaman), fungsi callback `setTimeout` tetap aktif di heap browser. Hal ini memicu memory leak dan error React: *"Can't perform a React state update on an unmounted component"*.

Selain itu, perpindahan halaman yang cepat tidak membatalkan request HTTP yang sedang berlangsung, menyita connection pool HTTP dan bandwidth pengguna.

### 1.2 Tindakan Perbaikan
1. **Membuat Hook Standar `src/hooks/useClipboard.ts`**:
   - Menyediakan timer ref auto-cleanup pada event unmount `useEffect`.
   - Mengembalikan `{ copied, copy }`.
2. **Refactor 14 Komponen Bermasalah**:
   - Gantikan `useState` + `setTimeout` manual dengan `useClipboard()` pada:
     - `components/home/ApiCodeSandbox.tsx`
     - `components/home/MessageSimulator.tsx`
     - `components/public/ContactUsView.tsx`
     - `modules/admin/components/devices/DeviceDetailModal.tsx`
     - `modules/admin/components/messages/MessageDetailModal.tsx`
     - `modules/admin/components/subscriptions/SubscriptionDetailModal.tsx`
     - `modules/campaign/components/broadcast/CampaignDetailModal.tsx`
     - `modules/campaign/components/logs/MessageDetailModal.tsx`
     - `modules/iam/components/address/UserAddressForm.tsx`
     - `modules/iam/components/auth/ForgotPasswordForm.tsx`
     - `modules/iam/components/auth/ResetPasswordForm.tsx`
     - `modules/whatsapp/components/devices/DeviceCard.tsx`
     - `modules/whatsapp/components/devices/DeviceDetailModal.tsx`
     - `modules/whatsapp/components/devices/LiveQRModal.tsx`
3. **Penyebaran `AbortSignal` ke 17 Custom Data Hooks & API**:
   - Perbarui tanda tangan fungsi API domain untuk menerima `signal?: AbortSignal`:
     - `campaign.api.ts`, `finance.api.ts`, `admin.api.ts`, `support.api.ts`, `team.api.ts`.
   - Terapkan pola `AbortController` standar di dalam `useEffect` pada:
     - `useAdminBilling.ts`, `useAdminDevices.ts`, `useAdminMessageLogs.ts`, `useAdminNotifications.ts`, `useAdminPlans.ts`, `useAdminSubscriptions.ts`, `useUserActivities.ts`.
     - `useCampaigns.ts`, `useMessageLogs.ts`.
     - `useBilling.ts`.
     - `useUserAddress.ts`, `useUserActivities.ts`.
     - `useSubscription.ts`, `useSupport.ts`, `useTeam.ts`.

---

## Fase 2: Design System Purge & Token Normalization (P1 - Tinggi)

### 2.1 Pembersihan Dead Code Komponen UI (44 Komponen)
Berdasarkan audit dependensi impor, 44 file berikut terbukti tidak memiliki importir di seluruh proyek:
```
accordion.tsx        bubble.tsx         input-group.tsx      menubar.tsx          resizable.tsx        toast.tsx
aspect-ratio.tsx     button-group.tsx   input-otp.tsx        message-scroller.tsx scroll-area.tsx      toggle-group.tsx
attachment.tsx       calendar.tsx       item.tsx             message.tsx          select.tsx           toggle.tsx
avatar.tsx           card.tsx           kbd.tsx              navigation-menu.tsx  separator.tsx        tooltip.tsx
breadcrumb.tsx       carousel.tsx       label.tsx            popover.tsx          sheet.tsx
chart.tsx            collapsible.tsx    marker.tsx           questionnaire.tsx    sidebar.tsx
combobox.tsx         context-menu.tsx   command.tsx          radio-group.tsx      slider.tsx
direction.tsx        drawer.tsx         field.tsx            hover-card.tsx       spinner.tsx
```
*Catatan: Sebelum penghapusan fisik, buat arsip/backup atau konfirmasi jika ada rencana penggunaan jangka pendek untuk kalender atau popover.*

### 2.2 Relokasi & Standardisasi `TurnstileWidget.tsx`
- **Masalah:** `src/components/ui/TurnstileWidget.tsx` berada di direktori UI atomic, menggunakan PascalCase, dan mengimpor domain env & i18n context.
- **Tindakan:**
  - Pindahkan ke `src/components/shared/TurnstileWidget.tsx` (atau `src/modules/iam/components/auth/TurnstileWidget.tsx`).
  - Perbarui jalur import di `LoginForm.tsx`, `RegisterForm.tsx`, `ForgotPasswordForm.tsx`, dan `ResetPasswordForm.tsx`.

### 2.3 Normalisasi Token Warna Tailwind v4 (97 File)
- **Masalah:** Penggunaan arbitrary color `dark:bg-[#161715]` pada 97 file redundan karena token `--surface` dan `--card` di `globals.css` pada dark mode sudah disetel ke `#161715`.
- **Tindakan:**
  - Ganti seluruh kemunculan `bg-surface dark:bg-[#161715]` menjadi kelas semantik murni `bg-surface`.
  - Ganti seluruh kemunculan `bg-card dark:bg-[#161715]` menjadi `bg-card`.
  - Ganti hardcoded `text-[#9fe870]` dengan `text-primary` atau `text-wise-green`.

### 2.4 Ekstraksi Komponen Reusable `<MetricCard>`
- **Masalah:** Duplikasi markup stat card di `UserDashboardOverview.tsx`, `AdminDashboardOverview.tsx`, `DeviceMetricsCards.tsx`, `SubscriptionMetricsCards.tsx`, dan `NotificationMetricsCards.tsx`.
- **Tindakan:**
  - Buat `src/components/ui/metric-card.tsx` yang mendukung: `title`, `value`, `subtitle`, `icon`, `trend`, `variant`.

---

## Fase 3: Screaming Architecture & Penataan Direktori (P1 - Tinggi)

### 3.1 Konsolidasi Halaman Publik / Marketing
- **Kondisi Sekarang:** 
  - File tampilan publik tersebar di `src/components/public/` (`AboutView`, `BlogListView`, `BlogPostView`, `ContactUsView`, `PrivacyView`, `TermsView`) dan `src/components/home/` (`HomeView`).
  - Sementara modul `src/modules/content/` hanya memiliki `api` dan `types`.
- **Target Restrukturisasi:**
  - Satukan views publik ke dalam `src/modules/marketing/views/` atau `src/modules/content/views/`.
  - Folder `src/components/` murni dikhususkan untuk:
    - `src/components/ui/`: UI primitives atomik.
    - `src/components/layout/`: Header, Sidebar, Footer, Navigation, Breadcrumbs.
    - `src/components/shared/`: Cross-cutting concerns (e.g., `RBACGuard`, `TurnstileWidget`).

### 3.2 Pembersihan Rute Redundan `/tos`
- **Kondisi Sekarang:** `src/app/(public)/tos/page.tsx` menduplikasi `src/app/(public)/terms/page.tsx`.
- **Target:** Hapus folder `app/(public)/tos` dan tambahkan redirect permanen di `next.config.ts`:
  ```ts
  async redirects() {
    return [
      {
        source: "/tos",
        destination: "/terms",
        permanent: true,
      },
    ];
  }
  ```

---

## Fase 4: DOM Virtualization Skala Tinggi (P2 - Menengah)

### 4.1 Target Komponen
1. **`MessageLogsTable.tsx`** (`src/modules/campaign/components/logs/` & `src/modules/admin/components/messages/`):
   - Riwayat log pengiriman pesan dapat mencapai ribuan baris per kampanye siaran.
2. **`ContactTable.tsx`** (`src/modules/contact/components/list/`):
   - Daftar kontak audiens WhatsApp yang sering diimpor dalam skala ribuan nomor via CSV.
3. **`UserActivitiesTable.tsx`** (`src/modules/admin/components/activity/`):
   - Log telemetri dan audit trail sistem.

### 4.2 Pola Implementasi (@tanstack/react-virtual)
```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

export function VirtualizedTable({ rows }: { rows: RowItem[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });
  // Virtual rendering wrapper
}
```

---

## Fase 5: Runtime Schema Validation dengan Zod (P2 - Menengah)

### 5.1 Kebutuhan
Memastikan data yang diterima dari respons microservice Go diproteksi oleh schema validation saat runtime, bukan hanya tipe statis TypeScript saat compile time.

### 5.2 Rencana Pembuatan Schema
Buat file schema Zod di masing-masing modul:
1. `src/modules/whatsapp/schemas/whatsapp.schema.ts` (Device schema, QR status)
2. `src/modules/campaign/schemas/campaign.schema.ts` (Campaign DTO, Message Log DTO)
3. `src/modules/contact/schemas/contact.schema.ts` (Contact schema, Tag DTO, CSV import schema)
4. `src/modules/finance/schemas/finance.schema.ts` (Invoice schema, Transaction DTO)
5. `src/modules/subscription/schemas/subscription.schema.ts` (Plan limits, active subscription)

---

## 7. Matriks Risiko & Rencana Mitigasi

| Tindakan Refactoring | Tingkat Risiko | Potensi Masalah | Rencana Mitigasi |
| :--- | :---: | :--- | :--- |
| **Pembersihan 44 UI Dead Code** | Rendah | Ada komponen yang mendadak dibutuhkan di masa depan | Komponen dapat sewaktu-waktu di-generate ulang via `bun x shadcn add <name>` |
| **Penyebaran AbortSignal** | Sedang | Request dibatalkan sebelum render selesai | Pasang fallback pemeriksaan `err.name === "AbortError"` agar tidak memicu alert error palsu |
| **Normalisasi 97 File Token Warna** | Rendah | Tampilan dark mode berubah warna | Uji visual pada halaman utama & dashboard dalam mode gelap sebelum rilis |
| **Relokasi File Marketing Views** | Sedang | Broken import path di `page.tsx` | Verifikasi penuh dengan `bun x tsc --noEmit` untuk menjamin referensial integritas |
| **DOM Virtualization** | Sedang | Kalkulasi tinggi container tabel overflow | Gunakan container tinggi terukur (`h-[600px]` / `flex-1`) dengan skeleton loader |

---

## 8. Rencana Pengujian & Verifikasi Kualitas

Setiap fase perubahan wajib lolos 3 gate verifikasi otomatis:
1. **Type Safety Gate**:
   ```bash
   bun x tsc --noEmit
   ```
   *Target: 0 error tipe.*
2. **Linter & Code Quality Gate**:
   ```bash
   bun run lint
   ```
   *Target: 0 warning, 0 error.*
3. **i18n Parity Audit Gate**:
   ```bash
   bun run scratch/audit_locale_parity.js
   ```
   *Target: 0 discrepancies antara ID dan EN.*

---

## 9. Checklist Persetujuan Review Manual

Silakan tandai fase-fase berikut untuk disetujui atau disesuaikan sebelum dieksekusi:

- [x] **Fase 1: SELESAI** — Zero-Leak Hook `useClipboard`, timer ref cleanups, dan `AbortController` Signal pada seluruh domain API & 21 hooks data-fetching.
- [ ] **Setujui Fase 2.1**: Penghapusan 44 dead code komponen UI di `src/components/ui/`.
- [ ] **Setujui Fase 2.2**: Relokasi `TurnstileWidget.tsx` ke `src/components/shared/`.
- [ ] **Setujui Fase 2.3**: Normalisasi token warna (hapus `dark:bg-[#161715]` di 97 file).
- [ ] **Setujui Fase 2.4**: Ekstraksi komponen `<MetricCard>`.
- [ ] **Setujui Fase 3**: Restrukturisasi direktori rute publik (`components/public` $\rightarrow$ `modules/marketing` atau `modules/content`).
- [ ] **Setujui Fase 4**: Implementasi `@tanstack/react-virtual` pada tabel dataset besar.
- [ ] **Setujui Fase 5**: Standarisasi skema runtime Zod pada seluruh modul microservice.

---
*Dokumen ini dibuat sebagai dasar audit arsitektur independen untuk user review.*
