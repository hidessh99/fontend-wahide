# 🛡️ Rencana Perbaikan: Penghapusan Protokol Mesin & Tenant ID pada Modal Detail Perangkat

Dokumen ini merancang penghapusan informasi teknis internal dan kredensial multi-tenant dari antarmuka pengguna `DeviceDetailModal.tsx` demi keamanan (*security hygiene*) dan profesionalitas tampilan (*white-label aesthetic*).

---

## 1. 💡 Evaluasi & Pandangan UX/UI Designer

### **Penilaian: 100% TEPAT DAN SANGAT BAGUS!**

| Informasi | Alasan Harus Dihapus | Dampak Positif |
| :--- | :--- | :--- |
| **Protokol Mesin (`whatsmeow Multi-Device (MD)`)** | Menampilkan nama library open-source internal (`whatsmeow`) membocorkan detail teknis implementasi backend. Dari sudut pandang SaaS profesional / White-Label, pengguna tidak perlu tahu library Go apa yang digunakan di balik layar. | Menjaga estetika produk tetap eksklusif, profesional, dan berstandar SaaS enterprise. |
| **Tenant ID (`01M1BT8E...`)** | `Tenant ID` adalah kunci partisi database internal (*multi-tenancy isolation key*). Mengeksposnya ke antarmuka pengguna biasa berpotensi membocorkan identifier internal yang bersifat sensitif/kredensial. | Mencegah kebocoran metadata arsitektur internal (*security by design*). |

---

## 2. 🎨 Hasil Perubahan Layout Modal

Setelah kedua kartu tersebut dihapus, seksi bawah dirampingkan menjadi **2 kartu simetris (50% - 50%)**:

```
┌────────────────────────────────────────────────────────┐
│ [📱] dimas                    [Hibernasi]         [✕]  │
│      📞 +62 821-5174-3688                              │
├────────────────────────────────────────────────────────┤
│ 🆔 IDENTITAS & PARAMETER SESI                          │
│ ┌───────────────────────────┬────────────────────────┐ │
│ │ Device ID: 01M1... [📋]   │ JID: 62821... [📋]     │ │
│ └───────────────────────────┴────────────────────────┘ │
│                                                        │
│ 🛡️ KESEHATAN SLOT & ANTI-BAN TELEMETRY                 │
│ ┌──────────────┬──────────────────┬──────────────────┐ │
│ │ Reputasi: 10 │ Fase Pemanasan:  │ Pesan Hari Ini:  │ │
│ │      / 10    │ Hari ke-1        │ 5 pesan          │ │
│ └──────────────┴──────────────────┴──────────────────┘ │
│                                                        │
│ ⏱️ RIWAYAT KONEKSI                                     │
│ ┌───────────────────────────┬────────────────────────┐ │
│ │ ⚡ Terakhir Aktif         │ 📅 Tanggal Ditautkan   │ │
│ │    Baru saja              │    03 Sep 2026, 16:57  │ │
│ └───────────────────────────┴────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ [ ☀️ Bangunkan ]                               [Tutup] │
└────────────────────────────────────────────────────────┘
```

---

## 3. 📁 Rencana Perubahan Berkas

### [MODIFY] [`fontwahide/src/modules/whatsapp/components/devices/DeviceDetailModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/whatsapp/components/devices/DeviceDetailModal.tsx)
1. Hapus elemen card **Protokol Mesin** (dan ikon `Zap`).
2. Hapus elemen card **Tenant ID**.
3. Sederhanakan grid riwayat waktu menjadi 2 kolom simetris:
   - **Terakhir Aktif** (`lastSeenAt`).
   - **Tanggal Ditautkan** (`createdAt`).
4. Bersihkan impor ikon yang tidak lagi digunakan (`Zap`).

---

## 4. 🧪 Rencana Pengujian & Quality Gate

1. `bun x tsc --noEmit` di direktori `fontwahide` (0 error).
2. `bun run lint` di direktori `fontwahide` (0 error, 0 warning).
3. `bun run format` di direktori `fontwahide`.
4. 🛡️ Tidak menjalankan `bun run build` dan `git push` (kepatuhan aturan).
