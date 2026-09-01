# 🧭 Rencana & Evaluasi UI/UX: Masa Aktif Langganan Tenant (Subscription Expiration) pada Dashboard

Penyelarasan pemahaman dan rencana implementasi penyajian **Masa Aktif Langganan Tenant (`subscriptions.expired_at`)** pada halaman `http://localhost:3000/dashboard`, membedakan status masa aktif langganan **FREE (Masa Aktif Langganan: Selamanya / Unlimited)** dengan langganan **Berbayar (Masa Aktif Langganan: Berdasarkan Tanggal Expired Subscription & Sisa Hari)**.

---

## 🎯 1. Penjelasan Konsep & Definisi yang Benar

### 📌 Perbedaan Plan (Master Data Paket) vs Subscription (Langganan Tenant):
* **Plan (`plans`)**: Master data spesifikasi paket statis (nama paket, limit pesan per bulan, slot device, harga).
* **Subscription (`subscriptions`)**: Entitas langganan spesifik milik **Tenant (User)** yang memiliki siklus hidup:
  * `started_at`: Kapan tenant mulai mengaktifkan langganan ini.
  * `expired_at`: **Kapan masa aktif langganan tenant ini berakhir (Expired Subscription)**.
  * `status`: Status langganan tenant (`ACTIVE`, `EXPIRED`, `CANCELLED`).

---

## 🎨 2. Logika & Aturan Tampilan Masa Aktif Langganan (UI/UX)

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │      STATUS LANGGANAN TENANT (SUBSCRIPTION)            │
                                  └──────────────────────────┬─────────────────────────────┘
                                                             │
                             ┌───────────────────────────────┴───────────────────────────────┐
                             ▼                                                               ▼
                 [ Langganan Paket FREE ]                                       [ Langganan Paket Berbayar ]
                 • DB expired_at: 10 Tahun                                      • DB expired_at: Tanggal Riil (e.g. +30 Hari)
                 • UI: "Masa Aktif: Selamanya (Unlimited)"                      • UI: "Berlaku s/d 01 Okt 2026 (Sisa 30 Hari)"
```

### 1. Untuk Tenant dengan Langganan FREE:
* **Logika**: Jika `plan_name === 'FREE'` (atau tier Starter):
* **Teks Tampilan**: **`"Paket FREE • Masa Aktif: Selamanya (Unlimited)"`**
* **Alasan UX**: Nilai teknis seeder `expired_at + 10 tahun` tidak boleh ditampilkan sebagai tanggal angka agar pengguna memahami bahwa langganan gratis mereka permanen dan tidak akan hangus.

### 2. Untuk Tenant dengan Langganan Berbayar (PRO / REGULAR / ENTERPRISE):
* **Logika**: Mengambil tanggal `expired_at` dari entitas `Subscription` tenant yang bersangkutan:
* **Teks Tampilan**: **`"Paket [Nama] • Berlaku hingga [DD MMM YYYY] (Sisa [N] Hari)"`**
* **Indikator Status Langganan**:
  * **Aktif (> 7 hari)**: Badge hijau lembut/netral.
  * **Mendekati Kadaluarsa ($\le$ 7 hari)**: Badge peringatan amber/kuning **`"Langganan Berakhir dalam [N] Hari"`** + Tombol **`[ Perpanjang ]`**.
  * **Kadaluarsa (`EXPIRED`)**: Badge merah **`"Langganan Telah Berakhir"`** + Tombol **`[ Aktifkan Kembali ]`**.

---

## 🛠️ 3. Rencana Teknis Backend & Frontend

### 📌 1. Backend Go ([`wahide`](file:///G:/WEB2026/wahide/))
* **DTO Statistik Dasbor** ([`dashboard_dto.go`](file:///G:/WEB2026/wahide/internal/modules/iam/domain/dto/dashboard_dto.go)):
  * Tambahkan `SubscriptionExpiresAt *time.Time json:"subscription_expires_at,omitempty"` pada struct `UserDashboardResponse`.
* **UseCase Dasbor** ([`dashboard_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/iam/usecase/dashboard_usecase.go)):
  * Hubungkan `info.ExpiresAt` (dari `sub.ExpiredAt`) ke field `SubscriptionExpiresAt`.

### 📌 2. Frontend React ([`fontwahide`](file:///G:/WEB2026/fontwahide/))
* **Tipe Data** ([`dashboard.types.ts`](file:///G:/WEB2026/fontwahide/src/services/iam/types/dashboard.types.ts)):
  * Tambahkan `subscription_expires_at?: string` pada `UserDashboardStats`.
* **Komponen Dasbor** ([`DashboardOverviewView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/DashboardOverviewView.tsx)):
  * Perbarui badge header dasbor agar merender status masa aktif langganan tenant:
    * Jika FREE $\to$ `"Masa Aktif: Selamanya (Unlimited)"`.
    * Jika Berbayar $\to$ Format tanggal kadaluarsa langganan (`subscription_expires_at`) + kalkulasi sisa hari + tombol tautan ke `/subscription`.
