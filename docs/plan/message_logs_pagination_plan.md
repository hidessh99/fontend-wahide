# 🛠️ Analisis & Rencana Perbaikan: Implementasi & Perbaikan Pagination pada Tabel Delivered Message Logs

Dokumen ini merinci analisis mendalam mengapa kontrol pagination tidak muncul pada tab *Delivered Message Logs* di `http://localhost:3000/campaigns`, serta rencana perbaikan menyeluruh pada API client, hook, dan UI pagination bar.

---

## 1. 🔍 Analisis Masalah & Akar Penyebab

### A. Mengapa Kontrol Pagination Tidak Tampil di Layar Pengguna?
Berdasarkan tangkapan layar yang diunggah pengguna:
Di footer tabel hanya tertulis:
> *"Menampilkan 1 - 1 dari 1 log pesan"*
dan tidak ada tombol pagination (`Sebelumnya`, `Halaman 1 dari 1`, `Berikutnya`).

Penyebabnya adalah kombinasi dari 2 hal:

1. **Akar Masalah di Data Extraction ([`campaign.api.ts:124`](file:///g:/WEB2026/fontwahide/src/modules/campaign/api/campaign.api.ts#L124)) 🔴**:
   ```ts
   const total = res.pagination?.total_items || logs.length;
   ```
   - Backend Go (`wahide`) mengembalikan pagination dalam field **`additional_info.total`** (format standar `RespondPaginated` di Go backend).
   - Di `campaign.api.ts`, kode mencari `res.pagination?.total_items` yang bernilai `undefined`.
   - Akibatnya, `total` **selalu jatuh ke fallback `logs.length`**!
   - Dampak fatalnya: Sekalipun di database ada 100 atau 1.000 log pesan, `total` akan selalu sama dengan jumlah baris yang diambil saat itu (misal 20), sehingga `totalPages = Math.ceil(20 / 20) = 1`.
   - Akibatnya, sistem selalu menganggap data hanya 1 halaman!

2. **Kondisi Sembunyi Total ([`MessageLogsTable.tsx:389`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/logs/MessageLogsTable.tsx#L389))**:
   ```tsx
   {totalPages > 1 && (
     <DataTablePagination ... />
   )}
   ```
   Karena `totalPages` dihitung bernilai `1`, kontrol pagination disembunyikan sepenuhnya dari pandangan pengguna, dan pengguna tidak dapat melihat tombol navigasi maupun opsi memilih jumlah baris per halaman (*rows per page*).

---

## 2. 🛠️ Rencana Perbaikan Lengkap

### A. Perbaikan Ekstraksi Total di [`campaign.api.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/api/campaign.api.ts)
Perbaiki pembacaan metadata total dari `res.additional_info.total`:
```ts
const info = res.additional_info as { total?: number; page?: number; size?: number } | undefined;
const total = info?.total ?? res.pagination?.total_items ?? logs.length;
```
Dengan perbaikan ini, jumlah riil log pesan di database (misal 50, 100, 500) akan terbaca secara akurat.

### B. Dukungan Dynamic Page Size di [`useMessageLogs.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/hooks/useMessageLogs.ts)
- Izinkan pengguna mengubah `pageSize` (10, 20, 50, 100).
- Tambahkan `pageSize` dan setter `setPageSize` yang terhubung ke pemanggilan API.

### C. Redesain Pagination Bar di [`MessageLogsTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/logs/MessageLogsTable.tsx)
Footer tabel dirancang ulang dengan layout enterprise modern:
1. **Sisi Kiri**:
   - Ringkasan data: `Menampilkan {startItem} - {endItem} dari {total} log pesan`.
   - Pemilih baris per halaman (*Rows per page selector*): Dropdown `[10, 20, 50, 100]` baris per halaman.
2. **Sisi Kanan (Selalu Tampak)**:
   - Tombol `Sebelumnya` (disabled jika di halaman pertama).
   - Indikator halaman: Badge / teks `Halaman {page} dari {totalPages}`.
   - Tombol `Berikutnya` (disabled jika di halaman terakhir).
   - Menghilangkan aturan `if (totalPages > 1)` agar pengguna selalu melihat kontrol pagination yang konsisten dan interaktif.

### D. Lokalisasi Bahasa ([`id/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/id/campaign.json) & [`en/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/en/campaign.json))
- Tambahkan teks:
  - `pageOf`: "Halaman {page} dari {total}"
  - `perPage`: "per halaman"
  - `rowsPerPage`: "Baris per halaman"

---

## 3. 📋 Rencana Pengujian & Quality Gate

1. `bun x tsc --noEmit` di direktori `fontwahide`.
2. `bun run lint`.
3. `bun run format`.
4. `make lint` di direktori `wahide`.
5. ❌ Tidak menjalankan `bun run build` dan `git push` (kepatuhan aturan).
