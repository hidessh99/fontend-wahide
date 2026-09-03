# 📋 MASTER PLAN (REVISI): Alur Konfirmasi Reset Password Murni di Frontend (Zero Backend Change)
**Target Scope:** `G:\WEB2026\fontwahide\src` (Frontend Saja — Backend Go Tetap Asli Tanpa Ubahan)  
**Author:** System Design Lead & Senior UI/UX Architect  
**Objective:** Mengimplementasikan alur konfirmasi reset password yang mulus di frontend: Pengguna memasukkan email di `/forgot-password` $\to$ diarahkan langsung ke halaman `/reset-password` $\to$ pengguna memasukkan token dari email dan kata sandi baru $\to$ berhasil reset dan login.

---

## 💡 1. Konsep Desain UI/UX (Pure Frontend Flow)

Sesuai arahan Anda, **backend Go tidak perlu diubah sama sekali**. Token yang dikirim backend ke email pengguna sudah cukup. Frontend akan menangani seluruh transisi halaman secara elegan:

```
┌───────────────────────────────┐
│ 1. Halaman /forgot-password   │
│ Pengguna memasukkan Email     │
│ Klik "Kirim Instruksi Reset"  │
└──────────────┬────────────────┘
               │ (Backend mengirim Token ke Email)
               ▼
┌───────────────────────────────┐
│ Notifikasi Sukses Kilat       │
│ "Token telah dikirim!..."     │
└──────────────┬────────────────┘
               │ (Otomatis diarahkan dalam 1.5 detik atau klik tombol)
               ▼
┌───────────────────────────────┐
│ 2. Halaman /reset-password    │
│ Menampilkan info email tujuan │
│ Kolom 1: Token Verifikasi     │ ◄── Pengguna copy-paste Token dari inbox
│ Kolom 2: Password Baru        │
│ Kolom 3: Konfirmasi Password  │
│ Klik "Simpan Password Baru"   │
└──────────────┬────────────────┘
               │ (Memanggil POST /api/v1/auth/reset-password)
               ▼
┌───────────────────────────────┐
│ 3. Sukses & Redirect ke Login │
│ "Password berhasil diubah!"   │ ──► Redirect ke /login
└───────────────────────────────┘
```

---

## 🛠️ 2. Rincian Implementasi di Frontend (`fontwahide`)

### 1. Kamus Bahasa Multi-Bahasa (`id/auth.json` & `en/auth.json`)
Menambahkan kunci penerjemahan lengkap untuk form konfirmasi:
- **Judul:** `"Konfirmasi Reset Password"`
- **Deskripsi:** `"Masukkan token verifikasi yang dikirim ke email Anda dan buat kata sandi baru."`
- **Label Token:** `"Token Verifikasi"`
- **Placeholder Token:** `"Tempel token dari email (contoh: a1b2c3d4-...)"`
- **Label Password Baru:** `"Password Baru (Minimal 8 Karakter)"`
- **Label Konfirmasi:** `"Konfirmasi Password Baru"`
- **Tombol Submit:** `"Simpan & Perbarui Password"`
- **Pesan Sukses:** `"Password berhasil diperbarui! Mengalihkan ke halaman login..."`
- **Link Kembali/Kirim Ulang:** `"Belum menerima token? Kirim ulang di sini"`

---

### 2. Komponen Form: `ResetPasswordForm.tsx`
- **File Baru:** `src/modules/iam/components/auth/ResetPasswordForm.tsx`
- **Fitur Canggih & Ramah Pengguna:**
  - **Email Hint Badge:** Jika ada parameter `?email=...`, tampilkan kotak info: *"Token verifikasi telah dikirim ke **[email]**. Silakan periksa inbox/spam Anda."*
  - **Token Input:** Kolom teks bergaya modern dengan ikon kunci, siap menerima paste token UUID dari email.
  - **Password Visibility Toggle:** Ikon mata (*Eye / EyeOff*) pada password baru dan konfirmasi password.
  - **Validasi Zod:** Memastikan token terisi, password minimal 8 karakter, dan konfirmasi password cocok sebelum dikirim ke server.
  - **Integrasi API:** Memanggil `authApi.resetPassword({ token, password })`.
  - **Auto Redirect:** Menampilkan alert hijau sukses dan otomatis berpindah ke `/login` dalam 2 detik.

---

### 3. Halaman Rute Next.js 16: `reset-password/page.tsx`
- **File Baru:** `src/app/(auth)/reset-password/page.tsx`
- Menggunakan `AuthLayout` dengan visual banner pemulihan akun yang sudah ada.
- Dibungkus dengan `<Suspense fallback={<DashboardSkeleton />}>` agar terhindar dari CSR bailout Next.js 16 saat membaca parameter URL.

---

### 4. Menghubungkan Halaman `ForgotPasswordForm.tsx`
- **File:** `src/modules/iam/components/auth/ForgotPasswordForm.tsx`
- Begitu API `forgotPassword` berhasil:
  1. Tampilkan pesan sukses.
  2. Tampilkan tombol tegas: **"Lanjut Masukkan Token Sekarang →"**.
  3. Otomatis alihkan (*auto-redirect*) ke `/reset-password?email=` + `email` setelah 1.5 detik.
- Di bawah kolom input:
  - Tambahkan link: *"Sudah memiliki token verifikasi? Masukkan token di sini"* $\to$ menuju ke `/reset-password`.

---

### 5. Penyesuaian `auth.api.ts`
- **File:** `src/modules/iam/api/auth.api.ts`
- Pastikan payload yang dikirim ke `POST /auth/reset-password` persis sesuai DTO Go backend:
  ```ts
  resetPassword: async (payload: ResetPasswordInput): Promise<{ message: string }> => {
    const res = await httpClient.post(`${IAM_BASE}/auth/reset-password`, {
      token: payload.token,
      password: payload.password,
    });
    return { message: res.message || "Password berhasil diatur ulang." };
  },
  ```

---

## 🔍 3. Rencana Verifikasi & Quality Gates

| Pengujian | Perintah | Target Hasil |
| :--- | :--- | :--- |
| **TypeScript Type Checking** | `bun x tsc --noEmit` | **0 errors** |
| **ESLint Static Analysis** | `bun run lint` | **0 errors, 0 warnings** |
| **Build Check** | *Ditahan sesuai instruksi Anda* | *Tidak dijalankan* |
| **Uji Alur Manual** | Browser `http://localhost:3000` | Input email di `/forgot-password` $\to$ langsung diarahkan ke `/reset-password` $\to$ form siap menerima token dan password baru. |
