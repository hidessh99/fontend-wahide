# 📋 Audit & Rencana Sinkronisasi Role Backend Go (`wahide`) vs Frontend (`fontwahide`)

> **Target File Backend**: [`G:\WEB2026\wahide\internal\modules\iam\domain\entity\role.go`](file:///G:/WEB2026/wahide/internal/modules/iam/domain/entity/role.go) & [`G:\WEB2026\wahide\internal\shared\context\auth.go`](file:///G:/WEB2026/wahide/internal/shared/context/auth.go)  
> **Target File Frontend**: [`G:\WEB2026\fontwahide\src\services\iam\types\auth.types.ts`](file:///G:/WEB2026/fontwahide/src/services/iam/types/auth.types.ts) & [`DashboardSidebar.tsx`](file:///G:/WEB2026/fontwahide/src/components/layout/dashboard/DashboardSidebar.tsx)  

---

## 🔍 1. Hasil Audit Sumber Kebenaran (*Single Source of Truth*) di Backend Go

Berdasarkan pemeriksaan langsung pada kode sumber backend:
1. **`internal/modules/iam/domain/entity/role.go`**:
   ```go
   const (
       RoleAdmin    = sharedCtx.RoleAdmin    // "admin"
       RoleSeller   = sharedCtx.RoleSeller   // "seller"
       RoleReseller = sharedCtx.RoleReseller // "reseller"
       RoleUser     = sharedCtx.RoleUser     // "user"
   )
   ```
2. **`internal/shared/context/auth.go`**:
   ```go
   const (
       RoleAdmin    = "admin"    // Super Administrator sistem global
       RoleSeller   = "seller"   // Pemilik Tenant / Pelaku Bisnis
       RoleReseller = "reseller" // Akun Reseller
       RoleUser     = "user"     // Staf CS / Operator / End-User
   )
   ```
3. **`internal/shared/database/migration.go`**:
   Tabel `roles` diisi dengan data awal:
   * `"admin"` ➔ Super Administrator
   * `"seller"` ➔ Tenant Business Owner / Seller
   * `"user"` ➔ Customer Service / CS Agent
   * *(Alias database: `"owner"` setara `"seller"`, `"staff"` setara `"user"`)*

---

## ⚠️ 2. Analisis Kesenjangan (*Gap Analysis*) pada Frontend

| Aspek | Backend Go (`wahide`) | Frontend Eksisting (`fontwahide`) | Dampak / Risiko |
| :--- | :--- | :--- | :--- |
| **Konvensi String Role** | Lowercase (`"admin"`, `"seller"`, `"user"`) | Uppercase (`"SUPER_ADMIN"`, `"SELLER"`, `"AGENT"`) | Pengecekan `user?.role === "SUPER_ADMIN"` bernilai `false` saat user `admin` login dari backend Go |
| **Role Staf CS Operator** | `"user"` (atau alias `"staff"`) | `"AGENT"` | CS Agent tidak teridentifikasi saat token JWT diverifikasi |
| **Role Pemilik Usaha** | `"seller"` (atau alias `"owner"`) | `"SELLER"` | Potensi *casing mismatch* |

---

## 🛡️ 3. Desain Matriks Hak Akses Terpadu (*Unified RBAC Matrix*)

Frontend harus mendukung perbandingan peran yang **tahan terhadap variasi huruf (*Case-Insensitive & Alias-Safe*)**:

```typescript
// Helper Normalisasi Standar
export function isAdmin(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "admin" || r === "super_admin";
}

export function isSeller(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "seller" || r === "owner";
}

export function isUserAgent(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "user" || r === "staff" || r === "agent";
}
```

### Matriks Akses Navigasi Sidebar yang Disesuaikan:

| Modul Navigasi | Rute | `admin` (Superadmin) | `seller` (Tenant Owner) | `user` (CS Agent) |
| :--- | :--- | :---: | :---: | :---: |
| **Overview** | `/dashboard` | ✅ Akses | ✅ Akses | ✅ Akses |
| **Slot WhatsApp** | `/devices` | ✅ Akses | ✅ Akses | ✅ Akses |
| **Kampanye Broadcast** | `/campaigns` | ✅ Akses | ✅ Akses | ✅ Akses |
| **Buku Kontak** | `/contacts` | ✅ Akses | ✅ Akses | ✅ Akses |
| **Tim CS & Operator** | `/team` | ✅ Akses | ✅ Akses | ❌ *Disembunyikan* |
| **Paket & Kuota** | `/subscription` | ✅ Akses | ✅ Akses | ❌ *Disembunyikan* |
| **Faktur & Tagihan** | `/billing` | ✅ Akses | ✅ Akses | ❌ *Disembunyikan* |
| **Tiket Bantuan** | `/support` | ✅ Akses | ✅ Akses | ✅ Akses |
| **Pengaturan & API** | `/settings` | ✅ Akses | ✅ Akses | ⚠️ *Profil Saja* |
| **Panel Superadmin** | `/admin/overview` | ✅ **Aktif Khusus** | ❌ *Disembunyikan* | ❌ *Disembunyikan* |

---

## 🛠️ 4. Langkah Implementasi Perbaikan (*Action Plan*)

1. **Update `src/services/iam/types/auth.types.ts`**:
   - Definisikan tipe kanonikal: `export type UserRole = "admin" | "seller" | "user" | "reseller" | string;`
   - Ekspor fungsi helper: `isAdmin()`, `isSeller()`, `isUserAgent()`.
2. **Update `src/components/layout/dashboard/DashboardSidebar.tsx`**:
   - Ganti filter string statis dengan helper kanonikal `isAdmin(user?.role)` dan `isSeller(user?.role)`.
   - Item `/team`, `/subscription`, `/billing` hanya ditampilkan jika `isAdmin()` atau `isSeller()`.
   - Item `/admin/overview` hanya ditampilkan jika `isAdmin()`.
3. **Verifikasi & Validasi**:
   - Jalankan `bun x tsc --noEmit` dan `bun run lint` untuk memastikan 100% type safety.
