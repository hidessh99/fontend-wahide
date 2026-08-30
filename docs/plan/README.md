# Wahide Frontend Technical Planning Documentation (Wise Design System Edition)

Dokumen perencanaan teknis untuk frontend **Wahide (`fontwahide`)** berstandar Enterprise Fintech dengan identitas **Wise-Inspired Design System**:

1. **[Master Technical Planning Document (Wise Edition)](./frontend_architecture_and_technical_plan.md)**
   - **Wise Design System**: Palet warna Lime Green (`#9fe870`), Dark Forest (`#163300`), Near-Black (`#0e0f0c`), tipografi Display Weight 900 dengan ultra-tight line-height `0.85`, Inter 600 default reading weight, Pill Buttons (`rounded-full`) dengan efek fisik `scale(1.05)` saat hover, serta Card radius kanonikal (`rounded-md` & `rounded-lg`).
   - **Arsitektur Single Page Application (SPA)**: Navigasi instan client-side menggunakan `next/link` dan `router.push()`, pencegatan form asinkron (`e.preventDefault()`), zero page reload, serta persistensi memori state/WebSocket.
   - **Sistem Notifikasi Global (Sonner Toaster)**: Engine notifikasi modern `sonner` dengan auto-sync tema Dark/Light dan integrasi dual-tier (Inline Banners untuk validasi form + Floating Toasts untuk event global).
   - **Internationalization (i18n) Bilingual**: Dukungan multi-bahasa dinamis (`ID` & `EN`) dengan *smart fallback resolver* dan *zero hydration mismatch*.
   - **Proteksi Bot & Brute-Force (Cloudflare Turnstile)**: Integrasi widget Turnstile pada form otentikasi dengan manajemen lifecycle auto-reset.
   - **Standar Aksesibilitas & SEO (Lighthouse 100)**: MetadataBase, Canonical URL, OpenGraph, JSON-LD Structured Data, Semantic `<main>` landmark, dan touch target minimum 36px.
   - **Arsitektur Domain Services (`src/services/*`)**: Pembagian 9 domain service terisolasi (`iam`, `whatsapp`, `campaign`, `contact`, `subscription`, `finance`, `support`, `content`, `admin`).
   - **Zero Memory & CPU Leak Protocol**: Panduan streaming SSE / WebSocket QR Pairing & Virtualized Data Tables yang sangat ringan untuk laptop Core i3 & RAM 8GB.
   - **Roadmap 6 Fase**: Rencana tahapan eksekusi dari Wise Core Shell hingga Production Performance Audit.
