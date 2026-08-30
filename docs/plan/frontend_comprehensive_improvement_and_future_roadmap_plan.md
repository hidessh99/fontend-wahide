# 🚀 Dokumen Perencanaan Strategis: Peluang Peningkatan & Roadmap Produksi Frontend Wahide (`fontwahide`)

> **Disusun oleh**: Senior Next.js & React Enterprise Architect  
> **Status Proyek**: 100% Fitur REST API & Role RBAC Selesai  
> **Tujuan**: Menganalisis peluang peningkatan dari aspek Resiliensi Real-Time, Efisiensi Data Caching, Micro-UX B2B, Keamanan Jaringan, dan Kesiapan Observabilitas Skala Enterprise.  

---

## 📑 Daftar Isi
1. [Evaluasi Kesehatan Sistem Saat Ini (Baseline Assessment)](#1-evaluasi-kesehatan-sistem-saat-ini)
2. [Pilar 1: Resiliensi Streaming Real-Time (SSE & Heartbeat Backoff)](#2-pilar-1-resiliensi-streaming-real-time)
3. [Pilar 2: Lapisan Caching Data & Smart Invalidation (SWR Pattern)](#3-pilar-2-lapisan-caching-data--smart-invalidation)
4. [Pilar 3: Micro-UX & Command Palette Pintas (`Ctrl + K`)](#4-pilar-3-micro-ux--command-palette-pintas)
5. [Pilar 4: Keamanan Jaringan & Hardening `next.config.ts` (CSP & ReDoS Defense)](#5-pilar-4-keamanan-jaringan--hardening-nextconfigts)
6. [Pilar 5: Deteksi Koneksi Offline & Network Flakiness Banner](#6-pilar-5-deteksi-koneksi-offline--network-flakiness-banner)
7. [Pilar 6: Otomasi Pengujian Unit (Unit Test Suite Vitest / Bun:test)](#7-pilar-6-otomasi-pengujian-unit)
8. [Matriks Prioritas & Dampak (Impact vs Effort)](#8-matriks-prioritas--dampak)

---

## 1. Evaluasi Kesehatan Sistem Saat Ini

| Parameter Arsitektur | Kondisi Saat Ini | Status |
| :--- | :--- | :---: |
| **Cakupan API Backend** | 100% Endpoint REST API terintegrasi (9 domain service) | 🟢 Optimal |
| **Type-Safety TypeScript** | `bun x tsc --noEmit` = 0 Error | 🟢 Optimal |
| **Kepatuhan Linter** | `bun run lint` = 0 Error, 0 Warning | 🟢 Optimal |
| **Diferensiasi Role (RBAC)** | Terintegrasi dengan Go Backend (`admin`, `seller`, `user`) | 🟢 Optimal |
| **Pencegahan Crash** | Segmented React Error Boundary terpasang di semua modul | 🟢 Optimal |
| **Desain & UI/UX** | Wise-Inspired Design Tokens (0 Emoji, Canonical CSS) | 🟢 Optimal |

---

## 2. Pilar 1: Resiliensi Streaming Real-Time

### 🔍 Analisis Kebutuhan:
Saat browser melakukan pairing QR WhatsApp melalui Server-Sent Events (SSE) di jaringan seluler yang tidak stabil (3G/4G fluktuatif), koneksi TCP berpotensi terputus tiba-tiba tanpa memicu event `error` standar.

### 💡 Rekomendasi Peningkatan:
1. **Exponential Backoff Reconnection**: Jika koneksi SSE terputus, coba hubungkan ulang secara otomatis dengan jeda eksponensial (1s ➔ 2s ➔ 4s ➔ 8s) maksimal 5 percobaan.
2. **Heartbeat Timeout Watchdog**: Jika tidak ada frame heartbeat dari backend selama 15 detik, anggap koneksi *stale* dan segarkan koneksi secara mulus.
3. **Status Banner Disconnected**: Menampilkan indikator visual kecil jika node WhatsApp sedang dalam status *reconnecting*.

---

## 3. Pilar 2: Lapisan Caching Data & Smart Invalidation

### 🔍 Analisis Kebutuhan:
Saat ini, setiap kali pengguna berpindah tab SPA (misal dari `/devices` ke `/contacts` lalu kembali ke `/devices`), komponen memanggil `fetchDevices()` ulang ke server.

### 💡 Rekomendasi Peningkatan:
1. **Stale-While-Revalidate (SWR) In-Memory Cache**:
   - Menampilkan data instan dari memori (*0ms render latency*), sementara request background memperbarui data jika sudah lewat masa *freshness* (misal > 30 detik).
2. **Optimistic UI Updates pada Aksi Cepat**:
   - Saat pengguna menghapus kontak atau meng-hibernasi sesi WhatsApp, ubah status di UI secara instan dalam 0ms, lalu lakukan sinkronisasi mutasi ke backend di background (dengan auto-rollback jika server merespons error).

---

## 4. Pilar 3: Micro-UX & Command Palette Pintas (`Ctrl + K`)

### 🔍 Analisis Kebutuhan:
Pengguna enterprise (operator CS dan admin) sering bekerja dengan banyak tab dan ratusan nomor kontak setiap hari. Berpindah halaman menggunakan mouse dapat memperlambat efisiensi kerja.

### 💡 Rekomendasi Peningkatan:
1. **Global Command Palette (`Ctrl + K` / `Cmd + K`)**:
   - Dialog pencarian instan yang memungkinkan pengguna mengetik perintah: *"Kirim Pesan"*, *"Cari Kontak Budi"*, *"Buka Slot WA Node 1"*, *"Top Up Deposit"*.
2. **Pintasan Keyboard Global**:
   - `N` ➔ Buka modal Kirim Pesan Cepat.
   - `?` ➔ Buka panduan tombol pintas.
   - `Esc` ➔ Tutup modal atau drawer navigasi.

---

## 5. Pilar 4: Keamanan Jaringan & Hardening `next.config.ts`

### 🔍 Analisis Kebutuhan:
Frontend memerlukan perlindungan ekstra terhadap serangan *Clickjacking*, *XSS via script injection*, dan *Regular Expression Denial of Service (ReDoS)* pada generator Spintax.

### 💡 Rekomendasi Peningkatan:
1. **Injeksi Content Security Policy (CSP) & HSTS di `next.config.ts`**:
   - Membatasi domain asal iframe, skrip eksternal, dan koneksi API hanya ke `api.wahide.com` dan Cloudflare Turnstile.
2. **ReDoS Defense pada Spintax Regex Parser**:
   - Membatasi kedalaman nesting Spintax template (`{Halo|Hai|{Selamat Pagi|Pagi}}`) maksimal 3 level untuk mencegah konsumsi CPU berlebih pada client browser.

---

## 6. Pilar 5: Deteksi Koneksi Offline & Network Flakiness Banner

### 🔍 Analisis Kebutuhan:
Jika laptop pengguna kehilangan koneksi internet saat sedang mengunggah file CSV 10.000 kontak atau saat mengonfigurasi broadcast, tombol submit dapat tampak menggantung (*hanging*).

### 💡 Rekomendasi Peningkatan:
1. **Online/Offline Event Listener (`navigator.onLine`)**:
   - Menampilkan *floating bar* non-intrusif di bagian atas dasbor: *"Koneksi internet Anda terputus. Aksi mutasi dijeda sementara."*
2. **Pencegahan Form Submit saat Offline**:
   - Otomatis men-disable tombol submit saat offline untuk mencegah request gagal yang tidak perlu.

---

## 7. Pilar 6: Otomasi Pengujian Unit (Unit Test Suite)

### 🔍 Analisis Kebutuhan:
Memastikan fungsi utilitas logika murni (*pure algorithmic logic*) memiliki pengujian otomatis (*Unit Testing*) yang dieksekusi di CI/CD pipeline.

### 💡 Rekomendasi Peningkatan:
1. **Pengujian Spintax Engine**: Verifikasi variasi kata terdistribusi secara merata dan tidak menghasilkan sintaks kurung kurawal bocor.
2. **Pengujian CSV Formula Sanitizer**: Memastikan karakter berbahaya (`=`, `+`, `-`, `@`) selalu dinetralkan dengan apostrof (`'`).
3. **Pengujian Role Normalizer**: Memastikan fungsi `isAdmin()`, `isSeller()`, dan `isUserAgent()` lolos uji variasi huruf dan alias database.

---

## 8. Matriks Prioritas & Dampak (Impact vs Effort)

| Peningkatan | Dampak Bisnis | Tingkat Kesulitan | Rekomendasi Status |
| :--- | :---: | :---: | :---: |
| **1. CSP Security Headers di `next.config.ts`** | 🔴 Tinggi (Keamanan) | 🟢 Rendah (1 Berkas) | **Prioritas 1 (Rekomendasi Utama)** |
| **2. Offline / Disconnected Network Banner** | 🟡 Sedang (UX Resiliensi) | 🟢 Rendah (1 Hook) | **Prioritas 2** |
| **3. Command Palette (`Ctrl + K`)** | 🟡 Sedang (Ergonomi Pro) | 🟡 Sedang (1 Dialog) | **Prioritas 3** |
| **4. SSE Heartbeat & Exponential Backoff** | 🔴 Tinggi (Stabilitas WA) | 🟡 Sedang (Refactor Hook) | **Prioritas 4** |
| **5. Unit Test Suite (Vitest / Bun:test)** | 🔴 Tinggi (Kualitas CI/CD) | 🟡 Sedang (Test Files) | **Prioritas 5** |
| **6. Optimistic UI Updates** | 🟢 Rendah-Sedang (Kecepatan) | 🔴 Tinggi (State Sync) | **Fase Lanjutan** |
