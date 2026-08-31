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

5. **[Device Action CTA Refinement Plan](./device_action_cta_refinement_plan.md)**
   - **Penyempurnaan Label CTA Kartu Perangkat ("Hubungkan")**: Analisis semantik antarmuka dan penggantian tombol "Scan QR Code" menjadi "Hubungkan" (ID) / "Connect" (EN) untuk meningkatkan kejelasan tujuan pengguna (*Action-Oriented UX*).

6. **[Device Card Action Buttons Streamlining Plan](./device_card_action_buttons_streamlining_plan.md)**
   - **Penyederhanaan Tombol Aksi Kartu Perangkat ("Putuskan" & "Hibernasi")**: Mengoptimalkan micro-copy tombol side-by-side pada kartu slot perangkat agar hemat ruang (~45%), bebas dari text-wrapping, dan proporsional di seluruh resolusi layar.

7. **[Billing Affiliate Section Cleanup Plan](./billing_affiliate_section_cleanup_plan.md)**
   - **Pembersihan Section Komisi Afiliasi / Seller Pending**: Menghapus kartu hardcoded komisi afiliasi pada halaman billing agar antarmuka fokus murni pada saldo deposit dan faktur transaksi resmi.

8. **[Top-Up Micro Denominations & Min. Limit Plan](./topup_micro_denominations_plan.md)**
   - **Penyesuaian Pilihan Nominal Deposit & Minimal Rp 10.000**: Memperbarui preset nominal deposit menjadi Rp 10.000, Rp 20.000, Rp 50.000, Rp 100.000 dan mengatur batas validasi minimum top-up menjadi Rp 10.000.

9. **[Subscription undefined toLocaleString Fix Plan](./subscription_undefined_tolocalestring_fix_plan.md)**
   - **Perbaikan Error TypeError toLocaleString pada Halaman Subscription**: Normalisasi data respon backend Go (`snake_case` $\to$ `camelCase`) dan implementasi rendering defensif pada `QuotaDialCard` dan `PlanCardGrid`.
