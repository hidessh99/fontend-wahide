# 🧭 Analisis & Rencana Perbaikan: Responsivitas Viewport Modal, Scrollability, & Aksesibilitas (`LiveQRModal` & Seluruh Modal)

Dokumen investigasi mendalam mengenai akar penyebab modal terpotong di layar (*viewport clipping*), tidak bisa di-scroll, dan tombol close terpotong pada laptop/resolusi tertentu, serta rencana standardisasi arsitektur modal enterprise.

---

## 🔍 1. Hasil Audit & Investigasi Akar Masalah (Root Cause)

Berdasarkan analisis tangkapan layar `http://localhost:3000/devices`:

1. **Akar Masalah Viewport Overflow & Clipping**:
   * Kontainer luar modal menggunakan:
     ```tsx
     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
     ```
   * Kontainer dalam menggunakan tinggi dinamis tanpa batas maksimum:
     ```tsx
     <div className="relative w-full max-w-lg rounded-md border border-border bg-surface shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
     ```
   * **Mengapa Terpotong?** Total tinggi konten QR Modal (Header + Badge + Box QR 200px + Countdown + 3 Petunjuk Teks + Tombol Tutup) adalah sekitar **~750px**. Pada layar laptop (resolusi 1366x768 atau 1080p dengan zoom browser 125% / bookmark bar), tinggi viewport yang tersisa hanya ~600px–680px.
   * Karena `items-center` memposisikan modal di tengah vertikal, bagian **Header (judul & tombol X) terdorong keluar ke atas layar (offscreen top)** dan bagian **Footer (tombol Tutup) terdorong keluar ke bawah layar (offscreen bottom)**.
   * Kontainer overlay `fixed inset-0` tidak memiliki `overflow-y-auto`, dan kontainer dalam memiliki `overflow-hidden`, sehingga **pengguna tidak bisa menggulir (*scroll*) untuk melihat tombol tutup atau petunjuk**.

2. **Ketiadaan Fitur UX Standar (*Backdrop Click* & *Escape Key*)**:
   * Pengguna tidak bisa menutup modal dengan menekan tombol `Escape` di keyboard.
   * Pengguna tidak bisa menutup modal dengan mengklik area gelap di luar modal (*backdrop click*).

---

## ⚡ 2. Solusi & Rencana Implementasi Arsitektur Modal Enterprise

Kita akan menstandarisasi struktur seluruh modal (`LiveQRModal` dan 9 modal lainnya) dengan pola **Flex Column + Scrollable Body + Header/Footer Terkunci**:

```
┌────────────────────────────────────────────────────────────┐
│ Fixed Backdrop (overflow-y-auto, click-outside-to-close)   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Modal Container (max-h-[90vh], flex flex-col)        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ 1. Sticky Header (Title & Tombol 'X' Selalu Ada)│  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │ 2. Scrollable Body (overflow-y-auto p-6)       │  │  │
│  │  │    - Box QR Code (Optimal size 180px)          │  │  │
│  │  │    - Countdown / Refresh Button                │  │  │
│  │  │    - Petunjuk Pemindaian Ponsel                │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │ 3. Sticky Footer (Tombol Tutup / Aksi Utama)   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Rincian Peningkatan Teknis:
1. **Overlay Backdrop**:
   * `fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 flex min-h-full items-center justify-center`
   * Event `onClick` pada backdrop untuk menutup modal saat area luar diklik.
2. **Inner Modal Container**:
   * `w-full max-w-lg max-h-[90vh] flex flex-col rounded-md border border-border bg-surface shadow-2xl`
3. **Body Scrollable**:
   * `overflow-y-auto p-5 sm:p-6 space-y-5 flex-1` (Jika layar laptop kecil, hanya area isi yang di-scroll, sedangkan Header dan Footer tetap terlihat).
4. **Keyboard Accessibility**:
   * Menambahkan listener event `Escape` keydown untuk menutup modal seketika.

---

## 📋 3. Daftar Berkas Modal yang Akan Distandarisasi:
1. [`src/services/whatsapp/components/LiveQRModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/LiveQRModal.tsx)
2. [`src/services/whatsapp/components/AddDeviceModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/AddDeviceModal.tsx)
3. [`src/services/whatsapp/components/SendMessageModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/SendMessageModal.tsx)
4. [`src/services/campaign/components/CampaignWizardModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/campaign/components/CampaignWizardModal.tsx)
5. [`src/services/contact/components/ContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactModal.tsx)
6. [`src/services/contact/components/ImportCsvModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ImportCsvModal.tsx)
7. [`src/services/finance/components/TopUpModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/TopUpModal.tsx)
8. [`src/services/support/components/CreateTicketModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/CreateTicketModal.tsx)
9. [`src/services/support/components/TicketThreadModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketThreadModal.tsx)
10. [`src/services/admin/components/AdjustBalanceModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/AdjustBalanceModal.tsx)
