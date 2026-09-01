# 🧭 Rencana Perbaikan: Balasan Tiket Bantuan Tidak Muncul (Murni Frontend - Zero Backend Modification)

Penyelesaian kendala pesan balasan tiket tidak muncul di modal `http://localhost:3000/support` **secara murni di level Frontend React (`fontwahide`) tanpa mengubah kode Backend Go sama sekali**.

---

## 🔍 1. Analisis & Keputusan Arsitektur

### Backend Go (`wahide`) Tetap Utuh (Zero Modification)
- Backend Go tetap memegang teguh standar keamanan ketat:
  - Validasi parameter `:id` wajib berupa **ULID 26 karakter** (`xval.IsValidULID`).
  - Endpoint yang sudah tersedia:
    - `POST /api/v1/support/tickets/:id/reply` (Menyimpan balasan ke tabel `ticket_replies`).
    - `GET /api/v1/support/tickets/:id/reply` (Mengambil daftar balasan dari tabel `ticket_replies`).
- **Tidak ada kode backend yang diubah**, menjaga integritas arsitektur Go, skema database, dan seluruh suite unit test Go yang sudah ada.

### Akar Masalah Sebenarnya Murni di Frontend (`fontwahide`)
1. **Frontend Tidak Pernah Mengambil Balasan dari Database**:
   - `supportApi` tidak memiliki pemanggilan ke `GET /support/tickets/:id/reply`.
   - `TicketThreadModal` hanya mengandalkan prop statis `ticket.messages` (yang hanya berisi 1 pesan awal tiket). Akibatnya, saat modal dibuka kembali, seluruh riwayat percakapan yang tersimpan di database tidak pernah dimuat.
2. **Pemisahan `id` (ULID) vs `ticketNumber` (Nomor Tiket `TKT-...`)**:
   - Backend mengharuskan `:id` adalah **ULID**.
   - Frontend harus memisahkan dengan tegas:
     - `ticket.id`: **Wajib ULID** (digunakan untuk seluruh pemanggilan API backend `/support/tickets/${ticket.id}/reply`).
     - `ticket.ticketNumber`: **Nomor Referensi UI** (`TKT-202609-UURDM`), hanya untuk badge tampilan visual.
3. **State Percakapan di `TicketThreadModal` Tidak Reaktif**:
   - Ketika pengguna mengklik **"Kirim"**, `TicketThreadModal` tidak memperbarui pesan secara lokal (*optimistic update*). Textarea dikosongkan, namun bubble chat baru tidak muncul di layar.

---

## 🛠️ 2. Rencana Eksekusi Murni Frontend (`fontwahide`)

### File 1: [`fontwahide/src/services/support/types/support.types.ts`](file:///G:/WEB2026/fontwahide/src/services/support/types/support.types.ts)
- Tambahkan field opsional `message?: string;` pada antarmuka `Ticket` untuk menyimpan teks pesan inisial tiket dari backend.

### File 2: [`fontwahide/src/services/support/api/support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts)
1. **Sempurnakan `normalizeTicket`**:
   - Pastikan `ticket.id` selalu menyimpan ULID asli dari backend (`raw.id`).
   - Simpan `ticket.ticketNumber` sebagai nomor referensi (`raw.ref_number || raw.ticket_number`).
   - Simpan pesan awal tiket (`raw.message`).
2. **Tambahkan fungsi `getReplies(ticketId: string)`**:
   - Memanggil `GET ${SUPPORT_BASE}/support/tickets/${ticketId}/reply?page=1&page_size=100`.
   - Memetakan respon `ticket_replies` menjadi list `TicketMessage[]`.
3. **Perbarui `replyTicket(ticketId: string, content: string)`**:
   - Mengirim payload `{ content, message: content }` ke `POST ${SUPPORT_BASE}/support/tickets/${ticketId}/reply`.
   - Mengembalikan objek `TicketMessage` yang valid.

### File 3: [`fontwahide/src/services/support/components/TicketThreadModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketThreadModal.tsx)
1. **Auto-Fetch Riwayat Balasan Saat Modal Dibuka**:
   - Tambahkan state lokal `messages: TicketMessage[]` dan `isFetching: boolean`.
   - Saat `isOpen && ticket?.id` aktif:
     - Tampilkan pesan awal tiket (`ticket.message`).
     - Jalankan `supportApi.getReplies(ticket.id)` untuk mengambil seluruh percakapan terdahulu dari database.
     - Tampilkan indikator loading halus saat sedang memuat pesan.
2. **Instant Optimistic Update Saat Kirim Pesan**:
   - Saat tombol **"Kirim"** ditekan:
     - Panggil `onSendReply(ticket.id, replyText)`.
     - Langsung tambahkan pesan baru ke state `messages` seketika (*instant bubble chat appear*).
     - Kosongkan textarea input.

### File 4: [`fontwahide/src/services/support/hooks/useSupport.ts`](file:///G:/WEB2026/fontwahide/src/services/support/hooks/useSupport.ts)
- Pastikan `replyTicket` mengembalikan objek `TicketMessage` baru ke pemanggil, dan memperbarui `updatedAt` pada tiket yang bersangkutan.

### File 5: [`fontwahide/src/services/support/components/TicketList.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketList.tsx)
- Sinkronkan `currentTicket` dengan state `tickets` aktif sehingga modal selalu sinkron dengan state induk.

---

## 🔍 3. Verification Plan
* `bun x tsc --noEmit`: Memastikan 0 error type-safety.
* `bun run lint`: Memastikan 0 warning/error linter.
* Pengujian manual di browser `http://localhost:3000/support`:
  1. Klik **"Buka"** pada tiket `belajaar` (`TKT-202609-UURDM`).
  2. Riwayat balasan langsung termuat dari database secara otomatis.
  3. Ketik balasan baru dan klik **"Kirim"** $\to$ Bubble chat balasan **langsung muncul seketika di layar**.
  4. Tutup modal lalu klik **"Buka"** kembali $\to$ Seluruh pesan balasan tetap ada dan tersimpan rapi.
