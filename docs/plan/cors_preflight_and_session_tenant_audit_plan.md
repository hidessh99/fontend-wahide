# 🧭 Analisis & Rencana Perbaikan: Audit CORS Preflight & Manajemen `tenantId` Berbasis Session

Dokumen investigasi mendalam mengenai akar penyebab CORS error pada dashboard (`http://localhost:3030/api/v1/*`), hasil audit referensi Postman API (`G:\WEB2026\postman-wahide copy`), dan rencana perbaikan eliminasi header non-standar `X-Tenant-ID`.

---

## 🔍 1. Hasil Audit & Investigasi Akar Masalah (Root Cause)

### A. Mengapa Terjadi Error CORS pada Tangkapan Layar Browser?
* **Pesan Error di Console**:
  ```text
  Access to fetch at 'http://localhost:3030/api/v1/campaigns' from origin 'http://localhost:3000'
  has been blocked by CORS policy: Request header field x-tenant-id is not allowed by
  Access-Control-Allow-Headers in preflight response.
  ```
* **Penyebab Utama**:
  1. Pada [`src/lib/api/http-client.ts`](file:///G:/WEB2026/fontwahide/src/lib/api/http-client.ts) (baris 145–147), `HttpClient` secara otomatis menyisipkan header kustom:
     ```ts
     if (activeTenant) {
       defaultHeaders["X-Tenant-ID"] = activeTenant;
     }
     ```
  2. Saat browser melakukan panggilan cross-origin (`localhost:3000` ke backend Go `localhost:3030`), browser mengirimkan preflight `OPTIONS` request.
  3. Middleware CORS pada backend Go hanya mengizinkan header standar (`Authorization`, `Content-Type`, `Accept`, `X-Requested-With`). Karena `X-Tenant-ID` tidak ada di daftar `Access-Control-Allow-Headers`, browser memblokir seluruh request API.

---

### B. Hasil Audit Referensi Postman API (`G:\WEB2026\postman-wahide copy`)
Berdasarkan pemeriksaan seluruh koleksi OpenAPI dan Postman resmi:
1. **Autentikasi & Multi-Tenancy Murni JWT Bearer**:
   * Seluruh endpoint (`/api/v1/wa/devices`, `/api/v1/campaigns`, `/api/v1/contacts`, `/api/v1/subscription`, dll.) hanya menggunakan header standar:
     ```http
     Authorization: Bearer <jwt_access_token>
     Content-Type: application/json
     Accept: application/json
     ```
   * Backend Go secara otomatis mengekstrak `tenant_id` dan `user_id` langsung dari klaim payload JWT Token (`claims["tenant_id"]`).
2. **Tidak Ada Kebutuhan Header `X-Tenant-ID`**:
   * Header `X-Tenant-ID` sama sekali tidak pernah didefinisikan atau dibutuhkan di spesifikasi API backend.

---

### C. Manajemen `tenantId` di Frontend (Session & Local Storage)
* Informasi Tenant (`id`, `name`, `slug`, `tier`, `quota`) telah diterima saat pengguna berhasil login (`POST /api/v1/auth/login`) dan disimpan secara persisten di:
  1. **Zustand Store (`wahide_auth_storage`)** di `localStorage`.
  2. **Cookie Session (`wahide_tenant_id`)** untuk Edge Proxy (`src/proxy.ts`).
* Komponen UI frontend (Header, Sidebar, Settings, Billing) sudah membaca data tenant secara langsung dari store lokal (`useAuth((s) => s.tenant)`), sehingga **tidak perlu dan tidak boleh mengirim header `X-Tenant-ID` ke backend**.

---

## ⚡ 2. Rencana Implementasi & Solusi

1. **Pembersihan `src/lib/api/http-client.ts`**:
   * Hapus penyisipan header `X-Tenant-ID` pada `defaultHeaders`.
   * Hapus method `getActiveTenantId()` yang tidak diperlukan.
   * Pastikan `HttpClient` hanya menyertakan header standar (`Authorization: Bearer <token>`, `Content-Type: application/json`, `Accept: application/json`).

2. **Dampak Perbaikan**:
   * Menghilangkan 100% penolakan CORS Preflight pada seluruh rute API (`/campaigns`, `/devices`, `/subscription`, `/contacts`, `/support`, dll.).
   * Request API langsung lolos dan data dashboard langsung termuat seketika.

3. **Verifikasi Quality Gates**:
   * Jalankan `bun x tsc --noEmit` (0 error).
   * Jalankan `bun run lint` (0 error, 0 warning).
