# 📋 Rencana Komprehensif: Evaluasi & Perbaikan Fitur "Input Manual" serta Status Kampanye Otomatis

Dokumen ini menjawab pertanyaan arsitektur produk dan teknis:
> *"Apakah sebaiknya inputan manual dihapus atau diperbaiki atau ada cara lain? Kenapa status kampanye input manual masih 'Sedang Mengirim' padahal pesan sudah sampai?"*

---

## 1. 🎯 Rekomendasi Arsitektur: Dihapus atau Diperbaiki?

### **Rekomendasi: JANGAN DIHAPUS, TETAP DILANJUTKAN & DIPERBAIKI**

| Opsi | Dampak Bisnis & UX | Rekomendasi |
| :--- | :--- | :--- |
| **Opsi A: Dihapus** | Pengguna kehilangan fleksibilitas. Pengguna dipaksa memasukkan setiap nomor baru ke buku kontak (`contacts`) meskipun hanya ingin mengirim pengumuman sekali pakai (*one-off blast*). Mengurangi daya saing platform dibanding tools WhatsApp gateway lainnya. | ❌ Tidak Disarankan |
| **Opsi B: Diperbaiki & Disempurnakan (Rekomendasi)** | Sistem sudah terbukti **100% sukses mengirim pesan manual** (terbukti di database: target 1, sent 1). Hanya memerlukan restart backend dan penataan tampilan badge nomor di kartu/modal agar pengguna tahu nomor mana saja yang ditargetkan. | ✅ **Sangat Direkomendasikan** |

---

## 2. 🔍 Investigasi: Mengapa Status Kampanye `fhdh` Masih "Sedang Mengirim"?

Berdasarkan pemeriksaan langsung ke database MySQL dan proses sistem:
1. **Pesan Manual Sudah Berhasil Terkirim 100%**:
   - Kampanye `fhdh` (`01M1M3P3DXNFSY3VBRA15B86J8`) memiliki data:
     `total_target = 1`, `total_sent = 1`, `total_failed = 0`.
   - Log pesan WhatsApp telah terkirim ke nomor `6287711301818`.
2. **Akar Masalah Status Belum Berubah**:
   - Proses Go backend (`go run ./cmd/web/main.go`, PID 12580) tercatat berjalan sejak **23:56:07 WIB**.
   - Perbaikan kode `IncrementProgress` (yang secara otomatis mengubah status ke `COMPLETED`) baru ditulis pada **00:01:36 WIB**.
   - Karena bahasa Go adalah bahasa terkompilasi (*compiled language*), kode baru tersebut **belum dieksekusi oleh proses Go yang sedang aktif** sampai server backend di-restart / di-recompile.
   - Akibatnya, worker yang memproses pengiriman masih menjalankan logika lama yang tidak meng-update status ke `COMPLETED`.

---

## 3. 🛠️ Rencana Langkah Perbaikan Menyeluruh

### Langkah 1: Normalisasi Nomor Telepon Otomatis (Frontend Wizard)
- Di [`CampaignWizardModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignWizardModal.tsx):
  - Tambahkan fungsi pembersih dan penyeragam nomor:
    - Jika pengguna mengetik `0877...` $\rightarrow$ otomatis diubah ke `62877...`.
    - Jika pengguna mengetik `+62877...` $\rightarrow$ tanda plus dihilangkan menjadi `62877...`.
    - Membersihkan karakter spasi, strip, dan karakter non-angka.
  - Memberikan umpan balik jumlah nomor valid secara real-time.

### Langkah 2: Tampilan Elegan untuk Input Manual (Detail Modal & List)
- Di [`CampaignDetailModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignDetailModal.tsx):
  - Ketika `targetType === "CUSTOM"`, tampilkan pill badge nomor telepon:
    `[📞 6287711301818]` agar pengguna dapat memeriksa daftar nomor yang dikirimi pesan.
- Di [`CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx):
  - Di footer kartu audiens: Tampilkan `🎯 Input Manual (1 nomor)` jika menggunakan input manual, bukan tanda strip.

### Langkah 3: Eksekusi Restart Backend Go (`wahide`)
- Me-restart proses backend Go agar file binary yang berjalan memuat logika `IncrementProgress` dan `FindAll` terbaru.
- Seketika server aktif kembali, fungsi `FindAll` secara otomatis merekonsiliasi seluruh kampanye (termasuk `fhdh`) yang `total_sent >= total_target` menjadi **`COMPLETED`**.

---

## 4. 🧪 Rencana Pengujian & Quality Gate

1. Update status kampanye `fhdh` di database ke `COMPLETED`.
2. Restart service backend Go `wahide`.
3. Verifikasi dengan `make lint` di backend (0 issues).
4. Verifikasi `bun x tsc --noEmit` & `bun run lint` di frontend (0 error).
5. Buat pengujian siaran kampanye baru dengan "Input Manual" untuk membuktikan status otomatis berubah dari `RUNNING` menjadi `COMPLETED` saat pesan terkirim.
