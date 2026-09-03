# 🛠️ Rencana Perbaikan: Solusi Modal Detail Kampanye Tidak Bisa Di-Scroll (Modal Scrolling Fix)

Dokumen ini merancang perbaikan struktural layout pada komponen `CampaignDetailModal.tsx` agar konten yang panjang dapat di-scroll dengan mulus dan tombol aksi di footer selalu terlihat (tidak terpotong di layar).

---

## 1. 🔍 Analisis Masalah

- **Gejala**: Ketika modal detail kampanye dibuka pada layar laptop/desktop, bagian bawah modal (kotak template pesan dan tombol aksi footer) terpotong dan keluar dari batas layar tanpa bisa di-scroll.
- **Penyebab**:
  - `DialogContent` pada `CampaignDetailModal.tsx` belum memiliki batas ketinggian maksimum (`max-h-[88vh]`).
  - Container modal menggunakan layout grid default tanpa pembagian flexbox antara Header (tetap di atas), Body (scrollable `overflow-y-auto`), dan Footer (tetap di bawah).

---

## 2. 🎨 Solusi Perbaikan Arsitektur Modal (UX/UI Standard)

Kita akan menerapkan struktur modal standar enterprise:

```
┌────────────────────────────────────────────────────────┐
│ [DialogHeader] (shrink-0, border-b)                    │
│  Nama Kampanye                            [Badge] [✕]  │
│  Deskripsi rincian kampanye                            │
├────────────────────────────────────────────────────────┤
│ [Scrollable Body] (flex-1, overflow-y-auto, p-5)       │
│                                                        │
│  ⏰ Banner Jadwal Pengiriman                           │
│  ┌────────────────────────┬─────────────────────────┐  │
│  │ Dibuat: 03 Sep, 23:24  │ Perangkat Utama         │  │
│  ├────────────────────────┼─────────────────────────┤  │
│  │ Audiens: #belajar      │ Anti-Ban: Jitter 3s     │  │
│  └────────────────────────┴─────────────────────────┘  │
│                                                        │
│  📊 Metrik Pengiriman Real-time                        │
│  💬 Template Pesan Lengkap (White-space monospace)     │
│  ... (Scrollable jika layar terbatas)                  │
├────────────────────────────────────────────────────────┤
│ [DialogFooter] (shrink-0, border-t, bg-muted/30)       │
│  [▶️ Mulai Siaran Sekarang]                    [Tutup] │
└────────────────────────────────────────────────────────┘
```

---

## 3. 📁 Rencana Perubahan Berkas

### [MODIFY] [`fontwahide/src/modules/campaign/components/broadcast/CampaignDetailModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignDetailModal.tsx)
1. **Container `DialogContent`**:
   Tambahkan `flex max-h-[88vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl`.
2. **`DialogHeader`**:
   Beri properti `shrink-0 border-b border-border/70 p-5 sm:p-6`.
3. **Body Konten**:
   Bungkus seluruh isi konten dengan `flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs font-semibold`.
4. **`DialogFooter`**:
   Beri properti `shrink-0 border-t border-border/70 p-4 sm:p-5 bg-muted/20 dark:bg-[#10110e] flex items-center justify-between`.

---

## 4. 🧪 Rencana Pengujian & Quality Gate

1. `bun x tsc --noEmit` di direktori `fontwahide` (0 error).
2. `bun run lint` di direktori `fontwahide` (0 error).
3. `bun run format` di direktori `fontwahide`.
4. 🛡️ Tidak menjalankan `bun run build` dan `git push` (kepatuhan aturan).
