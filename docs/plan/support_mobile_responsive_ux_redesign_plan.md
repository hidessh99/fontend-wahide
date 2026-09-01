# 📱 Audit & Rencana Redesain UX/UI Mobile: Optimasi Responsivitas Modul Dukungan (`/support`)

Dokumen analisis mendalam dari sudut pandang **UX/UI Designer & Mobile Architect** mengenai kendala tampilan pada layar ponsel (viewport 360px - 430px) pada halaman `http://localhost:3000/support` berdasarkan screenshot evaluasi pengguna (`media_1788236414205.png`), serta rencana perbaikan menyeluruh (*mobile-first responsive overhaul*).

---

## 🔍 1. Temuan Masalah UX/UI pada Tampilan Mobile (Audit Visual Screenshot)

Berdasarkan tangkapan layar perangkat mobile yang Anda berikan, ditemukan 5 kendala utama yang merusak pengalaman pengguna (*broken mobile ergonomics*):

```
KONDISI SEKARANG (BERMASALAH):
+-------------------------------------------------------------+
| [ Q Cari tiket berdasar...       ] [ Cari ]  <-- Terhimpit  |
+-------------------------------------------------------------+
| [Semua  ] [Menunggu ] [Sedang    ] [Selesai] <-- Teks patah |
| [Status ] [Respons  ] [Ditangani ]           <-- 2 baris!   |
+-------------------------------------------------------------+
| [🔄]  [+ Buat Tiket Baru]                    <-- Canggung & |
|                                              <-- menggantung|
+-------------------------------------------------------------+
```

### A. Filter Pills Terjepit & Teks Patah Dua Baris (*Cramped Filter Box*)
* **Masalah**: Kontainer filter dibungkus dalam `rounded-full` statis dengan lebar sempit. Akibatnya, 4 filter status dipaksa masuk ke dalam ruang ~320px.
* **Dampak**: Teks label terbelah menjadi dua baris secara tidak wajar (`"Menunggu \n Respons"`, `"Sedang \n Ditangani"`). Tombol menjadi sempit, sulit disentuh jempol (*fat-finger problem*), dan merusak estetika antarmuka.

### B. Form Pencarian & Tombol "Cari" Terhimpit (*Squished Search Bar*)
* **Masalah**: Input pencarian disandingkan berdampingan dengan tombol `"Cari"` dalam `flex items-center gap-2`. Pada layar kecil, placeholder `"Cari tiket berdasarkan subjek..."` terpotong parah menjadi `"Cari tiket berdasar..."`.

### C. Penempatan Tombol Aksi Tidak Proporsional (*Awkward Action Buttons*)
* **Masalah**: Tombol refresh `[🔄]` dan tombol utama `[+ Buat Tiket Baru]` diletakkan di baris terpisah di bawah filter pills dengan perataan kiri (`items-center gap-2`), menyisakan ruang kosong besar di sebelah kanannya. Hirarki tombol utama menjadi tenggelam.

### D. Tampilan Tabel Desktop di Ponsel (*Grid Hijacking pada Mobile*)
* **Masalah**: Saat ada data tiket, komponen merender `grid-cols-12` desktop:
  * Kolom 6: Nomor & Subjek Tiket
  * Kolom 3: Status Badge
  * Kolom 3: Tombol Buka
* **Dampak**: Di layar 360px, ruang 6 kolom hanya sekitar ~170px. Judul tiket terpotong pendek, status badge terhimpit, dan tabel terasa dipaksakan untuk perangkat genggam.

### E. Spasi dan Padding yang Terlalu Boros (*Excessive White Space*)
* **Masalah**: Empty state card memiliki padding `p-12` (48px) yang menghabiskan hampir separuh tinggi layar ponsel tanpa nilai tambah informasi.

---

## 🎨 2. Solusi Desain Mobile-First (Standar Aplikasi B2B Kelas Dunia)

Untuk menghadirkan pengalaman pengguna yang mulus, rapi, dan ergonomis di ponsel layaknya Linear, Stripe, dan GitHub Mobile, kita akan mengimplementasikan pendekatan **Mobile-First Responsive Pattern**:

```
SOLUSI DESAIN BARU (MOBILE OPTIMIZED):
+-------------------------------------------------------------+
| Tiket Bantuan                    [+ Buat Tiket] <-- Header  |
| Pusat dukungan teknis Wahide                    <-- Jelas   |
+-------------------------------------------------------------+
| [🔍 Cari tiket berdasarkan subjek atau nomor...] <-- Full-W |
+-------------------------------------------------------------+
| [Semua Status] [Menunggu Respons] [Sedang Ditangani]  --> 🔄|
| <--------- Horizontal Scrollable Chips (Satu Baris) -------->|
+-------------------------------------------------------------+
| +---------------------------------------------------------+ |
| | #TKT-202609-UURDM                       [Menunggu]      | |
| | Belajar Integrasi WhatsApp                              | |
| | WhatsApp Gateway • Tinggi • 01 Sep, 10:51       [Buka >]| |
| +---------------------------------------------------------+ |
| (Card View Mobile: Luas, Mudah Disentuh, Sangat Rapi!)     |
+-------------------------------------------------------------+
```

### 1. Horizontal Scrollable Filter Chips (Standar Emas Mobile UI)
* Mengubah kontainer filter pills di mobile menjadi **Horizontal Scrollable Chips** (`overflow-x-auto no-scrollbar whitespace-nowrap flex-nowrap`).
* Teks status tetap berada di **satu baris utuh** (*single-line*), dengan padding tombol yang nyaman disentuh (`px-3.5 py-1.5`).
* Pengguna dapat menggeser (*swipe*) chip dengan jempol secara halus (*smooth scrolling*).
* Tombol refresh `[🔄]` ditempatkan menyatu secara elegan di samping chip filter.

### 2. Search Input Full-Width & Terintegrasi
* Di layar ponsel, input pencarian dibuat selebar layar penuh (`w-full`) dengan tombol cari menyatu atau pembersihan instan dengan tombol silang `(X)`.

### 3. Dual-Mode List: Mobile Cards vs Desktop Table
* **Mode Ponsel (`block md:hidden`)**:
  * Tiket ditampilkan dalam format **Kartu Tiket Native Mobile**:
    * Baris Atas: Nomor Tiket Monospace (kiri) + Status Badge (kanan).
    * Baris Tengah: Judul Subjek Tiket dengan tipografi tebal (H4).
    * Baris Bawah: Kategori, Prioritas, Tanggal, dan tombol aksi `"Buka"` yang nyaman disentuh.
* **Mode Desktop (`hidden md:block`)**:
  * Tetap mempertahankan format tabel 12-kolom yang luas dan profesional untuk layar laptop/monitor.

### 4. Tombol Utama Header yang Responsif
* Di mobile, tombol `+ Buat Tiket` diposisikan secara strategis di samping judul header atau di atas toolbar pencarian agar langsung terlihat saat halaman dimuat (*above-the-fold CTA*).

### 5. Optimasi Halaman Detail (`TicketDetailView.tsx`) di Mobile
* Memastikan padding kontainer mobile menggunakan `p-3 sm:p-6 lg:p-8`.
* Komposer balasan di ponsel memiliki tombol kirim yang jelas dan textarea yang tidak terdorong keluar layar saat keyboard ponsel muncul.

---

## 🛠️ 3. Rencana Eksekusi File

1. **[`SupportView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/SupportView.tsx)**:
   * Optimasi padding kontainer dari `p-4 sm:p-6` menjadi `p-3 sm:p-6 lg:p-8`.
   * Penyesuaian tata letak judul dan tombol aksi cepat mobile.
2. **[`TicketList.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketList.tsx)**:
   * Redesain toolbar pencarian & chip filter horizontal scroll.
   * Implementasi Mobile Card View (`md:hidden`) dan Desktop Table (`hidden md:block`).
   * Optimasi empty state card padding dari `p-12` menjadi `p-6 sm:p-12`.
   * Optimasi pagination controls di mobile.
3. **[`TicketDetailView.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/detail/TicketDetailView.tsx)**:
   * Optimasi header tiket dan komposer pesan di layar ponsel.

---

## 🔍 4. Verification Plan
1. **TypeScript Type Check**: `bun x tsc --noEmit` $\to$ 0 error.
2. **ESLint Static Check**: `bun run lint` $\to$ 0 error.
3. **Uji Coba Responsivitas Resolusi**:
   * Resolusi 360px (Samsung Galaxy/Small Android): Filter chips dapat digeser mulus, tidak ada teks patah 2 baris, kartu tiket rapi.
   * Resolusi 390px (iPhone 14/15/16): Form pencarian dan tombol aksi presisi.
   * Resolusi 768px (iPad/Tablet): Transisi mulus ke tata letak tablet.
   * Resolusi 1280px+ (Desktop): Tampilan tabel 12-kolom tetap profesional dan luas.
