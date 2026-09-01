# 🧭 Rencana Arsitektur: Pencarian Kontak Berbasis Server (Server-Side Search) dengan Tombol Submit

Dokumen perencanaan teknis mengenai implementasi tombol submit pencarian dan pemanggilan API backend (`GET /contacts?search=query&tag=tag`) pada halaman Buku Kontak ([`src/components/dashboard/ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx)).

---

## 🔍 1. Analisis Kebutuhan & Desain Interaksi

### 📌 Masalah Saat Ini:
* Pencarian kontak saat ini hanya menyaring data yang sudah terunduh di memori lokal browser.
* Pada skala database puluhan ribu kontak, memuat seluruh kontak ke browser tidak efisien. Diperlukan query langsung ke backend saat pengguna mencari nomor atau nama tertentu.

### 🎨 Desain UX:
```
┌─────────────────────────────────────────────────────────────┬───────────────┐
│ 🔍  Cari nama, nomor WhatsApp, atau tag...               ✖  │  [ 🔍 Cari ]  │
└─────────────────────────────────────────────────────────────┴───────────────┘
```
1. **Form Submit / Tombol Enter**:
   * Mengetik kata kunci lalu menekan tombol **`[ 🔍 Cari ]`** atau menekan tombol keyboard **`Enter`** akan memicu request `GET /contacts?search=query` ke API backend.
2. **Tombol Hapus Cepat (`X`)**:
   * Menekan tombol `X` akan mengosongkan input dan otomatis memanggil ulang seluruh daftar kontak utama.

---

## ⚡ 2. Rencana Implementasi

1. **Pembaruan API Client ([`src/services/contact/api/contact.api.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/api/contact.api.ts))**:
   * Memperbarui method `getContacts` agar menerima parameter query opsional `{ search?: string; tag?: string }`:
     ```ts
     getContacts: async (params?: { search?: string; tag?: string }): Promise<Contact[]> => { ... }
     ```

2. **Pembaruan Hook ([`src/services/contact/hooks/useContacts.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/hooks/useContacts.ts))**:
   * Menambahkan state pencarian aktif, method `executeSearch(query?: string)`, dan `clearSearch()`.

3. **Pembaruan Antarmuka ([`src/components/dashboard/ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx))**:
   * Membungkus input dalam form pencarian `<form onSubmit={handleSearchSubmit}>` dengan tombol `[ 🔍 Cari ]` (`variant="primaryPill"`).

4. **Pembaruan Kamus Multi-Bahasa (`src/locales/`)**:
   * Menambahkan `"searchBtn": "Cari"` (ID) dan `"searchBtn": "Search"` (EN).

---

## 🔍 3. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 **0 errors (100% Type-Safe)**
* `eslint` ➔ 🟢 **0 errors, 0 warnings (100% Bersih & Kanonikal)**
