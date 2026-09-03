# 📱 Rencana Desain & Implementasi: Preservasi Status 'HIBERNATED' Saat Server Restart

Dokumen ini memetakan rencana perbaikan menyeluruh terhadap masalah status perangkat WhatsApp yang berubah menjadi **"Disconnected"** (dan meminta scan QR ulang) saat server Golang direstart, agar sesuai dengan arsitektur **Zero-Heap Session Hibernation** di mana perangkat berstatus **"HIBERNATED"** dan siap dibangunkan kembali (*Wake Up*).

---

## 1. 🔍 Analisis Akar Masalah (Root Cause Analysis)

### A. Di Sisi Backend (`wahide`)
1. **Graceful Shutdown Menghapus JID dan Memaksa Status OFFLINE**:
   Pada [`wahide/internal/modules/whatsapp/infrastructure/session_manager.go:229-236`](file:///g:/WEB2026/wahide/internal/modules/whatsapp/infrastructure/session_manager.go#L229-L236):
   ```go
   for deviceID, sess := range s.sessions {
       if sess.client != nil && sess.client.IsConnected() {
           s.log.Infof("Gracefully disconnecting WhatsApp client for device %s", deviceID)
           sess.client.Disconnect()
           _ = s.devRepo.UpdateStatus(context.Background(), deviceID, "OFFLINE", "") // 🔴 Masalah
       }
       delete(s.sessions, deviceID)
   }
   ```
   - Status perangkat diubah paksa ke `"OFFLINE"`.
   - Parameter JID dikosongkan (`""`), sehingga database kehilangan informasi bahwa perangkat tersebut sudah ter-pairing.

2. **Startup Reconciliation Terbatas**:
   Pada [`wahide/internal/modules/whatsapp/whatsapp.go:55`](file:///g:/WEB2026/wahide/internal/modules/whatsapp/whatsapp.go#L55):
   ```go
   db.Model(&entity.Device{}).Where("status = ? AND j_id != ''", entity.DeviceStatusOnline).Update("status", entity.DeviceStatusHibernated)
   ```
   - Server hanya memeriksa `status = ONLINE`.
   - Karena saat shutdown statusnya sudah diubah menjadi `OFFLINE` oleh `session_manager.go`, maka saat server dinyalakan kembali, query ini tidak menyentuh baris perangkat tersebut.

### B. Di Sisi Frontend (`fontwahide`)
1. **Mapper API Tidak Mengenali OFFLINE dengan JID**:
   Pada [`fontwahide/src/modules/whatsapp/api/whatsapp.api.ts:13-23`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/api/whatsapp.api.ts#L13-L23):
   ```ts
   if (mappedStatus === "ONLINE" || mappedStatus === "CONNECTED") {
     mappedStatus = "CONNECTED";
   } else if (mappedStatus === "HIBERNATED") {
     mappedStatus = "HIBERNATED";
   } else if (mappedStatus === "PAIRING" || mappedStatus === "QR_PENDING") {
     mappedStatus = d.jid ? "HIBERNATED" : "PAIRING";
   } else {
     mappedStatus = "DISCONNECTED"; // 🔴 Masalah: 'OFFLINE' jatuh ke sini
   }
   ```
   - Ketika backend mengirim status `OFFLINE`, frontend langsung memetakannya ke `DISCONNECTED`.
   - Di komponen [`DeviceCard.tsx`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/components/devices/DeviceCard.tsx), status `DISCONNECTED` memicu tombol **"Pindai QR"**, membuat pengguna mengira sesi WhatsApp terhapus padahal sesi masih tersimpan di ponsel dan database.

---

## 2. 🛠️ Rencana Perubahan Kode

### A. Backend (`wahide`)

#### 1. [MODIFY] [`internal/modules/whatsapp/infrastructure/session_manager.go`](file:///g:/WEB2026/wahide/internal/modules/whatsapp/infrastructure/session_manager.go#L229)
Perbaiki fungsi `Close()` agar saat server mati/restart:
- Ambil JID perangkat aktif dari store `sess.client.Store.ID.String()` atau dari repository.
- Putuskan koneksi soket (`Disconnect()`).
- Simpan status perangkat sebagai **`entity.DeviceStatusHibernated`** (`"HIBERNATED"`) dengan JID yang tetap utuh (tidak dikosongkan).
- Jika perangkat belum pernah di-pairing (JID kosong), set ke `QR_PENDING`.

#### 2. [MODIFY] [`internal/modules/whatsapp/whatsapp.go`](file:///g:/WEB2026/wahide/internal/modules/whatsapp/whatsapp.go#L55)
Perluas cakupan query rekonsiliasi saat server boot:
- Mengubah perangkat dengan status `ONLINE` maupun `OFFLINE` yang memiliki JID valid (`j_id != ''`) menjadi **`entity.DeviceStatusHibernated`**.
- Memastikan perangkat yang saat ini sudah terlanjur berstatus `OFFLINE` di database langsung kembali ke `HIBERNATED` saat server menyala.

---

### B. Frontend (`fontwahide`)

#### 1. [MODIFY] [`src/modules/whatsapp/api/whatsapp.api.ts`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/api/whatsapp.api.ts#L13)
Sempurnakan fungsi `mapBackendDevice`:
- Jika status dari backend adalah `OFFLINE` atau `DISCONNECTED`, periksa apakah terdapat `jid` / `j_id`:
  - Jika **ada JID** $\rightarrow$ Perangkat sudah ter-pairing, petakan ke status **`"HIBERNATED"`**.
  - Jika **tidak ada JID** $\rightarrow$ Petakan ke status **`"DISCONNECTED"`** (minta scan QR).

---

## 3. 🎯 Dampak & Hasil yang Diharapkan

1. **Setelah Server Direstart**:
   - Perangkat yang sudah ter-pairing otomatis tampil dengan status **🌙 Hibernasi** di antarmuka web.
   - Tombol pada kartu perangkat menampilkan **☀️ Bangunkan Sesi** (*Wake Up*), bukan tombol *Pindai QR*.
   - Saat pengguna meluncurkan kampanye broadcast di `/campaigns`, perangkat otomatis dibangunkan secara instan (*on-demand wakeup* dalam ~0.3 detik).

---

## 4. 📋 Rencana Pengujian & Quality Gate

1. **Backend Go**:
   - Jalankan `make lint` di direktori `wahide` (`go fmt` + `golangci-lint` harus 0 issues).
2. **Frontend**:
   - Jalankan `bun x tsc --noEmit` di direktori `fontwahide`.
   - Jalankan `bun run lint`.
   - Jalankan `bun run format`.
3. **Kepatuhan Aturan**:
   - ❌ Tidak menjalankan `bun run build`.
   - ❌ Tidak menjalankan `git push`.
