# 🛠️ Analisis & Rencana Perbaikan: Error `Cannot read properties of undefined (reading 'toString')` di `/campaigns`

Dokumen ini merinci analisis mendalam dan rencana perbaikan terhadap error layar merah *Crash/ErrorBoundary* yang terjadi di halaman `http://localhost:3000/campaigns` sesaat setelah pengguna berhasil membuat kampanye siaran (*broadcast campaign*).

---

## 1. 🔍 Analisis Tangkapan Layar & Akar Masalah

Berdasarkan 2 gambar yang diunggah pengguna:

### A. Tampilan Browser (Gambar 1)
- Tampilan Error Boundary:
  > **Gagal Memuat Daftar Kampanye Siaran**
  > `Cannot read properties of undefined (reading 'toString')`

### B. Terminal Next.js / PowerShell (Gambar 2)
- Stack Trace spesifik:
  ```
  at CampaignsView (src/modules/campaign/views/CampaignsView.tsx:55:11)
  at CampaignsPage (src\app\(dashboard)\campaigns\page.tsx:21:7)
  239 |   <span className="text-foreground">
  240 |     {t("campaign.progressSent", {
  241 |       sent: campaign.sentCount.toString(),
                                  ^
  242 |       total: campaign.totalRecipients.toString(),
  243 |       percent: percent.toString(),
  244 |     })}
  ```

### C. Mengapa `campaign.sentCount` Bernilai `undefined`?
1. **Perbedaan Format Field Backend vs Frontend**:
   - Backend Go (`wahide`) mengembalikan data kampanye dalam format JSON **`snake_case`**:
     - `total_sent`
     - `total_target`
     - `total_failed`
     - `message_template`
     - `device_id`
   - Frontend TypeScript (`Campaign` interface) mengharapkan format **`camelCase`**:
     - `sentCount`
     - `totalRecipients`
     - `failedCount`
     - `messageTemplate`
     - `deviceId`

2. **Hilangnya Fungsi Mapper di [`campaign.api.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/api/campaign.api.ts)**:
   - Pada `campaignApi.getCampaigns` dan `campaignApi.createCampaign`, respons dari backend langsung dikembalikan mentah tanpa dipetakan (*mapping*).
   - Ketika kampanye baru dibuat atau daftar dimuat ulang, objek kampanye memiliki field `total_sent` dan `total_target`, tetapi **tidak memiliki `sentCount` maupun `totalRecipients`** (`undefined`).

3. **Ketiadaan Null-Safety di [`CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx#L240)**:
   - Di baris 241: `sent: campaign.sentCount.toString()` langsung memanggil `.toString()` pada nilai `undefined`.
   - JavaScript melempar runtime exception: `TypeError: Cannot read properties of undefined (reading 'toString')` yang meruntuhkan seluruh halaman kampanye ke ErrorBoundary.

---

## 2. 🛠️ Rencana Perbaikan (2-Layer Defense)

### Layer 1: Tambahkan Normalisasi / Data Mapper di [`campaign.api.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/api/campaign.api.ts)
Buat fungsi mapper `mapBackendCampaign` yang mengubah objek mentah backend menjadi format `Campaign` yang valid dan aman:
```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendCampaign = (c: any): Campaign => {
  const totalRecipients = Number(c.total_target ?? c.totalRecipients ?? 0);
  const sentCount = Number(c.total_sent ?? c.sentCount ?? 0);
  const failedCount = Number(c.total_failed ?? c.failedCount ?? 0);

  return {
    id: c.id,
    name: c.name || "Kampanye Siaran",
    deviceId: c.device_id || c.deviceId || "",
    deviceName: c.device_name || c.deviceName || undefined,
    messageTemplate: c.message_template || c.messageTemplate || "",
    jitterDelaySeconds: Number(c.jitter_delay_seconds ?? c.jitterDelaySeconds ?? 3),
    enableHumanTyping: Boolean(c.enable_human_typing ?? c.enableHumanTyping ?? true),
    targetType: c.target_type || c.targetType || "ALL",
    targetTags: Array.isArray(c.tag_ids) ? c.tag_ids : c.targetTags || [],
    targetNumbers: Array.isArray(c.target_numbers) ? c.target_numbers : c.targetNumbers || [],
    totalRecipients,
    sentCount,
    failedCount,
    status: (c.status as CampaignStatus) || "DRAFT",
    scheduledAt: c.scheduled_at || c.scheduledAt || undefined,
    createdAt: c.created_at || c.createdAt || new Date().toISOString(),
  };
};
```
Terapkan mapper ini pada:
- `campaignApi.getCampaigns`
- `campaignApi.createCampaign`

### Layer 2: Penguatan Null-Safety di [`CampaignList.tsx`](file:///g:/WEB2026/fontwahide/src/modules/campaign/components/broadcast/CampaignList.tsx)
Gunakan *nullish coalescing* dan konversi string yang aman:
```tsx
const totalRecipients = campaign.totalRecipients ?? 0;
const sentCount = campaign.sentCount ?? 0;
const percent =
  totalRecipients > 0
    ? Math.min(100, Math.round((sentCount / totalRecipients) * 100))
    : 0;
```
Dan pada render progress:
```tsx
<span className="text-foreground">
  {t("campaign.progressSent", {
    sent: String(sentCount),
    total: String(totalRecipients),
    percent: String(percent),
  })}
</span>
```
Serta pengamanan fallback pada field lainnya:
- `Jitter {campaign.jitterDelaySeconds ?? 3}s`
- `{campaign.messageTemplate || "-"}`
- Validasi tanggal `campaign.createdAt` sebelum `new Date()`.

---

## 3. 📋 Rencana Pengujian & Quality Gate

1. **TypeScript Type Check**: `bun x tsc --noEmit` di direktori `fontwahide`.
2. **ESLint**: `bun run lint`.
3. **Prettier**: `bun run format`.
4. **Backend Lint**: `make lint` di direktori `wahide`.
5. **Kepatuhan Aturan**:
   - ❌ Tidak menjalankan `bun run build`.
   - ❌ Tidak menjalankan `git push`.
