# 🧭 Perencanaan Arsitektur UX/UI: Transformasi Modal Support Menjadi Halaman Dedicated (`/support/[id]`)

Dokumen analisis mendalam dari sudut pandang **UX/UI Engineer** mengenai perbandingan antara **Modal Popup** vs **Halaman Khusus (Dedicated Page / Master-Detail)** untuk sistem tiket bantuan B2B SaaS Wahide, berdasarkan referensi desain yang Anda berikan.

---

## 🎨 1. Analisis UX/UI Engineer: Modal Popup vs Dedicated Page

### Pertanyaan Utama: *"Apakah harus popup atau tidak, atau page terpisah?"*
> **Kesimpulan Singkat UX/UI Engineer**: **SANGAT DIREKOMENDASIKAN MENGGUNAKAN HALAMAN TERPISAH (DEDICATED PAGE `/support/[id]`)**. 
> Penggunaan modal popup untuk membaca dan membalas tiket bantuan adalah *anti-pattern* pada aplikasi enterprise/B2B SaaS (seperti Zendesk, Linear, GitHub Issues, Jira, Intercom).

### Tabel Perbandingan Matriks UX/UI:

| Parameter Evaluasi | Modal Popup (Kondisi Saat Ini - Image 1) | Dedicated Page (Layout Referensi - Image 2) |
| :--- | :--- | :--- |
| **Area Kerja & Luas Layar (Canvas)** | ❌ **Sangat Sempit**: Terkungkung dalam kotak melayang (`max-w-2xl`) di tengah layar gelap. Jika ada gambar screenshot atau log teks panjang, terjadi *viewport claustrophobia*. | 🌟 **Sangat Lega & Nyaman**: Memanfaatkan lebar layar penuh dashboard secara proporsional. Gambar dan teks teknis terbaca leluasa. |
| **Deep Linking & URL Persistence** | ❌ **Tidak Bisa Di-bookmark**: Jika pengguna me-refresh browser (`F5`), modal tertutup seketika dan context hilang. Pengguna harus mencari ulang tiket di tabel. | 🌟 **URL Unik Mandiri**: Memiliki alamat URL tetap: `http://localhost:3000/support/TKT-202609-UURDM`. Bisa di-refresh, di-bookmark, atau dibagikan ke anggota tim. |
| **Struktur Hierarki Informasi** | ❌ **Bercampur**: Metadata (nomor tiket, status, kategori, lampiran awal) bertumpuk di header modal yang sempit. | 🌟 **2-Column Master-Detail Layout**: Thread pesan di sebelah kiri (fokus utama), sedangkan metadata teknis terkonsolidasi rapi di kartu kanan (*Ticket Details*). |
| **Aksi Status Tiket (*Close / Resolve*)** | ❌ **Sulit Ditempatkan**: Tidak ada ruang yang pas untuk tombol aksi tanpa membuat header modal penuh sesak. | 🌟 **Aksi Cepat & Jelas**: Tombol `Close Ticket` berada di posisi kanan atas yang strategis dan mudah diakses kapan saja. |
| **Komposer Balasan & Multi-Lampiran** | ❌ **Terhimpit**: Textarea kecil di footer modal; preview lampiran rawan terpotong jika layar laptop kecil. | 🌟 **Komposer Luas**: Kartu `Reply to Ticket` luas, mendukung upload multi-gambar/file dengan preview thumbnail yang lapang. |
| **Responsivitas Perangkat (Mobile & Tablet)**| ⚠️ **Rawan Masalah**: Keyboard virtual ponsel rawan menutupi form modal yang sticky. | 🌟 **Aliran Alami (Natural Scroll)**: Halaman mengalir vertikal alami (`flex-col` pada mobile, `grid 2-kolom` pada desktop). |

---

## 📐 2. Dekonstruksi Desain Layout Referensi (Image 2)

Layout referensi yang Anda berikan adalah **standar emas (gold standard) sistem tiket B2B modern**. Berikut adalah pembagian zona layoutnya:

```
+---------------------------------------------------------------------------------------------------+
|  ← Kembali ke Daftar Tiket (Breadcrumb Back Link)                                                  |
|                                                                                                   |
|  payment                                                                    [✓ Close Ticket]      |
|  Ticket #032bed3ba05a  |  [Open]  [Priority: Medium]  [Billing]  01 Sep 2026, 10:51                |
+------------------------------------------------------------------+--------------------------------+
|  KOLOM KIRI: THREAD PERCAKAPAN & BALASAN (Col-Span 8)            |  KOLOM KANAN: METADATA (Col 4) |
+------------------------------------------------------------------+--------------------------------+
|  +------------------------------------------------------------+  |  +---------------------------+ |
|  | KARTU PESAN UTAMA (Inisial Tiket)                          |  |  | Ticket Details            | |
|  | Dedi Susanto • 01 Sep 2026, 10:51                          |  |  | ------------------------- | |
|  | dsafafsaffasfaf                                            |  |  | Status:            [Open] | |
|  | [Lampiran Gambar / Screenshot Resolusi Penuh]              |  |  | Priority:        [Medium] | |
|  +------------------------------------------------------------+  |  | Category:         Billing | |
|                                                                  |  | Created:      01 Sep 2026 | |
|  +------------------------------------------------------------+  |  | Updated: 01 Sep 2026, 10:51| |
|  | KARTU BALASAN 1 (Staf Support)                             |  |  | Replies:                0 | |
|  | Staff Support • 01 Sep 2026, 11:00                         |  |  +---------------------------+ |
|  | Halo, kami sedang memproses kendala pembayaran Anda...     |  |                                |
|  +------------------------------------------------------------+  |  (Sticky Sidebar mengikuti     |
|                                                                  |   scroll layar saat thread     |
|  +------------------------------------------------------------+  |   panjang)                     |
|  | KARTU KOMPOSER BALASAN (Reply to Ticket)                   |  |                                |
|  | Write your reply...                                        |  |                                |
|  | [Textarea Luas & Nyaman 5-6 baris]                         |  |                                |
|  |                                                            |  |                                |
|  | Attachments (optional)                                     |  |                                |
|  | [+ Add file]  No files selected                            |  |                                |
|  | Max 10MB/file • PNG, JPG, JPEG                             |  |                                |
|  |                                                            |  |                                |
|  |                                            [🚀 Send Reply]  |  |                                |
|  +------------------------------------------------------------+  |                                |
+------------------------------------------------------------------+--------------------------------+
```

---

## 🏗️ 3. Arsitektur Komponen & Routing Frontend (`fontwahide`)

### A. Struktur Rute Next.js App Router
* **Rute Baru**: `src/app/(dashboard)/support/[id]/page.tsx`
  * Mendukung parameter URL dinamis `:id` (baik ULID `01...` maupun nomor tiket `TKT-...`).
  * Menyediakan navigasi instan dari tabel daftar tiket: klik tombol *"Buka"* $\to$ pindah ke `/support/[id]`.

### B. Pemisahan Komponen Modular (Clean Architecture)
1. **`TicketDetailPage.tsx` (Container Page)**:
   * Mengambil data tiket (`supportApi.getTicket(id)`) dan riwayat balasan (`supportApi.getReplies(id)`).
   * Menampilkan skeleton loader profesional saat data sedang dimuat.
2. **`TicketDetailHeader.tsx`**:
   * Tombol kembali: `← Kembali ke Daftar Tiket` (dengan ikon `ArrowLeft`).
   * Judul subjek tiket (H1 tegas dan bersih).
   * Nomor tiket badge, status badge, prioritas badge, kategori, dan tanggal.
   * Tombol aksi: `Tutup Tiket` (`Close Ticket`) yang memanggil API backend `PATCH /support/tickets/:id/close`.
3. **`TicketThreadTimeline.tsx`**:
   * Menampilkan pesan awal pelanggan dan seluruh kartu balasan berurutan secara kronologis.
   * Mendukung render screenshot Cloudflare R2 dengan tampilan border rapi, thumbnail tajam, dan fitur klik buka ukuran penuh.
   * Indikator pembeda jelas antara pelanggan (`Anda`) dan staf teknis (`Staff Support` dengan lencana verifikasi).
4. **`TicketReplyComposer.tsx`**:
   * Textarea yang lega dengan placeholder informatif.
   * Fitur upload gambar Cloudflare R2:
     * Tombol `+ Tambah File / Screenshot`.
     * Preview thumbnail gambar langsung dengan ukuran file.
     * Tombol hapus lampiran `(X)`.
   * Tombol `Kirim Balasan` (`Send Reply`) dengan status loading spinner yang elegan.
5. **`TicketDetailsSidebar.tsx`**:
   * Kartu ringkasan di sebelah kanan: Status, Kategori, Prioritas, Tanggal Pembuatan, Terakhir Diperbarui, dan Total Balasan.
   * Menggunakan utility `sticky top-6` sehingga tetap terlihat saat pengguna menggulir thread percakapan yang panjang.

### C. Nasib Modal Pembuatan Tiket (`CreateTicketModal.tsx`)
* **Tetap Menggunakan Modal**:
  * Untuk **membuat tiket baru**, modal pop-up tetap sangat tepat dan efisien (karena isian form singkat: Subjek, Kategori, Prioritas, Pesan, Screenshot).
  * Ini sejalan dengan pola standar SaaS: *Create is a quick modal, Conversation is a dedicated page*.

---

## 🔌 4. Kesiapan Backend Go (`wahide`)

Kabar baiknya, **Backend Go sudah memiliki seluruh endpoint REST API yang dibutuhkan**, sehingga kita tidak perlu merombak arsitektur backend:
1. `GET /api/v1/support/tickets/:id` $\to$ Mengambil detail tiket lengkap.
2. `GET /api/v1/support/tickets/:id/reply` $\to$ Mengambil seluruh balasan dari tabel `ticket_replies`.
3. `POST /api/v1/support/tickets/:id/reply` $\to$ Mengirim pesan balasan (dengan dukungan `attachment` yang baru saja kita pasang!).
4. `POST /api/v1/support/tickets/upload` $\to$ Mengunggah screenshot ke Cloudflare R2.
5. `PATCH /api/v1/support/tickets/:id/close` $\to$ Menutup tiket secara resmi.

---

## 🚀 5. Rencana Eksekusi Bertahap (Roadmap)

1. **Langkah 1**: Tambahkan fungsi `getTicket(id: string)` dan `closeTicket(id: string)` di [`support.api.ts`](file:///G:/WEB2026/fontwahide/src/services/support/api/support.api.ts).
2. **Langkah 2**: Bangun komponen halaman detail:
   * `TicketDetailHeader` (Breadcrumb + Title + Close button).
   * `TicketDetailsSidebar` (Metadata card di sisi kanan).
   * `TicketThreadTimeline` (Kartu pesan & gambar R2).
   * `TicketReplyComposer` (Form balasan + upload screenshot R2).
3. **Langkah 3**: Buat route Next.js `src/app/(dashboard)/support/[id]/page.tsx`.
4. **Langkah 4**: Hubungkan tombol *"Buka"* pada [`TicketList.tsx`](file:///G:/WEB2026/fontwahide/src/services/support/components/TicketList.tsx) ke rute `/support/${ticket.id}` menggunakan Next.js `Link` atau `router.push`.
5. **Langkah 5**: Hapus ketergantungan pada `TicketThreadModal` yang sempit.
6. **Langkah 6**: Validasi menyeluruh: Type check (`tsc --noEmit`), Lint (`eslint`), dan uji coba langsung di browser.
