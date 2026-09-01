# 🧭 Analisis & Rencana Pembaruan: Penghapusan Total Kolom & Input Tag / Segmen pada Modul Buku Kontak

Dokumen perencanaan teknis mengenai penghapusan menyeluruh kolom **Tag / Segmen** pada tabel kontak ([`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx)), **Popup Form Tambah & Edit Kontak** ([`ContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactModal.tsx)), **Modal Impor CSV** ([`ImportCsvModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ImportCsvModal.tsx)), dan **Toolbar Filter** ([`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx)) karena backend tidak mendukung skema tag.

---

## 🔍 1. Analisis & Cakupan Pembersihan

### 📌 Komponen yang Dibersihkan:
1. **Tabel Kontak ([`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx))**:
   * Menghapus header kolom `TAG / SEGMEN` dan rendering badge tag.
   * Menata ulang grid 12 kolom agar Nama Kontak dan Nomor WhatsApp mendapatkan ruang penuh yang lega.
2. **Popup Modal Tambah & Edit Kontak ([`ContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactModal.tsx))**:
   * Menghapus input field `Tag Segmentasi (tagsStr)` baik pada mode **Tambah Baru** maupun mode **Ubah/Edit Kontak**.
   * Form modal kini murni meminta 2 input esensial: **Nama Lengkap / Kontak** dan **Nomor WhatsApp (Awalan 62)**.
3. **Modal Impor File CSV ([`ImportCsvModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ImportCsvModal.tsx))**:
   * Menyesuaikan format kolom impor menjadi 2 kolom murni: `name, phone`.
4. **Bilah Pencarian & Filter ([`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx))**:
   * Menghapus pill filter tag yang tidak terpakai dan menyelaraskan placeholder pencarian menjadi `"Cari nama atau nomor WhatsApp..."`.

---

## 🎨 2. Desain Antarmuka yang Disederhanakan

### A. Tabel Kontak (12 Kolom Grid):
```
┌────┬─────────────────────────────┬─────────────────────────────┬────────┐
│ ☐  │ NAMA KONTAK                 │ NOMOR WHATSAPP              │ AKSI   │
├────┼─────────────────────────────┼─────────────────────────────┼────────┤
│ ☐  │ dimas                       │ +6287711301818              │ ✏️ 🗑️  │
└────┴─────────────────────────────┴─────────────────────────────┴────────┘
```

### B. Form Modal Tambah / Edit Kontak:
```
┌────────────────────────────────────────────────────────┐
│ Ubah Informasi Kontak                                ✖ │
├────────────────────────────────────────────────────────┤
│ NAMA LENGKAP / KONTAK                                  │
│ [ dimas                                              ] │
│                                                        │
│ NOMOR WHATSAPP (AWALAN 62)                             │
│ [ 6287711301818                                      ] │
│                                                        │
│                       [ Batal ]  [ Simpan Perubahan ]  │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Rencana Implementasi

1. **Pembaruan `ContactTable.tsx`**:
   * Hapus kolom `TAG / SEGMEN` dan distribusikan grid (`col-span-1` checkbox, `col-span-6 sm:col-span-5` nama, `col-span-5 sm:col-span-5` nomor WA, `col-span-1` aksi).
2. **Pembaruan `ContactModal.tsx`**:
   * Hapus state `tagsStr` dan elemen input tag segmentasi.
3. **Pembaruan `ImportCsvModal.tsx`**:
   * Hapus referensi kolom tags dari template CSV dan parsing preview.
4. **Pembaruan `ContactsView.tsx`**:
   * Hapus render filter tag.
5. **Pembaruan `contact.json` (ID & EN)**:
   * Bersihkan key tag yang tidak lagi digunakan dan sesuaikan placeholder.
6. **Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
