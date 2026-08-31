# 🧭 Rencana: Penyederhanaan Paginasi Kontak Murni Tombol Sebelumnya & Berikutnya (*Prev/Next Only*)

Dokumen perencanaan teknis mengenai penyederhanaan bilah paginasi pada modul Buku Kontak ([`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx)) agar murni menggunakan kontrol **Sebelumnya (*Previous*)** dan **Berikutnya (*Next*)** tanpa tombol angka halaman (`1`, `2`, `3`, dst.).

---

## 🔍 1. Analisis & Evaluasi UX

### 📌 Keuntungan Desain Prev/Next Sederhana (*Clean Streamlined Navigation*):
1. **Antarmuka Minimalis & Bebas Distraksi**:
   - Menghilangkan deretan tombol angka (`[1] [2] [3] ... [10]`) yang memakan banyak ruang horizontal dan berpotensi terpotong pada layar ponsel/tablet.
2. **Fokus pada Alur Navigasi Sekuensial**:
   - Pengguna cukup menekan tombol `[ ◄ Sebelumnya ]` dan `[ Berikutnya ► ]` untuk menjelajahi daftar kontak.
   - Status halaman saat ini tetap terlihat jelas melalui teks indikator: `Halaman 1 dari 6`.
3. **Penyelarasan Props Komponen**:
   - Menyederhanakan kode `ContactTable.tsx` dan mengurangi kerumitan rendering array angka.

---

## 🎨 2. Desain Visual Bilah Paginasi Baru

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Menampilkan 1 - 10 dari 58 kontak    Halaman 1 dari 6   [◄ Prev]  [Next ►]  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Rencana Implementasi

### A. Komponen Tabel ([`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx)):
* Hapus loop `Array.from({ length: totalPages })` untuk tombol angka halaman.
* Tampilkan indikator teks: `Halaman {page} dari {totalPages}`.
* Sediakan dua tombol aksi utama:
  * Tombol **`[ ◄ Sebelumnya ]`** (otomatis nonaktif saat `page <= 1`).
  * Tombol **`[ Berikutnya ► ]`** (otomatis nonaktif saat `page >= totalPages`).

### B. Kamus i18n (`src/locales/`):
* Tambahkan teks indikator:
  * `"pageIndicator": "Halaman {page} dari {total}"` (ID)
  * `"pageIndicator": "Page {page} of {total}"` (EN)

---

## 🔍 4. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 0 error.
* `eslint` ➔ 🟢 0 error.
* Uji klik navigasi `Sebelumnya` dan `Berikutnya`.
