# 🧭 Analisis & Rencana Perbaikan: Arsitektur Pure Server-Side Search pada Modul Kontak (Submit-Only Trigger)

Dokumen perencanaan teknis investigasi dan restrukturisasi arsitektur pencarian kontak pada ([`src/components/dashboard/ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx) & [`src/services/contact/hooks/useContacts.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/hooks/useContacts.ts)) agar pencarian **HANYA** dieksekusi ke backend saat pengguna secara eksplisit mengeklik tombol **`[ 🔍 Cari ]`** atau menekan tombol **`Enter`**, bukan menyaring lokal setiap pengetikan huruf (*keystroke*).

---

## 🔍 1. Akar Masalah (Root-Cause Analysis)

### 📌 Mengapa Pencarian Sebelumnya Terjadi Setiap Huruf Diketik?
1. **Penyatuan State Input dengan Filter Lokal (*Coupled State & In-Memory Filter*)**:
   * Input teks dihubungkan langsung ke state `searchQuery`.
   * Pada saat yang sama, `useMemo` menghitung `filteredContacts` dengan memfilter array `contacts` di memori lokal browser setiap kali `searchQuery` berubah:
     ```ts
     // Kode Lama: Menyaring tabel di browser setiap 1 huruf diketik tanpa request ke backend
     const filteredContacts = useMemo(() => {
       return contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
     }, [contacts, searchQuery]);
     ```
   * Akibatnya, tabel langsung berubah sebelum tombol "Cari" diklik, dan backend tidak pernah menerima query pencarian yang sebenarnya.

---

## 🛠️ 2. Arsitektur Pure Server-Side Search (Pemisahan Draft State vs Active Query)

### 🎨 Desain Alur Kerja yang Benar:
1. **Draft Input State (`searchInput`)**:
   * Mengetik di kotak input hanya memperbarui draft teks lokal (`searchInput`).
   * **Tabel TIDAK berubah sama sekali saat pengguna sedang mengetik.**
2. **Submit Trigger (Klik Tombol "Cari" / Tekan `Enter`)**:
   * Form `onSubmit` memanggil `executeSearch(searchInput)`.
   * Request dikirimkan ke backend: `GET /contacts?search=kata_kunci`.
   * Backend mengembalikan daftar kontak hasil query, dan tabel di-render ulang dengan data dari server.
3. **Reset / Clear Trigger (`X`)**:
   * Mengosongkan `searchInput` dan memanggil `clearSearch()` untuk memuat ulang seluruh kontak dari backend.

---

## ⚡ 3. Rencana Implementasi

1. **Pembaruan Hook ([`src/services/contact/hooks/useContacts.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/hooks/useContacts.ts))**:
   * Hapus filter in-memory `useMemo(filteredContacts)`.
   * Jadikan `filteredContacts` langsung merujuk ke data `contacts` dari server.
   * Buat method `fetchContacts(query?: string)`, `executeSearch(query: string)`, dan `clearSearch()`.
   * Sediakan state `activeSearch` untuk mendeteksi apakah pencarian sedang aktif pada tampilan status kosong (*empty state*).

2. **Pembaruan Tampilan ([`src/components/dashboard/ContactsView.tsx`](file:///G:/WEB2026/fontwahide/src/components/dashboard/ContactsView.tsx))**:
   * Gunakan `const [searchInput, setSearchInput] = useState("");` sebagai state lokal form input.
   * Event `onSubmit` mengeksekusi `executeSearch(searchInput)`.
   * Klik tombol `X` mereset `searchInput` dan memanggil `clearSearch()`.

3. **Verifikasi Quality Gates**:
   * `bun x tsc --noEmit` (0 error).
   * `bun run lint` (0 error).
