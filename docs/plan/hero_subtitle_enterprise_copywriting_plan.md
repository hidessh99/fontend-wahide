# 🧭 Rencana Arsitektur & Pelaksanaan: Pembaruan Copywriting Hero Subtitle Landing Page

> **Tujuan**: Menyelaraskan teks deskripsi utama (*Hero Subtitle*) pada halaman landing (`http://localhost:3000/`) agar berorientasi pada fungsionalitas bisnis enterprise (Chatbot, Customer Service, Notifikasi Otomatis, Broadcast Kampanye, Pengiriman Media, dan Manajemen Kontak) menggantikan klaim teknis konsumsi memori.

---

## 📑 Rincian Perubahan Copywriting

### 1. 🇮🇩 Bahasa Indonesia (`src/locales/id/common.json`)
* **Teks Sebelumnya**:
  > *"Gateway WhatsApp multi-device tercepat dengan 5 Lapis Anti-Ban, Spintax dinamis, rotasi load-balancing nomor, dan konsumsi memori 95% lebih hemat berbasis Go Microservices."*

* **Teks Baru yang Diterapkan**:
  > *"Gateway WhatsApp multi-device tercepat dengan 5 Lapis Anti-Ban, Spintax dinamis, dan rotasi load-balancing nomor. Mendukung berbagai aplikasi berbasis WhatsApp, termasuk chatbot, sistem layanan pelanggan, notifikasi otomatis, dan kampanye pesan massal. Platform ini menawarkan fitur lengkap untuk mengirim pesan teks, gambar, serta file media, sekaligus mengelola daftar kontak secara efisien."*

---

### 2. 🇬🇧 English (`src/locales/en/common.json`)
* **Teks Sebelumnya**:
  > *"Fastest multi-device WhatsApp gateway powered by 5-Layer Anti-Ban, dynamic Spintax, load-balanced device rotation, and 95% lower memory footprint with Go Microservices."*

* **Teks Baru yang Diterapkan**:
  > *"Fastest multi-device WhatsApp gateway powered by 5-Layer Anti-Ban, dynamic Spintax, and load-balanced device rotation. Supports diverse WhatsApp-based workflows including chatbots, customer service systems, automated alerts, and broadcast campaigns with full support for text, media files, and efficient contact management."*

---

## 🗺️ Rencana Pelaksanaan (3 Langkah):

1. **Langkah 1: Pembaruan Kamus Bahasa Indonesia (`id/common.json`)**:
   * Perbarui key `hero.subtitle`.
2. **Langkah 2: Pembaruan Kamus Bahasa Inggris (`en/common.json`)**:
   * Perbarui key `hero.subtitle`.
3. **Langkah 3: Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` & `bun run lint` (0 error & 0 warning).

---

## 🔍 Verifikasi Tampilan & Tipografi
* Memastikan tata letak hero di [`HomeView.tsx`](file:///G:/WEB2026/fontwahide/src/components/home/HomeView.tsx) memiliki keterbacaan (*readability*) yang nyaman di layar ponsel (sm), tablet (md), dan desktop (lg/xl) tanpa pergeseran tata letak yang janggal (*layout shift*).
