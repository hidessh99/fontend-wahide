# ⚡ RENCANA IMPLEMENTASI: Streaming Skeletons & Global Offline Banner
**Target Scope:** `G:\WEB2026\fontwahide\src`  
**Author:** Lead Programmer & System Design Senior Architect  
**Objective:** Mengangkat standar UX & reliabilitas aplikasi Wahide menuju standar enterprise global (setara Stripe & Linear).

---

## 🎯 1. Latar Belakang & Masalah yang Diselesaikan

| Fitur | Masalah Saat Ini | Solusi Standar Enterprise |
| :--- | :--- | :--- |
| **Streaming Skeletons (`loading.tsx`)** | Saat berpindah rute (misal `/dashboard` $\to$ `/contacts`), ada jeda hening 0.5–1 detik sebelum halaman baru muncul. Pengguna sering merasa tombolnya belum tertekan dan melakukan klik berulang kali. | **0ms Instant Feedback**: Next.js 16 langsung menampilkan kerangka (*skeleton shimmer*) seketika saat menu diklik, sebelum data dan kode selesai dimuat. |
| **Global Offline Banner (`NetworkStatusBanner`)** | Jika koneksi Wi-Fi/data kantor pengguna putus, aksi pengguna gagal dengan pesan error merah. Pengguna menyangka server Wahide yang bermasalah. | **Real-Time Network Awareness**: Bilah notifikasi cerdas melayang di atas layar saat offline, memberi tahu pengguna secara jujur bahwa jaringan mereka terputus, dan otomatis memberi tahu saat pulih. |

---

## 🛠️ 2. Rincian Teknis & Arsitektur File

### Fase 1: Streaming Skeletons di Next.js App Router

#### 1.1 Komponen Reusable: `src/components/layout/shared/DashboardPageSkeleton.tsx`
Membuat siluet kerangka antarmuka yang presisi menyerupai halaman dasbor Wahide:
- **Header Skeleton**: Baris judul tebal (`h-8 w-48`), deskripsi (`h-4 w-72`), dan tombol aksi pil (`h-9 w-28`).
- **Metric Cards Skeleton**: Grid 4 kolom kartu metrik (`h-24 rounded-md border border-border bg-surface`) dengan efek shimmer berdenyut halus (`animate-pulse`).
- **Filter Toolbar Skeleton**: Kolom input pencarian dan tombol filter.
- **Table Rows Skeleton**: 6 baris tabel dengan tinggi dan lebar bervariasi menyerupai baris data riil.

#### 1.2 Implementasi di Rute Dasbor Klien: `src/app/(dashboard)/loading.tsx`
Mengaktifkan React 19 Streaming SSR otomatis untuk semua sub-rute seller:
- `/dashboard`
- `/devices`
- `/contacts`
- `/campaigns`
- `/billing`
- `/subscription`
- `/activities`
- `/settings`
- `/support`

#### 1.3 Implementasi di Rute Superadmin: `src/app/admin/loading.tsx`
Mengaktifkan React 19 Streaming SSR otomatis untuk semua sub-rute admin:
- `/admin`
- `/admin/users`
- `/admin/devices`
- `/admin/messages`
- `/admin/billing`
- `/admin/plans`
- `/admin/subscriptions`
- `/admin/notifications`
- `/admin/activities`

---

### Fase 2: Global Offline Resilience Banner

#### 2.1 Hook Deteksi Jaringan: `src/hooks/useOnlineStatus.ts`
- Mendengarkan event bawaan browser: `window.addEventListener("online")` dan `window.addEventListener("offline")`.
- Membaca status awal `navigator.onLine`.
- Menyediakan status transisi `wasOffline`: saat internet kembali tersambung, banner tetap menampilkan pesan hijau sukses selama 3.5 detik sebelum menghilang secara halus (*smooth slide-up*).

#### 2.2 Komponen Bilah Jaringan: `src/components/layout/shared/NetworkStatusBanner.tsx`
- Desain *floating bar* dengan z-index tertinggi (`fixed top-0 inset-x-0 z-50`).
- **Kondisi Offline**:
  - Warna: Oranye / Rose tegas (`bg-amber-600 dark:bg-rose-900 text-white`).
  - Ikon: `WifiOff` (Lucide icon).
  - Teks: *"Koneksi internet Anda terputus. Menunggu koneksi kembali..."*.
- **Kondisi Reconnected (Pulih)**:
  - Warna: Hijau Emerald (`bg-emerald-600 dark:bg-emerald-900 text-white`).
  - Ikon: `Wifi` (Lucide icon).
  - Teks: *"Koneksi internet pulih. Menyinkronkan data..."*.
  - Animasi: Menghilang otomatis setelah 3.5 detik.

#### 2.3 Pemasangan Global: `src/app/layout.tsx`
- Dipasang di dalam `<Providers>` pada level `RootLayout`.
- Melindungi seluruh area aplikasi: Halaman Publik, Halaman Auth (Login/Register), Dasbor Klien, dan Portal Superadmin.

---

## 🔍 3. Rencana Pengujian & Verifikasi Kualitas

1. **TypeScript Type Safety**: `bun x tsc --noEmit` $\to$ **0 errors**.
2. **ESLint Static Analysis**: `bun run lint` $\to$ **0 errors, 0 warnings**.
3. **Production Build Turbopack**: `bun run build` $\to$ **38/38 static & dynamic routes compiled successfully**.
4. **Simulasi Offline Manual**:
   - Di Chrome DevTools $\to$ Tab Network $\to$ Ubah dropdown Throttling menjadi **"Offline"**.
   - Banner oranye langsung muncul seketika di bagian atas layar.
   - Kembalikan ke **"Online"** $\to$ Banner berubah menjadi hijau selama 3 detik lalu menghilang dengan mulus.
5. **Simulasi Streaming Skeleton**:
   - Berpindah menu dari Dasbor ke Kontak / Billing pada simulasi koneksi "Slow 4G" di DevTools.
   - Layar langsung menampilkan skeleton shimmer dalam 0ms tanpa ada layar beku atau flash putih.
