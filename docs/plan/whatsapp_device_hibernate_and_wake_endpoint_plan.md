# 🧭 Rencana Perbaikan: Endpoint Hibernasi & Bangunkan Perangkat WhatsApp (Fix 404 Not Found)

Analisis akar masalah error `404 Not Found` saat menekan tombol **Hibernasi (*Hibernate*)** pada halaman `/devices` dan rencana perbaikan terstruktur di backend Go ([`wahide/internal/modules/whatsapp/`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/)).

---

## 🔍 1. Analisis Akar Masalah (Root Cause Analysis)

### Bukti Error dari Log Permintaan Pengguna:
```json
{
  "duration_ms": 58.9672,
  "error": "Not Found",
  "http.method": "POST",
  "http.route": "/api/v1/whatsapp/devices/01M1BW2V8PKCP0GYH1Z99PBS65/hibernate",
  "http.status_code": 404,
  "level": "error",
  "msg": "HTTP request failed with server error"
}
```

### Investigasi Kode Sumber:
1. **Frontend Calling Endpoint**:
   * Di [`whatsapp.api.ts`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/api/whatsapp.api.ts#L80-L88), frontend mengirimkan HTTP POST ke:
     * `POST /whatsapp/devices/:id/hibernate` (saat tombol Hibernasi diklik).
     * `POST /whatsapp/devices/:id/wake` (saat tombol Bangunkan diklik).
2. **Backend Route Registration Missing**:
   * Di [`wahide/internal/modules/whatsapp/delivery/http/router.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/delivery/http/router.go#L21-L32), rute yang terdaftar hanya mencakup:
     * `POST /wa/devices`, `POST /whatsapp/devices`
     * `POST /wa/devices/:id/pair`, `POST /whatsapp/devices/:id/pair`
     * `POST /wa/devices/:id/pair-phone`, `POST /whatsapp/devices/:id/pair-phone`
     * `POST /wa/devices/:id/disconnect`, `POST /whatsapp/devices/:id/disconnect`
     * `DELETE /wa/devices/:id`, `DELETE /whatsapp/devices/:id`
   * ❌ **Rute `POST /wa/devices/:id/hibernate` dan `POST /whatsapp/devices/:id/hibernate` (serta `/wake`) BELUM DIDAFTARKAN**.

---

## 🏗️ 2. Pola Arsitektur Hibernasi Sesuai Standar `whatsapp-gateway-engine`

Sesuai skill arsitektur whatsmeow engine:
* **Hibernasi**:
  1. Memutus koneksi WebSocket whatsmeow (`client.Disconnect()`).
  2. Menghapus sesi in-memory dari map `sessions` (menghemat ~15MB RAM per koneksi idle).
  3. Kredensial pairing Multi-Device (kunci enkripsi Noise) **tetap tersimpan aman di database PostgreSQL / SQLite**, sehingga perangkat TIDAK perlu scan ulang QR saat bangun.
  4. Memperbarui status perangkat di database menjadi `"HIBERNATED"`.
* **Bangunkan (*Wakeup*)**:
  1. Memuat kembali store Multi-Device dari database.
  2. Membuka kembali koneksi WebSocket whatsmeow ke server Meta (`client.Connect()`).
  3. Memperbarui status perangkat di database menjadi `"ONLINE"`.

---

## ⚡ 3. Rencana Perubahan Kode (Proposed Changes)

### 📌 1. Layer Infrastructure ([`session_manager.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/infrastructure/session_manager.go))
* Tambahkan method pada interface `SessionManager`:
  * `HibernateClient(deviceID string) error`
  * `WakeClient(ctx context.Context, deviceID, tenantID string) error`
* Implementasikan method `HibernateClient` (disconnect socket + lepas memory) dan `WakeClient` (auto-reconnect on demand).

### 📌 2. Layer Domain ([`usecase.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/domain/usecase.go))
* Tambahkan contract method pada interface `DeviceSessionUseCase`:
  * `HibernateDevice(ctx context.Context, tenantID, id string) error`
  * `WakeDevice(ctx context.Context, tenantID, id string) error`

### 📌 3. Layer UseCase ([`device_session_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/usecase/device_session_usecase.go))
* Implementasikan `HibernateDevice`:
  * Validasi kepemilikan tenant device.
  * Panggil `sessionMgr.HibernateClient(device.ID)`.
  * Update status DB ke `"HIBERNATED"`.
* Implementasikan `WakeDevice`:
  * Validasi kepemilikan tenant device.
  * Panggil `sessionMgr.WakeClient(ctx, device.ID, tenantID)`.
  * Update status DB ke `"ONLINE"`.

### 📌 4. Layer Delivery HTTP ([`device_handler.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/delivery/http/device_handler.go) & [`router.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/delivery/http/router.go))
* Tambahkan handler `HibernateDevice(c *echo.Context) error` dan `WakeDevice(c *echo.Context) error`.
* Daftarkan rute pada `RegisterRoutes`:
  ```go
  deviceGroup.POST("/wa/devices/:id/hibernate", h.HibernateDevice)
  deviceGroup.POST("/whatsapp/devices/:id/hibernate", h.HibernateDevice)
  deviceGroup.POST("/wa/devices/:id/wake", h.WakeDevice)
  deviceGroup.POST("/whatsapp/devices/:id/wake", h.WakeDevice)
  ```

---

## 🔍 4. Verification & Testing Plan
* Jalankan `go test ./internal/modules/whatsapp/...` di `wahide`.
* Jalankan `bun x tsc --noEmit` di `fontwahide`.
