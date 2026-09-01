# 🧭 Audit & Rencana Perbaikan i18n: Lokalisasi Komprehensif Seluruh Modul Dukungan (`/support` & `/support/[id]`)

Dokumen audit dan rencana standarisasi lokalisasi (*internationalization*) pada seluruh antarmuka modul tiket bantuan (`fontwahide`), memastikan tidak ada teks mentah (*hardcoded strings*) dan mendukung penuh dwibahasa (**Bahasa Indonesia `id`** dan **English `en`**).

---

## 🔍 1. Temuan Audit Hardcoded Strings

Setelah melakukan penelusuran menyeluruh pada seluruh komponen di bawah `src/services/support/` dan `src/app/(dashboard)/support/`, ditemukan beberapa area yang masih menggunakan teks statis:

### A. [`TicketDetailView.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/detail/TicketDetailView.tsx)
* Navigasi: `"Kembali ke Daftar Tiket"`
* Tombol Aksi: `"Tutup Tiket"`
* Label Identitas: `"Anda"`, `"(Pembuat Tiket)"`, `"Staff Support"`
* Lampiran: `"Lampiran Screenshot Awal"`, `"Buka Gambar"`, `"Buka Ukuran Penuh"`
* Komposer Balasan: `"Kirim Balasan (Reply to Ticket)"`, `"Tulis balasan pesan Anda..."`, `"Lampirkan Gambar (Maks 1MB)"`, `"Format didukung: PNG, JPG, JPEG"`, `"Siap dilampirkan"`, `"Kirim Balasan"`
* Status Tiket Ditutup: `"Tiket Ini Telah Ditutup"`, `"Percakapan telah diselesaikan. Jika Anda memiliki pertanyaan atau kendala baru, silakan buat tiket baru."`
* Sidebar Detail: `"Detail Tiket (Ticket Details)"`, `"Status"`, `"Prioritas"`, `"Kategori"`, `"Nomor Referensi"`, `"Dibuat Pada"`, `"Terakhir Diperbarui"`, `"Total Balasan"`, `"Lampiran Gambar Awal"`
* Pesan Error & Toast: `"Format file tidak valid: hanya PNG, JPG, dan JPEG yang diperbolehkan"`, `"Ukuran file maksimal 1 MB"`, `"Gagal mengunggah gambar ke cloud"`, `"Gagal mengirim balasan"`, `"Tiket bantuan telah berhasil ditutup"`, `"Gagal menutup tiket bantuan"`, `"Tiket Tidak Ditemukan"`, `"Kembali ke Dukungan"`
* Nilai Prioritas: `"Tinggi"`, `"Sedang"`, `"Rendah"`

### B. [`TicketList.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketList.tsx)
* Nilai Prioritas Badge: `"Tinggi"`, `"Sedang"`, `"Rendah"`
* Tombol Cari: `"Cari"`
* Aksesibilitas: `aria-label="Refresh Tiket"`
* Tombol Aksi Baris: `"Buka"`
* Pagination Footer:
  * `"Menampilkan {startItem} - {endItem} dari {total} tiket"`
  * `"Halaman {page} dari {totalPages}"`
  * `"Sebelumnya"`
  * `"Berikutnya"`

### C. [`CreateTicketModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/CreateTicketModal.tsx)
* Validasi Upload: `"Format file tidak valid. Hanya PNG, JPG, dan JPEG yang diperbolehkan."`, `"Ukuran file terlalu besar. Maksimal 1 MB."`
* Tombol Unggah: `"Pilih Gambar Screenshot"`
* Status Thumbnail: `"Screenshot terunggah"`
* Validasi Form: `"Subjek dan rincian pesan kendala wajib diisi."`
* Error Toast: `"Gagal membuat tiket"`

---

## 🛠️ 2. Rencana Eksekusi Standarisasi i18n

### Langkah 1: Perluas Kamus Bahasa di [`locales/id/support.json`](file:///G:/WEB2026/fontwahide/src/locales/id/support.json) & [`locales/en/support.json`](file:///G:/WEB2026/fontwahide/src/locales/en/support.json)
Tambahkan seluruh kunci terjemahan baru dengan padanan kata profesional dalam Bahasa Indonesia dan English.

### Langkah 2: Refactor [`TicketDetailView.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/detail/TicketDetailView.tsx)
Gantikan seluruh string statis, label sidebar, pesan validasi, dan notifikasi toast menggunakan `t("support.KEY")`.

### Langkah 3: Refactor [`TicketList.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketList.tsx)
Gantikan teks pagination, tombol cari, label badge prioritas, dan teks tombol buka dengan `t("support.KEY")`.

### Langkah 4: Refactor [`CreateTicketModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/CreateTicketModal.tsx)
Gantikan pesan error validasi file dan tombol pilih screenshot dengan `t("support.KEY")`.

---

## 🔍 3. Verification Plan
1. `bun x tsc --noEmit`: Memastikan 0 error type-safety.
2. `bun run lint`: Memastikan 0 warning/error linter.
3. Buka `http://localhost:3000/support` lalu ganti bahasa ke **English** $\to$ pastikan seluruh elemen teks berubah menjadi bahasa Inggris yang natural.
4. Ganti kembali ke **Bahasa Indonesia** $\to$ pastikan teks tampil dalam Bahasa Indonesia yang formal dan profesional.
