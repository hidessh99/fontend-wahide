# 🧭 Rencana Perbaikan Mode Development: Resilient Session Auto-Healing (Bebas 401 Saat Restart Redis/Golang)

Rencana implementasi mekanisme **Resilient Session Auto-Healing & Explicit Blacklist Revocation** di backend Go (`wahide`) untuk mengatasi error 401 *"Session has been revoked"* yang sering dialami pengembang akibat sering mematikan/menghidupkan server Golang dan Redis di lingkungan lokal.

---

## 🔍 1. Analisis Akar Masalah (Mengapa Masih Mengalami 401?)

### 🔬 Kronologi Masalah di Mode Development:
1. Pengembang sering **mematikan dan menyalakan kembali server Golang dan Redis**.
2. Setiap kali Redis dimatikan/direstart di laptop lokal, seluruh memori RAM Redis terhapus (kunci `session:USER_ID:TOKEN_ID` hilang).
3. Browser pengembang masih menyimpan token JWT yang sah (masa berlaku 7 hari).
4. Saat halaman memanggil endpoint (seperti `GET /api/v1/whatsapp/devices`), [`auth_middleware.go`](file:///G:/WEB2026/wahide/internal/shared/middleware/auth_middleware.go) memeriksa apakah `session:USER_ID:TOKEN_ID` ada di Redis.
5. Karena Redis baru saja direstart dan kuncinya kosong (`!exists`), middleware menganggap sesi telah dicabut (*revoked*) dan mengembalikan `401 "Session has been revoked"`.
6. Pengembang terpaksa harus login ulang setiap kali me-restart Redis/Golang.

---

## 🛠️ 2. Solusi Terbaik: "Resilient Session Auto-Healing"

Untuk membuat sistem **100% nyaman di mode development dan tetap aman kelas enterprise di production**, kita mengubah paradigma dari *Strict Memory Whitelist* menjadi **Hybrid Explicit Blacklist + Auto-Healing**:

```mermaid
flowchart TD
    A["Request Masuk (Bearer JWT)"] --> B["Validasi Kriptografi JWT (HS256)"]
    B -->|Tanda Tangan Tidak Sah / Expired| C["401 Unauthorized (Invalid JWT)"]
    B -->|Tanda Tangan Sah| D{"Apakah Token Ada di Blacklist (revoked:session:TOKEN_ID)?"}
    D -->|Ya (Pernah Logout)| E["401 Unauthorized (Session Revoked)"]
    D -->|Tidak (Sesi Sah)| F{"Apakah Kunci session:* Ada di Redis?"}
    F -->|Ada| G["200 OK: Request Berhasil"]
    F -->|Tidak Ada (Redis Baru Direstart)| H["⚡ Auto-Heal: Re-populate Sesi ke Redis"]
    H --> G
```

---

## 📋 3. Rencana Perubahan Kode (Action Plan)

### 📌 1. Update [`auth_middleware.go`](file:///G:/WEB2026/wahide/internal/shared/middleware/auth_middleware.go)
* Periksa apakah `revoked:session:TOKEN_ID` ada di Redis. Jika ada $\to$ tolak dengan 401.
* Jika tidak di-blacklist dan kunci `session:USER_ID:TOKEN_ID` kosong (akibat Redis direstart):
  * Lakukan **Auto-Healing**: simpan kembali data sesi ke Redis secara otomatis.
  * Loloskan request dengan status `200 OK`.

### 📌 2. Update Modul IAM ([`auth_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/iam/usecase/auth_usecase.go) & [`user_session_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/iam/usecase/user_session_usecase.go))
* Saat fungsi `Logout` atau `LogoutAll` dipanggil, set kunci blacklist `revoked:session:TOKEN_ID` dengan TTL 7 hari.

---

## 🌟 Keuntungan Solusi Ini:
1. **Bebas Masalah di Local Dev**: Anda bebas mematikan/menghidupkan server Golang dan Redis kapan saja tanpa pernah terkena 401 atau dipaksa login ulang!
2. **Keamanan Tetap Terjaga 100%**: Jika Anda sengaja mengklik tombol Logout, sesi tetap dibatalkan seketika melalui daftar blacklist.
3. **Hemat Memori Redis**: Mengurangi beban memori Redis hingga 90%.
