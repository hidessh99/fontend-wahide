# 🧭 Audit Menyeluruh Seluruh Komponen Modal & Rencana Standarisasi Viewport Responsiveness (Anti-Cutoff)

Audit lengkap terhadap seluruh komponen Modal / Dialog di frontend (`fontwahide`) untuk mencegah masalah konten terpotong (*clipped content*), tidak bisa di-scroll, dan tombol aksi (*Batal / Simpan / Kirim*) hilang di luar layar laptop.

---

## 🔍 1. Hasil Audit 13 Komponen Modal di Seluruh Sistem

| No | Nama Komponen Modal | Lokasi File | Status Saat Ini | Masalah / Risiko |
|---|---|---|---|---|
| 1 | **CreateTicketModal** | [`services/support/components/CreateTicketModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/CreateTicketModal.tsx) | 🟢 **PERFECT** *(Baru Saja Diperbaiki)* | Sudah menerapkan 3-Layer Sticky Layout (Header sticky, Body scrollable, Footer sticky). |
| 2 | **TopUpModal** | [`services/finance/components/TopUpModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/TopUpModal.tsx) | 🟢 **PERFECT** | Sudah 3-Layer Sticky Layout. |
| 3 | **InvoiceReceiptModal** | [`services/finance/components/InvoiceReceiptModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceReceiptModal.tsx) | 🟢 **PERFECT** | Sudah 3-Layer Sticky Layout (Print-ready). |
| 4 | **LiveQRModal** | [`services/whatsapp/components/LiveQRModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/LiveQRModal.tsx) | 🟢 **PERFECT** | Header sticky, Tab switcher fixed, body scrollable. |
| 5 | **DeleteContactModal** | [`services/contact/components/DeleteContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/DeleteContactModal.tsx) | 🟢 **AMAN** | Dialog konfirmasi ringkas (compact alert). |
| 6 | **DeleteTeamMemberModal** | [`services/team/components/DeleteTeamMemberModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/team/components/DeleteTeamMemberModal.tsx) | 🟢 **AMAN** | Dialog konfirmasi ringkas (compact alert). |
| 7 | **AdjustBalanceModal** | [`services/admin/components/AdjustBalanceModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/AdjustBalanceModal.tsx) | 🔴 **RENTAN TERPOTONG** | Outer card `max-h-[90vh] overflow-hidden` tanpa body `flex-1 overflow-y-auto min-h-0`. Tombol Simpan bisa hilang di laptop kecil. |
| 8 | **ImportCsvModal** | [`services/contact/components/ImportCsvModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ImportCsvModal.tsx) | 🔴 **RENTAN TERPOTONG** | Saat preview CSV muncul, tinggi modal memanjang melebihi 90vh dan tombol "Mulai Impor" terpotong di bawah tanpa bisa di-scroll. |
| 9 | **ContactModal** | [`services/contact/components/ContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactModal.tsx) | 🟡 **PERLU STANDARISASI** | Outer card statis padding, form belum memiliki scroll internal independen. |
| 10 | **TicketThreadModal** | [`services/support/components/TicketThreadModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketThreadModal.tsx) | 🟡 **PERLU STANDARISASI** | Input composer dan header belum diisolasi `shrink-0` murni. |
| 11 | **CampaignWizardModal** | [`services/campaign/components/CampaignWizardModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/campaign/components/CampaignWizardModal.tsx) | 🟡 **PERLU STANDARISASI** | Body sudah `overflow-y-auto`, namun header & footer perlu di-docking `shrink-0` dengan `min-h-0` agar stabil di semua browser. |
| 12 | **AddDeviceModal** | [`services/whatsapp/components/AddDeviceModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/AddDeviceModal.tsx) | 🟡 **PERLU STANDARISASI** | Footer tombol masih berada di dalam form scrollable; perlu dipindahkan ke sticky footer bawah. |
| 13 | **SendMessageModal** | [`services/whatsapp/components/SendMessageModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/SendMessageModal.tsx) | 🟡 **PERLU STANDARISASI** | Footer tombol masih berada di dalam form scrollable; perlu dipindahkan ke sticky footer bawah. |

---

## 🛠️ 2. Standar Arsitektur Emas (*Gold Standard Modal Pattern*)

Setiap modal yang memiliki form atau konten dinamis **WAJIB** menerapkan struktur 3-Layer:

```tsx
<div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in">
  <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
    {/* 1. STICKY HEADER (shrink-0) */}
    <div className="p-5 sm:p-6 pb-4 border-b border-border/80 flex items-start justify-between shrink-0">
      {/* Title & Close Button */}
    </div>

    {/* 2. SCROLLABLE BODY (flex-1 overflow-y-auto min-h-0) */}
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 min-h-0">
      {/* Form Fields / Content */}
    </div>

    {/* 3. STICKY FOOTER (shrink-0) */}
    <div className="p-4 sm:p-6 pt-3 border-t border-border/80 bg-surface/90 dark:bg-[#161715]/90 backdrop-blur-sm flex items-center justify-end gap-2.5 shrink-0">
      {/* Cancel & Submit Action Buttons */}
    </div>
  </div>
</div>
```

---

## 📋 3. Rencana Eksekusi Standarisasi (Action Plan)

Kita akan menstandarisasi 7 komponen yang rentan:
1. [`AdjustBalanceModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/AdjustBalanceModal.tsx)
2. [`ImportCsvModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ImportCsvModal.tsx)
3. [`ContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactModal.tsx)
4. [`TicketThreadModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketThreadModal.tsx)
5. [`CampaignWizardModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/campaign/components/CampaignWizardModal.tsx)
6. [`AddDeviceModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/AddDeviceModal.tsx)
7. [`SendMessageModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/SendMessageModal.tsx)

---

## 🔍 4. Verification Plan
* `bun x tsc --noEmit`: Memastikan 0 type error.
* `bun run lint`: Memastikan 0 lint error.
* Menguji modal di resolusi kecil/laptop untuk memastikan tombol aksi selalu terlihat di bawah dan konten dapat di-scroll dengan sempurna.
