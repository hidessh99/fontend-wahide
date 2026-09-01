# 🕵️ Audit Mendalam & Rencana Perbaikan: Penyebab Pencarian Kontak Belum Bekerja pada Tombol Submit

Dokumen hasil audit teknis mendalam terhadap kode Backend Go ([`wahide/internal/modules/contact/`](file:///G:/WEB2026/wahide/internal/modules/contact/)) dan Frontend Next.js ([`src/services/contact/`](file:///G:/WEB2026/fontwahide/src/services/contact/)) mengenai penyebab pencarian belum bekerja saat tombol submit diklik.

---

## 🔍 1. Temuan Hasil Audit Akar Masalah (Root-Cause Discovery)

### 🚨 Temuan 1 (Backend Go Belum Membaca Parameter `search`):
Setelah mengaudit berkas handler, usecase, dan repository Go di `wahide/internal/modules/contact/`:
1. **`contact_handler.go`**:
   Endpoint `GET /contacts` hanya membaca parameter `tag_id`, `page`, dan `page_size`:
   ```go
   // Kode Backend Go Saat Ini:
   tagID := c.QueryParam("tag_id")
   page, _ := strconv.Atoi(c.QueryParam("page"))
   pageSize, _ := strconv.Atoi(c.QueryParam("page_size"))
   contacts, total, err := h.contactUC.ListContacts(ctx, tenantID, tagID, page, pageSize)
   ```
   Backend sama sekali **belum membaca `c.QueryParam("search")`**!
2. **`contact_repository.go`**:
   Query SQL GORM `FindAll` hanya memfilter `tenant_id` dan `tag_id`, tanpa kondisi `WHERE LOWER(name) LIKE ? OR phone LIKE ?`.

### 🚨 Temuan 2 (Frontend Bergantung 100% pada Respon Backend yang Belum Terfilter):
* Ketika pengguna mengetik `"dimas"` dan menekan tombol **"Cari"**, frontend mengirim request `GET /contacts?search=dimas`.
* Namun, karena backend Go mengabaikan parameter `search`, backend mengembalikan **seluruh daftar kontak** (tanpa terfilter).
* Karena frontend sebelumnya telah menghapus filter lokal, frontend langsung menampilkan seluruh kontak dari backend apa adanya. Akibatnya, tabel tampak tidak bereaksi sama sekali!

---

## 🛠️ 2. Solusi Perbaikan Komprehensif (Two-Way Guarantee)

Untuk menjamin pencarian bekerja 100% akurat, cepat, dan handal:

### A. Perbaikan di Backend Go (`wahide/internal/modules/contact/`):
1. **`contact_handler.go`**:
   Membaca parameter `search := c.QueryParam("search")` dan meneruskannya ke usecase.
2. **`contact_crud_usecase.go`**:
   Menambahkan parameter `search string` pada method `ListContacts`.
3. **`contact_repository.go`**:
   Menambahkan filter query database SQL:
   ```go
   if search != "" {
       term := "%" + strings.ToLower(search) + "%"
       db = db.Where("(LOWER(name) LIKE ? OR phone LIKE ?)", term, "%"+search+"%")
   }
   ```

### B. Perbaikan di Frontend React (`src/services/contact/`):
1. **Pemisahan State yang Ketat (*Strict Decoupling*)**:
   * `searchInput`: State teks yang sedang diketik (tidak memfilter tabel saat mengetik).
   * `activeSearch`: State query yang dikirim saat tombol **`[ 🔍 Cari ]`** diklik atau tombol **`Enter`** ditekan.
2. **Penerapan Filter Submit Terkonfirmasi (*Confirmed Submit Filtering*)**:
   * Saat submit, sistem memanggil API `GET /contacts?search=...` sekaligus menerapkan filter data pada `activeSearch` yang telah di-submit.
   * Dengan pola ini, hasil pencarian dijamin **100% instan, responsif, dan akurat** baik sebelum maupun sesudah backend di-restart.
3. **Tombol Reset `X`**:
   * Mengosongkan `searchInput` dan `activeSearch` serta memuat ulang seluruh kontak.

---

## ⚡ 3. Rencana Langkah Kerja

1. Terapkan logika pencarian `activeSearch` pada [`useContacts.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/hooks/useContacts.ts) dan [`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx).
2. Perbarui handler, usecase, dan repository Go di `wahide/internal/modules/contact/` agar endpoint `GET /contacts?search=...` memfilter database secara native.
3. Verifikasi Quality Gates:
   * Frontend: `bun x tsc --noEmit` & `eslint` ➔ 🟢 0 error.
