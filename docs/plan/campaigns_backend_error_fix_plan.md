# 🛠️ Rencana Final: Resolusi Error Backend saat Akses `/campaigns` & Dukungan Status 'HIBERNATED'

Dokumen ini memetakan rencana implementasi lengkap untuk menangani log error backend `server.log` dan penambahan dukungan status `HIBERNATED` pada constraint database MySQL secara idempotent.

---

## 1. 🔍 Pokok Masalah & Solusi yang Disepakati

### A. Masalah 1: Error `context canceled` saat Membuka `/campaigns`
* **Gejala**: Log backend mencatat `[ERROR] failed to count contacts` dan `[ERROR] Error listing contacts` saat pengguna mengakses `/campaigns`.
* **Solusi Frontend ([`CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx) & [`CampaignWizardModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignWizardModal.tsx))**:
  - Bungkus `<CampaignWizardModal />` dengan kondisi `{isWizardOpen && (...) }` agar tidak dieksekusi saat pengguna sekadar melihat daftar kampanye.
  - Tambahkan guard clause `if (!isOpen) return null;` di awal `CampaignWizardModal`.
* **Solusi Backend ([`contact_crud_usecase.go`](file:///g:/WEB2026/wahide/internal/modules/contact/usecase/contact_crud_usecase.go) & [`contact_handler.go`](file:///g:/WEB2026/wahide/internal/modules/contact/delivery/http/contact_handler.go))**:
  - Filter `errors.Is(err, context.Canceled)` agar pembatalan request oleh browser/klien tidak dicatat sebagai `level: "error"`.

### B. Masalah 2: Peringatan Database Check Constraint `dev_status_valid`
* **Gejala**: Log backend mencatat `Error 3819 (HY000): Check constraint 'dev_status_valid' is violated` saat startup reconciliation.
* **Penyebab**: Constraint MySQL `dev_status_valid` saat ini hanya mengizinkan `('QR_PENDING','ONLINE','OFFLINE','BANNED')`, belum mendukung `'HIBERNATED'`.
* **Solusi Backend ([`migration.go`](file:///g:/WEB2026/wahide/internal/shared/database/migration.go))**:
  - Menambahkan eksekusi DDL idempotent di `migration.go`:
    ```sql
    ALTER TABLE devices DROP CHECK dev_status_valid;
    ALTER TABLE devices ADD CONSTRAINT dev_status_valid CHECK (status IN ('QR_PENDING','ONLINE','OFFLINE','BANNED','HIBERNATED'));
    ```
  - Mempertahankan `entity.DeviceStatusHibernated` pada [`whatsapp.go:55`](file:///g:/WEB2026/wahide/internal/modules/whatsapp/whatsapp.go#L55) sesuai arsitektur *Session Hibernation Zero-Heap*.
  - Eksekusi migrasi database (`make migrate`) akan dilakukan manual oleh pengguna.

---

## 2. 📋 Spesifikasi Berkas yang Diubah

1. **[`wahide/internal/shared/database/migration.go`](file:///g:/WEB2026/wahide/internal/shared/database/migration.go)**:
   - Tambahkan fungsi migrasi constraint idempotent `updateDeviceCheckConstraint(db)`.
2. **[`wahide/internal/modules/contact/usecase/contact_crud_usecase.go`](file:///g:/WEB2026/wahide/internal/modules/contact/usecase/contact_crud_usecase.go)**:
   - Tambahkan penanganan graceful `context.Canceled` pada `Count` dan `FindAll`.
3. **[`wahide/internal/modules/contact/delivery/http/contact_handler.go`](file:///g:/WEB2026/wahide/internal/modules/contact/delivery/http/contact_handler.go)**:
   - Filter `context.Canceled` pada logging handler `ListContacts`.
4. **[`fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx)**:
   - Ubah pemanggilan `<CampaignWizardModal>` menjadi bersyarat `{isWizardOpen && (...) }`.
5. **[`fontwahide/src/modules/campaign/components/broadcast/CampaignWizardModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignWizardModal.tsx)**:
   - Tambahkan `if (!isOpen) return null;`.

---

## 3. 🧪 Quality Gate & Verifikasi

- **Backend**: `make lint` di direktori `wahide` (`go fmt` + `golangci-lint` harus 0 issues).
- **Frontend**: `bun x tsc --noEmit` & `bun run lint` & `bun run format`.
- **Aturan**: Tidak ada eksekusi `bun run build` atau `git push` otomatis.
