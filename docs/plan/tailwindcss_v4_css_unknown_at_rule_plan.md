# 🧭 Analisis & Rencana: Penjelasan Format Tailwind CSS v4 & Peringatan "Unknown at rule" (`globals.css`)

Dokumen penjelasan mengenai format sintaks CSS di `src/app/globals.css`, mengapa peringatan (*warning*) *Unknown at rule* muncul di editor (VS Code / Cursor / Windsurf), dan langkah standardisasi konfigurasinya.

---

## 🔍 1. Apakah Format `globals.css` Saat Ini Sudah Sesuai Standar Tailwind CSS?

**JAWABAN: YA, 100% SUDAH SESUAI STANDAR RESMI TAILWIND CSS v4.**

Proyek ini menggunakan dependensi modern:
* `"tailwindcss": "^4"`
* `"@tailwindcss/postcss": "^4"`

### 📜 Perbedaan Format Tailwind CSS v3 vs Tailwind CSS v4:

| Fitur | Tailwind CSS v3 (Format Lama) | Tailwind CSS v4 (Format Saat Ini di Proyek Anda) |
| :--- | :--- | :--- |
| **Import Utama** | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| **Kustomisasi Tema (Colors & Fonts)** | Dikonfigurasi di file JavaScript terpisah `tailwind.config.js` | Dikonfigurasi langsung di CSS menggunakan `@theme` / `@theme inline` |
| **Dark Mode Strategy** | `darkMode: "class"` di `tailwind.config.js` | `@custom-variant dark (&:is(.dark *));` langsung di CSS |

Sintaks `@theme inline`, `@custom-variant`, dan `@import "tailwindcss";` adalah **spesifikasi kanonikal CSS-first dari Tailwind CSS v4** yang direkomendasikan langsung oleh tim inti Tailwind Labs.

---

## ⚠️ 2. Mengapa Muncul Peringatan (*Warning*) "Unknown at rule"?

* **Penyebab**:  
  Linter CSS bawaan di editor kode (VS Code / Cursor / Windsurf) hanya mengenali aturan CSS standar W3C kuno (`@media`, `@keyframes`, `@supports`, dll.). Editor **belum mengetahui secara otomatis bahwa kata kunci `@theme` dan `@custom-variant` adalah aturan resmi milik Tailwind CSS v4**.
* **Dampak**:  
  Peringatan ini **hanya bersifat kosmetik di editor editor text (*IDE warning*)** dan sama sekali **tidak mempengaruhi kompilasi build browser (Next.js & PostCSS tetap memprosesnya 100% lancar)**.

---

## 🛠️ 3. Rencana Solusi Menghilangkan Warning di Editor

1. **Membuat Konfigurasi Editor ([`.vscode/settings.json`](file:///G:/WEB2026/fontwahide/.vscode/settings.json))**:
   Menambahkan pengaturan standar industri resmi yang direkomendasikan oleh Tailwind CSS:
   ```json
   {
     "css.lint.unknownAtRules": "ignore",
     "files.associations": {
       "*.css": "tailwindcss"
     }
   }
   ```
2. **Verifikasi**:
   * Peringatan bergaris kuning/merah *"Unknown at rule @theme"* dan *"Unknown at rule @custom-variant"* di `globals.css` akan langsung hilang seketika di editor.
   * `bun x tsc --noEmit` & `bun run lint` tetap berstatus 🟢 0 errors & 0 warnings.
