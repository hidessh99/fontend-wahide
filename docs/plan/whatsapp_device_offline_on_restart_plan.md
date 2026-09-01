# 🧭 Rencana Perbaikan: Status Perangkat Menjadi OFFLINE Saat Server Go Direstart / Dimatikan

Rencana penyesuaian status perangkat WhatsApp agar otomatis beralih ke status **`OFFLINE`** (Terputus / Disconnected) saat server Go direstart atau dimatikan, membedakan antara status *Offline karena server mati* dengan *Hibernasi yang sengaja diaktifkan oleh pengguna*.

---

## 🔍 1. Analisis Kebutuhan & Perilaku Status

### Permintaan Pengguna:
* Jika server Golang **direstart atau dimatikan**, status perangkat harus menjadi **`OFFLINE`** (bukan `HIBERNATED`).

### Definisi Status yang Presisi:
1. **`ONLINE` (`CONNECTED`)**:
   * Soket WebSocket whatsmeow di RAM server aktif terhubung ke server WhatsApp Meta dan terotentikasi (`client.IsConnected() && client.IsLoggedIn()`).
2. **`HIBERNATED`**:
   * Hanya aktif jika pengguna **secara eksplisit menekan tombol Hibernasi** (`POST /whatsapp/devices/:id/hibernate`).
3. **`OFFLINE` (`DISCONNECTED`)**:
   * Terjadi ketika server Go **direstart / dimatikan**, atau koneksi WebSocket terputus / gagal rekoneksi.
4. **`QR_PENDING` (`PAIRING`)**:
   * Slot perangkat baru yang belum pernah dipasangkan (*Unpaired*).

---

## 🏗️ 2. Rencana Perubahan pada Backend Go (`wahide`)

### 📌 1. Startup Database Reconciliation ([`whatsapp.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/whatsapp.go))
* Saat server Go boot pertama kali (`Initialize`), perbarui baris yang berstatus `"ONLINE"` di database menjadi **`"OFFLINE"`**:
  ```go
  if err := db.Model(&entity.Device{}).Where("status = ?", entity.DeviceStatusOnline).Update("status", entity.DeviceStatusOffline).Error; err != nil {
      log.Warnf("WhatsApp startup database reconciliation warning: %v", err)
  }
  ```

### 📌 2. Dynamic Live State Resolution ([`device_crud_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/usecase/device_crud_usecase.go))
* Pada fungsi `resolveLiveStatus`:
  ```go
  func (u *deviceCrudUseCase) resolveLiveStatus(d *entity.Device) {
      if d == nil {
          return
      }
      client, exists := u.sessionMgr.GetClient(d.ID)
      if exists && client != nil && client.IsConnected() && client.IsLoggedIn() {
          d.Status = entity.DeviceStatusOnline
      } else if d.Status == entity.DeviceStatusHibernated {
          // Tetap HIBERNATED hanya jika status eksplisit di DB adalah HIBERNATED
          d.Status = entity.DeviceStatusHibernated
      } else if d.JID != "" {
          // Jika server restart / socket mati di RAM -> status OFFLINE
          d.Status = entity.DeviceStatusOffline
      } else {
          d.Status = entity.DeviceStatusQRPending
      }
  }
  ```

### 📌 3. Graceful Shutdown Draining ([`session_manager.go`](file:///G:/WEB2026/wahide/internal/modules/whatsapp/infrastructure/session_manager.go))
* Saat server Go dimatikan (`Close()`):
  * Putuskan seluruh socket dan perbarui status database semua perangkat aktif menjadi `"OFFLINE"`.

---

## 🔍 3. Rencana Verifikasi (Verification Plan)
* Jalankan `go test ./...` di backend `wahide`.
* Jalankan `bun x tsc --noEmit` & `bun run lint` di frontend `fontwahide`.
