# 🧭 Rencana Perbaikan: Rekonsiliasi Real-Time Status Koneksi Perangkat WhatsApp (Fix Stale "Connected" Status)

Analisis mendalam mengapa status perangkat tetap menampilkan `"Connected"` saat server Go dimatikan / direstart, serta rencana penerapan **Dynamic Live State Resolution & Database Startup Reconciliation** di backend Go ([`wahide/internal/modules/whatsapp/`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/)).

---

## 🔍 1. Analisis Akar Masalah (Mengapa Tetap "Connected" Padahal Server Direstart?)

### 1.1 Persistensi Kolom Database yang Statis vs Realitas WebSocket di Memory:
* Saat proses pairing pertama kali berhasil, backend mengeksekusi:
  ```go
  _ = s.devRepo.UpdateStatus(ctx, deviceID, "ONLINE", client.Store.ID.String())
  ```
  Nilai `"ONLINE"` disimpan secara permanen di baris tabel MySQL/PostgreSQL `devices`.
* Ketika server Go **dimatikan atau direstart**:
  * Seluruh koneksi WebSocket whatsmeow ke server WhatsApp Meta terputus.
  * Map `sessions` di dalam memory Go (`SessionManager`) menjadi **KOSONG** (`len(sessions) == 0`).
  * Namun, baris di database masih tertulis `"ONLINE"`.
* Ketika frontend memanggil `GET /whatsapp/devices`:
  * UseCase `ListDevices` saat ini hanya memanggil `devRepo.FindAll()` yang membaca kolom mentah `status = "ONLINE"` dari database tanpa memverifikasi apakah socket WebSocket di RAM benar-benar tersambung.
  * Akibatnya, frontend menerima `"ONLINE"` dan menampilkannya sebagai `Connected` berwarna hijau dengan titik berkedip, padahal sesi di RAM belum aktif.

---

## 🏗️ 2. Standar Arsitektur: Dynamic Live State Resolution (Single Source of Live Truth)

Sesuai standar arsitektur WhatsApp Multi-Device Gateway:
1. **Status Real-Time Mengikuti Socket Memory (`SessionManager.GetClient`)**:
   * Jika `sessionMgr.GetClient(deviceID)` aktif dan `client.IsConnected() && client.IsLoggedIn()` $\to$ Status = **`ONLINE`** (`CONNECTED`).
   * Jika `d.JID != ""` (kredensial tersimpan di DB) tetapi TIDAK ada koneksi socket di RAM $\to$ Status = **`HIBERNATED`** (Terhibernasi / Sesi Dingin di DB, siap dibangunkan on-demand saat kirim pesan atau klik Bangunkan).
   * Jika `d.JID == ""` (belum pernah di-scan) $\to$ Status = **`DISCONNECTED`** (atau `QR_PENDING`).
2. **Startup Reconciliation**:
   * Saat modul WhatsApp pertama kali `Initialize`, perbarui baris yang berstatus `"ONLINE"` di database menjadi `"HIBERNATED"` karena server baru saja boot dan socket belum dibangun.
3. **Frontend Defensive Mapping**:
   * Menjamin `mapBackendDevice` memetakan `"HIBERNATED"` ke `"HIBERNATED"` (Badge biru muda/sky 🌙 dengan tombol Bangunkan ☀️).

---

## ⚡ 3. Rencana Perubahan Kode (Proposed Changes)

### 📌 1. Backend UseCase Layer ([`device_crud_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/usecase/device_crud_usecase.go))
* Pada method `ListDevices` dan `GetDevice`, lakukan pengecekan real-time status:
  ```go
  for i := range devices {
      client, exists := u.sessionMgr.GetClient(devices[i].ID)
      if exists && client != nil && client.IsConnected() && client.IsLoggedIn() {
          devices[i].Status = "ONLINE"
      } else if devices[i].JID != "" {
          devices[i].Status = "HIBERNATED"
      } else {
          devices[i].Status = entity.DeviceStatusQRPending
      }
  }
  ```

### 📌 2. Backend Module Initializer ([`whatsapp.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/whatsapp.go))
* Saat `Initialize`, lakukan rekonsiliasi DB:
  ```go
  _ = db.Model(&entity.Device{}).Where("status = ?", "ONLINE").Update("status", "HIBERNATED").Error
  ```

### 📌 3. Frontend Mapping ([`whatsapp.api.ts`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/api/whatsapp.api.ts))
* Pastikan `mapBackendDevice` menangani seluruh variasi status secara tegas (`ONLINE`/`CONNECTED` $\to$ `CONNECTED`, `HIBERNATED`/`hibernated` $\to$ `HIBERNATED`, `OFFLINE`/`QR_PENDING`/`BANNED`/`DISCONNECTED` $\to$ `DISCONNECTED`).

---

## 🔍 4. Verification Plan
* Jalankan `go test ./...` di backend `wahide`.
* Jalankan `bun x tsc --noEmit` & `bun run lint` di frontend `fontwahide`.
