# 🧭 Rencana & Panduan: Penerapan Opsi A (Keamanan Maksimal: Hybrid Stateful JWT + Redis) Bebas Bug di Local Development & Production

Panduan arsitektur dan standardisasi teknis untuk memastikan **Opsi A (Keamanan Maksimal: Dual-Layer JWT + Redis Session Revocation)** beroperasi 100% andal, stabil, dan bebas bug di lingkungan local development maupun production.

---

## 🔍 1. Mengapa Opsi A adalah Standar Terbaik?

### Keunggulan Keamanan:
1. **Pencabutan Sesi Instan (*Instant Revocation*)**:
   * Saat user melakukan logout, ganti password, atau klik *"Keluar dari Semua Perangkat Lain"*, token langsung hangus seketika di Redis.
   * Mencegah pencurian token (token replay attack) yang sering terjadi pada pure stateless JWT.
2. **Sinkronisasi Masa Aktif 7 Hari**:
   * Masa berlaku JWT (Layer Kriptografi): **7 Hari**.
   * Masa berlaku Kunci Redis `session:{user_id}:{token_id}`: **7 Hari**.
   * Keduanya berjalan sinkron dan serempak (*lockstep lifecycle*).

---

## 🛠️ 2. Rencana Jaminan Bebas Bug di Local Development

Agar Opsi A berjalan mulus di localhost tanpa false-positive logout:

### 📌 1. Debounce 401 Redirect Lock di Frontend ([`http-client.ts`](file:///G:/WEB2026/fontwahide/src/lib/api/http-client.ts))
* Mencegah balapan (*race condition*) ketika beberapa komponen me-request API secara paralel (misal `/profile`, `/stats`, `/devices`).
* Tambahkan flag atomic `isRedirectingToLogin` agar browser hanya melakukan redirect 1x secara anggun.

### 📌 2. Pembersihan Total Sesi Saat Redirect ([`LoginForm.tsx`](file:///G:/WEB2026/fontwahide/src/services/iam/components/LoginForm.tsx))
* Halaman login langsung menyapu seluruh cookie dan me-reset memori Zustand begitu mendeteksi `session_expired=1`.
* Pengguna cukup memasukkan email & password, lalu langsung mendapatkan JWT + Kunci Redis baru yang valid 7 hari penuh.

### 📌 3. Rekomendasi Local Redis Persistence
* Di lingkungan development, jalankan Redis dengan konfigurasi standar atau persistent container (RDB snapshot aktif) sehingga mematikan laptop / restart tidak menghapus sesi aktif.

---

## 📄 Dokumen Perencanaan Tersimpan:
👉 [**`G:\WEB2026\fontwahide\docs\plan\stateful_jwt_security_option_a_plan.md`**](file:///G:/WEB2026/fontwahide/docs/plan/stateful_jwt_security_option_a_plan.md)
