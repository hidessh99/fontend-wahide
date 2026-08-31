# 🧭 Rencana Arsitektur & Pelaksanaan: Penghapusan Section Perbandingan Arsitektur Teknis

> **Tujuan**: Menghapus section perbandingan tabel arsitektur teknis (*"Mengapa Wahide Lebih Unggul dari Gateway Lain?"* / `id="architecture"`) pada landing page (`http://localhost:3000/`) agar alur narasi produk lebih ringkas, padat, berfokus langsung pada nilai tambah bisnis (*value proposition*), fitur enterprise, dan paket harga.

---

## 📑 Rincian Perubahan yang Akan Dilakukan

### 1. 🗑️ Berkas yang Disesuaikan

#### A. Komponen Halaman Beranda ([`HomeView.tsx`](file:///G:/WEB2026/fontwahide/src/components/home/HomeView.tsx))
* **Dihapus**: Bagian `<section id="architecture" ...>...</section>` (Tabel komparasi teknis vs Chromium/Puppeteer).
* **Alur Baru Landing Page**:
  1. ⚡ **Hero Section & 4 Kartu Metrik Performa**
  2. 📱 **WhatsApp Message Simulator**
  3. 🧪 **Anti-Ban Spintax Live Playground**
  4. 💻 **Developer First & REST API Code Sandbox**
  5. 🏢 **9 Pilar Fitur Enterprise**
  6. 💳 **Tabel 3-Tier Paket Harga** (Starter Rp 0, Pro Rp 10.000, Enterprise Rp 50.000)
  7. ❓ **FAQ Accordion**
  8. 🚀 **Final High-Impact CTA Banner**

---

## 🗺️ Roadmap Pelaksanaan (2 Langkah)

1. **Langkah 1**: Menghapus blok JSX `<section id="architecture">` dari [`HomeView.tsx`](file:///G:/WEB2026/fontwahide/src/components/home/HomeView.tsx).
2. **Langkah 2**: Menjalankan pengujian Quality Gates: `bun x tsc --noEmit` & `bun run lint` (0 error & 0 warning).

---

## 🔍 Verifikasi Tampilan
* Memeriksa transisi visual antar section: dari **9 Pilar Fitur Enterprise** langsung mengalir mulus ke **Tabel Paket Harga 3-Tier** tanpa celah horizontal/vertikal yang janggal.
