# 🧭 Rencana & Integrasi: Upload Gambar Screenshot Cloudflare R2 pada Modal Buat Tiket Bantuan

Analisis mendalam mengapa upload lampiran gambar Cloudflare R2 belum tampil di antarmuka frontend ([`CreateTicketModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/CreateTicketModal.tsx)), serta rencana implementasi integrasi S3 Cloudflare R2 lengkap dengan preview, validasi batas ukuran (1MB), dan penayangan lampiran pada thread percakapan.

---

## 🔍 1. Analisis Akar Masalah (Mengapa Belum Tampil?)

### 📸 Temuan pada Screenshot Pengguna:
* Modal `CreateTicketModal.tsx` saat ini hanya berisi 4 input:
  1. Subjek Kendala
  2. Kategori Layanan
  3. Tingkat Prioritas
  4. Rincian Kendala / Pesan
* **Komponen input file lampiran (*attachment*) belum ditambahkan ke dalam JSX `CreateTicketModal.tsx`**.

### 🔬 Kondisi Backend vs Frontend Saat Ini:
1. **Backend Go (`wahide`) SUDAH LENGKAP & SIAP**:
   * Endpoint `POST /api/v1/support/tickets/upload` sudah tersedia di [`ticket_handler.go#L342-L378`](file:///G:/WEB2026/wahide/internal/modules/support/delivery/http/ticket_handler.go#L342-L378).
   * Menerima multipart file `file` (PNG, JPG, JPEG, Maks 1 MB).
   * Mengunggah gambar ke bucket Cloudflare R2 S3 (`support/{user_id}/{ulid}.{ext}`) dan mengembalikan URL publik (`https://pub-xxx.r2.dev/support/...`).
   * Field `attachment` pada entity `Ticket` dan DTO `CreateTicketRequest` sudah siap menyimpan URL tersebut.
2. **Kekurangan di Frontend (`fontwahide`)**:
   * `http-client.ts`: Method `post` sebelumnya meng-JSON.stringify `FormData`, yang perlu disesuaikan agar mendukung multipart `FormData` tanpa `Content-Type: application/json`.
   * `support.types.ts`: Interface `CreateTicketInput` dan `Ticket` belum menyertakan `attachment?: string`.
   * `support.api.ts`: Belum ada fungsi `uploadImage: async (file: File): Promise<string>`.
   * `CreateTicketModal.tsx`: Belum ada tombol pemilih file, indikator progress upload, dan preview thumbnail.
   * `TicketThreadModal.tsx`: Belum menampilkan gambar lampiran jika tiket memiliki `attachment`.

---

## 🛠️ 2. Rencana Perubahan Kode (Action Plan)

### 📌 1. Dukungan Multipart FormData ([`http-client.ts`](file:///G:/WEB2026/fontwahide/src/lib/api/http-client.ts))
* Sesuaikan `HttpClient.request` dan `HttpClient.post`:
  * Jika `body instanceof FormData`, jangan pasang `Content-Type: application/json` agar browser otomatis menyetel `multipart/form-data; boundary=...`.
  * Jangan jalankan `JSON.stringify` pada `FormData`.

### 📌 2. Penambahan Type & API Method ([`support.types.ts`](file:///G:/WEB2026/fontwahide/src/services/support/types/support.types.ts) & [`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts))
* Tambahkan `attachment?: string` pada `CreateTicketInput` dan `Ticket`.
* Tambahkan fungsi `uploadImage(file: File): Promise<string>` yang memanggil `POST /support/tickets/upload`.

### 📌 3. Komponen Upload & Preview di Modal Tiket ([`CreateTicketModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/CreateTicketModal.tsx))
* Tambahkan tombol "Lampirkan Screenshot (Opsional)".
* Batasi tipe file: `image/png, image/jpeg, image/jpg` dengan batas maksimal 1 MB.
* Saat gambar dipilih:
  * Tampilkan spinner *"Mengunggah gambar ke cloud..."*.
  * Panggil `supportApi.uploadImage(file)` $\to$ dapatkan URL Cloudflare R2.
  * Tampilkan kartu preview gambar mungil dengan tombol hapus/ganti.
* Saat submit:
  * Kirim payload `{ ...data, attachment: imageUrl }`.

### 📌 4. Penayangan Lampiran di Thread Diskusi ([`TicketThreadModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketThreadModal.tsx))
* Jika `ticket.attachment` ada, tampilkan kartu lampiran dengan thumbnail dan tautan *"Lihat Gambar Penuh ↗"*.

### 📌 5. Kamus Bahasa Multibahasa ([`id/support.json`](file:///G:/WEB2026/fontwahide/src/locales/id/support.json) & [`en/support.json`](file:///G:/WEB2026/fontwahide/src/locales/en/support.json))
* Tambahkan label `attachmentLabel`, `attachmentHint`, `uploadingImage`, `removeAttachment`.

---

## 🔍 3. Verification Plan
* Jalankan `bun x tsc --noEmit` dan `bun run lint` di `fontwahide`.
* Uji upload gambar di modal buat tiket dan pastikan gambar tersimpan di Cloudflare R2 serta tampil di thread tiket.
