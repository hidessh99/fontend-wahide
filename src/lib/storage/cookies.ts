// ==============================================================================
// Wahide Client Cookie Storage Utility
// Manages session cookies synchronized with Next.js Edge Middleware
// ==============================================================================

export function setCookie(name: string, value: string, maxAgeSeconds: number = 2592000) {
  if (typeof document === "undefined") return;
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Strict${secureFlag}`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const cookie of cookies) {
    const [key, val] = cookie.split("=");
    if (decodeURIComponent(key) === name) {
      return decodeURIComponent(val || "");
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  // Use explicit 1970 expiration date and Max-Age=0 to guarantee instant purge across all browsers & localhost
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Strict`;
}

export function clearAllAuthStorage() {
  if (typeof window === "undefined") return;

  // 1. Purge all known active and legacy auth cookies
  const authCookieNames = [
    "wahide_session_token",
    "wahide_user_role",
    "wahide_token",
    "wahide_tenant_id",
    "token",
    "session_token",
  ];

  for (const name of authCookieNames) {
    deleteCookie(name);
  }

  // 2. Clear localStorage auth persistence
  try {
    localStorage.removeItem("wahide_auth_storage");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
  } catch {
    // ignore storage access error
  }

  // 3. Clear sessionStorage
  try {
    sessionStorage.clear();
  } catch {
    // ignore storage access error
  }
}
