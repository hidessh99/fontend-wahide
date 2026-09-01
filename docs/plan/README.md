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

16. **[Contacts Server-Side Search and Submit Plan](./contacts_server_side_search_and_submit_plan.md)**
    - **Pencarian Kontak Berbasis Server (Server-Side Search) dengan Tombol Submit**: Penambahan tombol submit "Cari" dan penanganan pemanggilan API `GET /contacts?search=query` saat Enter / klik Cari.

17. **[Contact Table Tag Column Removal Plan](./contact_table_tag_column_removal_plan.md)**
    - **Penghapusan Kolom Tag / Segmen pada Tabel Kontak**: Menghapus kolom Tag / Segmen yang tidak didukung backend Go dan memperluas kolom Nama Kontak serta Nomor WhatsApp.

18. **[Pure Server-Side Contact Search Plan](./pure_server_side_contact_search_plan.md)**
    - **Pencarian Kontak Pure Server-Side (Submit-Only Trigger)**: Memisahkan state input draft dari query aktif sehingga pengetikan tidak menyaring tabel lokal, melainkan murni memanggil backend saat klik Cari atau tekan Enter.

19. **[Contacts Search Root Cause Audit & Fix Plan](./contacts_search_root_cause_audit_and_fix_plan.md)**
    - **Audit Mendalam & Perbaikan Akar Masalah Pencarian Kontak**: Penambahan parsing query parameter `search` pada backend Go (`contact_handler.go` & `contact_repository.go`) dan penyempurnaan filtering submit di frontend.

20. **[Backend Contact Search Finance Reference Plan](./backend_contact_search_finance_reference_plan.md)**
    - **Penyelarasan Backend Go Modul Kontak Berdasarkan Referensi Billing Module (FindAll)**: Mengadopsi pola Clean Architecture dari Billing Module (`billing_handler.go#L155`, `ListContactRequest`, `xval.SanitizeFields`, `PreparePagination`, dan `database.FullTextSearch`) untuk endpoint `GET /contacts`.

21. **[Contact Table Pagination & Desktop Typography Plan](./contact_table_pagination_and_desktop_typography_plan.md)**
    - **Paginasi Server-Side (10 Data/Halaman) & Peningkatan Tipografi Desktop**: Penerapan bilah paginasi numerik dengan ukuran font yang proporsional, tegas, dan mudah dibaca pada mode desktop.

22. **[Contact Delete Confirmation Dialog Plan](./contact_delete_confirmation_dialog_plan.md)**
    - **Dialog Konfirmasi Penghapusan Kontak (Single & Bulk Delete)**: Mencegah aksi penghapusan permanen tidak sengaja dengan menyajikan modal alert konfirmasi kontekstual yang aman dan profesional.

23. **[Contact Pagination Prev/Next Only Plan](./contact_pagination_prev_next_only_plan.md)**
    - **Penyederhanaan Paginasi Kontak Murni Tombol Sebelumnya & Berikutnya**: Mengeliminasi deretan angka nomor halaman agar bilah navigasi lebih ringkas, bersih, dan hemat ruang.

24. **[Comprehensive Table Components Audit & Standardization Plan](./comprehensive_table_components_audit_and_standardization_plan.md)**
    - **Audit Menyeluruh & Rencana Standarisasi Seluruh Komponen Tabel**: Penyelarasan Search Form Submit Button, Paginasi Prev/Next, Tipografi Desktop, dan Dialog Konfirmasi Hapus pada seluruh tabel (Finance, Campaign Logs, Admin Users, Audit Logs, Support Tickets, dan Team).

25. **[WhatsApp Device Hibernate and Wake Endpoint Plan](./whatsapp_device_hibernate_and_wake_endpoint_plan.md)**
    - **Rencana Perbaikan Endpoint Hibernasi & Bangunkan Perangkat WhatsApp (Fix 404 Not Found)**: Implementasi route registration `POST /whatsapp/devices/:id/hibernate` dan `POST /whatsapp/devices/:id/wake`, handler, usecase, serta manajemen sesi whatsmeow di backend Go.

26. **[WhatsApp Device Realtime Connection State Reconciliation Plan](./whatsapp_device_realtime_connection_state_reconciliation_plan.md)**
    - **Rencana Rekonsiliasi Real-Time Status Koneksi Perangkat WhatsApp (Fix Stale "Connected" Status)**: Menghubungkan status perangkat langsung ke kondisi real-time WebSocket memory (`SessionManager.GetClient`) sehingga saat server Go direstart/mati, status perangkat otomatis terhibernasi (`HIBERNATED`) dan bukan statis `Connected`.

27. **[Subscription Page Streamlining Plans Only Plan](./subscription_page_streamlining_plans_only_plan.md)**
    - **Rencana Perampingan Halaman Subscription (Murni Fokus Pilihan Paket / Plans)**: Menghapus section Remaining Message Quota dan Webhook URL Configuration, serta menyelaraskan judul & menu navigasi menjadi "Plans" / "Paket Langganan".

28. **[WhatsApp Device Offline on Restart Plan](./whatsapp_device_offline_on_restart_plan.md)**
    - **Rencana Status Perangkat Menjadi OFFLINE Saat Server Go Direstart / Dimatikan**: Menyesuaikan status perangkat saat server mati atau boot ulang menjadi `OFFLINE` (Disconnected), dan hanya `HIBERNATED` jika tombol Hibernasi diklik secara sengaja.

29. **[Subscription Upgrade Endpoint & Business Scenarios Plan](./subscription_upgrade_endpoint_and_scenarios_plan.md)**
    - **Rencana Implementasi Endpoint Upgrade Subscription & Skenario Bisnis (Fix 404 Not Found)**: Implementasi rute `POST /subscription/upgrade`, handler, usecase, ACID transaction, serta rekonsiliasi masa aktif dan kuota langganan di backend Go.

30. **[Dashboard Active Subscription Expiration UI/UX Plan](./dashboard_active_plan_expiration_ui_ux_plan.md)**
    - **Rencana & Evaluasi UI/UX: Masa Aktif Langganan Tenant (Subscription Expiration) pada Dashboard**: Menampilkan status masa aktif langganan tenant pada header dasbor dengan membedakan Langganan FREE (Selamanya/Lifetime) dan Langganan Berbayar (Berdasarkan `subscriptions.expired_at` & Hitungan Sisa Hari).

31. **[Sidebar Role-Based Grouping UI/UX Plan](./sidebar_role_based_grouping_ui_ux_plan.md)**
    - **Rencana & Evaluasi UI/UX: Restrukturisasi Sidebar Navigasi Berbasis Grouping & Pemisahan Role (Sleek & Clean)**: Menghapus badge FREE di header logo, menghapus footer box Anti-Ban, memisahkan navigasi role (Admin, Seller, Agent), dan mengelompokkan menu menjadi 4 kategori terstruktur (*General*, *WhatsApp Engine*, *Account & Billing*, *Support*).

32. **[Support Tickets Route & Mapping Plan](./support_tickets_route_and_mapping_plan.md)**
    - **Rencana Implementasi: Perbaikan Route Support Tickets (Fix 404 Not Found)**: Mendaftarkan alias route `/support/tickets`, `/support/ticket`, `/tickets`, `/ticket` di backend Go dan menyempurnakan normalisasi DTO di frontend.

33. **[Support Ticket Priority & Payload Audit Plan](./support_ticket_priority_and_payload_audit_plan.md)**
    - **Rencana & Audit Mendalam: Validasi Payload Tiket Bantuan & DTO Support Module (Fix Validation oneof Priority & Attachment Cloudflare R2)**: Mengatasi penolakan field `Priority` huruf kapital pada Go validator, menyelaraskan mapping field balasan tiket (`content` vs `message`), dan integrasi attachment Cloudflare R2.

34. **[Support Ticket Priority Uppercase Constants Plan](./support_ticket_priority_uppercase_constants_plan.md)**
    - **Rencana & Standardisasi: Konstanta Huruf Kapital (UPPERCASE) Priority & Category pada Support Module Entity**: Mendefinisikan konstanta eksplisit `LOW`, `MEDIUM`, `HIGH` di `entity/ticket.go` dan standarisasi nilai database.

35. **[Next.js Routing & 404 Root Cause Plan](./nextjs_routing_and_404_root_cause_plan.md)**
    - **Analisis Mendalam & Rencana: Mengatasi Halaman 404 (Looks Like You've Wandered Off The Grid) pada Next.js**: Penjelasan desinkronisasi cache routing dev server `.next/` dan panduan pemulihan server frontend.

36. **[Auth Session Expired & Cookie Cleanup Plan](./auth_session_expired_and_cookie_cleanup_plan.md)**
    - **Analisis & Rencana: Penanganan Session Expired, Pembersihan Cookie & LocalStorage Menyeluruh**: Penjelasan pemicu `/login?session_expired=1`, fungsi `clearAllAuthStorage()`, banner notifikasi di LoginForm, dan eliminasi residu auth state.

37. **[JWT & Redis Session Revocation Audit Plan](./jwt_redis_session_revocation_audit_plan.md)**
    - **Analisis Mendalam & Audit: Mekanisme 401 "Session has been revoked" & Masa Berlaku JWT 7 Hari**: Penjelasan arsitektur dual-layer JWT + Redis session key, penyebab kunci Redis hilang saat restart, dan standarisasi siklus autentikasi.

38. **[Stateful JWT Security Option A Plan](./stateful_jwt_security_option_a_plan.md)**
    - **Rencana & Panduan: Penerapan Opsi A (Keamanan Maksimal: Hybrid Stateful JWT + Redis) Bebas Bug di Local Development & Production**: Standarisasi debounce redirect 401, sinkronisasi masa aktif 7 hari, dan pembersihan total sesi.

39. **[Support Ticket Cloudflare R2 Image Upload Plan](./support_ticket_cloudflare_r2_image_upload_plan.md)**
    - **Rencana & Integrasi: Upload Gambar Screenshot Cloudflare R2 pada Modal Buat Tiket Bantuan**: Integrasi upload multipart `FormData`, penambahan pemilih file screenshot, preview thumbnail, dan penayangan gambar pada thread diskusi tiket.

40. **[Resilient Session Auto-Healing Plan](./resilient_session_auto_healing_plan.md)**
    - **Rencana Perbaikan Mode Development: Resilient Session Auto-Healing (Bebas 401 Saat Restart Redis/Golang)**: Pola explicit revocation blacklist + session auto-rehydration di backend Go agar pengembang bebas mematikan/menghidupkan Redis dan Golang tanpa logout paksa.

41. **[All Modals Viewport Scroll Audit Plan](./all_modals_viewport_scroll_audit_plan.md)**
    - **Audit Menyeluruh Seluruh Komponen Modal & Rencana Standarisasi Viewport Responsiveness (Anti-Cutoff)**: Audit 13 komponen modal/dialog di frontend dan rencana standarisasi struktur 3-layer sticky layout agar bebas terpotong di layar laptop.

42. **[Support Ticket Reply Audit and Fix Plan](./support_ticket_reply_audit_and_fix_plan.md)**
    - **Audit Mendalam & Rencana Perbaikan: Balasan Tiket Bantuan Tidak Muncul (Ticket Reply Synchronization)**: Investigasi 4 akar penyebab pesan balasan tidak muncul di thread tiket, penambahan API `getReplies`, sinkronisasi real-time thread messages, dan dukungan fleksibel ID/RefNumber di backend Go.

43. **[Support Ticket Reply Image Upload Plan](./support_ticket_reply_image_upload_plan.md)**
    - **Rencana Integrasi: Upload Gambar / Screenshot pada Balasan Tiket Bantuan (Ticket Thread Image Attachment)**: Arsitektur unggah screenshot Cloudflare R2 pada modal balasan tiket, komparasi Opsi A (Native Field Backend & Frontend) vs Opsi B (Murni Frontend), desain form attachment, dan rendering thumbnail gambar di bubble chat.

44. **[Support Dedicated Page UX Refactor Plan](./support_dedicated_page_ux_refactor_plan.md)**
    - **Perencanaan Arsitektur UX/UI: Transformasi Modal Support Menjadi Halaman Dedicated (`/support/[id]`)**: Evaluasi mendalam UX/UI engineer perbandingan modal vs dedicated page, adopsi 2-column master-detail layout standar B2B SaaS, deep linking, sticky metadata sidebar, dan breadcrumb navigasi.
