# 📄 Rencana Penyederhanaan Pagination Tabel: Format Minimalis (Hanya Prev & Next)

**Target File:** [`src/components/ui/pagination.tsx`](file:///g:/WEB2026/fontwahide/src/components/ui/pagination.tsx)  
**Tujuan:** Menghapus tombol nomor halaman yang bertumpuk (*overlapping*), menggantinya dengan navigasi minimalis **Sebelumnya**, teks indikator **Halaman X dari Y**, dan **Berikutnya** sesuai arahan user.  
**Status:** Menunggu Persetujuan User (*Pending Approval*)

---

## 🔍 1. Analisis Masalah Tampilan Saat Ini

Berdasarkan tangkapan layar yang Anda kirimkan:
- Tombol nomor halaman bulat (`1`, `2`, `3`, `4`) bertubrukan dan tumpang tindih (*overlap*) di atas teks tombol `"Sebelumnya"` dan `"Berikutnya"`.
- Hal ini terjadi karena gaya bawaan shadcn `PaginationContent` dan tombol Prev/Next memiliki styling layout anchor default yang sempit jika digabungkan dengan banyak tombol angka di dalam kontainer tabel.
- **Arahan User yang Sangat Tepat**:
  > *"pada pagination seharusnya nga perlu pakai nomer , cukup next previus aja , bikin planing"*
  
Menghapus deretan tombol angka dan beralih ke format **Next & Previous Saja** adalah keputusan UX yang sangat tepat:
1. **Bebas Tumpang Tindih (Zero Overlap):** Ruang layout menjadi sangat lapang dan rapi.
2. **Sangat Ringan & Bersih (Minimalist & Clean):** Selaras dengan prinsip desain Wise.
3. **Responsif Sempurna di Mobile:** Tidak ada risiko tombol meluber ke samping di layar HP kecil.
4. **Sentralisasi Cerdas:** Karena seluruh 11 tabel kita telah menggunakan `<DataTablePagination />`, perubahan cukup dilakukan di **1 file saja** (`src/components/ui/pagination.tsx`) dan otomatis berlaku ke seluruh aplikasi!

---

## 🎨 2. Rencana Desain Baru (Prev & Next Only)

### Struktur Tampilan:
```
[ < Sebelumnya ]    Halaman 2 dari 5    [ Berikutnya > ]
```

- **Tombol Sebelumnya (`PaginationPrevious`):**
  - Ikon panah kiri (`ChevronLeft`).
  - Label teks `"Sebelumnya"` (tetap tampil rapi di desktop, atau ikon panah di layar sangat kecil).
  - Otomatis `disabled` dan berpenampilan pudar saat berada di Halaman 1.
- **Teks Indikator Tengah:**
  - `Halaman {page} dari {totalPages}` dengan font bersih `text-xs font-bold text-foreground-secondary select-none px-2`.
- **Tombol Berikutnya (`PaginationNext`):**
  - Label teks `"Berikutnya"`.
  - Ikon panah kanan (`ChevronRight`).
  - Otomatis `disabled` dan berpenampilan pudar saat berada di Halaman Terakhir.

---

## 🛠️ 3. Rencana Langkah Eksekusi

### **Langkah 1: Perbarui Komponen `DataTablePagination` di `src/components/ui/pagination.tsx`**
- Hapus loop perenderan tombol angka bulat `pageItems.map(...)`.
- Susun layout horizontal bersih dengan `gap-2 sm:gap-3` yang tidak akan pernah bertubrukan:
  - Tombol `PaginationPrevious`
  - Teks tengah `Halaman {page} dari {totalPages}`
  - Tombol `PaginationNext`
- Rapikan padding `PaginationPrevious` dan `PaginationNext` agar tidak menggunakan utility class negatif atau override keras (`pl-1.5!`).

### **Langkah 2: Verifikasi Quality Gates**
- `bun x tsc --noEmit` $\to$ Pastikan tipe data 100% aman (0 errors).
- `bun run lint` $\to$ Pastikan 0 errors dan 0 warnings.
- `bun run format` $\to$ Pastikan formatting Prettier rapi.
- *(Sesuai instruksi Anda: `bun run build` TIDAK AKAN dijalankan)*.
