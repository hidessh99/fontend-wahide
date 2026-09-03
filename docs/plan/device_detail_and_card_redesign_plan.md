# 🎨 Blueprint UX/UI: Redesain Kartu Perangkat, Penghapusan Baterai & Fitur Get Detail Perangkat

Dokumen ini merinci analisis UX/UI design dan rencana arsitektur teknis untuk halaman **Manajemen Perangkat WhatsApp** (`http://localhost:3000/devices`).

---

## 1. 💡 Analisis & Pandangan UX/UI Designer

### A. Penghapusan Status Baterai: **100% Tepat & Rasional**
- **Konteks Protokol**: Pada era WhatsApp Web v1 (Single Device), ponsel harus terus menyala dan mengirimkan status baterai. Namun sejak arsitektur **WhatsApp Multi-Device (MD)** via library `whatsmeow`, server bertindak sebagai perangkat pendamping independen (*standalone linked companion*). WhatsApp MD tidak lagi menyiarkan persentase baterai ponsel induk.
- **Dampak UX Negatif**: Menampilkan `BATERAI: -` di baris utama kartu memberikan impresi buruk kepada pengguna seolah ada data yang rusak atau tidak termuat (*broken feature*).
- **Solusi**: Menghapus indikator baterai dan menggantinya dengan informasi operasional yang bernilai tinggi (*high-value operational telemetry*).

---

### B. Urgensi Menampilkan Device ID pada Kartu
- **Nilai Praktis**: Device ID (ULID) adalah kunci utama bagi pengguna saat:
  - Mengonfigurasi integrasi API / Webhook.
  - Memilih slot WhatsApp pada modul Kampanye Broadcast.
  - Melakukan audit log dan pemecahan masalah (*troubleshooting*).
- **UX Affordance**: Device ID ditampilkan dalam font monospace dengan chip ramping dan dilengkapi tombol **Salin 1-Klik (Copy to Clipboard)** serta tooltip feedback visual.

---

### C. Pentingnya Modal "Get Detail" (`DeviceDetailModal`)
- Saat ini pengguna hanya melihat kartu ringkas tanpa tahu informasi mendalam seperti:
  - JID WhatsApp lengkap (`62821...@s.whatsapp.net`).
  - Skor Reputasi Anti-Ban (*Trust Score*).
  - Tahap Pemanasan Nomor (*Warmup Day*).
  - Kuota pengiriman harian & jumlah pesan terkirim hari ini (*Daily Sent Count*).
  - Waktu pembuatan dan pembaruan slot.
- Dengan adanya `DeviceDetailModal`, pengguna mendapatkan transparansi penuh dan kendali atas setiap nomor WhatsApp yang mereka hubungkan.

---

## 2. 📐 Wireframe Antarmuka Baru

### A. Tampilan Kartu Baru ([`DeviceCard.tsx`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/components/devices/DeviceCard.tsx))
```
┌────────────────────────────────────────────────────────┐
│ [📱] dimas                    [Hibernasi]  [ ⋮ ]       │
│      📞 +62 821-5174-3688                              │
├────────────────────────────────────────────────────────┤
│ DEVICE ID                     AKTIF                    │
│ 01M1M... [📋]                 Baru saja                │
├────────────────────────────────────────────────────────┤
│ REPUTASI / WARMUP             PESAN HARI INI           │
│ ⭐ 10/10 (Hari ke-1)          0 pesan                  │
├────────────────────────────────────────────────────────┤
│ [ ☀️ Bangunkan ]                       [Lihat Detail >] │
└────────────────────────────────────────────────────────┘
```

### B. Tampilan Modal Detail ([`DeviceDetailModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/components/devices/DeviceDetailModal.tsx))
```
┌────────────────────────────────────────────────────────┐
│ [📱] dimas                      [Badge Status]    [✕]  │
│      +62 821-5174-3688 • Perangkat Utama               │
├────────────────────────────────────────────────────────┤
│ [Scrollable Telemetry Body]                            │
│                                                        │
│ 🆔 IDENTITAS PERANGKAT                                 │
│ ├─ Device ID: 01M1M1CT7VENMEGEASSJ03GNMV [Salin]       │
│ ├─ WhatsApp JID: 6282151743688:80@s.whatsapp.net       │
│ └─ Tenant ID: 01M0...                                  │
│                                                        │
│ 🛡️ PROTEKSI ANTI-BAN & KESEHATAN SESI                  │
│ ├─ Skor Reputasi (Trust Score): 10/10 [Meter Bar]     │
│ ├─ Fase Pemanasan: Hari ke-1                          │
│ └─ Pesan Terkirim Hari Ini: 0 pesan                   │
│                                                        │
│ ⏱️ RIWAYAT WAKTU                                       │
│ ├─ Terakhir Aktif: 04 Sep 2026, 00:20 WIB             │
│ └─ Tanggal Ditautkan: 03 Sep 2026, 23:00 WIB          │
├────────────────────────────────────────────────────────┤
│ [Footer Actions]                                       │
│ [ ☀️ Bangunkan / 🌙 Hibernasi ]               [Tutup] │
└────────────────────────────────────────────────────────┘
```

---

## 3. 📁 Rencana Perubahan Berkas

### A. Backend Go (`wahide`)
1. **[`device_handler.go`](file:///g:/WEB2026/wahide/internal/modules/whatsapp/delivery/http/device_handler.go)**:
   - Tambahkan method `GetDevice(c *echo.Context) error` yang memanggil `h.crudUC.GetDevice(c.Request().Context(), auth.TenantID, id)`.
2. **[`router.go`](file:///g:/WEB2026/wahide/internal/modules/whatsapp/delivery/http/router.go)**:
   - Daftarkan endpoint `GET /whatsapp/devices/:id` dan `GET /wa/devices/:id`.

### B. Frontend Next.js (`fontwahide`)
1. **[`whatsapp.types.ts`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/types/whatsapp.types.ts)**:
   - Perbarui tipe `Device`: tambahkan `trustScore`, `warmupDay`, `dailySentCount`, `jid`. Hapus ketergantungan `batteryLevel`.
2. **[`whatsapp.api.ts`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/api/whatsapp.api.ts)**:
   - Petakan `trust_score`, `warmup_day`, `daily_sent_count`, dan `jid`.
   - Tambahkan method `getDevice: async (id: string): Promise<Device>`.
3. **[`DeviceCard.tsx`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/components/devices/DeviceCard.tsx)**:
   - Hapus UI baterai.
   - Tampilkan baris Device ID dengan tombol Salin (Copy).
   - Tampilkan informasi pesan harian & warmup.
   - Tambahkan tombol / opsi "Lihat Detail".
4. **[NEW] [`DeviceDetailModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/components/devices/DeviceDetailModal.tsx)**:
   - Modal detail interaktif dengan layout responsif `max-h-[90dvh]`, header sticky, scrollable telemetry body, dan sticky footer actions.
5. **[`DeviceList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/components/devices/DeviceList.tsx)**:
   - Integrasikan state `selectedDeviceForDetail` dan dynamic import `DeviceDetailModal`.
6. **[`locales/id/whatsapp.json`](file:///g:/WEB2026/fontwahide/src/locales/id/whatsapp.json) & [`locales/en/whatsapp.json`](file:///g:/WEB2026/fontwahide/src/locales/en/whatsapp.json)**:
   - Tambahkan kunci terjemahan: `deviceId`, `copyDeviceId`, `deviceIdCopied`, `viewDetail`, `trustScore`, `warmupDay`, `dailyMessagesSent`, dll.

---

## 4. 🧪 Rencana Pengujian & Quality Gate

1. **Backend Go**: Jalankan `make lint` (`go fmt` + `golangci-lint`) $\rightarrow$ pastikan 0 issues.
2. **Frontend TypeScript**: Jalankan `bun x tsc --noEmit` $\rightarrow$ pastikan 0 error.
3. **Frontend Linter**: Jalankan `bun run lint` $\rightarrow$ pastikan 0 error, 0 warning.
4. **Frontend Formatter**: Jalankan `bun run format` $\rightarrow$ pastikan lolos 100%.
5. **Kepatuhan Aturan**: Tidak menjalankan `bun run build` dan `git push`.
