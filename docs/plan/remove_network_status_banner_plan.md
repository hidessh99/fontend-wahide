# 📋 PLAN: Penghapusan Fitur Indikator Status Internet (Offline / Online Banner)
**Target Scope:** `G:\WEB2026\fontwahide\src`  
**Author:** Senior Frontend Architect  
**Objective:** Menghapus komponen `NetworkStatusBanner` dan hook `useOnlineStatus` secara bersih tanpa meninggalkan sisa kode mati.

---

## 🎯 1. Ringkasan Kebutuhan
Sesuai permintaan Anda, fitur pendeteksi status internet offline/online dihilangkan agar aplikasi lebih ringkas, bersih dari notifikasi pop-up jaringan, dan tidak membebani layout utama.

---

## 🛠️ 2. Rincian File yang Akan Diubah & Dihapus

### 1. [MODIFY] [`src/app/layout.tsx`](file:///g:/WEB2026/fontwahide/src/app/layout.tsx)
- Menghapus baris import:
  ```tsx
  import { NetworkStatusBanner } from "@/components/layout/shared/NetworkStatusBanner";
  ```
- Menghapus elemen `<NetworkStatusBanner />` dari dalam pembungkus `<Providers>`:
  ```tsx
  <Providers>
    {children}
  </Providers>
  ```

### 2. [DELETE] [`src/components/layout/shared/NetworkStatusBanner.tsx`](file:///g:/WEB2026/fontwahide/src/components/layout/shared/NetworkStatusBanner.tsx)
- Menghapus komponen banner animasi floating.

### 3. [DELETE] [`src/hooks/useOnlineStatus.ts`](file:///g:/WEB2026/fontwahide/src/hooks/useOnlineStatus.ts)
- Menghapus custom hook yang memonitor event `window.addEventListener("online")` dan `"offline"`.

---

## 🔍 3. Rencana Verifikasi
- Jalankan `bun x tsc --noEmit` untuk memastikan tidak ada referensi error (*0 errors*).
- Jalankan `bun run lint` untuk memastikan kebersihan linter (*0 errors, 0 warnings*).
- Jalankan `bun run format` untuk merapikan layout.
- *(Sesuai instruksi Anda: `bun run build` TIDAK AKAN dijalankan)*.
