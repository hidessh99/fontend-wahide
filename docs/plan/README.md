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

10. **[Light Mode Color Contrast Accessibility Plan](./light_mode_color_contrast_accessibility_plan.md)**
    - **Standarisasi Kontras Warna Light Mode (WCAG AAA Compliance)**: Mengganti penggunaan `text-wise-green` neon pada mode terang menjadi `text-dark-green dark:text-wise-green` dan `bg-light-mint dark:bg-wise-green/15` untuk tautan "Lihat Semua", badge, dan ikon.

11. **[Deposit Balance Label Streamlining Plan](./deposit_balance_label_streamlining_plan.md)**
    - **Penyederhanaan Label "Saldo Deposit"**: Menghilangkan kata redundan "Pesan" pada judul kartu saldo di halaman Billing menjadi "Saldo Deposit" (ID) / "Deposit Balance" (EN).

12. **[Invoice Conditional Action & Payment Link Plan](./invoice_conditional_action_payment_link_plan.md)**
    - **Aksi Faktur Kondisional & Tautan Pembayaran Tagihan**: Menampilkan tombol "Bayar" aktif saat status PENDING dan otomatis menyembunyikan tombol bayar saat status PAID.

13. **[Official Invoice Receipt & Payment Flow Plan](./official_invoice_receipt_and_payment_flow_plan.md)**
    - **Alur Pembayaran Tagihan & Modal Faktur Resmi (Print / Save PDF)**: Implementasi tombol bayar langsung untuk tagihan PENDING dan modal faktur resmi berstempel LUNAS lengkap dengan fitur Cetak / Simpan PDF untuk tagihan PAID.

14. **[Invoice Amount undefined toLocaleString Fix Plan](./invoice_amount_undefined_tolocalestring_fix_plan.md)**
    - **Perbaikan Error TypeError toLocaleString pada InvoiceTable**: Normalisasi DTO `snake_case` backend Go dan defensive rendering fallback `Number(inv.amount ?? 0)`.

15. **[Checkout URL Direct Payment Gateway Redirect Plan](./checkout_url_direct_payment_gateway_redirect_plan.md)**
    - **Direct Redirect ke Link Payment Gateway (checkout_url)**: Ekstraksi `checkout_url` / `redirect_url` dari REST API payment gateway dan direct redirect tab baru saat tombol Bayar diklik tanpa membuka modal popup topup.
