# 🛠️ Rencana Perbaikan: Solusi Status Kampanye Draft & Eksekusi Pengiriman Siaran (Broadcast Dispatch)

Dokumen ini merinci rencana perbaikan menyeluruh untuk mengatasi masalah di mana kampanye baru (seperti "jgjg" dan "ryry") tertahan di status **`DRAFT`** dengan target `Sent 0 of 0 messages (0%)` dan tidak terkirim.

---

## 1. 🔍 Ringkasan Masalah & Solusi yang Akan Diterapkan

| Masalah yang Ditemukan | Penyebab | Solusi Perbaikan |
| :--- | :--- | :--- |
| **Audiens Tag 0 Kontak** | Frontend mengirim teks Nama Tag (`"belajar"`), sedangkan kolom `contact_tags.tag_id` di database adalah ULID unik. | **Dual-Lookup Backend & Frontend**: Backend mencocokkan `tag_id IN (?) OR tags.name IN (?)`. Frontend mengirimkan objek tag terstruktur. |
| **Error Auto-Start Ditelan** | `useCampaigns.ts` menangkap error `startCampaign` dengan `console.warn` tanpa memberitahu pengguna. | Tampilkan peringatan/error yang jelas jika audiens target kosong, dan jangan beri toast sukses palsu. |
| **Ketiadaan Tombol Mulai di UI** | `CampaignList.tsx` tidak memiliki tombol untuk memulai kampanye berstatus `DRAFT`. | Tambahkan tombol **"Mulai Siaran" (icon Play / Send)** pada kartu kampanye berstatus `DRAFT`. |
| **Worker Jadwal (Scheduled)** | Kampanye berjadwal disimpan sebagai `DRAFT` tapi belum ada background scheduler runner. | Tambahkan method/worker scheduler berkala di backend untuk memicu kampanye berjadwal saat waktunya tiba. |

---

## 2. 📁 File-File yang Akan Diperbarui

### A. Backend Go (`wahide`)
1. **[`wahide/internal/modules/contact/repository/contact_repository.go`](file:///g:/WEB2026/wahide/internal/modules/contact/repository/contact_repository.go)**:
   - Modifikasi `FindByTagIDs`:
     ```go
     func (r *contactRepository) FindByTagIDs(ctx context.Context, tenantID string, tagIDs []string) ([]entity.Contact, error) {
         var contacts []entity.Contact
         err := r.GetDB(ctx).
             Distinct("contacts.*").
             Joins("JOIN contact_tags ON contact_tags.contact_id = contacts.id").
             Joins("LEFT JOIN tags ON tags.id = contact_tags.tag_id").
             Where("contacts.tenant_id = ? AND (contact_tags.tag_id IN ? OR tags.name IN ?)", tenantID, tagIDs, tagIDs).
             Find(&contacts).Error
         return contacts, err
     }
     ```
2. **[`wahide/internal/modules/campaign/usecase/campaign_workflow_usecase.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/usecase/campaign_workflow_usecase.go)**:
   - Tambahkan background runner scheduler untuk kampanye berjadwal (`ScheduledAt <= time.Now()`).

---

### B. Frontend Next.js (`fontwahide`)
1. **[`fontwahide/src/modules/campaign/components/broadcast/CampaignWizardModal.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignWizardModal.tsx)**:
   - Gunakan `tags` (memuat `id` dan `name`) dari `useContacts()`.
   - Pastikan ID dan Nama Tag dikirim dengan benar ke backend.
2. **[`fontwahide/src/modules/campaign/hooks/useCampaigns.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/hooks/useCampaigns.ts)**:
   - Tambahkan fungsi `startCampaign(id: string)`.
   - Tangani error secara transparan saat auto-start gagal.
3. **[`fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx)**:
   - Tambahkan tombol **Mulai Siaran (Start Broadcast)** untuk kartu berstatus `DRAFT`.
4. **[`fontwahide/src/locales/id/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/id/campaign.json) & [`en/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/en/campaign.json)**:
   - Tambahkan terjemahan `startCampaign` dan `toastStarted`.

---

## 3. 📋 Rencana Pengujian & Quality Gate

1. `make lint` di direktori `wahide` (0 issues).
2. `bun x tsc --noEmit` di direktori `fontwahide` (0 error).
3. `bun run lint` di direktori `fontwahide` (0 error).
4. `bun run format` di direktori `fontwahide`.
5. ❌ Tidak menjalankan `bun run build` dan `git push` (kepatuhan aturan).
