# 🧭 Rencana Integrasi: Upload Gambar / Screenshot pada Balasan Tiket Bantuan (Ticket Thread Image Attachment)

Dokumen perencanaan arsitektur dan teknis untuk menghadirkan fitur **unggah gambar / screenshot (Cloudflare R2 Storage)** saat membalas tiket bantuan di modal `TicketThreadModal` (`http://localhost:3000/support`).

---

## 🔍 1. Analisis Situasi Saat Ini: Mengapa Baru Bisa Ketik Teks Saja?

Berdasarkan audit menyeluruh terhadap kode saat ini:
1. **Pada Form Balasan Modal ([`TicketThreadModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketThreadModal.tsx))**:
   * Bagian bawah modal hanya memiliki elemen `<textarea>` (*"Tulis balasan pesan Anda..."*) dan tombol `<Button type="submit">` (*"Kirim"*).
   * Belum ada tombol pemilih file gambar (`<input type="file">`), preview thumbnail sebelum kirim, maupun indikator upload.
2. **Pada Skema Data Balasan Backend ([`entity/ticket_reply.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/entity/ticket_reply.go))**:
   * Berbeda dengan tiket utama yang sudah memiliki kolom `attachment varchar(500)` di tabel `tickets`, entitas `TicketReply` di tabel `ticket_replies` saat ini baru menampung kolom: `id`, `ticket_id`, `user_id`, `message`, `created_at`, `updated_at`.
   * Endpoint upload gambar Cloudflare R2 backend (`POST /api/v1/support/tickets/upload`) **sudah tersedia dan aktif**, namun baru dimanfaatkan oleh form pembuatan tiket awal ([`CreateTicketModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/CreateTicketModal.tsx)).

---

## 💡 2. Dua Opsi Implementasi

Kami menyusun **2 opsi arsitektur** agar Anda dapat memilih pendekatan yang paling sesuai dengan kebutuhan:

---

### 🌟 Opsi A: Native First-Class Field (Direkomendasikan - Backend & Frontend)
Pendekatan standar enterprise di mana kolom `attachment` ditambahkan secara resmi ke entitas dan tabel `ticket_replies`.

#### A. Backend Go (`wahide`)
1. **Entitas [`entity/ticket_reply.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/entity/ticket_reply.go)**:
   * Tambahkan kolom:
     ```go
     Attachment string `gorm:"type:varchar(500);default:null"`
     ```
   * *Catatan Keamanan & Zero Downtime*: GORM `AutoMigrate` pada `database/migration.go` akan mengeksekusi `ALTER TABLE ticket_replies ADD COLUMN attachment VARCHAR(500) DEFAULT NULL` secara otomatis saat server berjalan tanpa menghapus data yang ada.
2. **DTO [`dto/ticket_reply_dto.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/dto/ticket_reply_dto.go)**:
   * Tambahkan field `Attachment string` pada `CreateTicketReplyRequest` (`validate:"omitempty,url,max=500"`).
   * Tambahkan field `Attachment string` pada `GetTicketReplyResponse`.
3. **Handler & Usecase ([`ticket_reply_handler.go`](file:///G:/WEB2026/wahide/internal/modules/support/delivery/http/ticket_reply_handler.go) & [`ticket_reply_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/support/usecase/ticket_reply_usecase.go))**:
   * Teruskan `req.Attachment` ke entitas `TicketReply` saat pembuatan balasan.
   * Petakan `p.Attachment` ke respon balasan (`toReplyResponseWithUser`).

#### B. Frontend Next.js (`fontwahide`)
1. **Tipe Data ([`support.types.ts`](file:///G:/WEB2026/fontwahide/src/services/support/types/support.types.ts))**:
   * Tambahkan `attachment?: string;` ke antarmuka `TicketMessage`.
2. **API Client ([`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts))**:
   * Perbarui `getReplies` untuk membaca field `attachment`.
   * Perbarui `replyTicket(id: string, content: string, attachment?: string)`.
3. **Komponen UI ([`TicketThreadModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketThreadModal.tsx))**:
   * Tambahkan tombol ikon klip kertas / gambar (`Paperclip` / `Image`) di samping textarea.
   * Validasi file sisi klien: format PNG/JPG/JPEG, maksimal 1 MB.
   * Unggah otomatis ke Cloudflare R2 via `supportApi.uploadImage(file)`.
   * Tampilkan preview thumbnail gambar yang siap dikirim lengkap dengan tombol hapus `(X)`.
   * Pada bubble chat thread, jika `msg.attachment` terisi, render gambar thumbnail interaktif yang dapat diklik untuk dibuka dalam resolusi penuh di tab baru.

---

### 🛡️ Opsi B: Murni Frontend (Zero Backend Changes)
Jika Anda **tidak ingin mengubah kode Backend Go sama sekali**:

1. **Cara Kerja**:
   * Pengguna memilih gambar di modal balasan.
   * Frontend mengunggah file ke Cloudflare R2 menggunakan endpoint yang sudah ada: `POST /api/v1/support/tickets/upload`.
   * URL publik Cloudflare R2 otomatis disematkan ke dalam pesan balasan dengan format khusus:
     `[Pesan teks] \n\n[attachment: https://pub-.../image.png]`.
2. **Rendering UI**:
   * Parser di `TicketThreadModal.tsx` mendeteksi tag `[attachment: URL]`, memisahkannya dari teks biasa, dan merender thumbnail gambar interaktif di dalam bubble chat.
3. **Kelebihan & Kekurangan**:
   * *Kelebihan*: Backend Go 100% tidak tersentuh.
   * *Kekurangan*: URL gambar menempel di dalam kolom teks `message` database, bukan sebagai kolom relasional terpisah.

---

## 📋 3. Desain Komponen UI pada `TicketThreadModal.tsx`

```
+-------------------------------------------------------------------+
| TKT-202609-UURDM  WHATSAPP                                    (X) |
| belajaar                                                          |
+-------------------------------------------------------------------+
|  [Bubble Chat: Anda • 10:15 AM]                                   |
|  fsafasvdgdtr dimana aja                                          |
|                                                                   |
|  [Bubble Chat: Staff • 10:17 AM]                                  |
|  kamu dimana                                                      |
|                                                                   |
|  [Bubble Chat: Anda • 10:52 AM]                                   |
|  +---------------------------+                                    |
|  | [Thumbnail Gambar R2]     |                                    |
|  +---------------------------+                                    |
|  Ini screenshot error yang saya alami                             |
+-------------------------------------------------------------------+
|  [Preview: error_screen.png (124 KB)                       (X)]   |
|  +-------------------------------------------------------------+  |
|  | Tulis balasan pesan Anda...                                 |  |
|  +-------------------------------------------------------------+  |
|  [📎 Lampirkan Gambar]                             [🚀 Kirim]    |
+-------------------------------------------------------------------+
```

---

## 🔍 4. Verification Plan (Rencana Verifikasi)

1. **Pemeriksaan Kompilasi & Linter**:
   * Backend (jika Opsi A): `go test ./internal/modules/support/...` $\to$ 100% PASS.
   * Frontend: `bun x tsc --noEmit` & `bun run lint` $\to$ 0 error, 0 warning.
2. **Pengujian Fungsional di Browser**:
   * Buka tiket `belajaar`.
   * Klik tombol ikon gambar / lampiran di form balasan.
   * Pilih file screenshot (`.png` / `.jpg`).
   * Pastikan preview thumbnail muncul seketika di atas textarea.
   * Ketik pesan dan klik **"Kirim"**.
   * Pastikan bubble chat balasan memuat teks sekaligus thumbnail gambar Cloudflare R2 yang dapat diklik untuk dibuka di tab baru.
   * Tutup modal dan buka kembali $\to$ Gambar tetap tersimpan dan tampil di thread riwayat.
