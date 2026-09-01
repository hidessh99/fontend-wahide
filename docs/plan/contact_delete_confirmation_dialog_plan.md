# 🧭 Analisis & Rencana Arsitektur: Dialog Konfirmasi Penghapusan Kontak (Single & Bulk Delete)

Dokumen analisis UI/UX dan perencanaan teknis mengenai implementasi **Modal Dialog Konfirmasi Hapus (*Destructive Action Confirmation Dialog*)** pada modul Buku Kontak ([`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx), [`ContactTable.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/ContactTable.tsx), dan komponen baru [`DeleteContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/DeleteContactModal.tsx)).

---

## 🔍 1. Analisis UI/UX & Best Practice Keamanan Data

### 📌 Mengapa Dialog Konfirmasi Wajib Diterapkan?
1. **Mencegah Klik Tidak Sengaja (*Accidental Deletion Defense*)**:
   - Menghapus kontak pelanggan merupakan aksi **destruktif permanen** (*irreversible*).
   - Di baris tabel yang padat, pengguna dapat dengan mudah salah mengklik ikon tempat sampah saat ingin mengklik ikon edit atau memilih checkbox.
   - Tanpa konfirmasi, kontak langsung terhapus dari backend Go tanpa peringatan.
2. **Konteks Data Spesifik (*Contextual Clarity*)**:
   - Dialog akan secara eksplisit menyebutkan identitas kontak yang akan dihapus, contoh:  
     `"Apakah Anda yakin ingin menghapus kontak Dimas Wahide (+6287711301818)?"`  
     sehingga pengguna 100% yakin item yang dihapus adalah benar.
3. **Standar Desain B2B Enterprise Modern**:
   - Tombol "Batal" dan "Hapus Permanen" yang memiliki pembeda visual tegas (`bg-rose-600 text-white` untuk aksi bahaya).
   - Dukungan aksesibilitas: tombol `Escape` untuk membatalkan dan penutupan klik di luar dialog (*click outside to close*).

---

## 🎨 2. Desain Visual Antarmuka Dialog Konfirmasi

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️  Hapus Kontak Ini?                                   ✕  │
├─────────────────────────────────────────────────────────────┤
│  Apakah Anda yakin ingin menghapus kontak:                  │
│                                                             │
│  👤 Dimas Wahide                                            │
│  📞 +6287711301818                                          │
│                                                             │
│  Kontak ini akan dihapus secara permanen dari buku telepon │
│  dan tidak dapat dikembalikan.                              │
├─────────────────────────────────────────────────────────────┤
│                         [ Batal ]   [ 🗑️ Ya, Hapus Kontak ] │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Rencana Implementasi Teknis

### A. Komponen Dialog Hapus ([`DeleteContactModal.tsx`](file:///G:/WEB2026/fontwahide/src/services/contact/components/DeleteContactModal.tsx)) [NEW]:
* Props:
  * `isOpen: boolean`
  * `contact: Contact | null` (untuk single delete)
  * `selectedCount?: number` (untuk bulk delete)
  * `isBulk?: boolean`
  * `onClose: () => void`
  * `onConfirm: () => Promise<void>`
* State internal: `isDeleting` (dengan spinner `Loader2` dan disable button saat proses berlangsung).
* Aksesibilitas: Keyboard `Escape`, backdrop blur, dan animasi fade-in.

### B. Hubungkan di View Layer ([`ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx)):
* Tambahkan state:
  * `deletingContact: Contact | null`
  * `isDeleteModalOpen: boolean`
  * `isBulkDeleteModalOpen: boolean`
* Saat tombol tong sampah diklik di tabel:
  * `handleRequestDelete(contact)` ➔ Membuka modal konfirmasi dengan kontak terpilih.
* Saat tombol "Hapus Terpilih" diklik di header toolbar:
  * Membuka modal konfirmasi bulk delete.

### C. Kamus Multi-Bahasa (`src/locales/`):
* Memperkaya kamus dengan pesan kontekstual:
  * `"deleteSingleDesc": "Apakah Anda yakin ingin menghapus kontak {name} ({phone})? Tindakan ini bersifat permanen."` (ID) / `"Are you sure you want to delete contact {name} ({phone})? This action cannot be undone."` (EN).
  * `"deleteBulkTitle": "Hapus {count} Kontak Terpilih?"` (ID) / `"Delete {count} Selected Contacts?"` (EN).
  * `"deleteBulkDesc": "Semua kontak yang dipilih akan dihapus permanen dari buku telepon."` (ID) / `"All selected contacts will be permanently removed from your phonebook."` (EN).

---

## 🔍 4. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 0 error.
* `eslint` ➔ 🟢 0 error.
* Uji alur pembatalan (*Cancel/Escape*) dan eksekusi penghapusan (*Confirm*).
