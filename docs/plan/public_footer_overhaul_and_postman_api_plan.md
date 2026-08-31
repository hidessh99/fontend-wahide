# 🧭 Rencana Arsitektur & Pelaksanaan: Pembaruan Footer Publik & Integrasi Dokumentasi Postman API

> **Tujuan**: Memperbarui komponen footer publik ([`PublicFooter.tsx`](file:///G:/WEB2026/fontwahide/src/components/layout/public/PublicFooter.tsx)) dengan informasi operasional resmi Hide Digital Security, menautkan dokumentasi Postman API resmi, serta merapikan daftar tautan pada kolom Developer dan Legal & Bantuan.

---

## 📑 Rincian Perubahan Komponen Footer

### 1. 🏢 Kolom Identitas & Jam Operasional Brand
Mengganti teks deskripsi umum menjadi informasi kontak dan jam layanan resmi:
* **Pengembang**: `By Hide Digital Security`
* **Email Resmi**: `admin@hidessh.com` (*clickable mailto*)
* **Jam Operasional**:
  * `Open Hours (Fast Response):`
  * `Mon - Sat: 8 am - 5 pm, Sunday: Slow Response`

### 2. 💻 Kolom Developer
* **Dokumentasi Postman API**: Mengarahkan ke URL resmi Postman:
  * URL: `https://documenter.getpostman.com/view/26294023/2sBYAuSqz3`
  * Atribut: `target="_blank"` dan `rel="noopener noreferrer"`
* **Dihapus**:
  * ❌ *GitHub Repo* (`https://github.com/...`)
  * ❌ *Arsitektur whatsmeow* (`/#architecture`)

### 3. ⚖️ Kolom Legal & Bantuan
* **Dihapus**:
  * ❌ *Helpdesk Support* (`/support`)
* **Tautan yang Dipertahankan**:
  * ✅ **Hubungi Kami** (`/contact`)
  * ✅ **Syarat & Ketentuan** (`/terms`)
  * ✅ **Kebijakan Privasi** (`/privacy`)

---

## 🗺️ Perubahan Struktur Data & Kode

### A. Kamus Multibahasa (`src/locales/{id,en}/common.json`)
```json
"footer": {
  "by": "By Hide Digital Security",
  "email": "Email : admin@hidessh.com",
  "openHoursTitle": "Open Hours (Fast Response):",
  "openHoursDesc": "Mon - Sat: 8 am - 5 pm, Sunday: Slow Response",
  "product": "Produk",
  "developer": "Developer",
  "apiDocs": "Dokumentasi Postman API",
  "legal": "Legal & Bantuan",
  "contact": "Hubungi Kami",
  "terms": "Syarat & Ketentuan",
  "privacy": "Kebijakan Privasi",
  "rights": "All rights reserved.",
  "sla": "SLA 99.9% Uptime",
  "encryption": "AES-GCM 256 Enkripsi"
}
```

### B. Komponen Footer (`src/components/layout/public/PublicFooter.tsx`)
* Memperbarui JSX layout grid 4-kolom dengan tipografi kontras tinggi yang ramah Light/Dark Mode.
* Menyusun tautan eksternal Postman dengan icon eksternal yang rapi.

---

## 🔍 Verifikasi Quality Gates
* **Uji Tautan Eksternal**: Klik *Dokumentasi Postman API* membuka tab baru ke `https://documenter.getpostman.com/view/26294023/2sBYAuSqz3`.
* **Uji Tautan Legal**: Klik *Hubungi Kami*, *Syarat & Ketentuan*, *Kebijakan Privasi* berfungsi tanpa error 404.
* **TypeScript & Lint**: `bun x tsc --noEmit` & `bun run lint` (0 error & 0 warning).
