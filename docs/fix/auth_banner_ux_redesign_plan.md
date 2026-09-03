# 🎨 PLAN LENGKAP: Redesain UI/UX Banner Halaman Auth (Login, Register & Forgot Password)
**Target Scope:** `G:\WEB2026\fontwahide`  
**Author:** System Design Lead & Senior UI/UX Architect  
**Objective:** Mengubah banner teknis yang kaku dan tidak relevan pada halaman Login & Register menjadi copywriting yang kontekstual, manusiawi, elegan, dan berorientasi pada nilai bisnis pelanggan.

---

## 🧐 1. Analisis Kritis UI/UX (Masalah pada Halaman Saat Ini)

### ❌ Masalah Saat Ini:
1. **Ketidakcocokan Konteks (*Contextual Mismatch*):**
   - Di halaman Login (`/login`), pengguna melihat tulisan:
     > *"WhatsApp Gateway tanpa batas memori. Platform SaaS WhatsApp Multi-Tenant & Multi-Device berkinerja tinggi dengan Session Hibernation, 5 Lapis Anti-Ban, dan arsitektur Go Microservices."*
   - **Kritik UI/UX:** Teks ini adalah **pitch teknis developer backend**, bukan pesan untuk orang yang ingin login! Pengguna yang mau login adalah pemilik bisnis atau staf customer service yang ingin segera masuk untuk bekerja. Mereka tidak peduli arsitektur Go Microservices atau Session Hibernation apa yang ada di balik layar.
2. **Banner Statis & Monoton (Sama Persis di Semua Halaman):**
   - Halaman Login, Register, dan Forgot Password menampilkan teks banner kiri yang sama persis tanpa ada perbedaan nuansa.
3. **Tulisan Terlalu Panjang & Membosankan:**
   - Paragraf terlalu padat, menggunakan istilah teknis yang berat, dan tidak memberikan dorongan emosional yang tepat bagi pengguna.

---

## 💡 2. Konsep Solusi UI/UX: Copywriting Kontekstual & Diferensiasi Halaman

Sebagai Senior UI/UX Designer, setiap halaman autentikasi memiliki **tujuan psikologis pengguna yang berbeda**:

```
┌─────────────────────────┬──────────────────────────────────┬─────────────────────────────────┐
│ Halaman                 │ Psikologi Pengguna               │ Nada Pesan Banner yang Tepat    │
├─────────────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ 🔐 Login (/login)       │ Ingin segera masuk & bekerja     │ Produktivitas, Keandalan, Aman  │
│ 🚀 Register (/register) │ Calon pelanggan mengevaluasi     │ Nilai Bisnis, Mudah, Anti-Blokir│
│ 🔑 Forgot Password      │ Pengguna butuh kepastian         │ Keamanan Akun, Cepat & Terlindungi│
└─────────────────────────┴──────────────────────────────────┴─────────────────────────────────┘
```

---

### ✍️ Rancangan Redaksi Copywriting Baru:

#### 1. Untuk Halaman Login (`/login`):
* **Badge:** `"PORTAL BISNIS RESMI"`
* **Headline:** `"Kelola pesan pelanggan tanpa hambatan."`
* **Subheadline:** `"Pantau antrean broadcast, kelola multi-perangkat WhatsApp, dan pastikan komunikasi bisnis Anda berjalan lancar 24/7."`
* **Tag Footer:** `"Sistem Siap Operasi • Uptime 99.9%"`
* **Kelebihan:** Terasa sangat profesional, menyambut staf/seller yang ingin langsung produktif bekerja.

#### 2. Untuk Halaman Register (`/register`):
* **Badge:** `"FREE TRIAL 1.500 PESAN"`
* **Headline:** `"Tumbuhkan bisnis dengan WhatsApp Gateway."`
* **Subheadline:** `"Kirim ribuan notifikasi otomatis dan broadcast massal dengan proteksi anti-ban terdepan. Siap dalam 5 menit tanpa kartu kredit."`
* **Tag Footer:** `"Setup 5 Menit • Enkripsi End-to-End"`
* **Kelebihan:** Memberikan keyakinan instan, mengurangi keraguan calon pembeli, dan menonjolkan fitur unggulan secara manusiawi.

#### 3. Untuk Halaman Lupa Password (`/forgot-password`):
* **Badge:** `"PEMULIHAN AKUN"`
* **Headline:** `"Akses aman ke seluruh data bisnis Anda."`
* **Subheadline:** `"Sistem verifikasi terenkripsi memastikan aset akun dan kontak pelanggan Anda tetap terlindungi setiap saat."`

---

## 🛠️ 3. Rencana Eksekusi Teknis

1. **[MODIFY] [`src/locales/id/auth.json`](file:///g:/WEB2026/fontwahide/src/locales/id/auth.json)**:
   - Tambahkan struktur banner kontekstual untuk `login`, `register`, dan `forgotPassword`.
2. **[MODIFY] [`src/locales/en/auth.json`](file:///g:/WEB2026/fontwahide/src/locales/en/auth.json)**:
   - Tambahkan teks versi bahasa Inggris yang sepadan dan profesional.
3. **[MODIFY] [`src/app/(auth)/login/page.tsx`](file:///g:/WEB2026/fontwahide/src/app/(auth)/login/page.tsx)**:
   - Meneruskan props banner login ke `<AuthLayout>`.
4. **[MODIFY] [`src/app/(auth)/register/page.tsx`](file:///g:/WEB2026/fontwahide/src/app/(auth)/register/page.tsx)**:
   - Meneruskan props banner register ke `<AuthLayout>`.
5. **[MODIFY] [`src/app/(auth)/forgot-password/page.tsx`](file:///g:/WEB2026/fontwahide/src/app/(auth)/forgot-password/page.tsx)**:
   - Meneruskan props banner forgot-password ke `<AuthLayout>`.
6. **[MODIFY] [`src/components/layout/auth/AuthBanner.tsx`](file:///g:/WEB2026/fontwahide/src/components/layout/auth/AuthBanner.tsx)**:
   - Dukung footer tag dinamis agar teks footer kiri selaras dengan konteks halaman.

---

## 🔍 4. Verifikasi Kualitas
- Uji TypeScript compiler: `bun x tsc --noEmit` $\to$ **0 errors**.
- Uji Linter: `bun run lint` $\to$ **0 errors, 0 warnings**.
- Buka `http://localhost:3000/login` $\to$ banner kiri menampilkan pesan produktivitas bisnis yang elegan.
- Buka `http://localhost:3000/register` $\to$ banner kiri menampilkan ajakan nilai tambah uji coba gratis.
- **PENTING:** Perintah `bun run build` TIDAK AKAN DIJALANKAN sesuai arahan Anda.
