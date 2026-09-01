# 🧭 Rencana Implementasi: Perbaikan Route Support Tickets (Fix 404 Not Found)

Analisis akar masalah error `404 Not Found` pada `GET /api/v1/support/tickets?page=1&page_size=10` dan rancangan pendaftaran route alias lengkap di backend Go ([`wahide/internal/modules/support/delivery/http/router.go`](file:///G:/WEB2026/wahide/internal/modules/support/delivery/http/router.go)) serta normalisasi DTO di frontend ([`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts)).

---

## 🔍 1. Analisis Akar Masalah (Root Cause Analysis)

### Bukti Error:
```json
{
  "duration_ms": 49.2228,
  "error": "Not Found",
  "http.method": "GET",
  "http.route": "/api/v1/support/tickets?page=1&page_size=10",
  "http.status_code": 404,
  "level": "error",
  "msg": "HTTP request failed with server error"
}
```

### Investigasi Kode Sumber:
1. **Frontend Calling Endpoint**:
   * Di [`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts#L51), frontend memanggil:
     `GET /support/tickets?page=1&page_size=10`
   * Serta `POST /support/tickets`, `POST /support/tickets/:id/reply`, dll.
2. **Backend Route Registration**:
   * Di [`wahide/internal/modules/support/delivery/http/router.go`](file:///G:/WEB2026/wahide/internal/modules/support/delivery/http/router.go#L19), rute yang terdaftar hanya:
     `authGroup.Group("/ticket")` (singular tanpa prefix `/support/` dan tanpa plural `tickets`).
   * Rute `/support/tickets`, `/support/ticket`, dan `/tickets` **belum terdaftar di backend**.

---

## 🛠️ 2. Rencana Perubahan Kode

### 📌 1. Backend Go ([`router.go`](file:///G:/WEB2026/wahide/internal/modules/support/delivery/http/router.go))
* Daftarkan seluruh variasi alias rute yang umum digunakan klien (RESTful & Backward-Compatible):
  * `/support/tickets` (Standar REST plural dengan modul prefix)
  * `/support/ticket` (Standar REST singular dengan modul prefix)
  * `/tickets` (Standar REST plural root)
  * `/ticket` (Standar REST singular root)
* Berlaku sama untuk grup rute Pengguna Biasa (`authGroup`) dan Administrator (`adminGroup`).

### 📌 2. Frontend React ([`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts))
* Implementasikan fungsi `normalizeTicket` defensif untuk memetakan respons database Go (`ref_number` $\to$ `ticketNumber`, `created_at` $\to$ `createdAt`, initial `message` $\to$ thread list) agar tidak terjadi `undefined` rendering pada tabel tiket bantuan.

---

## 🔍 3. Verification Plan
* Jalankan `go test ./...` di backend Go `wahide`.
* Jalankan `bun x tsc --noEmit` & `bun run lint` di frontend `fontwahide`.
