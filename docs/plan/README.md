# 📚 Wahide Frontend Technical Planning Documentation (Wise Design System Edition)

Dokumen perencanaan teknis untuk frontend **Wahide (`fontwahide`)** dengan identitas **Wise-Inspired Design System**:

1. **[Master Technical Planning Document (Wise Edition)](./frontend_architecture_and_technical_plan.md)**
   - **Wise Design System**: Palet warna Lime Green (`#9fe870`), Near-Black (`#0e0f0c`), tipografi Display Weight 900 dengan ultra-tight line-height `0.85`, Inter 600 default reading weight, Pill Buttons (`rounded-full`) dengan efek fisik `scale(1.05)` saat hover, serta Card radius besar (`rounded-[30px]`).
   - **Arsitektur Domain Services (`src/services/*`)**: Pembagian domain service `iam`, `whatsapp`, `campaign`, `contact`, `subscription`, `finance`, `support`, `content`, `admin`.
   - **Responsivitas & Theming**: Dukungan native **Dark Mode & Light Mode** dan adaptasi responsif mobile/tablet/desktop.
   - **Zero Memory & CPU Leak Protocol**: Panduan streaming SSE / WebSocket QR Pairing & Virtualized Data Tables yang sangat ringan untuk laptop Core i3 & RAM 8GB.
   - **Internationalization (i18n)**: Dukungan multi-bahasa (`id` & `en`).
   - **Roadmap 6 Fase**: Rencana tahapan eksekusi dari Wise Core Shell hingga Production Performance Audit.
