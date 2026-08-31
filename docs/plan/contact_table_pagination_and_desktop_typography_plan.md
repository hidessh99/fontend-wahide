# 🧭 Analisis & Rencana Arsitektur: Paginasi Server-Side (10 Data / Halaman) & Peningkatan Tipografi Desktop pada Modul Kontak

Dokumen perencanaan teknis mengenai implementasi **Paginasi 10 Data per Halaman** dan **Peningkatan Tipografi Desktop (Legibility & Sizing)** pada modul Buku Kontak ([`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx), [`useContacts.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/hooks/useContacts.ts), [`contact.api.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/api/contact.api.ts), dan [`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx)).

---

## 🔍 1. Analisis Kebutuhan & Masalah UI/UX Saat Ini

### 📌 Masalah 1: Ukuran Font Mode Desktop Terlalu Kecil (Micro-Typography)
* **Kondisi Saat Ini**:
  * Nama kontak berukuran `text-xs` (12px).
  * Nomor WhatsApp berukuran `text-[11px] font-mono` (11px).
  * Padding baris sangat rapat (`py-3`).
* **Dampak**: Pada monitor desktop resolusi 1080p / 1440p / 4K, teks 11px terasa sangat kecil, sulit dibaca (*eye strain*), dan tidak mencerminkan standar desain enterprise modern.
* **Standar Tipografi Baru**:
  * **Nama Kontak**: Ditingkatkan menjadi `text-sm font-bold text-foreground` (14px, tegas & kontras).
  * **Nomor WhatsApp**: Ditingkatkan menjadi `text-sm font-mono font-medium text-foreground-secondary` (14px, mudah diverifikasi).
  * **Tinggi Baris (Row Rhythm)**: Ditingkatkan dari `py-3` menjadi `py-4 px-5 min-h-[58px]` dengan efek hover yang nyaman.
  * **Ikon Aksi**: Tombol ubah/hapus diperbesar menjadi `size-8` dengan ikon `size-4`.

---

### 📌 Masalah 2: Belum Ada Paginasi 10 Data per Halaman
* **Kondisi Saat Ini**: Seluruh data kontak di-load sekaligus dalam satu view virtualized scroll tanpa navigasi halaman.
* **Kebutuhan**: Menyediakan **Paginasi Server-Side 10 Data per Halaman** yang terhubung langsung dengan respon backend Go `RespondPaginated` (`page`, `page_size: 10`, `total`).

---

## 🎨 2. Desain Antarmuka Paginasi & Tabel Desktop

```
┌────┬─────────────────────────────┬─────────────────────────────┬────────┐
│ ☐  │ NAMA KONTAK                 │ NOMOR WHATSAPP              │ AKSI   │
├────┼─────────────────────────────┼─────────────────────────────┼────────┤
│ ☐  │ Dimas Wahide                │ +6287711301818              │ ✏️ 🗑️  │
│ ☐  │ Budi Santoso                │ +6281234567890              │ ✏️ 🗑️  │
│ ...│ ...                         │ ...                         │ ...    │
├────┴─────────────────────────────┴─────────────────────────────┴────────┤
│ Menampilkan 1 - 10 dari 58 kontak        [◄ Prev]  [1]  (2)  [3]  [Next ►]  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Rencana Implementasi

### A. API Client ([`contact.api.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/api/contact.api.ts)):
* Mengirimkan parameter `page` dan `page_size: 10` ke endpoint `GET /contacts?page=1&page_size=10&search=query`.
* Mengekstrak data kontak `payload` dan metadata total item dari `additional_info.total`.

### B. Hook State ([`useContacts.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/hooks/useContacts.ts)):
* Menyediakan state `page` (default 1), `pageSize` (default 10), `total`, dan `totalPages`.
* Menyediakan fungsi navigasi `setPage(page)`, `nextPage()`, `prevPage()`.
* Saat pengguna mencari kata kunci baru, halaman otomatis di-reset ke `page = 1`.

### C. Komponen Tabel & Paginasi ([`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx)):
* Terapkan tipografi proporsional desktop (`text-sm`, `py-4`, `px-5`).
* Render bilah paginasi di bawah tabel lengkap dengan tombol navigasi numerik dan panah `Previous` / `Next`.

### D. Kamus Multi-Bahasa (`src/locales/`):
* Tambahkan teks paginasi:
  * `"showingPagination": "Menampilkan {start} - {end} dari {total} kontak"` (ID) / `"Showing {start} - {end} of {total} contacts"` (EN).
  * `"prevPage": "Sebelumnya"`, `"nextPage": "Berikutnya"`.

---

## 🔍 4. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 0 error.
* `eslint` ➔ 🟢 0 error.
* Verifikasi tampilan desktop pada browser agar nyaman dan jelas terbaca.
