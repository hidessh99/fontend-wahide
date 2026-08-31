# Wahide Frontend Technical Planning & Architecture Documentation

Dokumen perencanaan arsitektur dan kesiapan produksi untuk frontend **Wahide (`fontwahide`)** berstandar Enterprise Fintech:

1. **[Master Technical Planning Document (Wise Edition)](./frontend_architecture_and_technical_plan.md)**
   - **Wise Design System**: Palet warna Lime Green (`#9fe870`), Dark Forest (`#163300`), Near-Black (`#0e0f0c`), tipografi Display Weight 900 dengan ultra-tight line-height `0.85`, Inter 600 default reading weight, Pill Buttons (`rounded-full`) dengan efek fisik `scale(1.05)` saat hover, serta Card radius kanonikal (`rounded-md` & `rounded-lg`).
   - **Arsitektur Single Page Application (SPA)**: Navigasi instan client-side menggunakan `next/link` dan `router.push()`, pencegatan form asinkron (`e.preventDefault()`), zero page reload, serta persistensi memori state/WebSocket.
   - **Sistem Notifikasi Global (Sonner Toaster)**: Engine notifikasi modern `sonner` dengan auto-sync tema Dark/Light dan integrasi dual-tier (Inline Banners untuk validasi form + Floating Toasts untuk event global).
   - **Internationalization (i18n) Bilingual**: Dukungan multi-bahasa dinamis (`ID` & `EN`) dengan *smart fallback resolver* dan *zero hydration mismatch*.
   - **Proteksi Bot & Brute-Force (Cloudflare Turnstile)**: Integrasi widget Turnstile pada form otentikasi dengan manajemen lifecycle auto-reset.
   - **Standar Aksesibilitas & SEO (Lighthouse 100)**: MetadataBase, Canonical URL, OpenGraph, JSON-LD Structured Data, Semantic `<main>` landmark, dan touch target minimum 36px.
   - **Arsitektur Domain Services (`src/services/*`)**: Pembagian 9 domain service terisolasi (`iam`, `whatsapp`, `campaign`, `contact`, `subscription`, `finance`, `support`, `content`, `team`, `admin`).
   - **Zero Memory & CPU Leak Protocol**: Panduan streaming SSE / WebSocket QR Pairing & Virtualized Data Tables yang sangat ringan untuk laptop Core i3 & RAM 8GB.
   - **Roadmap 6 Fase**: Status 100% komplit dari Core Shell hingga Production Performance Audit.

2. **[Enterprise Architecture & Production Readiness Blueprint](./enterprise_architecture_and_production_readiness_plan.md)**
   - **Performance Optimization**: Leaf Client Component pattern, Suspense streaming boundaries, 60 FPS CSS transforms, dan zero barrel files.
   - **Resource Management**: Auto-teardown SSE AbortController, Base64 memory eviction, dan TanStack Virtual DOM windowing untuk 100.000+ data baris.
   - **Scalability & Clean Code**: Isolasi domain service, stateless API client DTOs, dan zero utility spill.
   - **Enterprise Security**: Content Security Policy (CSP), mitigasi CSV Formula Injection (CWE-1236), Cloudflare Turnstile token guard, dan HMAC SHA256 Webhook signatures.
   - **Production Readiness & Quality Gates**: Error Boundary hierarchies, Sentry/APM observability readiness, serta verifikasi ganda `tsc --noEmit` & strict canonical ESLint.

3. **[Sidebar Role RBAC & Single Page Application (SPA) Plan](./sidebar_role_rbac_and_spa_architecture_plan.md)**
   - **Diferensiasi Role-Based Access Control (RBAC)**: Pemisahan hak akses navigasi menu bisnis antara `SELLER` (Tenant Owner), `AGENT` (Staf CS Operator), dan `SUPER_ADMIN` (Platform Owner).
   - **Audit Arsitektur SPA (100% Zero Page Reload)**: Navigasi instan `next/link`, pencegatan form `e.preventDefault()`, dan persistensi in-memory JWT / WebSocket state.
   - **Integrasi Menu Tim CS (`/team`)**: Navigasi khusus delegasi staf operator WhatsApp dengan proteksi role bersyarat.

4. **[Backend Role Audit & Frontend Synchronization Plan](./backend_role_audit_and_frontend_synchronization_plan.md)**
   - **Sinkronisasi Canonical Role Backend Go (`wahide`)**: Penyelarasan konstanta string peran riil Go (`admin`, `seller`, `user`, `reseller`) dengan frontend TypeScript `fontwahide`.
   - **Helper Tahan Variasi Huruf (*Case-Insensitive & Alias-Safe*)**: Implementasi utilitas `isAdmin()`, `isSeller()`, dan `isUserAgent()` untuk mencegah kegagalan verifikasi hak akses.

5. **[Comprehensive Improvement & Future Roadmap Plan](./frontend_comprehensive_improvement_and_future_roadmap_plan.md)**
   - **Peluang Peningkatan Skala Enterprise**: Analisis 6 pilar strategis meliputi Resiliensi Streaming Real-Time (SSE Heartbeat & Exponential Backoff), Lapisan Caching Data SWR, Command Palette (`Ctrl + K`), Hardening CSP di `next.config.ts`, Deteksi Offline Network, dan Otomasi Pengujian Unit Test Suite.

6. **[i18n Comprehensive Audit & Implementation Plan](./i18n_comprehensive_audit_and_implementation_plan.md)**
   - **Cakupan 100% Bilingual (ID & EN)**: Audit menyeluruh seluruh modul komponen di `src/components/` dan `src/services/` untuk mengeliminasi string hardcoded.
   - **Roadmap Eksekusi 5 Fase**: Pendaftaran kamus lengkap di `context.tsx`, penerjemahan pesan instan WhatsApp, tabel log kampanye, kupon voucher & komisi, blog CMS publik, hingga seluruh portal Superadmin.

7. **[Public Legal & Company Pages Architecture Plan](./public_legal_and_company_pages_plan.md)**
   - **Halaman Profil & Legalitas Resmi Hide Group**: Pembuatan halaman Tentang Kami (`/about`), Hubungi Kami (`/contact`), Kebijakan Privasi (`/privacy` berstandar UU PDP & GDPR), dan Syarat & Ketentuan Layanan (`/terms` & `/tos`).
   - **Integrasi Data Perusahaan Terverifikasi**: Alamat kantor Semarang, email `admin@hidessh.com`, dan hotline WhatsApp `0877111301818` dengan penyesuaian navigasi Header & Footer.

8. **[Public Layout (Header & Footer) Unification Plan](./public_layout_header_footer_plan.md)**
   - **Penyatuan Shell Navigasi Publik `(public)/layout.tsx`**: Memastikan seluruh halaman publik (`/`, `/about`, `/contact`, `/privacy`, `/terms`, `/tos`, `/blog`) secara otomatis dan konsisten dibungkus oleh `PublicHeader` dan `PublicFooter` kanonikal.

9. **[Comprehensive Error Pages & Resilience Plan](./comprehensive_error_pages_and_resilience_plan.md)**
   - **Penanganan Error HTTP & Runtime Multi-Tier**: Pembuatan halaman kustom `not-found.tsx` (404), `error.tsx` (500 & Runtime Exception Handler), `global-error.tsx` (Root Layout Recovery), dan Segment Error Boundaries untuk dashboard & portal admin.

10. **[Landing Page Unofficial WhatsApp Benchmark Plan](./landing_page_unofficial_whatsapp_benchmark_plan.md)**
    - **Kurasi Konten B2B Enterprise (Benchmark Fonnte, Wablas, RuangWA, WhaCenter)**: Pengembangan 9 bagian komprehensif pada landing page meliputi Simulator Chat Interaktif (Teks, Media, OTP, Tombol, List), Code Sandbox REST API Multi-Language (cURL, Node.js, Go, PHP, Python), 9 Pilar Fitur Enterprise, Tabel Komparasi Arsitektur Go vs Chromium, Paket Harga Transparan, dan FAQ Interaktif berstandar Wise Aesthetic tanpa AI-slop.

11. **[Light Mode Color Contrast & Accessibility Plan](./light_mode_color_contrast_and_accessibility_plan.md)**
    - **Audit & Perbaikan Keterbacaan Teks Mode Terang**: Mengganti aksen warna teks `text-wise-green` dengan pola dual-tone `text-dark-green dark:text-wise-green` (rasio kontras 12:1 di Mode Terang dan 11.5:1 di Mode Gelap) pada tabel komparasi, kartu metrik, pill badges, dan halaman publik.

12. **[Public Header Navigation & Anchors Plan](./public_header_navigation_and_anchors_plan.md)**
    - **Penataan Ulang Menu Header Publik**: Menyusun menu navigasi utama menjadi tautan kanonikal (**Fitur**, **Harga**, **FAQ**, **Tentang Kami**, dan **Hubungi Kami**) dengan integrasi anchor scroll mulus pada landing page.

13. **[Public Footer Overhaul & Postman API Plan](./public_footer_overhaul_and_postman_api_plan.md)**
    - **Pembaruan Footer & Tautan Postman API**: Memperbarui identitas operasional *Hide Digital Security*, email, jam operasional fast-response, menautkan dokumentasi Postman API resmi, serta merapikan link Developer dan Legal.

14. **[Hero Subtitle Enterprise Copywriting Plan](./hero_subtitle_enterprise_copywriting_plan.md)**
    - **Penyelarasan Copywriting Hero Subtitle**: Mengubah teks deskripsi utama landing page untuk fokus pada fitur ekosistem WhatsApp bisnis (chatbot, CS multi-agent, notifikasi otomatis, blast massal, media file, & buku kontak).

15. **[Landing Page Width & UI/UX Refinement Plan](./landing_page_width_and_ui_ux_refinement_plan.md)**
    - **Audit Tata Letak & Pembatasan Lebar Kontainer (UI/UX)**: Menghilangkan kesan halaman terlalu melebar (*stretched*) dengan menerapkan hierarki kontainer Tier-1 (`max-w-6xl`, `max-w-5xl`, `max-w-4xl`, `max-w-3xl`) yang ergonomis, rapi, dan nyaman dibaca.

16. **[Remove Technical Architecture Comparison Section Plan](./remove_technical_architecture_comparison_section_plan.md)**
    - **Penghapusan Section Komparasi Arsitektur**: Menghapus tabel perbandingan teknis whatsmeow vs Chromium dari landing page untuk menyederhanakan alur narasi produk langsung ke fitur dan harga.

17. **[Meta Cloud API Drop-in Compatibility Plan](./meta_cloud_api_compatibility_copywriting_plan.md)**
    - **Kompatibilitas Penuh Meta WhatsApp Cloud API**: Menambahkan callout profesional pada section REST API Sandbox yang mengedukasi developer bahwa integrasi Meta Cloud API dapat langsung beralih ke Wahide cukup dengan mengganti Base URL tanpa rombak kode.

18. **[Hero Headline Wise Copywriting Plan](./hero_headline_wise_copywriting_plan.md)**
    - **Penyelarasan Judul Hero Gaya Wise**: Mengganti judul kaku bernuansa AI slop menjadi judul berorientasi aksi dan manfaat nyata: *"Kirim Pesan WhatsApp Massal Lebih Cepat, Aman, dan Tanpa Blokir."*

19. **[Frontend Performance & Speed Optimization Plan](./frontend_performance_and_speed_optimization_plan.md)**
    - **Audit Kinerja & Optimasi Kecepatan Frontend**: Dekomposisi Server vs Client Components, isolasi SpintaxSandbox, tree-shaking `optimizePackageImports`, serta kompresi HTTP untuk mencapai sub-second load time.

20. **[Comprehensive Architecture & Performance Review](./comprehensive_architecture_and_performance_review.md)**
    - **Audit Arsitektur Menyeluruh & Analisis Bottleneck**: Evaluasi komprehensif sistem frontend Next.js 16 (Edge Middleware route protection, Server Component streaming boundaries, Query cache deduplication, SSE resilience, table virtualization, dan HTTP client timeouts).

21. **[Deep Codebase Re-Audit & Production Hardening Plan](./deep_codebase_reaudit_and_production_hardening_plan.md)**
    - **Re-Audit Menyeluruh & Pengerasan Produksi Lanjutan**: Implementasi dynamic code-splitting modal via `next/dynamic`, virtualisasi tabel audit admin, atomic Zustand selectors, dan resource preconnect untuk performa puncak tanpa potensi bug masa depan.

22. **[Dynamic Preconnect via siteUrl Plan](./dynamic_preconnect_api_origin_plan.md)**
    - **Preconnect & DNS-Prefetch Dinamis Berbasis siteUrl**: Mengganti URL hardcoded `https://api.wahide.id` pada `layout.tsx` menjadi dinamis menggunakan konstanta `siteUrl` (`env.NEXT_PUBLIC_APP_URL || "https://wahide.id"`) agar konsisten dan adaptif antar lingkungan.

23. **[Turbopack Dev Diagnostics & Filesystem Tuning Plan](./turbopack_dev_diagnostics_and_filesystem_tuning_plan.md)**
    - **Analisis & Tuning Diagnostik Turbopack**: Penjelasan mendalam mengenai log cache self-healing Turbopack, peringatan filesystem benchmark drive sekunder Windows, auto-sync tsconfig.json, dan optimasi status eksperimental tree-shaking.
