# 🧪 Interactive Testing Roadmap & Quality Assurance Checklist (Wahide Frontend)

**Platform:** Wahide Frontend Web Application (Next.js 16.3.3 + React 19 + Turbopack + Tailwind CSS v4 + TypeScript + Bun)  
**Tujuan:** Checklist Pengujian Interaktif Manual & Unit QA (Bisa Dicentang / Di-klik `[x]`) untuk Seluruh Modul, Halaman, Interaksi Komponen, & Integrasi Gateway  
**Lokasi Berkas:** `G:\WEB2026\fontwahide\docs\test\COMPREHENSIVE_FEATURE_TESTING_ROADMAP.md`  

> 💡 **Panduan Penggunaan:** File ini menggunakan format standar GitHub Flavored Markdown Task List (`- [ ]` dan `- [x]`), ditulis sebagai *tight list* agar kotak checkbox dapat dicentang secara langsung di Markdown Preview editor atau GitHub Web Interface saat pengujian QA manual dilakukan.

---

## 📊 Status Progress Testing Keseluruhan

- [ ] **Modul 1: Autentikasi & Edge Security Boundary** (0/7 Selesai)
- [ ] **Modul 2: Landing Page & Halaman Publik** (0/6 Selesai)
- [ ] **Modul 3: Dashboard Utama & Multi-Tenant State** (0/5 Selesai)
- [ ] **Modul 4: Manajemen Perangkat WhatsApp & Live QR SSE Streaming** (0/7 Selesai)
- [ ] **Modul 5: Kontak & Manajemen Audiens (High-Throughput Virtualized)** (0/6 Selesai)
- [ ] **Modul 6: Kampanye Broadcast Pesan & Spintax Engine** (0/7 Selesai)
- [ ] **Modul 7: Saldo Deposit, Billing & Invoice** (0/5 Selesai)
- [ ] **Modul 8: Langganan Paket & Webhook Gateway** (0/5 Selesai)
- [ ] **Modul 9: Manajemen Tim & Role-Based Access Control (RBAC)** (0/4 Selesai)
- [ ] **Modul 10: Pusat Bantuan & Sistem Tiket Support** (0/4 Selesai)
- [ ] **Modul 11: Pengaturan Akun & Developer API Key (CSPRNG)** (0/5 Selesai)
- [ ] **Modul 12: Superadmin Control Panel & Audit Keamanan** (0/6 Selesai)
- [ ] **Modul 13: UI/UX Responsivitas, Wise Design System, & i18n** (0/5 Selesai)
- [ ] **Modul 14: Ketahanan Jaringan, Timeout Aborts, & Error Boundaries** (0/5 Selesai)

---

## 🔐 1. Modul Autentikasi & Edge Security Boundary (`/login`, `/register`, `/forgot-password`)

- [x] **1.1 Registrasi Akun Baru (Valid)** — `/register` — Isi nama lengkap, email valid, password ≥ 8 karakter, konfirmasi password, selesaikan Cloudflare Turnstile → Notifikasi toast sukses muncul, otomatis redirect ke halaman `/login`.
- [x] **1.2 Registrasi Validasi Form Error** — `/register` — Masukkan email format salah, password < 8 karakter, atau konfirmasi password tidak cocok → Pesan validasi error muncul di bawah field input, tombol submit dalam status disable/loading.
- [x] **1.3 Login Kredensial Valid & Sinkronisasi Sesi Edge** — `/login` — Masukkan email dan password terdaftar + Turnstile → Token JWT tersimpan di Zustand (`wahide_auth_storage`) dan Cookie (`wahide_session_token`, `wahide_user_role`), otomatis redirect ke `/dashboard`.
- [ ] **1.4 Login Kredensial Salah (401 Unauthorized)** — `/login` — Masukkan password salah → Toast error muncul: *"Email atau password yang Anda masukkan salah."*, form tidak crash.
- [ ] **1.5 Lupa Password & Reset Request** — `/forgot-password` — Masukkan email terdaftar, klik *Kirim Instruksi Reset* → Status loading aktif, toast konfirmasi pengiriman email muncul.
- [ ] **1.6 Proteksi Rute 0ms Edge Proxy (`src/proxy.ts`)** — Buka URL `/dashboard`, `/devices`, `/campaigns` saat dalam kondisi *incognito / logout* → Server Edge langsung mencegat dan me-redirect ke `/login?from=/dashboard` tanpa *screen flash / FOUC*.
- [ ] **1.7 Auto-Redirect Pengguna Terotentikasi** — Saat sudah login aktif, buka URL `/login` atau `/register` → Edge Proxy langsung me-redirect kembali ke `/dashboard`.

---

## 🌐 2. Modul Landing Page & Halaman Publik (`/`, `/about`, `/contact`, `/blog`, `/privacy`, `/terms`)

- [ ] **2.1 Homepage & Hero Section** — `/` — Buka halaman utama → Branding Wahide tampil tajam dengan tema Wise Design System (neon `#9fe870` & dark green `#163300`), animasi live widget WhatsApp berputar mulus, tombol CTA *Mulai Sekarang* mengarah ke `/register`.
- [ ] **2.2 Katalog Fitur & Keunggulan Multi-Device** — `/` — Periksa kartu fitur (Anti-Ban 5-Layer, Spintax Parser, Webhook Streaming, REST API) → Tampilan kartu rapi, ikon Lucide tajam, typography kontras tinggi.
- [ ] **2.3 Halaman Tentang Kami (About)** — `/about` — Periksa identitas PT Hide Digital Security, alamat kantor Semarang, legalitas, dan visi platform → Teks terstruktur rapi di mobile & desktop.
- [ ] **2.4 Halaman Kontak & Dukungan Bisnis** — `/contact` — Isi formulir kontak kemitraan/pertanyaan → Validasi input berjalan, notifikasi terkirim muncul.
- [ ] **2.5 Halaman Blog & Artikel Teknis** — `/blog` & `/blog/[slug]` — Buka daftar artikel dan halaman detail blog → Konten Markdown/HTML ter-render rapi dengan styling prose, estimasi waktu baca tampil akurat.
- [ ] **2.6 Halaman Kebijakan & Privasi Legal** — `/privacy`, `/terms`, `/tos` — Buka tiap tautan legal footer → Metadata SEO dan canonical URL terpasang, teks kepatuhan hukum tampil lengkap.

---

## 📊 3. Modul Dashboard Utama & Multi-Tenant State (`/dashboard`)

- [x] **3.1 Kartu Metrik KPI Ringkasan Bisnis** — `/dashboard` — Periksa 4 kartu ringkasan (Total Kontak, Kampanye Aktif, Sisa Kuota Pesan, Perangkat Terhubung) → Angka statistik sinkron dengan session tenant di Zustand.
- [x] **3.2 Tabel Sesi Node WhatsApp Terkini** — `/dashboard` — Periksa tabel perangkat aktif di bawah widget ringkasan → Status badge (*CONNECTED / PAIRING / DISCONNECTED*) tampil dengan warna indikator yang tepat.
- [x] **3.3 Widget Riwayat Kampanye Broadcast Terkini** — `/dashboard` — Periksa log pesan siaran terbaru → Tanggal, nama kampanye, persentase progress blast tampil realtime.
- [x] **3.4 Tombol Navigasi Cepat (Quick Action Pills)** — `/dashboard` — Klik tombol *Tambah Perangkat*, *Buat Kampanye*, *Top-Up Saldo* → Modal wizard terkait langsung terbuka seketika via dynamic code-splitting.
- [x] **3.5 Eliminasi Unnecessary Re-renders** — Buka React DevTools Profiler saat navigasi antar tab dasbor → Header dan Sidebar tidak mengalami re-render ulang berkat atomic Zustand selectors.

---

## 📱 4. Modul Manajemen Perangkat WhatsApp & Live QR SSE Streaming (`/devices`)

- [x] **4.1 Daftar Slot Perangkat (Device Grid/List)** — `/devices` — Periksa daftar nomor WhatsApp yang terdaftar → Nama perangkat, nomor telepon, badge status koneksi, dan tombol aksi (*Scan QR*, *Kirim Pesan Uji*, *Disconnect*, *Hapus*) tampil akurat.
- [ ] **4.2 Modal Tambah Slot Perangkat Baru** — `/devices` — Klik *Tambah Perangkat* → Modal `AddDeviceModal` dimuat secara dinamis, masukkan nama slot (misal: *CS Support 1*), klik Simpan → Slot perangkat baru terbentuk.
- [x] **4.3 Live QR Streaming Pairing (SSE Engine)** — `/devices` — Klik *Hubungkan / Scan QR* pada slot → Modal `LiveQRModal` terbuka, stream Server-Sent Events (SSE) aktif, kode QR berganti otomatis tiap 20 detik dengan hitung mundur.
- [ ] **4.4 Exponential Backoff + Jitter Reconnect Test** — `/devices` — Putuskan koneksi internet/gateway saat popup QR aktif → Sistem mencoba reconnect dengan jeda bertingkat ($1s \to 1.5s \to 2.25s \dots$), tidak terjadi memory leak atau loop CPU tanpa batas.
- [ ] **4.5 Teardown Cleanup Anti-Memory Leak** — `/devices` — Tutup modal `LiveQRModal` saat countdown masih berjalan → `EventSource.close()` seketika memutus koneksi socket, `clearInterval` mematikan timer, RAM browser tetap stabil < 15MB.
- [ ] **4.6 Kirim Pesan Uji Coba Cepat (Test Message)** — `/devices` — Klik *Kirim Pesan Uji* pada slot terhubung → Masukkan nomor WhatsApp tujuan (diawali `62`) dan isi pesan, klik Kirim → Toast sukses muncul.
- [ ] **4.7 Pemutusan Koneksi (Disconnect & Delete Slot)** — `/devices` — Klik *Disconnect* → Status berubah menjadi *DISCONNECTED*; klik *Hapus Slot* → Konfirmasi modal muncul, slot terhapus permanen dari daftar.

---

## 👥 5. Modul Kontak & Manajemen Audiens Virtualized (`/contacts`)

- [x] **5.1 Virtual Scrolling 60 FPS Skala Masif** — `/contacts` — Buka daftar ribuan kontak → Tabel menggunakan `@tanstack/react-virtual`, scrolling sangat mulus pada 60 FPS, hanya ~15 elemen DOM yang dirender secara aktif.
- [x] **5.2 Tambah Kontak Manual Baru** — `/contacts` — Klik *Tambah Kontak* → Modal `ContactModal` terbuka dinamis, masukkan Nama, Nomor WhatsApp (`628xxx`), Tag/Grup, dan Atribut Kustom → Kontak tersimpan dan tampil di tabel.
- [x] **5.3 Import Kontak Massal via CSV (Import Wizard)** — `/contacts` — Klik *Import CSV* → Modal `ImportCsvModal` terbuka, upload file `.csv`, lakukan mapping kolom (Nama, Telepon, Tag) → Progress bar impor berjalan, validasi nomor duplikat/invalid terdeteksi.
- [x] **5.4 Pencarian & Filter Kontak Instan** — `/contacts` — Ketik nama/nomor di kolom pencarian atau filter berdasarkan Tag → Tabel melakukan filter reaktif tanpa reload halaman.
- [x] **5.5 Edit & Hapus Kontak** — `/contacts` — Klik ikon Edit pada baris kontak → Form terisi data lama, ubah data dan simpan; klik Hapus → Kontak terhapus dari daftar.
- [x] **5.6 Export Kontak ke CSV / Excel** — `/contacts` — Klik *Export Kontak* → File CSV terunduh secara instan berisi seluruh daftar kontak yang difilter.

---

## 📢 6. Modul Kampanye Broadcast Pesan & Spintax Engine (`/campaigns`)

- [ ] **6.1 Wizard Pembuatan Kampanye Blast Baru** — `/campaigns` — Klik *Buat Kampanye* → Modal `CampaignWizardModal` terbuka dinamis dengan navigasi step-by-step (Pilih Perangkat, Pilih Target Kontak, Tulis Pesan, Jadwal & Delay).
- [ ] **6.2 Live Spintax Regex Parser (`{Halo|Hai|Selamat Pagi}`)** — `/campaigns` — Tulis template pesan berspintax `{Halo|Hai|Hi} Kak {Nama}` → Kotak live preview menampilkan variasi pesan berbeda secara acak untuk menguji anti-ban.
- [ ] **6.3 Pengaturan Jitter Delay & Anti-Ban Slider** — `/campaigns` — Atur interval jeda pengiriman (misal: 5–15 detik per pesan acak) → Estimasi total waktu blast terhitung otomatis.
- [ ] **6.4 Mulai & Jadwalkan Kampanye Blast** — `/campaigns` — Klik *Kirim Sekarang* atau *Jadwalkan* → Kampanye masuk ke antrian antarmuka dengan status *QUEUED / RUNNING*.
- [ ] **6.5 Kontrol Live Kampanye (Pause, Resume, Cancel)** — `/campaigns` — Uji tombol *Pause* saat broadcast berjalan → Status berganti *PAUSED*; klik *Resume* → Pengiriman berlanjut; klik *Cancel* → Antrian dibatalkan.
- [ ] **6.6 Virtualized Message Logs Table** — `/campaigns` — Buka tab riwayat log pesan terkirim → Tabel log pesan virtualized (`max-h-120`) menampilkan status pengiriman (*DELIVERED / READ / FAILED*), waktu timestamp, dan nomor tujuan.
- [ ] **6.7 Analisis Metrik Keberhasilan Broadcast** — `/campaigns` — Periksa kartu statistik kampanye → Persentase pesan terkirim (*Success Rate*), pesan gagal (*Failed*), dan pesan dibaca (*Read Rate*) tampil informatif.

---

## 💳 7. Modul Saldo Deposit, Billing & Invoice (`/billing`)

- [x] **7.1 Kartu Saldo Deposit & Kuota WhatsApp** — `/billing` — Periksa widget saldo wallet (IDR) dan sisa kuota pesan WhatsApp bulanan → Nilai saldo terformat Rupiah standar (`Rp xxx.xxx`).
- [x] **7.2 Modal Top-Up Saldo Instan (QRIS & Virtual Account)** — `/billing` — Klik *Top-Up Saldo* → Modal `TopUpModal` terbuka dinamis, pilih nominal (misal: Rp 100.000), pilih metode QRIS/BCA VA → QRIS / Nomor VA tampil jelas.
- [x] **7.3 Simulasi Auto-Check Pembayaran** — `/billing` — Setelah melakukan pembayaran simulasi → Sistem mendeteksi status sukses dan saldo wallet bertambah secara otomatis tanpa reload halaman.
- [x] **7.4 Tabel Riwayat Invoice & Filter Transaksi** — `/billing` — Periksa daftar invoice tagihan → Filter berdasarkan status *PAID / PENDING / EXPIRED*, pagination berfungsi normal.
- [x] **7.5 Export Lembar Invoice ke PDF** — `/billing` — Klik tombol *Download Invoice PDF* pada baris transaksi → Berkas PDF invoice resmi Wahide terunduh dengan rincian pajak dan timestamp transaksi.

---

## 💎 8. Modul Langganan Paket & Webhook Gateway (`/subscription`)

- [ ] **8.1 Katalog Pilihan Paket Langganan** — `/subscription` — Periksa kartu paket tier (**Starter**, **Pro**, **Enterprise**) → Rincian batas perangkat slot, kuota blast bulanan, dan fitur gateway tampil transparan.
- [ ] **8.2 Status Paket Aktif Tenant Saya** — `/subscription` — Periksa kartu langganan aktif → Nama paket, masa berlaku (*Expires At*), dan bar persentase penggunaan kuota tampil akurat.
- [ ] **8.3 Konfigurasi Webhook Event Inbound/Outbound** — `/subscription` — Masukkan URL Webhook endpoint (misal: `https://my-api.com/webhook`), centang toggle *Aktifkan Webhook* → Konfigurasi tersimpan sukses.
- [ ] **8.4 Regenerasi Webhook Secret Kriptografi Aman (CSPRNG)** — `/subscription` — Klik tombol *Regenerate Secret* → Rahasia webhook baru terbentuk secara kriptografi aman (`whsec_live_...`), lolos uji GitHub CodeQL 0 warning.
- [ ] **8.5 Tombol Test Ping Webhook** — `/subscription` — Klik *Kirim Ping Uji Coba* → Payload JSON simulasi terkirim ke URL webhook Anda, respon HTTP status code 200 OK tampil di popup notifikasi.

---

## 👥 9. Modul Manajemen Tim & Role-Based Access Control (`/team`)

- [ ] **9.1 Daftar Anggota Tim Tenant** — `/team` — Buka daftar anggota tim → Nama, email, tanggal bergabung, badge role (*ADMIN, AGENT, OPERATOR*), dan status keaktifan tampil.
- [ ] **9.2 Undang Anggota Tim Baru (Invite Modal)** — `/team` — Klik *Undang Anggota* → Masukkan email rekan kerja, pilih role hak akses, klik Kirim Undangan → Undangan terdaftar di tabel dengan status *PENDING*.
- [ ] **9.3 Perubahan Hak Akses Role Anggota** — `/team` — Ubah role salah satu anggota dari *AGENT* menjadi *ADMIN* → Konfirmasi simpan, hak akses pengguna langsung diperbarui.
- [ ] **9.4 Cabut Akses / Hapus Anggota Tim** — `/team` — Klik *Hapus / Revoke Access* pada anggota tim → Konfirmasi dialog muncul, akses anggota dicabut permanen.

---

## 🎫 10. Modul Pusat Bantuan & Sistem Tiket Support (`/support`)

- [x] **10.1 Daftar Tiket Bantuan & Filter Status** — `/support` — Buka daftar tiket → Filter tiket berdasarkan status (*OPEN, IN_PROGRESS, RESOLVED, CLOSED*), nomor tiket format `TKT-xxxx` tampil rapi.
- [x] **10.2 Buat Tiket Bantuan Baru (Create Ticket Modal)** — `/support` — Klik *Buat Tiket* → Modal `CreateTicketModal` terbuka dinamis, isi Judul Kendala, Kategori (Teknis/Billing), Prioritas, dan Pesan Pengaduan → Tiket baru terbuat dengan status *OPEN*.
- [x] **10.3 Percakapan Live Thread Tiket (Thread Modal)** — `/support` — Klik pada salah satu tiket → Modal `TicketThreadModal` terbuka dinamis, riwayat percakapan antara pengguna dan tim support tampil kronologis.
- [x] **10.4 Balas Pesan Tiket & Penyelesaian Kendala** — `/support` — Ketik balasan pesan di thread modal, klik Kirim → Balasan langsung muncul di gelembung chat; klik *Tandai Selesai* → Status tiket berubah menjadi *RESOLVED*.

---

## ⚙️ 11. Modul Pengaturan Akun & Developer API Key (`/settings`)

- [x] **11.1 Pengaturan Profil Tenant & Informasi Bisnis** — `/settings` — Ubah nama workspace bisnis dan email kontak utama, klik Simpan → Data profil tenant di Zustand store dan antarmuka ter-update instan.
- [x] **11.2 Ganti Kata Sandi Akun** — `/settings` — Masukkan kata sandi lama, kata sandi baru (≥ 8 karakter), dan konfirmasi kata sandi baru → Validasi sukses, toast konfirmasi penggantian password muncul.
- [x] **11.3 Manajemen REST API Key Developer** — `/settings` — Periksa kotak kredensial API → Tombol *Salin API Key* menyalin token ke clipboard, toggle *Show/Hide* menampilkan/menyembunyikan string token.
- [x] **11.4 Regenerasi API Key dengan Kriptografi Aman (CSPRNG)** — `/settings` — Klik *Regenerate Key* → API Key baru terbentuk (`hide_live_...`) menggunakan Web Crypto API `crypto.getRandomValues()`, token lama di-invalidasi.
- [x] **11.5 Pencabutan Kunci API (Revoke Key)** — `/settings` — Klik *Revoke Key* → Konfirmasi peringatan muncul, token API dihapus total sehingga integrasi lama terhenti seketika.

---

## 🛡️ 12. Modul Superadmin Control Panel & Audit Keamanan (`/admin/*`)

- [ ] **12.1 Proteksi Rute Superadmin di Edge Runtime** — `/overview`, `/users`, `/plans`, `/logs` — Coba akses URL admin menggunakan akun dengan role *SELLER / AGENT* → Edge Proxy langsung menolak dan me-redirect ke `/dashboard` (Forbidden).
- [ ] **12.2 Dashboard Overview Superadmin** — `/overview` — Login dengan akun `SUPERADMIN` → Metrik global sistem (Total Tenant Terdaftar, Total Pesan Terkirim Seluruh Server, Uptime Gateway, Revenue Bulanan) tampil akurat.
- [ ] **12.3 Manajemen Pengguna & Penyesuaian Kuota Massal** — `/users` — Buka daftar seluruh pengguna tenant → Buka aksi *Adjust Quota*, tambah kuota pesan tenant → Kuota tenant bertambah seketika.
- [ ] **12.4 Manajemen Master Paket Langganan Global** — `/plans` — Tambah/edit harga paket tier bulanan, limit slot perangkat, dan fitur watermark → Seluruh katalog harga sinkron.
- [ ] **12.5 Virtual Scrolling Log Audit Sistem (AuditLogsTable)** — `/logs` — Buka tab *Log Autentikasi* & *Log Aktivitas Operasional* → Tabel virtual scrolling 60 FPS menampilkan ribuan catatan login IP, event timestamp, User Agent, dan indikator keamanan (*ShieldCheck / ShieldAlert*).
- [ ] **12.6 Pusat Notifikasi & Broadcast Pengumuman Global** — `/notifications` — Kirim pesan banner pemeliharaan server (*Maintenance Alert*) ke seluruh tenant → Notifikasi muncul di header dashboard pengguna.

---

## 🎨 13. Modul UI/UX Responsivitas, Wise Design System, & i18n

- [x] **13.1 Wise Design System Theme Standard** — Periksa seluruh halaman → Aksen neon `#9fe870`, hijau pekat `#163300`, shape language kapsul (*radius-pill*), tombol interaktif memiliki state hover dan fokus yang jelas.
- [x] **13.2 Standar Kontras Aksesibilitas WCAG 2.2 AAA** — Uji kontras teks terhadap latar belakang terang (`#fbfcf9`) dan gelap (`#0e0f0c`) → Rasio kontras melampaui **11.2:1 (AAA Compliant)**, teks sangat tajam dan mudah dibaca.
- [x] **13.3 Peralihan Tema Instan (Dark & Light Mode)** — Klik toggle tema di Navbar → Seluruh token warna berganti secara instan tanpa glitch, preferensi tema tersimpan di local storage.
- [x] **13.4 Peralihan Multi-Bahasa Instan (i18n ID ↔ EN)** — Klik switcher bahasa di Navbar → Seluruh label navigasi, tombol, judul form, dan placeholder berganti bahasa instan (Bahasa Indonesia ↔ English) tanpa refresh halaman.
- [x] **13.5 Responsivitas Mobile & Tablet Viewport** — Buka aplikasi di resolusi smartphone (360px–414px) dan tablet (768px–1024px) → Sidebar otomatis berubah menjadi drawer geser (*Sheet*), tabel dapat di-scroll horizontal tanpa merusak layout, ukuran tombol minimum 44px (`min-h-11`).

---

## ⚡ 14. Modul Ketahanan Jaringan, Timeout Aborts, & Error Boundaries

- [ ] **14.1 HttpClient Timeout Auto-Abort (15 Detik)** — Simulasi koneksi backend lambat > 15 detik → `AbortSignal.timeout(15000)` otomatis membatalkan request, UI menampilkan toast error ramah tanpa mengalami freeze/hang.
- [ ] **14.2 Auto-Retry Idempotent Requests (502 / 503 / 504)** — Simulasi gangguan jaringan mikro saat panggilan `GET` API → `HttpClient` melakukan percobaan ulang otomatis dengan jeda *random backoff jitter* sebelum melaporkan error.
- [ ] **14.3 Bebas Header CORS Preflight (`X-Tenant-ID` Clean)** — Buka Network Tab di browser console saat memanggil API backend → Semua request hanya mengirimkan header standar `Authorization: Bearer <token>`, `Content-Type`, `Accept`, tidak ada penolakan CORS `403 / 405`.
- [ ] **14.4 Halaman Error 404 (Not Found)** — Buka URL acak yang tidak terdaftar (misal: `/halaman-tidak-ada`) → Halaman kustom [`src/app/not-found.tsx`](file:///G:/WEB2026/fontwahide/src/app/not-found.tsx) muncul rapi dengan tombol *Kembali ke Dashboard*.
- [ ] **14.5 Dual-Layer Error Boundary (Crash Resilience)** — Simulasi kegagalan rendering komponen React → [`src/app/error.tsx`](file:///G:/WEB2026/fontwahide/src/app/error.tsx) dan [`src/app/global-error.tsx`](file:///G:/WEB2026/fontwahide/src/app/global-error.tsx) menangkap crash dan menyediakan tombol *Coba Muat Ulang* tanpa membuat aplikasi crash total.
