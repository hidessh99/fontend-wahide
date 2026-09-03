# ⚡ MASTER PLAN: Enterprise Polish, Security Hardening & Zero-Leak Modal Finalization
**Target Scope:** `G:\WEB2026\fontwahide\src`  
**Author:** Lead Programmer & System Design Senior Architect  
**Objective:** Menyempurnakan sisa detail arsitektur frontend menuju standar industri komersial skala besar (*Bank-Grade Security & 100% Zero-Leak Modals*).

---

## 🎯 1. Latar Belakang & Ruang Lingkup Perbaikan

Meskipun fondasi utama telah stabil dan proses build produksi Next.js 16 telah lulus 100%, ada **3 aspek teknis** yang perlu dituntaskan agar sistem benar-benar kebal terhadap serangan siber dan bebas dari kebocoran event listener:

1. **Penyelesaian Menyeluruh 16 Modal Sekunder ke `useEscapeKey`**:
   - Saat ini masih ada 16 file modal sekunder yang menggunakan `window.addEventListener("keydown")` manual.
   - Kita akan menuntaskan migrasi seluruh modal ini ke hook terpusat `useEscapeKey(isOpen, onClose)` agar 100% modal di aplikasi Anda bersih dari kebocoran memori (*listener churn*).
2. **Penguatan Keamanan Siber: Content Security Policy (CSP)**:
   - Menambahkan header HTTP `Content-Security-Policy` pada `next.config.ts` untuk melindungi aplikasi dari serangan injeksi skrip (*Cross-Site Scripting / XSS*) dan pencurian data sesi.
   - Memastikan whitelist mencakup Cloudflare Turnstile, Google Fonts, API Go backend, dan koneksi WebSocket.
3. **Graceful Session Expiry Handling**:
   - Memastikan saat sesi login berakhir (HTTP 401), notifikasi pengalihan sesi ditampilkan dengan ramah tanpa merusak draft formulir pengguna.

---

## 🛠️ 2. Rincian Teknis per Fase

### Fase 1: Migrasi Menyeluruh Seluruh Modal ke `useEscapeKey`

Kita akan mengganti pola manual `window.addEventListener("keydown")` dengan `useEscapeKey(isOpen, onClose)` pada 16 modal:

#### 1. Modul Campaign & Finance:
- `src/modules/campaign/components/broadcast/CampaignWizardModal.tsx`
- `src/modules/finance/components/balance/TopUpModal.tsx`
- `src/modules/finance/components/invoices/InvoiceReceiptModal.tsx`

#### 2. Modul Admin (Superadmin Portal):
- `src/modules/admin/components/activity/DeleteActivityConfirmModal.tsx`
- `src/modules/admin/components/billing/UpdateBillingStatusModal.tsx`
- `src/modules/admin/components/notifications/DeleteQueueModal.tsx`
- `src/modules/admin/components/notifications/QueueDetailModal.tsx`
- `src/modules/admin/components/plans/DeletePlanModal.tsx`
- `src/modules/admin/components/plans/PlanFormModal.tsx`
- `src/modules/admin/components/users/AdjustBalanceModal.tsx`

#### 3. Modul IAM, Support, Team & WhatsApp:
- `src/modules/iam/components/settings/ApiKeyConfirmModal.tsx`
- `src/modules/iam/components/settings/SessionConfirmModal.tsx`
- `src/modules/support/components/tickets/CreateTicketModal.tsx`
- `src/modules/support/components/tickets/UpdateTicketStatusModal.tsx`
- `src/modules/team/components/modals/DeleteTeamMemberModal.tsx`
- `src/modules/whatsapp/components/messages/SendMessageModal.tsx`

*Manfaat:* 100% modal di seluruh aplikasi seragam menggunakan arsitektur stable ref yang kebal dari memory leak.

---

### Fase 2: Penguatan Keamanan dengan Content Security Policy (CSP)

Memperbarui `next.config.ts` untuk menambahkan header `Content-Security-Policy`:
```ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https:;
  connect-src 'self' http://localhost:* ws://localhost:* https://*.wahide.id wss://*.wahide.id https://challenges.cloudflare.com;
  frame-src 'self' https://challenges.cloudflare.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();
```
*Manfaat:* Standar keamanan perbankan (*Bank-Grade Security*), mencegah injeksi script berbahaya dari ekstensi browser pihak ketiga atau serangan hacker.

---

### Fase 3: Verifikasi Mutu & Kestabilan Kompilasi

1. **TypeScript Check**: `bun x tsc --noEmit` $\to$ **0 errors**.
2. **ESLint Static Analysis**: `bun run lint` $\to$ **0 errors, 0 warnings**.
3. **Production Build**: `bun run build` $\to$ **38/38 routes compiled cleanly**.
