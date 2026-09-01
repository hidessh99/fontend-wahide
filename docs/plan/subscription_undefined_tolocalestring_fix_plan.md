# 🧭 Analisis & Rencana Perbaikan: Error TypeError toLocaleString pada Halaman Subscription

Dokumen investigasi mendalam mengenai akar penyebab error `TypeError: Cannot read properties of undefined (reading 'toLocaleString')` pada komponen [`QuotaDialCard.tsx`](file:///G:/WEB2026/fontwahide/src/services/subscription/components/QuotaDialCard.tsx) dan [`PlanCardGrid.tsx`](file:///G:/WEB2026/fontwahide/src/services/subscription/components/PlanCardGrid.tsx) serta rencana perbaikan data normalizer multi-layer.

---

## 🔍 1. Investigasi & Akar Penyebab Masalah (Root Cause)

Berdasarkan tangkapan layar console browser dan audit kode:

1. **Inkonsistensi Casing Respon Backend (`snake_case` vs `camelCase`)**:
   * Endpoint Go Backend `/api/v1/subscription` dan `/api/v1/subscription/plans` mengembalikan payload JSON berformat `snake_case`:
     * `quota_total`, `quota_used`, `device_slots_used`, `device_slots_max`
     * `price_monthly`, `quota_monthly`, `max_devices`
   * Pada berkas [`src/services/subscription/api/subscription.api.ts`](file:///G:/WEB2026/fontwahide/src/services/subscription/api/subscription.api.ts), respon `res.payload` langsung dikembalikan tanpa transformasi *DTO mapper/normalizer*.
   * Akibatnya, pada objek JavaScript di frontend:
     * `subscription.quota_total` ada, tetapi `subscription.quotaTotal` bernilai **`undefined`**.
     * `plan.price_monthly` ada, tetapi `plan.priceMonthly` bernilai **`undefined`**.

2. **Kegagalan Pemanggilan Metode `.toLocaleString()`**:
   * Pada [`QuotaDialCard.tsx:117`](file:///G:/WEB2026/fontwahide/src/services/subscription/components/QuotaDialCard.tsx#L117):
     ```tsx
     subscription.quotaTotal.toLocaleString("id-ID") // Crash: undefined.toLocaleString()
     ```
   * Pada [`PlanCardGrid.tsx:80`](file:///G:/WEB2026/fontwahide/src/services/subscription/components/PlanCardGrid.tsx#L80):
     ```tsx
     plan.priceMonthly.toLocaleString("id-ID") // Crash: undefined.toLocaleString()
     ```
   * Error ini ditangkap oleh `<ErrorBoundary>` sehingga kartu berubah menjadi merah: *"Gagal Memuat Meteran Kuota Pesan"* dan *"Gagal Memuat Daftar Paket Langganan"*.

---

## ⚡ 2. Rencana Solusi Multi-Layer (Enterprise Defense)

Kita menerapkan proteksi 2 lapis (*Two-Layer Defense*):

### Lapis 1: Normalizer Respons API ([`src/services/subscription/api/subscription.api.ts`](file:///G:/WEB2026/fontwahide/src/services/subscription/api/subscription.api.ts))
Membuat fungsi transformer yang secara tangguh membaca field baik `camelCase` maupun `snake_case` dari backend:
```ts
function normalizeSubscription(raw: any): TenantSubscription {
  return {
    planId: raw?.planId || raw?.plan_id || "plan_starter",
    planName: raw?.planName || raw?.plan_name || "Starter",
    tier: (raw?.tier || "STARTER").toUpperCase() as PlanTier,
    quotaUsed: Number(raw?.quotaUsed ?? raw?.quota_used ?? 0),
    quotaTotal: Number(raw?.quotaTotal ?? raw?.quota_total ?? 1500),
    deviceSlotsUsed: Number(raw?.deviceSlotsUsed ?? raw?.device_slots_used ?? 0),
    deviceSlotsMax: Number(raw?.deviceSlotsMax ?? raw?.device_slots_max ?? raw?.max_devices ?? 1),
    hasWatermark: Boolean(raw?.hasWatermark ?? raw?.has_watermark ?? true),
    expiresAt: raw?.expiresAt || raw?.expires_at || new Date(Date.now() + 30 * 86400000).toISOString(),
  };
}
```

### Lapis 2: Defensive Rendering pada Komponen UI
1. **[`src/services/subscription/components/QuotaDialCard.tsx`](file:///G:/WEB2026/fontwahide/src/services/subscription/components/QuotaDialCard.tsx)**:
   * Menggunakan fallback aman: `(quotaRemaining ?? 0).toLocaleString("id-ID")` dan `(subscription?.quotaTotal ?? 0).toLocaleString("id-ID")`.
2. **[`src/services/subscription/components/PlanCardGrid.tsx`](file:///G:/WEB2026/fontwahide/src/services/subscription/components/PlanCardGrid.tsx)**:
   * Menggunakan fallback aman: `(plan?.priceMonthly ?? 0).toLocaleString("id-ID")` dan `(plan?.features || [])`.

---

## 🔍 3. Verifikasi Quality Gates:
* `bun x tsc --noEmit` ➔ 🟢 **0 errors (100% Type-Safe)**
* `eslint` ➔ 🟢 **0 errors, 0 warnings (100% Bersih & Kanonikal)**
