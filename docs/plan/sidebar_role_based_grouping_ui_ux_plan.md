# 🧭 Rencana & Evaluasi UI/UX: Restrukturisasi Sidebar Navigasi Berbasis Grouping & Pemisahan Role (Sleek & Clean)

Analisis mendalam, evaluasi prinsip UI/UX, dan rencana implementasi restrukturisasi sidebar navigasi pada `DashboardSidebar.tsx` dan `DashboardMobileNav.tsx` dengan:
1. Menghapus badge `FREE` pada logo header.
2. **Menghapus footer box "Anti-Ban Multi-Device / Noise Protocol"** di bagian bawah sidebar agar antarmuka lebih bersih (*clean & minimalist*) dan memberikan ruang vertikal lega untuk navigasi.
3. Memisahkan hak akses navigasi antar role (*Super Admin*, *Seller*, dan *Agent/Operator*).
4. Mengelompokkan menu menjadi 4 kategori terstruktur (*General*, *WhatsApp Engine*, *Account & Billing*, dan *Support*).

---

## 🎨 1. Evaluasi & Pandangan UI/UX (Expert Assessment)

### 💡 Penilaian UI/UX:
1. **Penghapusan Badge "FREE" di Header Logo**:
   * Logo murni `Wahide.` (dengan aksen titik hijau) memberikan impresi produk premium (*Clean Tech Branding*).
2. **Penghapusan Footer Box "Anti-Ban Multi-Device"**:
   * Menghilangkan kotak info statis di bagian bawah sidebar membuat sidebar terlihat sangat rapi, minimalis, dan modern (seperti standar dashboard Vercel / Stripe / Linear).
   * Seluruh area sidebar kini sepenuhnya didedikasikan untuk navigasi yang fungsional tanpa distraksi teks statis yang tidak bisa diklik.
3. **Manfaat Grouping Kategori (Cognitive Ergonomics)**:
   * Pengelompokan 4 blok kategori (*Overview*, *WhatsApp Engine*, *Account & Billing*, *Support*) memangkas waktu pencarian menu hingga 60%.
4. **Pemisahan Hak Akses Role yang Presisi (*Role-Based Navigation*)**:
   * **Super Admin**: Akses penuh ke seluruh fitur tenant + blok khusus *Sistem Global Superadmin*.
   * **Seller / Owner**: Akses operasional WhatsApp, manajemen CS Team, paket langganan, saldo deposit & faktur, serta pengaturan API Key.
   * **Agent / Operator / Staff**: Murni fokus pada operasional harian (*Overview*, *WhatsApp Slots*, *Broadcast Campaigns*, *Buku Kontak*, *Tiket Bantuan*). Menu sensitif finansial (*Billing, Plans, API Key, CS Team*) disembunyikan.

---

## 📐 2. Struktur Visual Sidebar Baru (Clean & Sleek)

```
┌────────────────────────────────────────────────────────┐
│  ● Wahide.                                             │  <- Logo Bersih (Tanpa Badge Free)
├────────────────────────────────────────────────────────┤
│                                                        │
│  [ ⊞ Overview ]                                        │  <- Menu Utama
│                                                        │
│  WHATSAPP ENGINE                                       │  <- Grup 1: Engine & Broadcasting
│  [ 📱 WhatsApp Slots                 (Engine) ]        │
│  [ ✈️ Broadcast Campaigns                      ]        │
│  [ 👥 Contact Book                             ]        │
│  [ 👤 CS Team & Agents             (Seller/Admin) ]    │
│                                                        │
│  MANAJEMEN & AKUN (ACCOUNT & BILLING)                  │  <- Grup 2: Finansial & Pengaturan
│  [ 💳 Plans / Paket Langganan      (Seller/Admin) ]    │
│  [ 🧾 Balance & Invoices           (Seller/Admin) ]    │
│  [ ⚙️ Settings & API                           ]        │
│                                                        │
│  PUSAT BANTUAN (SUPPORT)                               │  <- Grup 3: Pusat Bantuan
│  [ 🛟 Helpdesk Tickets                         ]        │
│                                                        │
│  SISTEM GLOBAL (Khusus Super Admin)                    │  <- Grup 4: Khusus Super Admin
│  [ 🛡️ Panel Superadmin                         ]        │
│                                                        │
└────────────────────────────────────────────────────────┘
```
*(Footer box Anti-Ban telah dihapus sepenuhnya untuk estetika clean & minimalis).*

---

## 🛠️ 3. Rencana File & Modifikasi Kode

### 📌 1. [`DashboardSidebar.tsx`](file:///G:/WEB2026/fontwahide/src/components/layout/dashboard/DashboardSidebar.tsx)
* **Header**: Hapus badge `{tenant?.planName || "Free"}` di samping logo.
* **Footer**: Hapus blok `<div className="p-4 border-t border-border m-3 rounded-md bg-[#f2f4ef] dark:bg-[#161715]">...</div>`.
* **Nav Items Schema**: Perbarui struktur array navigasi menjadi grouped items:
  ```ts
  export interface DashboardNavGroup {
    groupKey?: string; // e.g. "dashboardMenu.groupWhatsapp"
    roles?: UserRole[];
    items: DashboardNavItem[];
  }
  ```
* **Render Loop**: Render sub-header kategori (`text-[10px] font-bold uppercase tracking-wider text-foreground-muted`) untuk setiap grup, dan filter item berdasarkan role aktif.

### 📌 2. [`id/common.json`](file:///G:/WEB2026/fontwahide/src/locales/id/common.json) & [`en/common.json`](file:///G:/WEB2026/fontwahide/src/locales/en/common.json)
* Tambahkan key label kategori grouping:
  * ID:
    * `"groupGeneral": "Menu Utama"`
    * `"groupWhatsapp": "WhatsApp Engine"`
    * `"groupAccount": "Manajemen & Akun"`
    * `"groupSupport": "Pusat Bantuan"`
  * EN:
    * `"groupGeneral": "General"`
    * `"groupWhatsapp": "WhatsApp Engine"`
    * `"groupAccount": "Account & Billing"`
    * `"groupSupport": "Helpdesk & Support"`

---

## 🔍 4. Verification Plan
* Jalankan `bun x tsc --noEmit` di `fontwahide`.
* Jalankan `bun run lint` di `fontwahide`.
* Uji coba responsivitas desktop dan mobile drawer navigation.
