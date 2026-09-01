# 🧭 Analisis & Rencana: Penanganan Session Expired, Pembersihan Cookie & LocalStorage Menyeluruh

Analisis mendalam mengenai pemicu URL `/login?session_expired=1`, audit mekanisme pembersihan cookie & localStorage di browser, serta penyempurnaan alur logout/session expiry agar tidak menimbulkan bug state yang tertinggal.

---

## 🔍 1. Analisis Akar Masalah (Root Cause Analysis)

### ❓ Mengapa Muncul `http://localhost:3000/login?session_expired=1`?
Parameter `?session_expired=1` **bukanlah bug**, melainkan **mekanisme keamanan otomatis (*Auto-Logout & Session Guard*)** yang ada pada [`http-client.ts`](file:///G:/WEB2026/fontwahide/src/lib/api/http-client.ts#L154-L172).

Ketika aplikasi frontend memanggil API backend dan menerima respons **HTTP 401 Unauthorized** (misalnya token JWT kadaluwarsa, backend Go direstart sehingga sesi lama tidak valid, atau pengguna membuka dasbor tanpa token aktif):
1. `HttpClient` mendeteksi status `401`.
2. Menghapus cookie `wahide_session_token` dan `wahide_user_role`.
3. Menghapus data `wahide_auth_storage` dari `localStorage`.
4. Mengarahkan browser ke `/login?session_expired=1` agar pengguna masuk kembali.

---

### ⚠️ Mengapa Timbul Kesan "Belum Terhapus Benar / Timbul Bug"?
1. **Penghapusan Cookie di Localhost**:
   * Fungsi `deleteCookie` di `cookies.ts` hanya menggunakan `Max-Age=0`. Pada beberapa browser di environment `localhost`, penghapusan cookie lebih dapat diandalkan jika menyertakan header `Expires=Thu, 01 Jan 1970 00:00:00 GMT`.
2. **Residu Cookie Lama**:
   * Di versi awal, pernah ada cookie bernama `wahide_token`, `wahide_tenant_id`, atau `token`. Jika cookie-cookie ini masih tersimpan di browser, middleware atau script lama bisa saja membacanya.
3. **Tidak Ada Banner Informasi di Halaman Login**:
   * `LoginForm.tsx` saat ini belum membaca query `session_expired=1`. Akibatnya, form login hanya diam tanpa memberi tahu pengguna mengapa mereka diarahkan kembali ke login, sehingga menimbulkan kecurigaan adanya bug.
4. **Zustand In-Memory State**:
   * Jika redirect terjadi di level client-side tanpa reload penuh, state memori Zustand `isAuthenticated` perlu di-hard-reset ke `false`.

---

## 🛠️ 2. Rencana Perbaikan (Action Plan)

### 📌 1. Standarisasi Pembersihan Cookie & Storage ([`cookies.ts`](file:///G:/WEB2026/fontwahide/src/lib/storage/cookies.ts))
* Perbaiki `deleteCookie` agar menyertakan `Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/`.
* Tambahkan fungsi `clearAllAuthStorage()` yang menghapus semua varian cookie auth (`wahide_session_token`, `wahide_user_role`, `wahide_token`, `wahide_tenant_id`, `token`) serta membersihkan `localStorage.removeItem("wahide_auth_storage")`.

### 📌 2. Integrasi Notice & Hard-Reset di Form Login ([`LoginForm.tsx`](file:///G:/WEB2026/fontwahide/src/services/iam/components/LoginForm.tsx))
* Tangkap `searchParams.get("session_expired") === "1"`.
* Saat komponen mount dengan kondisi `session_expired=1`:
  * Jalankan `clearAllAuthStorage()` dan reset Zustand store `useAuth.getState().logout()`.
* Tampilkan banner pemberitahuan ramah berwarna kuning (*amber alert*):
  > *"Sesi Anda telah berakhir demi keamanan. Silakan masuk kembali dengan email dan password Anda."*

### 📌 3. Penyelarasan Kamus Bahasa ([`id/auth.json`](file:///G:/WEB2026/fontwahide/src/locales/id/auth.json) & [`en/auth.json`](file:///G:/WEB2026/fontwahide/src/locales/en/auth.json))
* Tambahkan key `"sessionExpiredNotice"` pada kedua bahasa.

---

## 🔍 3. Verification Plan
* Jalankan `bun x tsc --noEmit` & `bun run lint` di `fontwahide`.
* Uji navigasi ke `/login?session_expired=1` dan pastikan banner muncul rapi serta seluruh cookie & storage dibersihkan total.
