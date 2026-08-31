# 📚 Indeks Rencana & Panduan Arsitektur Frontend Wahide

Daftar dokumen perencanaan arsitektur, optimasi performa, dan standarisasi teknis untuk proyek `fontwahide`.

---

1. **[Tailwind CSS v4 & Unknown At-Rule Plan](./tailwindcss_v4_css_unknown_at_rule_plan.md)**
   - **Penjelasan Format Tailwind CSS v4 & Solusi Unknown At-Rule**: Panduan mengapa sintaks `@theme inline` dan `@custom-variant` adalah standar resmi Tailwind v4 dan penyediaan konfigurasi `.vscode/settings.json` untuk menghilangkan peringatan di editor.

2. **[CORS Preflight & Session Tenant Audit Plan](./cors_preflight_and_session_tenant_audit_plan.md)**
   - **Audit CORS Preflight & Manajemen Tenant Session**: Investigasi menyeluruh terhadap error CORS akibat header `x-tenant-id`, sinkronisasi referensi Postman API, dan perbaikan HttpClient agar murni mengandalkan JWT Bearer token serta Zustand session.

3. **[Auth Session & Storage Unification Plan](./auth_session_storage_unification_plan.md)**
   - **Unifikasi & Penyederhanaan Penyimpanan Autentikasi**: Analisis batas arsitektur Edge Runtime vs Client React, eliminasi duplikasi cookie `wahide_tenant_id` yang redundan, dan standarisasi Single Source of Truth.

4. **[Modal Viewport Responsiveness & Accessibility Plan](./modal_viewport_responsiveness_and_accessibility_plan.md)**
   - **Standardisasi Responsivitas Viewport & Aksesibilitas Modal**: Mengatasi masalah modal QR terpotong di layar laptop kecil, mengaktifkan scroll internal `max-h-[90vh]`, click outside to close, dan tombol `Escape` keyboard di seluruh modal.
