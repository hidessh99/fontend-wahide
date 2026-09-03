# 🛠️ Analisis & Rencana Perbaikan: Error Saat Menghapus Kampanye Broadcast

Dokumen ini merinci analisis penyebab error saat pengguna mencoba menghapus kampanye siaran (*broadcast campaign* bernama "promo") pada halaman `http://localhost:3000/campaigns`, serta rencana perbaikannya secara menyeluruh di Backend dan Frontend.

---

## 1. 🔍 Analisis Masalah & Investigasi Kode

Berdasarkan pengecekan alur klik tombol hapus (icon tempat sampah merah) pada kartu kampanye "promo":

### A. Alur di Frontend (`fontwahide`)
1. Di [`CampaignList.tsx:297`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx#L297):
   ```tsx
   <Button onClick={() => cancelCampaign(campaign.id)}>
     <Trash2 className="size-3.5" />
   </Button>
   ```
2. Fungsi `cancelCampaign` di [`useCampaigns.ts:99`](file:///g:/WEB2026/fontwahide/src/modules/campaign/hooks/useCampaigns.ts#L99) memanggil:
   ```ts
   await campaignApi.cancelCampaign(id);
   ```
3. Fungsi `campaignApi.cancelCampaign` di [`campaign.api.ts:111`](file:///g:/WEB2026/fontwahide/src/modules/campaign/api/campaign.api.ts#L111) mengeksekusi HTTP DELETE:
   ```ts
   httpClient.delete(`${CAMPAIGN_BASE}/campaigns/${id}`);
   ```

### B. Apa yang Terjadi di Backend (`wahide`)?
1. **Route Tidak Terdaftar**:
   Di [`wahide/internal/modules/campaign/delivery/http/router.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/delivery/http/router.go#L11-L28), rute yang terdaftar hanyalah:
   - `GET /campaigns`
   - `GET /campaigns/logs`
   - `POST /campaigns`
   - `POST /campaigns/:id/start`
   - **`DELETE /campaigns/:id` TIDAK ADA SAMA SEKALI!**
2. **Framework Response**:
   Server Go Echo mengembalikan HTTP `404 Not Found` / `405 Method Not Allowed` karena rute DELETE tidak ada.
3. **Usecase & Repository Kosong**:
   - `CampaignCrudUseCase` di [`domain/usecase.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/domain/usecase.go) belum memiliki method `DeleteCampaign`.
   - `CampaignRepository` di [`domain/repository.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/domain/repository.go) belum memiliki method `Delete`.

---

## 2. 🛠️ Rencana Perbaikan Komprehensif

### A. Backend Go (`wahide`)
1. **Domain Repository ([`domain/repository.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/domain/repository.go))**:
   - Tambahkan `Delete(ctx context.Context, tenantID, id string) error` ke interface `CampaignRepository`.
2. **Repository Implementation ([`repository/campaign_repository.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/repository/campaign_repository.go))**:
   - Implementasikan query penghapusan dengan validasi `tenant_id` dan `id`:
     ```go
     func (r *campaignRepository) Delete(ctx context.Context, tenantID, id string) error {
         res := r.GetDB(ctx).Where("tenant_id = ? AND id = ?", tenantID, id).Delete(&entity.Campaign{})
         if res.Error != nil {
             return res.Error
         }
         if res.RowsAffected == 0 {
             return domain.ErrCampaignNotFound
         }
         return nil
     }
     ```
3. **Domain Usecase ([`domain/usecase.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/domain/usecase.go))**:
   - Tambahkan `DeleteCampaign(ctx context.Context, tenantID, id string) error` ke `CampaignCrudUseCase`.
   - *(Bonus Fitur)* Tambahkan `PauseCampaign` dan `ResumeCampaign` ke `CampaignWorkflowUseCase` agar tombol jeda/lanjutkan pengiriman juga dapat berfungsi penuh.
4. **Usecase Implementation ([`usecase/campaign_crud_usecase.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/usecase/campaign_crud_usecase.go))**:
   - Panggil `r.campRepo.Delete(ctx, tenantID, id)`.
5. **Workflow Usecase Implementation ([`usecase/campaign_workflow_usecase.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/usecase/campaign_workflow_usecase.go))**:
   - Implementasikan atomic CAS status `RUNNING` $\leftrightarrow$ `PAUSED`.
6. **Mock Test ([`usecase/campaign_workflow_usecase_test.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/usecase/campaign_workflow_usecase_test.go))**:
   - Lengkapi mock struct `mockCampaignRepo` dengan method `Delete`.
7. **HTTP Handler ([`delivery/http/campaign_handler.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/delivery/http/campaign_handler.go))**:
   - Tambahkan method `DeleteCampaign`, `PauseCampaign`, dan `ResumeCampaign`.
8. **Router ([`delivery/http/router.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/delivery/http/router.go))**:
   - Daftarkan:
     - `campaignGroup.DELETE("/campaigns/:id", h.DeleteCampaign)`
     - `campaignGroup.POST("/campaigns/:id/pause", h.PauseCampaign)`
     - `campaignGroup.POST("/campaigns/:id/resume", h.ResumeCampaign)`

---

### B. Frontend Next.js (`fontwahide`)
1. **Modal Konfirmasi Hapus ([`CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx))**:
   - Saat tombol trash diklik, buka dialog/modal konfirmasi (`DeleteCampaignModal` / state dialog):
     - Meminta konfirmasi nama kampanye ("Apakah Anda yakin ingin menghapus kampanye **promo**?").
     - Tombol "Hapus" (merah) dan "Batal" (outline).
   - Menghindari penghapusan tidak sengaja (*accidental click*).
2. **Sinkronisasi Bahasa ([`locales/id/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/id/campaign.json) & [`locales/en/campaign.json`](file:///g:/WEB2026/fontwahide/src/locales/en/campaign.json))**:
   - Tambahkan teks untuk modal konfirmasi penghapusan kampanye.

---

## 3. 📋 Rencana Pengujian & Quality Gate

1. **Backend**: `make lint` di direktori `wahide` (`go fmt` + `golangci-lint` harus 0 issues).
2. **Frontend**: `bun x tsc --noEmit` & `bun run lint` & `bun run format`.
3. **Kepatuhan Aturan**:
   - ❌ Tidak menjalankan `bun run build`.
   - ❌ Tidak menjalankan `git push`.
