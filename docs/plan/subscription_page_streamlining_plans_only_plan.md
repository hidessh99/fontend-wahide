# 🧭 Rencana Perampingan Halaman Subscription (Murni Fokus Pilihan Paket / Plans)

Rencana perampingan halaman `/subscription` dengan menghapus section *Remaining Message Quota* dan *Webhook URL Configuration*, serta mengubah konten & judul "Plans & Message Quotas" menjadi "Plans" (atau "Paket Langganan").

---

## 🔍 1. Analisis Kebutuhan Pengguna

### Permintaan Pengguna:
1. **Hapus Section *Remaining Message Quota***: Menghapus kartu meteran/gauge sisa kuota pesan (`QuotaDialCard`) dari halaman `/subscription`.
2. **Hapus Section *Webhook URL Configuration***: Menghapus kartu formulir konfigurasi Webhook URL & HMAC signature key (`WebhookConfigCard`) dari halaman `/subscription`.
3. **Ubah Judul & Konten "Plans & Message Quotas" menjadi "Plans" / "Paket Langganan"**:
   - Memperbarui judul utama halaman `/subscription` dari "Paket & Kuota Pesan" / "Plans & Message Quotas" menjadi **"Plans"** (atau **"Paket Langganan"**).
   - Memperbarui label menu sidebar navigasi (`dashboardMenu.subscription`) menjadi **"Plans"** (EN) / **"Paket Langganan"** (ID).
   - Menyelaraskan micro-copy subtitle dan metadata SEO halaman.

---

## 🏗️ 2. File yang Akan Dimodifikasi

### 📌 1. [`SubscriptionView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/SubscriptionView.tsx)
* Hapus import & render `<QuotaDialCard />`.
* Hapus import & render `<WebhookConfigCard />`.
* Hanya render Header dan `<PlanCardGrid />` sehingga halaman berfokus murni pada pilihan paket langganan bisnis (*Pricing & Upgrade Plans*).

### 📌 2. [`id/subscription.json`](file:///G:/WEB2026/fontwahide/src/locales/id/subscription.json) & [`en/subscription.json`](file:///G:/WEB2026/fontwahide/src/locales/en/subscription.json)
* Update `title` & `subtitle`:
  * ID: `"title": "Paket Langganan"`, `"subtitle": "Pilih dan tingkatkan paket langganan bisnis yang sesuai dengan kebutuhan pengiriman pesan Anda."`
  * EN: `"title": "Plans"`, `"subtitle": "Choose and upgrade subscription plans tailored to your business messaging requirements."`

### 📌 3. [`id/common.json`](file:///G:/WEB2026/fontwahide/src/locales/id/common.json) & [`en/common.json`](file:///G:/WEB2026/fontwahide/src/locales/en/common.json)
* Update `dashboardMenu.subscription`:
  * ID: `"subscription": "Paket Langganan"`
  * EN: `"subscription": "Plans"`

### 📌 4. [`app/(dashboard)/subscription/page.tsx`](file:///G:/WEB2026/fontwahide/src/app/(dashboard)/subscription/page.tsx)
* Update page metadata title: `"Paket Langganan | Wahide"`.

---

## 🔍 3. Rencana Verifikasi (Verification Plan)
* Jalankan `bun x tsc --noEmit` untuk memastikan 0 TypeScript type errors.
* Jalankan `bun run lint` untuk memastikan 0 ESLint warnings.
