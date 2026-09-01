# 📱 Master Audit & Rencana Redesain UX/UI Responsif Seluruh Platform Wahide

Dokumen audit mendalam dari **Senior Expert UX/UI Designer** mengenai permasalahan responsivitas tampilan mobile (viewport 360px – 430px) pada seluruh halaman dashboard dan manajemen di `fontwahide`, memetakan 4 akar antipattern sistemik, serta rencana standardisasi **Mobile-First Responsive System**.

---

## 🔍 1. Hasil Audit 4 Antipattern Sistemik pada Seluruh Komponen

Berdasarkan investigasi komprehensif di seluruh `src/components/` dan `src/services/`, ditemukan bahwa masalah yang sebelumnya terjadi pada `/support` juga **terduplikasi di 6 modul utama lainnya**:

### 🚨 Antipattern 1: Filter Pills Terjepit di Kontainer Statis Sempit
* **Penyebab**: Menggunakan `flex items-center p-1 rounded-full bg-muted border border-border text-xs font-bold` untuk membungkus 4-5 tombol filter status. Di layar ponsel (< 400px), kontainer sempit memaksa teks label terpotong atau patah menjadi 2 baris canggung (`"Menunggu \n Respons"`, `"Sedang \n Ditangani"`, `"Terputus \n Sesi"`).
* **Komponen yang Terdampak**:
  1. [`DeviceList.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/DeviceList.tsx#L153) (Filter: Semua Sesi, Terhubung, Terputus, Hibernasi).
  2. [`BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx#L128) (Filter: Semua, Lunas, Menunggu, Kadaluarsa).

### 🚨 Antipattern 2: Tabel Desktop Dipaksakan ke Layar Ponsel (`grid grid-cols-12`)
* **Penyebab**: Komponen tabel langsung merender `grid-cols-12` tanpa fallback tampilan kartu (*card view*) untuk mobile.
* **Komponen yang Terdampak**:
  1. **[`InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx#L67)**:
     * Pada mobile, tombol aksi `"Bayar Sekarang"` atau `"Lihat Faktur"` dimasukkan ke dalam `col-span-2` (~50px), menyebabkan tombol meluap (*overflow*) keluar dari batas layar.
  2. **[`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx#L59)**:
     * Kolom aksi hanya diberikan `col-span-1` (~25px), padahal memuat DUA tombol aksi (`Edit` dan `Trash2`). Akibatnya kedua tombol bertumpuk dan menabrak teks nomor telepon di sampingnya.
  3. **[`TeamView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/TeamView.tsx#L184)**:
     * 4 kolom informasi staf dan tombol hapus dipaksakan ke layar 360px.
  4. **[`UsersTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/UsersTable.tsx#L135)**:
     * Kolom Nama, Paket, Kuota, Saldo, dan Aksi berdesakan parah di mobile.
  5. **[`AuditLogsTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/AuditLogsTable.tsx#L244)**:
     * Kolom Pengguna, IP, Event, User Agent, dan Waktu saling tumpang tindih.

### 🚨 Antipattern 3: Form Pencarian & Tombol "Cari" Terhimpit
* **Penyebab**: Form pencarian dibungkus dalam `flex-1 max-w-md flex items-center gap-2`. Di layar ponsel, input teks berbagi ruang sempit dengan tombol `"Cari"`, membuat placeholder panjang terpotong drastis (`"Cari nomor faktur atau d..."`, `"Cari nama, email, atau n..."`).
* **Komponen yang Terdampak**:
  1. [`BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx#L90)
  2. [`TeamView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/TeamView.tsx#L146)
  3. [`MessageLogsTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/campaign/components/MessageLogsTable.tsx#L177)
  4. [`AuditLogsTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/AuditLogsTable.tsx#L210)
  5. [`UsersTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/UsersTable.tsx#L73)

### 🚨 Antipattern 4: Padding Boros & Tombol Aksi Berserakan
* **Penyebab**: Padding luar `p-4 sm:p-6 lg:p-8` dan padding kartu kosong `p-12` (48px) membuang ruang layar vertikal secara sia-sia. Tombol aksi atas (`Export CSV`, `Import CSV`, `Tambah Kontak`) membungkus secara tidak teratur di mobile (`flex-wrap`).
* **Komponen yang Terdampak**:
  1. [`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx#L128)
  2. [`BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx#L56)
  3. [`DashboardOverviewView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/DashboardOverviewView.tsx#L134)

---

## 🎨 2. Blueprint Solusi Desain Standar Emas Mobile UI

Berikut adalah arsitektur desain terpadu yang akan diterapkan di seluruh komponen:

### Pola 1: Horizontal Scrollable Filter Chips (Zero Text Wrapping)
Semua filter status diubah menjadi chip geser horizontal:
```tsx
<div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth flex-1 min-w-0">
  {options.map((opt) => (
    <button className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ...">
      {opt.label}
    </button>
  ))}
</div>
```
* **Manfaat**: Teks selalu utuh 1 baris, dapat digeser mulus dengan jempol, dan memenuhi standar ergonomi Apple & Android.

### Pola 2: Dual-Mode List: Mobile Card List vs Desktop Table
Untuk semua tabel data tabular:
* **Layar Mobile (`< 768px / block md:hidden`)**: Render kartu data yang elegan, di mana nomor/judul di atas, metadata di tengah, dan tombol aksi di bawah yang mudah disentuh (min. 44px touch target).
* **Layar Desktop (`>= 768px / hidden md:block`)**: Tetap pertahankan format tabel tabular yang luas dan informatif.

### Pola 3: Toolbar Pencarian Adaptif
* Di mobile: form pencarian adaptif full-width dengan ikon pencarian terintegrasi dan tombol submit/clear yang rapi.

### Pola 4: Standarisasi Ruang & Padding
* Padding kontainer luar distandarisasi ke `p-3 sm:p-6 lg:p-8`.
* Padding empty state distandarisasi ke `p-6 sm:p-10`.

---

## 📋 3. Rencana Eksekusi Bertahap

### Tahap 1: WhatsApp Device Management ([`DeviceList.tsx`](file:///G:/WEB2026/fontwahide/src/services/whatsapp/components/DeviceList.tsx))
* Ubah filter status sesi (`ALL`, `CONNECTED`, `DISCONNECTED`, `HIBERNATED`) menjadi horizontal scrollable chips.
* Tata ulang toolbar pencarian dan tombol aksi agar rapi di mobile.

### Tahap 2: Keuangan & Faktur ([`BillingView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/BillingView.tsx) & [`InvoiceTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/finance/components/InvoiceTable.tsx))
* Ubah filter faktur (`Semua`, `Lunas`, `Menunggu`, `Kadaluarsa`) menjadi horizontal scrollable chips.
* Rombak `InvoiceTable.tsx` menjadi Dual-Mode (Mobile Card View + Desktop Table) agar tombol `"Bayar Sekarang"` dan `"Lihat Faktur"` tidak meluap keluar layar.

### Tahap 3: Kontak Pelanggan ([`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx) & [`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx))
* Rombak `ContactTable.tsx` menjadi Dual-Mode (Mobile Card View + Desktop Table) agar tombol `Edit` dan `Hapus` memiliki area sentuh yang luas dan tidak bertabrakan dengan nomor telepon.
* Rapikan tombol aksi ekspor/impor/tambah kontak pada mobile.

### Tahap 4: Tim & Staf Agen ([`TeamView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/TeamView.tsx))
* Rombak tabel staf menjadi Dual-Mode (Mobile Card View + Desktop Table).

### Tahap 5: Portal Admin ([`UsersTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/UsersTable.tsx) & [`AuditLogsTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/admin/components/AuditLogsTable.tsx))
* Implementasikan Dual-Mode / horizontal scroll wrapper responsif untuk data audit dan manajemen pengguna admin.

---

## 🔍 4. Verification Plan
1. `bun x tsc --noEmit`: 0 errors.
2. `bun run lint`: 0 errors, 0 warnings.
3. Verifikasi responsive breakpoints pada 360px (Samsung Android kecil), 390px (iPhone 14/15/16), 768px (Tablet), dan 1280px (Desktop).
