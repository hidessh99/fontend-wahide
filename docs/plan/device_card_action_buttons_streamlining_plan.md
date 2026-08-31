# 🧭 Analisis UX & Rencana Perbaikan: Penyederhanaan Tombol Aksi Kartu Perangkat ("Putuskan" & "Hibernasi")

Dokumen telaah UX (*Information Density, Micro-Copy, & Responsive UI Ergonomics*) mengenai penyederhanaan teks tombol aksi pada kartu slot perangkat WhatsApp agar pas dan rapi tanpa terpotong di layar kompak.

---

## 💡 1. Analisis & Pendapat Senior Lead UX / Software Architect

Usulan penyederhanaan label tombol dari **"Putuskan Koneksi"** menjadi **"Putuskan"** dan **"Hibernasi Sesi"** menjadi **"Hibernasi"** adalah **KEPUTUSAN UX SANGAT TEPAT DAN SANGAT DIANJURKAN! (100% Setuju)**.

### Alasan & Rasionalisasi Desain:
1. **Ergonomi Tata Letak Kompak (*Information Density & Anti-Wrapping*)**:
   * Kartu slot WhatsApp berukuran kompak (~320px–380px dalam grid).
   * Pada baris bawah, terdapat dua tombol yang berdampingan (*side-by-side flex split*).
   * Teks `Putuskan Koneksi` (16 karakter) + `Hibernasi Sesi` (14 karakter) + 2 ikon + padding sering kali membuat tombol terasa sesak, sempit, atau bahkan memicu *text wrapping* menjadi 2 baris pada layar ponsel/tablet.
   * Dengan memperpendek menjadi **`Putuskan`** (8 karakter) dan **`Hibernasi`** (9 karakter), kita **menghemat ~45% ruang horizontal**. Tombol menjadi sangat lega, seimbang, dan sedap dipandang.
2. **Menghilangkan Kata Redundan (*Concise Micro-Copy*)**:
   * Pengguna sudah berada di dalam kartu slot perangkat WhatsApp.
   * Kata tambahan *"..Koneksi"* dan *"..Sesi"* adalah *kata redundan* yang tidak memberikan nilai informasi tambahan.
   * Kata tunggal **`Putuskan`** dan **`Hibernasi`** sudah 100% jelas artinya (*self-explanatory*) dan tidak menimbulkan keraguan.
3. **Simetri Lengkap Status & Aksi**:
   * Status **Terputus** ➔ Tombol **`Hubungkan`** (1 kata)
   * Status **Terhubung** ➔ Tombol **`Hibernasi`** & **`Putuskan`** (masing-masing 1 kata)
   * Status **Hibernasi** ➔ Tombol **`Bangunkan`** (1 kata)

---

## ⚡ 2. Rencana Implementasi

1. **Pembaruan Kamus i18n (`src/locales/id/whatsapp.json`)**:
   * `"disconnect": "Putuskan"` (sebelumnya `"Putuskan Koneksi"`)
   * `"hibernate": "Hibernasi"` (sebelumnya `"Hibernasi Sesi"`)
   * `"wake": "Bangunkan"` (sebelumnya `"Bangunkan Sesi"`)
2. **Pembaruan Kamus i18n (`src/locales/en/whatsapp.json`)**:
   * `"disconnect": "Disconnect"`
   * `"hibernate": "Hibernate"`
   * `"wake": "Wake"`
3. **Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
