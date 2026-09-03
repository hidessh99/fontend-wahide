# 🚀 Rencana Teknis & Audit: Perbaikan 'Validation failed' saat Launch Campaign di `/campaigns`

Dokumen ini disusun untuk memudahkan audit manual atas penyebab dan solusi teknis error **"Validation failed"** yang terjadi saat meluncurkan kampanye broadcast WhatsApp dari frontend Next.js (`fontwahide`) ke backend Go (`wahide`).

---

## 1. 📌 Ringkasan Masalah (Problem Statement)

Pada halaman `http://localhost:3000/campaigns`:
1. Pengguna membuka modal **"Create New Campaign"** (`CampaignWizardModal.tsx`).
2. Pada **Langkah 1**: Memilih perangkat WhatsApp yang terhubung (`deviceId`) dan mengisi nama kampanye (`name`).
3. Pada **Langkah 2**: Memilih cakupan target **Input Manual (`CUSTOM`)** dan memasukkan nomor telepon `6287711301818`.
4. Pada **Langkah 3**: Mengisi pesan template Spintax.
5. Pada **Langkah 4**: Menekan tombol **"Launch Campaign"**.
6. **Hasil yang Muncul**: Muncul banner merah dan toast error bertuliskan **`Validation failed`**. Kampanye gagal tersimpan dan tidak masuk ke antrean pengiriman.

---

## 2. 🔍 Analisis Akar Masalah (Root Cause Analysis)

### A. Perbedaan Konvensi Nama Kolom JSON (camelCase vs snake_case)
* **Frontend Payload** ([`src/modules/campaign/api/campaign.api.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/api/campaign.api.ts)):
  Mengirimkan payload JavaScript mentah:
  ```json
  {
    "name": "Promo Diskon",
    "deviceId": "01M1KB7T723Q3D9YPFYHVSBF7A",
    "messageTemplate": "Halo Kak {nama}...",
    "jitterDelaySeconds": 4,
    "enableHumanTyping": true,
    "targetType": "CUSTOM",
    "targetNumbers": ["6287711301818"]
  }
  ```
* **Backend Struct Go** ([`internal/modules/campaign/domain/dto/campaign_dto.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/domain/dto/campaign_dto.go)):
  ```go
  type CreateCampaignRequest struct {
      DeviceID        string     `json:"device_id" validate:"required"`
      Name            string     `json:"name" validate:"required,min=2,max=150"`
      MessageTemplate string     `json:"message_template" validate:"required"`
      MediaURL        string     `json:"media_url" validate:"omitempty,url"`
      TagIDs          []string   `json:"tag_ids" validate:"required,min=1"`
      ScheduledAt     *time.Time `json:"scheduled_at"`
  }
  ```
* **Dampaknya**:
  * Echo framework menggunakan struct tag `json:"..."` untuk binding request body (`c.Bind(req)`).
  * Karena frontend mengirim `deviceId` dan `messageTemplate`, backend menerima `req.DeviceID = ""` dan `req.MessageTemplate = ""`.
  * Akibatnya, validasi `validate:"required"` pada `DeviceID` dan `MessageTemplate` langsung gagal.

---

### B. Aturan Validasi Backend Mengunci `tag_ids` Wajib Diisi (`validate:"required,min=1"`)
* Pada DTO backend saat ini, field `TagIDs` memiliki tag validasi:
  `TagIDs []string json:"tag_ids" validate:"required,min=1"`
* Saat pengguna memilih opsi **Input Manual (`CUSTOM`)** atau **Semua Kontak (`ALL`)**, frontend **tidak mengirimkan `tag_ids`** (atau bernilai `undefined`).
* Validator Go (`validator/v10`) menolak request tersebut karena `tag_ids` wajib diisi minimal 1 elemen.

---

### C. Pipeline Eksekusi Pengiriman Belum Mendukung `CUSTOM` dan `ALL`
* Pada [`internal/modules/campaign/usecase/campaign_workflow_usecase.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/usecase/campaign_workflow_usecase.go#L54):
  ```go
  contacts, err := u.contactPort.GetContactsByTagIDs(ctx, tenantID, tagIDs)
  ```
* Pipeline pengiriman pesan saat ini hanya mengambil data dari tabel relasi `contact_tags`.
* Belum ada logika untuk:
  1. Mengirim ke nomor manual tanpa harus tersimpan dulu di buku kontak.
  2. Mengambil semua kontak tenant sekaligus saat target bertipe `ALL`.

---

## 3. 🛠️ Rencana Solusi & Spesifikasi Perubahan

### Lapisan 1: Frontend Next.js (`fontwahide`)

#### File: [`src/modules/campaign/api/campaign.api.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/api/campaign.api.ts)
Tambahkan fungsi serializer/mapping payload agar mengubah format camelCase menjadi snake_case resmi yang dimengerti backend:
```ts
createCampaign: async (input: CreateCampaignInput): Promise<Campaign> => {
  let tagIDs: string[] = [];
  if (input.targetType === "ALL") {
    tagIDs = ["ALL"];
  } else if (input.targetType === "TAGS" && input.targetTags) {
    tagIDs = input.targetTags;
  } else if (input.targetType === "CUSTOM" && input.targetNumbers) {
    tagIDs = input.targetNumbers.map((num) => `phone:${num}`);
  }

  const payload = {
    device_id: input.deviceId,
    name: input.name,
    message_template: input.messageTemplate,
    target_type: input.targetType,
    tag_ids: tagIDs,
    target_numbers: input.targetNumbers,
    jitter_delay_seconds: input.jitterDelaySeconds,
    enable_human_typing: input.enableHumanTyping,
    scheduled_at: input.scheduledAt || null,
  };

  const res = await httpClient.post<Campaign>(`${CAMPAIGN_BASE}/campaigns`, payload);
  return res.payload || (res as unknown as Campaign);
}
```

#### File: [`src/modules/campaign/hooks/useCampaigns.ts`](file:///g:/WEB2026/fontwahide/src/modules/campaign/hooks/useCampaigns.ts)
* Setelah `createCampaign` sukses, jika kampanye tidak dijadwalkan ke masa depan (`!data.scheduledAt`), otomatis picu `campaignApi.startCampaign(newCampaign.id)` sehingga status langsung berubah ke `RUNNING` dan antrean berjalan seketika.
* Tangkap pesan error detail dari backend jika validasi gagal, sehingga pengguna mendapat informasi field yang bermasalah.

---

### Lapisan 2: Backend Go (`wahide`)

#### File: [`internal/modules/campaign/domain/dto/campaign_dto.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/domain/dto/campaign_dto.go)
Perbarui `CreateCampaignRequest` untuk mendukung fleksibilitas tipe target:
```go
type CreateCampaignRequest struct {
	DeviceID           string     `json:"device_id" validate:"required"`
	Name               string     `json:"name" validate:"required,min=2,max=150"`
	MessageTemplate    string     `json:"message_template" validate:"required"`
	MediaURL           string     `json:"media_url" validate:"omitempty,url"`
	TargetType         string     `json:"target_type"` // "ALL", "TAGS", "CUSTOM"
	TagIDs             []string   `json:"tag_ids"`
	TargetNumbers      []string   `json:"target_numbers"`
	JitterDelaySeconds int        `json:"jitter_delay_seconds"`
	EnableHumanTyping  *bool      `json:"enable_human_typing"`
	ScheduledAt        *time.Time `json:"scheduled_at"`
}
```
*(Catatan: `validate:"required,min=1"` dilepas dari `TagIDs` karena validasi target dipindahkan ke tingkat handler secara kondisional berdasarkan `TargetType`)*.

#### File: [`internal/modules/campaign/delivery/http/campaign_handler.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/delivery/http/campaign_handler.go)
Pada `CreateCampaign`:
```go
// Validasi audiens secara dinamis:
switch req.TargetType {
case "ALL":
	req.TagIDs = []string{"ALL"}
case "CUSTOM":
	if len(req.TargetNumbers) == 0 && len(req.TagIDs) == 0 {
		return response.RespondValidationError(c, "target_numbers", "minimal satu nomor telepon tujuan wajib diisi")
	}
	if len(req.TagIDs) == 0 {
		for _, num := range req.TargetNumbers {
			req.TagIDs = append(req.TagIDs, "phone:"+num)
		}
	}
default: // "TAGS"
	if len(req.TagIDs) == 0 {
		return response.RespondValidationError(c, "tag_ids", "minimal satu tag kontak wajib dipilih")
	}
}
```

#### File: [`internal/modules/contact/domain/contract.go`](file:///g:/WEB2026/wahide/internal/modules/contact/domain/contract.go) & [`usecase/contract_adapter.go`](file:///g:/WEB2026/wahide/internal/modules/contact/usecase/contract_adapter.go)
Tambahkan method `GetAllContacts`:
```go
type ContactContract interface {
	GetContactsByTagIDs(ctx context.Context, tenantID string, tagIDs []string) ([]entity.Contact, error)
	GetContactByPhone(ctx context.Context, tenantID, phone string) (*entity.Contact, error)
	GetAllContacts(ctx context.Context, tenantID string) ([]entity.Contact, error)
}
```
Implementasi di adapter:
```go
func (a *contactContractAdapter) GetAllContacts(ctx context.Context, tenantID string) ([]entity.Contact, error) {
	return a.contactRepo.FindAll(ctx, tenantID, "", 100000, 0)
}
```

#### File: [`internal/modules/campaign/domain/ports.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/domain/ports.go) & [`internal/shared/adapters/saas_whatsapp_adapters.go`](file:///g:/WEB2026/wahide/internal/shared/adapters/saas_whatsapp_adapters.go)
Tambahkan method `GetAllContacts` pada `ContactPort` dan adapter penghubungnya:
```go
func (a *ContactToCampaignAdapter) GetAllContacts(ctx context.Context, tenantID string) ([]contactEntity.Contact, error) {
	return a.contract.GetAllContacts(ctx, tenantID)
}
```

#### File: [`internal/modules/campaign/usecase/campaign_workflow_usecase.go`](file:///g:/WEB2026/wahide/internal/modules/campaign/usecase/campaign_workflow_usecase.go)
Pada `StartCampaign`, ekstrak audiens secara pintar dan deduplikasi nomor tujuan:
```go
var tagIDs []string
if len(camp.TagIDs) > 0 {
	_ = json.Unmarshal(camp.TagIDs, &tagIDs)
}

var contacts []contactEntity.Contact
var realTagIDs []string
seenPhones := make(map[string]bool)

for _, tid := range tagIDs {
	if tid == "ALL" {
		all, err := u.contactPort.GetAllContacts(ctx, tenantID)
		if err != nil {
			return err
		}
		for _, c := range all {
			if !seenPhones[c.Phone] {
				seenPhones[c.Phone] = true
				contacts = append(contacts, c)
			}
		}
	} else if strings.HasPrefix(tid, "phone:") {
		rawPhone := strings.TrimPrefix(tid, "phone:")
		if !seenPhones[rawPhone] {
			seenPhones[rawPhone] = true
			contacts = append(contacts, contactEntity.Contact{
				TenantID: tenantID,
				Phone:    rawPhone,
				Name:     rawPhone,
			})
		}
	} else {
		realTagIDs = append(realTagIDs, tid)
	}
}

if len(realTagIDs) > 0 {
	tagContacts, err := u.contactPort.GetContactsByTagIDs(ctx, tenantID, realTagIDs)
	if err != nil {
		return err
	}
	for _, c := range tagContacts {
		if !seenPhones[c.Phone] {
			seenPhones[c.Phone] = true
			contacts = append(contacts, c)
		}
	}
}

if len(contacts) == 0 {
	return domain.ErrNoAudienceFound
}
```

---

## 4. 📋 Rencana Pengujian & Verifikasi

1. **Uji Kompilasi & Type Check**:
   - Backend Go: `go vet ./internal/modules/campaign/... ./internal/modules/contact/... ./internal/shared/adapters/...`
   - Frontend Next.js: `bun x tsc --noEmit`, `bun run lint`, `bun run format`.
2. **Uji Skenario Audiens**:
   - Skenario A: Pembuatan kampanye dengan **Custom Numbers** (`6287711301818`).
   - Skenario B: Pembuatan kampanye dengan **Semua Kontak (`ALL`)**.
   - Skenario C: Pembuatan kampanye dengan **Tag Kontak (`TAGS`)**.
3. **Uji Auto-Start**:
   - Memastikan saat diluncurkan segera, kampanye langsung bertransisi ke status `RUNNING` dan antrean pemrosesan pesan berjalan aman.
