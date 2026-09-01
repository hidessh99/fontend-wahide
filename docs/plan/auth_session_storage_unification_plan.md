# 🧭 Analisis Arsitektur Senior Lead: Unifikasi Penyimpanan Autentikasi (Cookie vs LocalStorage)

Dokumen telaah teknis mengenai batas arsitektur runtime (*Edge Runtime Boundary vs Client React Runtime*), alasan mengapa ada dua media penyimpanan, dan rencana penyederhanaan (*streamlining*) untuk mengeliminasi duplikasi data.

---

## 🔍 1. Mengapa Terdapat Dua Lapisan Penyimpanan di Next.js?

Dalam arsitektur modern Next.js 16 (App Router + Edge Proxy), aplikasi beroperasi di dua lingkungan runtime yang berbeda:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. EDGE RUNTIME (Server Edge)                                               │
│    File   : src/proxy.ts                                                    │
│    Sifat  : Berjalan sebelum HTML dikirim ke browser.                       │
│    Akses  : HANYA BISA membaca HTTP Cookie (localStorage TIDAK ADA di Edge) │
│    Fungsi : Mencegah akses rute terlindungi dalam 0 milidetik (Anti-FOUC).  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. CLIENT RUNTIME (Browser React DOM)                                       │
│    File   : useAuth.ts (Zustand Store)                                      │
│    Sifat  : Berjalan di browser pengguna (React 19).                        │
│    Akses  : Membaca state reaktif instan dari Memory / LocalStorage.        │
│    Fungsi : Menyediakan data profil, nama tenant, dan kuota ke komponen UI. │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ 2. Hasil Audit: Apa yang Redundan dan Bisa Dihapus?

Setelah diaudit secara mendalam:

1. **Cookie `wahide_tenant_id` ADALAH 100% REDUNDAN**:
   * [`src/proxy.ts`](file:///G:/WEB2026/fontwahide/src/proxy.ts) hanya membutuhkan:
     * `wahide_session_token` (untuk validasi apakah user sudah login).
     * `wahide_user_role` (untuk memvalidasi apakah user adalah `SUPERADMIN`).
   * `src/proxy.ts` **SAMA SEKALI TIDAK PERNAH membaca cookie `wahide_tenant_id`**.
   * `HttpClient` juga sudah kita bersihkan dari header `X-Tenant-ID`.
2. **Duplikasi Data yang Tidak Perlu**:
   * Menyimpan `tenant_id` di Cookie terpisah membuat state berceceran tanpa ada consumer yang menggunakannya.

---

## ⚡ 3. Rencana Penyederhanaan (*Streamlined Single Responsibility*)

1. **Hapus Cookie `wahide_tenant_id`**:
   * Hapus `setCookie("wahide_tenant_id", ...)` pada fungsi `login()` di [`src/services/iam/hooks/useAuth.ts`](file:///G:/WEB2026/fontwahide/src/services/iam/hooks/useAuth.ts).
   * Hapus `deleteCookie("wahide_tenant_id")` pada fungsi `logout()` di `useAuth.ts`.

2. **Struktur Penyimpanan Akhir yang Sangat Rapi & Aman**:
   * **Cookie HTTP (Hanya 2 Token Esensial untuk Edge Proxy)**:
     1. `wahide_session_token` (Token sesi untuk izin masuk dashboard).
     2. `wahide_user_role` (Role user untuk izin masuk `/admin`).
   * **LocalStorage Zustand (Single Source of Truth untuk UI Client)**:
     * Objek state lengkap `{ token, user, tenant }` untuk reaktivitas UI instan.

3. **Verifikasi Quality Gates**:
   * Jalankan `bun x tsc --noEmit` (0 error).
   * Jalankan `bun run lint` (0 error, 0 warning).
