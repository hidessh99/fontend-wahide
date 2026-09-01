# 🧭 Rencana & Standardisasi: Konstanta Huruf Kapital (UPPERCASE) Priority & Category pada Support Module Entity

Standardisasi arsitektur domain entity di backend Go ([`wahide/internal/modules/support/domain/entity/ticket.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/entity/ticket.go)) dengan mendefinisikan konstanta eksplisit huruf kapital penuh (*ALL UPPERCASE*) untuk `Priority` (`LOW`, `MEDIUM`, `HIGH`) dan `Category` (`WHATSAPP`, `BILLING`, `API`, `GENERAL`), serta menyelaraskan database GORM tag `default:'MEDIUM'`.

---

## 🔍 1. Analisis & Evaluasi Standarisasi

### Konsep yang Diterapkan:
1. **Single Source of Truth di Entity**:
   * Seluruh status, prioritas, dan kategori tiket di modul Support harus memiliki `const` eksplisit di package entity:
     ```go
     // Priority Constants
     const (
         PriorityLow    = "LOW"
         PriorityMedium = "MEDIUM"
         PriorityHigh   = "HIGH"
     )

     // Category Constants
     const (
         CategoryWhatsapp = "WHATSAPP"
         CategoryBilling  = "BILLING"
         CategoryAPI      = "API"
         CategoryGeneral  = "GENERAL"
     )
     ```
2. **GORM Tag & Default Database**:
   * Kolom `Priority` pada struct `Ticket`:
     `Priority string gorm:"type:varchar(20);not null;default:'MEDIUM'"`
3. **Normalisasi di UseCase**:
   * Fungsi `normalizePriority` mengonversi input apapun (`low`, `Low`, `LOW`) menjadi konstanta huruf kapital `entity.PriorityLow`, `entity.PriorityMedium`, atau `entity.PriorityHigh`.

---

## 🛠️ 2. Rencana Perubahan Kode

### 📌 1. Backend Go (`wahide`):
1. **[`ticket.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/entity/ticket.go)**:
   * Tambahkan konstanta `PriorityLow = "LOW"`, `PriorityMedium = "MEDIUM"`, `PriorityHigh = "HIGH"`.
   * Tambahkan konstanta kategori `CategoryWhatsapp = "WHATSAPP"`, dst.
   * Ubah tag struct `Priority` menjadi `default:'MEDIUM'`.
2. **[`ticket_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/support/usecase/ticket_usecase.go)**:
   * Ubah `normalizePriority` agar mengembalikan `entity.PriorityLow`, `entity.PriorityMedium`, dan `entity.PriorityHigh` (Semua huruf kapital).
3. **[`ticket_dto.go`](file:///G:/WEB2026/wahide/internal/modules/support/domain/dto/ticket_dto.go)**:
   * Pastikan `validate:"omitempty,oneof=LOW MEDIUM HIGH low medium high Low Medium High"`.

---

## 🔍 3. Verification Plan
* Jalankan `go test ./...` di backend Go `wahide`.
* Jalankan `bun x tsc --noEmit` & `bun run lint` di frontend `fontwahide`.
