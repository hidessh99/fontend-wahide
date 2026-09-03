# 🏷️ Rencana Desain & Implementasi: Penambahan Kolom 'Tag / Segmentasi' pada Tabel Kontak (`/contacts`)

Dokumen ini disusun untuk merespons evaluasi pengguna bahwa pada tabel data kontak (`http://localhost:3000/contacts`), saat ini belum terdapat kolom khusus yang memuat data **Tag / Segmentasi Kontak**.

---

## 1. 🔍 Analisis Kondisi Saat Ini

Berdasarkan tangkapan layar dan pemeriksaan kode pada [`src/modules/contact/components/list/ContactTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/contact/components/list/ContactTable.tsx):

* **Header Tabel Saat Ini (Desktop Grid-12)**:
  - `col-span-1`: Kotak centang (Checkbox).
  - `col-span-5`: `CONTACT NAME` (`contact.tableHeaderName`).
  - `col-span-4`: `WHATSAPP NUMBER` (`contact.tableHeaderPhone`).
  - `col-span-2`: `ACTIONS` (`contact.tableHeaderActions`).
* **Masalah**:
  1. **Ketiadaan Kolom Header Tag**: Tidak ada judul kolom untuk **TAGS / SEGMENTASI**.
  2. **Peletakan Data Tag**: Tag sebelumnya diletakkan menumpuk di bawah nama pelanggan di dalam kolom nama, bukan memiliki kolom tersendiri layaknya tabel CRM profesional.
  3. **Belum Ada Kunci i18n**: Kunci `contact.tableHeaderTags` belum ada di file bahasa `id/contact.json` dan `en/contact.json`.

---

## 2. 🎨 Rancangan Desain Kolom Baru

Tabel desktop akan diatur ulang dengan pembagian 12-kolom grid yang seimbang dan proporsional:

| Kolom | Grid Span | Judul Header | Format Data Baris |
| :--- | :--- | :--- | :--- |
| **1. Select** | `col-span-1` | Checkbox (Pilih Semua) | Checkbox per baris |
| **2. Nama Kontak** | `col-span-3` | **CONTACT NAME** | Teks nama tebal (`truncate font-bold`) |
| **3. Nomor WhatsApp** | `col-span-3` | **WHATSAPP NUMBER** | Format nomor monospaced `+628...` |
| **4. Tag Segmentasi** | `col-span-3` | **TAGS / SEGMENTS** | Kumpulan badge pill warna hijau (`#VIP`, `#Reseller`), atau tanda `-` / badge muted jika belum ber-tag |
| **5. Aksi** | `col-span-2` | **ACTIONS** (Align Right) | Tombol Ubah (✏️) dan Hapus (🗑️) |

---

## 3. 🛠️ Spesifikasi Perubahan File

### A. File: [`src/locales/id/contact.json`](file:///g:/WEB2026/fontwahide/src/locales/id/contact.json) & [`src/locales/en/contact.json`](file:///g:/WEB2026/fontwahide/src/locales/en/contact.json)
Tambahkan kunci terjemahan header kolom tag:
- **`id`**: `"tableHeaderTags": "Tag / Segmentasi"`
- **`en`**: `"tableHeaderTags": "Tags / Segments"`

### B. File: [`src/modules/contact/components/list/ContactTable.tsx`](file:///g:/WEB2026/fontwahide/src/modules/contact/components/list/ContactTable.tsx)

#### 1. Perubahan Header Tabel Desktop (Baris 147–158):
```tsx
{/* Table Header */}
<div className="bg-muted/60 border-border text-foreground-muted grid grid-cols-12 items-center gap-3 border-b px-5 py-4 text-xs font-extrabold tracking-wider uppercase select-none">
  <div className="col-span-1 flex items-center justify-center">
    <Checkbox
      checked={isAllSelected}
      onCheckedChange={() => onToggleSelectAll(contacts.map((c) => c.id))}
      aria-label="Pilih Semua Kontak"
    />
  </div>
  <div className="col-span-3">{t("contact.tableHeaderName")}</div>
  <div className="col-span-3">{t("contact.tableHeaderPhone")}</div>
  <div className="col-span-3">{t("contact.tableHeaderTags")}</div>
  <div className="col-span-2 text-right">{t("contact.tableHeaderActions")}</div>
</div>
```

#### 2. Perubahan Baris Data Kontak Desktop (Baris 189–235):
```tsx
{/* Name Column */}
<div className="col-span-3 min-w-0 pr-2">
  <span className="text-foreground block truncate text-sm font-bold tracking-tight">
    {contact.name}
  </span>
</div>

{/* Phone Column */}
<div className="col-span-3 truncate font-mono text-xs font-semibold text-foreground-secondary">
  +{contact.phone}
</div>

{/* Dedicated Tags Column */}
<div className="col-span-3 min-w-0 pr-2">
  {contact.tags && contact.tags.length > 0 ? (
    <div className="flex flex-wrap items-center gap-1.5">
      {contact.tags.map((tag, idx) => {
        const tagName = typeof tag === "string" ? tag : tag.name;
        return (
          <span
            key={idx}
            className="inline-flex items-center rounded-full border border-wise-green/30 bg-wise-green/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-wise-green shadow-2xs"
          >
            #{tagName}
          </span>
        );
      })}
    </div>
  ) : (
    <span className="text-xs font-medium text-foreground-muted/60 italic">
      -
    </span>
  )}
</div>

{/* Action Buttons Column */}
<div className="col-span-2 flex items-center justify-end gap-1.5">
  {/* Edit & Delete Buttons */}
</div>
```

---

## 4. 📋 Rencana Pengujian & Quality Gate

1. **TypeScript Check**:
   - `bun x tsc --noEmit`
2. **ESLint**:
   - `bun run lint`
3. **Prettier Format**:
   - `bun run format`
4. **Kepatuhan Aturan Pengguna**:
   - ❌ **TIDAK** menjalankan `bun run build`.
   - ❌ **TIDAK** menjalankan `git push`.
5. **Verifikasi Tampilan**:
   - Memastikan header tabel menampilkan 4 judul kolom: `CONTACT NAME`, `WHATSAPP NUMBER`, `TAGS / SEGMENTS`, dan `ACTIONS`.
   - Kontak yang memiliki tag menampilkan badge hijau `#NamaTag`.
   - Kontak tanpa tag menampilkan strip `-` yang rapi.
