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
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Strict`;
}
