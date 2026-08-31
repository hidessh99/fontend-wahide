# 🧭 Rencana Perbaikan: Preconnect & DNS-Prefetch Menggunakan `siteUrl` (`src/app/layout.tsx`)

Dokumen perencanaan untuk menyelaraskan tag `<link rel="preconnect">` dan `<link rel="dns-prefetch">` di `src/app/layout.tsx` agar menggunakan konstanta `siteUrl` (`env.NEXT_PUBLIC_APP_URL || "https://wahide.id"`) yang sudah didefinisikan di bagian atas file.

---

## 🔍 Analisis Kondisi Saat Ini

* **Konstanta yang Sudah Ada di `src/app/layout.tsx`**:
  ```ts
  const siteUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";
  ```
* **Kondisi Tag `<head>` Saat Ini**:
  ```html
  <!-- Masih hardcoded "https://api.wahide.id" -->
  <link rel="preconnect" href="https://api.wahide.id" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="https://api.wahide.id" />
  ```
* **Alasan Penyesuaian ke `siteUrl`**:
  1. **Konsistensi Tunggal (Single Source of Truth)**: `src/app/layout.tsx` sudah memiliki konstanta `siteUrl` yang dipakai untuk OpenGraph, Twitter card, Canonical URL, dan Schema.org JSON-LD.
  2. **Dinamis & Adaptif**: Mengikuti konfigurasi `env.NEXT_PUBLIC_APP_URL`. Jika domain utama berubah, preconnect akan otomatis mengikuti tanpa perlu mengubah kode sumber secara manual.
  3. **Pencegahan Redundansi**: Tidak perlu mendeklarasikan parser URL baru, cukup memanfaatkan `siteUrl` yang sudah teruji.

---

## ⚡ Solusi & Rencana Implementasi

Di dalam komponen `RootLayout` pada `src/app/layout.tsx`:

```html
<head>
  {/* Preconnect & DNS-Prefetch Dinamis menggunakan siteUrl (hanya aktif di non-localhost) */}
  {siteUrl && !siteUrl.includes("localhost") && (
    <>
      <link rel="preconnect" href={siteUrl} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={siteUrl} />
    </>
  )}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
</head>
```

---

## 🔍 Hasil Uji Kualitas (Quality Gates):
* `bun x tsc --noEmit` ➔ 🟢 **0 errors (100% Type-Safe)**
* `eslint` ➔ 🟢 **0 errors, 0 warnings (100% Clean Code)**
