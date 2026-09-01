# 🧭 Rencana & Audit Mendalam: Validasi Payload Tiket Bantuan & DTO Support Module (Fix Validation oneof Priority & Attachment Cloudflare R2)

Audit menyeluruh terhadap kontrak DTO, validasi modul Support di backend Go ([`wahide/internal/modules/support/domain/dto/`](file:///G:/WEB2026/wahide/internal/modules/support/domain/dto/)), integrasi attachment Cloudflare R2, dan frontend Next.js ([`fontwahide/src/services/support/`](file:///G:/WEB2026/fontwahide/src/services/support/)).

---

## 🔍 1. Hasil Audit Temuan Masalah

### 🚨 Temuan 1: Error Validasi Case-Sensitive pada Field `Priority`
* **Log Error**:
  ```json
  {"error":"Key: 'CreateTicketRequest.Priority' Error:Field validation for 'Priority' failed on the 'oneof' tag"}
  ```
* **Penyebab**:
  * Frontend mengirimkan: `"priority": "MEDIUM"` (atau `"LOW"`, `"HIGH"` - Huruf Kapital).
  * Tag validasi di backend Go (`ticket_dto.go`): `validate:"omitempty,oneof=Low Medium High"` (Hanya menerima TitleCase: *Low*, *Medium*, *High*).
  * Go-playground validator bersifat **case-sensitive**, sehingga nilai `"MEDIUM"` ditolak dengan error 400.

### 🚨 Temuan 2: Inkonsistensi Penamaan Field Balasan Pesan (`content` vs `message`)
* **Penyebab**:
  * Frontend di [`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts) mengirimkan `{ content: "pesan balasan" }`.
  * Backend DTO di [`ticket_reply_dto.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/dto/ticket_reply_dto.go) hanya membaca `json:"message"`.
  * Akibatnya, saat pengiriman balasan tiket, pesan tidak terbaca jika nama key JSON berbeda.

### 🚨 Temuan 3: Integrasi Attachment Cloudflare R2
* **Arsitektur**:
  * Backend Go mendukung upload lampiran tangkapan layar ke Cloudflare R2 (S3-compatible) via `POST /support/tickets/upload` atau Presigned URL `GET /support/tickets/upload/presign`.
  * URL publik Cloudflare R2 (`https://pub-xxx.r2.dev/support/{user_id}/{ulid}.png`) diteruskan ke kolom `attachment` di tabel database `tickets`.

---

## 🛠️ 2. Rencana Solusi & Perubahan Kode

### 📌 1. Backend Go (`wahide`):
1. **[`ticket_dto.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/dto/ticket_dto.go)**:
   * Perluas tag validasi `Priority` pada `CreateTicketRequest` dan `UpdateTicketRequest`:
     ```go
     Priority string `json:"priority" validate:"omitempty,oneof=Low Medium High low medium high LOW MEDIUM HIGH"`
     ```
   * Perluas validasi `Status` pada `UpdateTicketStatusRequest`:
     ```go
     Status string `json:"status" validate:"required,oneof=OPEN IN_PROGRESS WAITING_FOR_REPLY RESOLVED CLOSED open in_progress waiting_for_reply resolved closed"`
     ```
2. **[`ticket_reply_dto.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/dto/ticket_reply_dto.go)**:
   * Tambahkan field `Content` sebagai alias fleksibel untuk `Message`:
     ```go
     type CreateTicketReplyRequest struct {
         Message string `json:"message" form:"message" validate:"omitempty,noxss"`
         Content string `json:"content" form:"content" validate:"omitempty,noxss"`
     }
     ```
3. **[`ticket_reply_handler.go`](file:///G:/WEB2026/wahide/internal/modules/support/delivery/http/ticket_reply_handler.go)**:
   * Tambahkan fallback penanganan: `if req.Message == "" && req.Content != "" { req.Message = req.Content }`.
4. **[`ticket_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/support/usecase/ticket_usecase.go)**:
   * Normalisasi nilai `Priority` menjadi format database standar TitleCase (`"Low"`, `"Medium"`, `"High"`) sebelum disimpan.

---

### 📌 2. Frontend React (`fontwahide`):
1. **[`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts)**:
   * Pastikan pemanggilan `replyTicket` mengirimkan `{ message: content, content: content }`.
   * Pastikan `createTicket` mengirimkan `priority` yang dinormalisasi dengan benar.

---

## 🔍 3. Verification Plan
* Jalankan `go test ./...` di backend Go `wahide`.
* Jalankan `bun x tsc --noEmit` & `bun run lint` di frontend `fontwahide`.
* Uji coba alur pembuatan tiket dan balasan pesan secara end-to-end.
