# 🧭 Rencana Implementasi: Endpoint Upgrade Subscription & Skenario Kalkulasi Bisnis (Fix 404 Not Found)

Analisis akar masalah error `404 Not Found` pada `POST /api/v1/subscription/upgrade` dan rancangan implementasi endpoint upgrade paket, validasi kalkulasi kuota & masa aktif, serta skenario bisnis lengkap di backend Go ([`wahide/internal/modules/subscription/`](file:///G:/WEB2026/wahide/internal/modules/subscription/)).

---

## 🔍 1. Analisis Akar Masalah (Root Cause Analysis)

### Bukti Error:
```json
{
  "duration_ms": 72.8929,
  "error": "Not Found",
  "http.method": "POST",
  "http.route": "/api/v1/subscription/upgrade",
  "http.status_code": 404,
  "level": "error",
  "msg": "HTTP request failed with server error"
}
```

### Investigasi Kode Sumber:
1. **Frontend Calling Endpoint**:
   * Di [`subscription.api.ts`](file:///G:/WEB2026/fontwahide/src/services/subscription/api/subscription.api.ts#L138), fungsi `upgradePlan(planId)` mengirimkan HTTP POST ke:
     `POST /subscription/upgrade` dengan payload `{ planId: "..." }`.
2. **Backend Route Registration Missing**:
   * Di [`wahide/internal/modules/subscription/delivery/http/router.go`](file:///G:/WEB2026/wahide/internal/modules/subscription/delivery/http/router.go), rute yang terdaftar hanya:
     * `GET /plans`, `GET /subscription/plans`
     * `GET /subscription`
     * `GET /subscription/webhook`, `PUT /subscription/webhook`
     * `POST /subscriptions/assign` (Khusus Admin)
   * ❌ **Rute `POST /subscription/upgrade` BELUM DIDAFTARKAN & UseCase-nya belum tersedia untuk Tenant/Seller**.

---

## 📊 2. Skenario Bisnis & Aturan Kalkulasi (Calculation Rules)

### 📌 Skenario 1: Upgrade dari Paket FREE ke Paket Berbayar (LITE / REGULAR / ENTERPRISE)
* **Kalkulasi Masa Aktif**:
  * Tanggal Mulai (`started_at`): Waktu saat ini (`time.Now()`).
  * Tanggal Kadaluarsa (`expired_at`): 30 hari ke depan (`time.Now().AddDate(0, 1, 0)`).
* **Kalkulasi Kuota & Kapasitas**:
  * Kuota Bulanan (`monthly_message_limit`): Diperbarui ke limit paket baru (misal LITE: 1.000, REGULAR: 10.000, ENTERPRISE: 50.000).
  * Pemakaian Bulan Berjalan (`current_month_usage`): Tetap dicatat sesuai pemakaian riil saat ini (tidak di-reset paksa ke 0 agar histori bulan ini valid).
  * Batas Slot Perangkat (`max_devices`): Bertambah (misal 1 $\to$ 3 $\to$ 10 slot).
  * Watermark (`has_watermark`): Otomatis nonaktif (`false`) pada paket berbayar.
* **Cache Invalidation**:
  * Kunci Redis `sub:tenant:{id}` langsung di-invalisasi (*Write-Through Cache*) agar verifikasi pengiriman pesan instan membaca batas baru.

### 📌 Skenario 2: Upgrade dari Paket Berbayar ke Tingkat Lebih Tinggi (LITE $\to$ ENTERPRISE)
* **Kalkulasi Masa Aktif**:
  * Jika paket lama masih aktif: Masa aktif baru diperpanjang 30 hari dari tanggal kadaluarsa sebelumnya (`expired_at.AddDate(0, 1, 0)`), atau di-reset 30 hari dari sekarang jika sudah mendekati habis.
* **Kalkulasi Kuota & Fitur**:
  * Kuota maksimal langsung naik ke 50.000 pesan.
  * Slot perangkat langsung bertambah hingga 10 slot.
  * Fitur kampanye broadcast & auto-reply bot langsung terbuka penuh.

### 📌 Skenario 3: Memilih Kembali Paket FREE (Downgrade / Reset)
* Masa aktif: 10 tahun (Lifetime Free tier).
* Batas kuota: 1.200 pesan / bulan.
* Batas slot perangkat: 1 slot.
* Watermark footer `"Powered by Wahide"`: Otomatis aktif kembali.

---

## 🏗️ 3. Rencana Perubahan Kode di Backend Go (`wahide`)

### 📌 1. DTO Layer ([`subscription_dto.go`](file:///G:/WEB2026/wahide/internal/modules/subscription/domain/dto/subscription_dto.go))
* Tambahkan DTO `UpgradeSubscriptionRequest`:
  ```go
  type UpgradeSubscriptionRequest struct {
      PlanID      string `json:"plan_id"`
      PlanIDCamel string `json:"planId"`
  }
  func (r *UpgradeSubscriptionRequest) GetPlanID() string {
      if r.PlanID != "" {
          return r.PlanID
      }
      return r.PlanIDCamel
  }
  ```

### 📌 2. Domain Contract ([`usecase.go`](file:///G:/WEB2026/wahide/internal/modules/subscription/domain/usecase.go))
* Tambahkan contract method pada interface `SubscriptionLifecycleUseCase`:
  ```go
  UpgradeSubscription(ctx context.Context, req *dto.UpgradeSubscriptionRequest, auth *sharedCtx.Auth) (*entity.Subscription, error)
  ```

### 📌 3. UseCase Layer ([`subscription_lifecycle_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/subscription/usecase/subscription_lifecycle_usecase.go))
* Implementasikan `UpgradeSubscription`:
  1. Validasi konteks autentikasi dan kepemilikan tenant (`auth.TenantID`).
  2. Resolusi ID Plan (mendukung pencarian berdasarkan ID maupun nama paket seperti "LITE", "REGULAR", "ENTERPRISE", "PRO", "FREE").
  3. Hitung masa aktif dan perbarui entitas `Subscription` di database dalam transaksi ACID (`txMgr.Execute`).
  4. Invalisasi cache Redis/RAM tenant (`invalidateTenantCache`).
  5. Kembalikan entitas langganan terbaru lengkap dengan data `Plan`.

### 📌 4. Delivery HTTP Layer ([`subscription_handler.go`](file:///G:/WEB2026/wahide/internal/modules/subscription/delivery/http/subscription_handler.go) & [`router.go`](file:///G:/WEB2026/wahide/internal/modules/subscription/delivery/http/router.go))
* Tambahkan handler `UpgradeSubscription(c *echo.Context) error`.
* Daftarkan rute pada `protected` & `seller` group:
  ```go
  protected.POST("/subscription/upgrade", h.UpgradeSubscription)
  ```

---

## 🔍 4. Verification Plan
* Jalankan `go test ./internal/modules/subscription/...` di `wahide`.
* Jalankan `bun x tsc --noEmit` & `bun run lint` di `fontwahide`.
