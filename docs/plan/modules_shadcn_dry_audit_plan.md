# 🏗️ AUDIT & MASTER PLAN: Refactoring Modules ke Komponen Shadcn UI (Prinsip DRY & Clean Architecture)

**Target Analisis:** Seluruh direktori `G:\WEB2026\fontwahide\src\modules` (133 File)  
**Komponen Acuan:** `G:\WEB2026\fontwahide\src\components\ui` (63 Komponen Shadcn)  
**Tujuan:** Mengeliminasi ratusan baris kode boilerplate/duplikasi (DRY), menstandarisasi UI, mempercepat rendering browser, serta meningkatkan aksesibilitas (W3C WCAG 2.1).  
**Status:** Audit Selesai — Menunggu Persetujuan User (*Pending User Review*)

---

## 📊 1. Ringkasan Eksekutif Hasil Audit Kode di `src/modules`

Berdasarkan pemindaian menyeluruh terhadap **133 file** di dalam `src/modules`, ditemukan **4 pola duplikasi besar** (*boilerplate duplication*) yang saat ini ditulis secara manual berkali-kali menggunakan tag HTML mentah:

| Pola Duplikasi di `src/modules` | Jumlah File Terdampak | Masalah Saat Ini | Komponen Shadcn UI yang Siap Menggantikan | Estimasi Baris Kode yang Dieliminasi |
| :--- | :---: | :--- | :--- | :---: |
| **1. Modal / Dialog Manual** | **30 File** | Setiap modal menulis ulang overlay `fixed inset-0 z-50 bg-black/60 backdrop-blur-xs`, tombol close `X`, dan hooking keyboard escape manual. | [`dialog.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/dialog.tsx) & [`alert-dialog.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/alert-dialog.tsx) | **~1.200 baris kode** |
| **2. Status & Category Badges** | **25 File** | Setiap tabel membuat fungsi lokal `renderStatusBadge` dengan class span panjang (`inline-flex items-center rounded-full border px-2.5 ...`). | [`badge.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/badge.tsx) | **~500 baris kode** |
| **3. Empty State (Data Kosong)** | **12 File** | Setiap tabel/list menulis manual card kosong dengan ikon tengah, h3, dan deskripsi berulang-ulang. | [`empty.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/empty.tsx) (`Empty`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`) | **~300 baris kode** |
| **4. Toolbar Pencarian (Search Bar)** | **11 File** | Setiap tabel menduplikasi 30 baris form pencarian lengkap dengan ikon search, tombol reset silang (X), dan styling input. | [`input.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/input.tsx) & [`input-group.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/input-group.tsx) | **~300 baris kode** |
| **TOTAL KODE BERSIH (DRY)** | **78 File** | Mengurangi beban file dan memastikan keseragaman desain 100%. | **Komponen UI Terpusat** | **~2.300+ baris kode** |

---

## 🔬 2. Analisis Rinci Per Area

### 🏷️ Area 1: Modal & Konfirmasi Hapus (30 File) $\to$ Migrasi ke `Dialog` & `AlertDialog`
#### Masalah Saat Ini:
Sebanyak 30 file modal (seperti `DeleteActivityConfirmModal`, `DeleteDeviceModal`, `DeleteMessageModal`, `ContactModal`, `ApiKeyConfirmModal`, `TopUpModal`, dll.) memiliki pola boilerplate yang identik:
```tsx
// ❌ POLA LAMA DI 30 FILE:
useEscapeKey(isOpen, handleClose); // 23 file memakai hook ini secara terpisah

if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
    <div className="bg-surface border-border animate-in fade-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl duration-200">
      <div className="border-border flex items-center justify-between border-b p-5">
        <h2>Judul</h2>
        <button onClick={onClose}><X /></button>
      </div>
      {/* isi form */}
    </div>
  </div>
);
```

#### Solusi Shadcn:
Menggunakan [`src/components/ui/dialog.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/dialog.tsx) atau [`src/components/ui/alert-dialog.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/alert-dialog.tsx):
- **Otomatis Accessibility:** Focus-trap bawaan, tombol ESC ditangani oleh Base UI tanpa hook tambahan, `aria-modal="true"`.
- **Otomatis Animasi:** Smooth enter/exit animation bawaan Tailwind CSS.
- **Otomatis Tombol Close:** `DialogContent` sudah memiliki tombol silang (X) yang rapi di pojok kanan atas.

---

### 🎨 Area 2: Status Badges (25 File) $\to$ Standarisasi ke `Badge` (`badge.tsx`)
#### Masalah Saat Ini:
Di 25 file tabel/kartu, terdapat fungsi lokal seperti:
```tsx
// ❌ POLA LAMA DI 25 FILE:
const renderStatusBadge = (status: string) => {
  if (status === "ACTIVE" || status === "SUCCESS") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-wise-green">
        <CheckCircle2 className="size-3" />
        <span>AKTIF</span>
      </span>
    );
  }
  // Diulang-ulang untuk PENDING, FAILED, EXPIRED, OUTBOUND, INBOUND, dll.
};
```

#### Solusi Shadcn:
Memanfaatkan komponen [`src/components/ui/badge.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/badge.tsx) dengan varian semantik atau membungkusnya menjadi reusable badge helper:
```tsx
// ✅ BERSIH & DRY:
<Badge variant="success" icon={<CheckCircle2 />}>AKTIF</Badge>
<Badge variant="warning" icon={<Clock />}>PENDING</Badge>
<Badge variant="danger" icon={<AlertCircle />}>FAILED</Badge>
```

---

### 📭 Area 3: Empty States (12 File) $\to$ Menggunakan `Empty` (`empty.tsx`)
#### Masalah Saat Ini:
Komponen [`src/components/ui/empty.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/empty.tsx) sudah tersedia lengkap di project kita, tetapi 12 tabel/view di `src/modules` masih menulis struktur div manual:
```tsx
// ❌ POLA LAMA DI 12 FILE:
<div className="space-y-2.5 p-10 text-center sm:p-14">
  <Activity className="text-foreground-muted mx-auto size-10" />
  <h3 className="text-foreground text-sm font-bold">Tidak Ada Aktivitas</h3>
  <p className="text-foreground-secondary mx-auto max-w-sm text-xs">Belum ada rekaman...</p>
</div>
```

#### Solusi Shadcn:
Menggunakan primitif Shadcn yang sudah ada:
```tsx
// ✅ BERSIH, SEMANTIK & DRY:
<Empty>
  <EmptyMedia><Activity className="size-8 text-foreground-muted" /></EmptyMedia>
  <EmptyHeader>
    <EmptyTitle>Tidak Ada Aktivitas</EmptyTitle>
    <EmptyDescription>Belum ada rekaman aktivitas yang tercatat pada sistem.</EmptyDescription>
  </EmptyHeader>
</Empty>
```

---

### 🔎 Area 4: Search Bar Toolbar (11 File) $\to$ Reusable `SearchInput`
#### Masalah Saat Ini:
11 file tabel admin dan pengguna menduplikasi kode form input pencarian berikut secara persis:
```tsx
// ❌ POLA LAMA DI 11 FILE:
<form onSubmit={handleSearchSubmit} className="relative flex-1">
  <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
  <input
    type="text"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    placeholder="Cari..."
    className="bg-surface text-foreground border-border hover:border-foreground-muted h-9.5 w-full rounded-full border pr-9 pl-10 text-xs font-semibold"
  />
  {searchInput && (
    <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 ...">
      <X className="size-3.5" />
    </button>
  )}
</form>
```

#### Solusi Shadcn:
Menggunakan [`src/components/ui/input.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/input.tsx) dan membuat wrapper terpadu `SearchInput` di `src/components/ui/search-input.tsx` sehingga pemanggilan di 11 tabel cukup 1 baris saja:
```tsx
// ✅ BERSIH & DRY:
<SearchInput
  value={searchInput}
  onChange={setSearchInput}
  onSearch={executeSearch}
  onClear={clearSearch}
  placeholder="Cari data..."
/>
```

---

## 🗺️ 3. Rencana Tahapan Eksekusi (Roadmap Prioritas)

Agar proses refactoring aman, stabil, dan tidak mengganggu fungsionalitas yang ada, kita bagi menjadi **4 Batch Bertahap**:

### 🎯 **Batch 1: Implementasi Empty State & Badge Standar (Tingkat Risiko: Rendah)**
- Pasang [`src/components/ui/empty.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/empty.tsx) pada 12 tabel.
- Tambahkan varian status (`success`, `warning`, `danger`, `info`) pada [`src/components/ui/badge.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/badge.tsx).
- **File target:** 10 Tabel Admin + `ContactTable.tsx` + `InvoiceTable.tsx`.

### 🎯 **Batch 2: Standardisasi Toolbar Pencarian / SearchBar (Tingkat Risiko: Rendah)**
- Buat komponen `SearchInput` terpadu menggunakan input shadcn.
- Migrasikan 11 toolbar pencarian pada tabel.
- **Hasil:** Menghilangkan ~300 baris duplikasi kode form input.

### 🎯 **Batch 3: Migrasi Modal Konfirmasi / Hapus (Tingkat Risiko: Sedang)**
- Migrasikan 12 modal konfirmasi/hapus ke `AlertDialog` (`alert-dialog.tsx`):
  - `DeleteActivityConfirmModal.tsx`, `DeleteDeviceModal.tsx`, `DeleteMessageModal.tsx`, `DeleteQueueModal.tsx`, `DeletePlanModal.tsx`, `DeleteContactModal.tsx`, `DeleteTeamMemberModal.tsx`, `ApiKeyConfirmModal.tsx`, `SessionConfirmModal.tsx`, `ExpireSubscriptionModal.tsx`.
- **Hasil:** Menghilangkan ketergantungan `useEscapeKey` manual dan overlay CSS duplikat.

### 🎯 **Batch 4: Migrasi Modal Form & Detail Kompleks (Tingkat Risiko: Sedang)**
- Migrasikan modal formulir input dan detail (seperti `ContactModal.tsx`, `PlanFormModal.tsx`, `DeviceDetailModal.tsx`, `InvoiceReceiptModal.tsx`, `TopUpModal.tsx`) ke `Dialog` (`dialog.tsx`).

---

## 🛡️ 4. Verifikasi & Quality Gates di Setiap Batch
1. **TypeScript Check**: `bun x tsc --noEmit` $\to$ Harus selalu **0 errors**.
2. **ESLint Check**: `bun run lint` $\to$ Harus selalu **0 errors & 0 warnings**.
3. **Prettier Format**: `bun run format` $\to$ Seluruh file terformat rapi.
4. **Instruksi Pengguna**: `bun run build` **TIDAK AKAN DIJALANKAN**.
5. **Komponen UI**: Semua komponen di `src/components/ui/` **TETAP DIPERTAHANKAN** (*tidak ada yang dihapus*).
