# 🧭 Analisis & Rencana Perbaikan: Standarisasi Kontras Warna Light Mode (WCAG AAA Compliance)

Dokumen investigasi dan perencanaan standarisasi kontras warna teks dan tautan aksi (*"Lihat Semua"*) di seluruh antarmuka aplikasi, khususnya pada mode tampilan terang (*Light Mode*).

---

## 🔍 1. Investigasi & Akar Masalah Kontras Warna Light Mode

Berdasarkan gambar laporan pengguna pada halaman dasbor (`http://localhost:3000/dashboard`):

### 📌 Masalah yang Terjadi:
* Tautan **"Lihat Semua ->"** dan beberapa ikon pada header kartu menggunakan class Tailwind:
  ```tsx
  className="text-xs font-bold text-wise-green hover:underline inline-flex items-center gap-1"
  ```
* Nilai warna `--color-wise-green` adalah `#9fe870` (hijau neon terang).
* **Rasio Kontras (Contrast Ratio)**:
  * Pada **Dark Mode** (`#161715` / hitam): Rasio kontras mencapai **11.5:1** (Sangat Tajam & Jelas).
  * Pada **Light Mode** (`#ffffff` / `#f4f5f0`): Rasio kontras hanya **1.35:1** (Gagal standar WCAG AA minimal 4.5:1).
  * Akibatnya teks tampak **pudar, silau, dan hampir tidak terbaca** oleh mata pengguna.

---

## 🎨 2. Standar Desain Sistem Wise B2B yang Benar

Dalam sistem desain resmi Wise, terdapat dua padanan warna hijau:
1. **Light Mode**: Menggunakan `text-dark-green` (`#163300`, rasio kontras **13.8:1** di atas latar putih/mint) dengan latar badge `bg-light-mint` (`#e2f6d5`).
2. **Dark Mode**: Menggunakan `dark:text-wise-green` (`#9fe870`, rasio kontras **11.5:1** di atas latar gelap) dengan latar badge `dark:bg-wise-green/15`.

Kombinasi standar enterprise yang wajib digunakan:
```tsx
// Untuk Tautan & Teks:
className="text-dark-green dark:text-wise-green hover:underline"

// Untuk Badge / Chips:
className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30"
```

---

## 📋 3. Hasil Audit Problem Serupa di Seluruh Codebase

| Berkas | Lokasi & Elemen | Status Saat Ini | Perbaikan Terstandarisasi |
| :--- | :--- | :--- | :--- |
| **`DashboardOverviewView.tsx`** | Link *"Lihat Semua"* (Devices & Campaigns) & *"Kelola Semua"* (Admin) | `text-wise-green` | `text-dark-green dark:text-wise-green` |
| **`DashboardOverviewView.tsx`** | Header Card Icons (`Radio`, `Layers`, `Users`, `CreditCard`) | `text-wise-green` | `text-dark-green dark:text-wise-green` |
| **`DashboardOverviewView.tsx`** | Badge Status Kampanye (`c.status`) | `bg-wise-green/10 text-wise-green` | `bg-light-mint dark:bg-wise-green/10 text-dark-green dark:text-wise-green border border-wise-green/30` |
| **`CampaignList.tsx`** | Persentase Selesai (`{percent}%`) | `text-wise-green` | `text-dark-green dark:text-wise-green` |
| **`CampaignWizardModal.tsx`** | Tombol Preset & Badge Target | `text-wise-green` | `bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30` |
| **`ImportCsvModal.tsx`** | Info format CSV | `text-wise-green` | `text-dark-green dark:text-wise-green` |
| **`BalanceCard.tsx`** | Label mata uang `"IDR"` | `text-wise-green` | `text-dark-green dark:text-wise-green` |
| **`QuotaDialCard.tsx`** | Badge `"Paket Aktif: ..."` | `bg-wise-green/15 text-wise-green` | `bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30` |
| **`TicketList.tsx`** | Nomor ID Tiket | `text-wise-green bg-wise-green/15` | `text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border border-wise-green/20` |
| **`TicketThreadModal.tsx`** | Nama Pengirim Tim CS & ID Tiket | `text-wise-green` | `text-dark-green dark:text-wise-green` |
| **`DeviceCard.tsx`** | Indikator Baterai Mengisi `(Sedang Diisi)` | `text-wise-green` | `text-dark-green dark:text-wise-green` |
| **`LiveQRModal.tsx`** | Badge Status & Teks `"Kode Tersalin!"` | `text-wise-green` | `bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30` |

---

## ⚡ 4. Rencana Eksekusi

1. Terapkan kelas `text-dark-green dark:text-wise-green` dan `bg-light-mint dark:bg-wise-green/15` pada seluruh 12 berkas yang teridentifikasi di atas.
2. Verifikasi kepatuhan TypeScript (`bun x tsc --noEmit`) dan Linter (`bun run lint`).
