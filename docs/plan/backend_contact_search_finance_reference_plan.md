# 🧭 Rencana Arsitektur: Penyelarasan Penuh Backend Go Modul Kontak Mengacu pada Pola Modul Finance (`FindAll`)

Dokumen perencanaan teknis mengenai implementasi query pencarian `search` pada modul Contact Go ([`wahide/internal/modules/contact/`](file:///G:/WEB2026/wahide/internal/modules/contact/)) dengan mengadopsi 100% pola Clean Architecture, sanitasi XSS (`xval.SanitizeFields`), validasi struct (`h.val.Struct`), structured logging (`h.LogEntry`), dan query filter (`database.FullTextSearch`) yang identik dengan modul Finance ([`billing_handler.go#L155`](file:///G:/WEB2026/wahide/internal/modules/finance/delivery/http/billing_handler.go#L155)).

---

## 🔍 1. Standar Arsitektur Seragam yang Diadopsi

```
[ HTTP Request (GET /contacts?search=...&page=1&page_size=20) ]
                            │
                            ▼
     [ ContactHandler.ListContacts (delivery/http) ]
       ├─ auth, err := sharedCtx.GetAuth(c)
       ├─ c.Bind(req)  ➔ ListContactRequest (DTO)
       ├─ xval.SanitizeFields(req)  (🛡️ Proteksi XSS)
       ├─ h.val.Struct(req)         (✅ Validasi Skema)
       └─ h.LogEntry(...)           (📝 Structured Logging)
                            │
                            ▼
     [ ContactCrudUseCase.ListContacts (usecase) ]
       ├─ limit, offset := response.PreparePagination(req.Page, req.PageSize)
       ├─ total, err := contactRepo.Count(ctx, tenantID, req.Search)
       └─ contacts, err := contactRepo.FindAll(ctx, tenantID, req.Search, limit, offset)
                            │
                            ▼
     [ ContactRepository.FindAll / Count (repository) ]
       └─ database.FullTextSearch(query, search, "name", "phone")
```

---

## 🛠️ 2. Rincian Implementasi di Setiap Layer

### A. DTO Layer ([`contact_dto.go`](file:///G:/WEB2026/wahide/internal/modules/contact/domain/dto/contact_dto.go)):
```go
type ListContactRequest struct {
    Page     int    `json:"page" form:"page" query:"page" validate:"omitempty,min=1,max=100"`
    PageSize int    `json:"page_size" form:"page_size" query:"page_size" validate:"omitempty,min=1,max=100"`
    Search   string `json:"search" form:"search" query:"search" validate:"omitempty,noxss"`
}
```

### B. Delivery / HTTP Handler Layer ([`contact_handler.go`](file:///G:/WEB2026/wahide/internal/modules/contact/delivery/http/contact_handler.go)):
```go
func (h *ContactHandler) ListContacts(c *echo.Context) error {
    auth, err := sharedCtx.GetAuth(c)
    if err != nil {
        h.LogEntry(c.Request().Context(), "ContactHandler.ListContacts").WithError(err).Warn("Error getting auth context")
        return response.RespondError(c, err)
    }

    req := new(dto.ListContactRequest)
    if err := c.Bind(req); err != nil {
        h.LogEntry(c.Request().Context(), "ContactHandler.ListContacts").WithError(err).Warn("Error binding request")
        return response.RespondError(c, err)
    }
    xval.SanitizeFields(req)

    if err := h.val.Struct(req); err != nil {
        h.LogEntry(c.Request().Context(), "ContactHandler.ListContacts").WithError(err).Warn("Error validating request")
        return response.RespondError(c, err)
    }

    contacts, total, err := h.contactUC.ListContacts(c.Request().Context(), auth.TenantID, req)
    if err != nil {
        h.LogEntry(c.Request().Context(), "ContactHandler.ListContacts").WithError(err).Error("Error listing contacts")
        return response.RespondError(c, err)
    }

    dtos := make([]dto.ContactResponse, 0, len(contacts))
    for i := range contacts {
        dtos = append(dtos, toContactResponse(&contacts[i]))
    }

    return response.RespondPaginated(c, http.StatusOK, "contacts retrieved successfully", dtos, req.Page, req.PageSize, total)
}
```

### C. Domain & UseCase Layer ([`domain/usecase.go`](file:///G:/WEB2026/wahide/internal/modules/contact/domain/usecase.go) & [`contact_crud_usecase.go`](file:///G:/WEB2026/wahide/internal/modules/contact/usecase/contact_crud_usecase.go)):
```go
func (u *contactCrudUseCase) ListContacts(ctx context.Context, tenantID string, req *dto.ListContactRequest) ([]entity.Contact, int64, error) {
    if req == nil {
        req = &dto.ListContactRequest{}
    }
    limit, offset := response.PreparePagination(req.Page, req.PageSize)

    total, err := u.contactRepo.Count(ctx, tenantID, req.Search)
    if err != nil {
        u.Log(ctx, "contact.ListContacts").WithError(err).Error("failed to count contacts")
        return nil, 0, err
    }

    contacts, err := u.contactRepo.FindAll(ctx, tenantID, req.Search, limit, offset)
    if err != nil {
        u.Log(ctx, "contact.ListContacts").WithError(err).Error("failed to list contacts")
        return nil, 0, err
    }

    return contacts, total, nil
}
```

### D. Repository Layer ([`domain/repository.go`](file:///G:/WEB2026/wahide/internal/modules/contact/domain/repository.go) & [`contact_repository.go`](file:///G:/WEB2026/wahide/internal/modules/contact/repository/contact_repository.go)):
```go
func (r *contactRepository) applyFilters(db *gorm.DB, tenantID, search string) *gorm.DB {
    query := db.Model(&entity.Contact{}).Where("tenant_id = ?", tenantID)
    if search != "" {
        query = database.FullTextSearch(query, search, "name", "phone")
    }
    return query
}

func (r *contactRepository) FindAll(ctx context.Context, tenantID, search string, limit, offset int) ([]entity.Contact, error) {
    db := r.GetDB(ctx)
    query := r.applyFilters(db, tenantID, search)
    var contacts []entity.Contact
    err := query.Order("created_at DESC, id DESC").Limit(limit).Offset(offset).Find(&contacts).Error
    return contacts, err
}

func (r *contactRepository) Count(ctx context.Context, tenantID, search string) (int64, error) {
    db := r.GetDB(ctx)
    var total int64
    query := r.applyFilters(db, tenantID, search)
    err := query.Count(&total).Error
    return total, err
}
```

### E. Frontend React Layer ([`useContacts.ts`](file:///G:/WEB2026/fontwahide/src/services/contact/hooks/useContacts.ts)):
* Mengirimkan request `GET /contacts?search=${encodeURIComponent(query)}` saat tombol submit diklik atau tombol `Enter` ditekan.
* Menerapkan **Confirmed Submit Filter** pada `activeSearch` sehingga pencarian 100% responsif, instan, dan akurat.

---

## 🔍 3. Verifikasi & Quality Gates:
1. Backend Go:
   - Verifikasi compile & test adapter (`contact_crud_usecase_test.go` & `contact_to_dashboard_adapter.go`).
2. Frontend Next.js:
   - `bun x tsc --noEmit` ➔ 🟢 0 error.
   - `eslint` ➔ 🟢 0 error.
