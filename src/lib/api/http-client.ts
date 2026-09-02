// ==============================================================================
// Wahide Frontend HTTP Client & Standard Backend REST Response Envelope
// Matches Go Backend: github.com/hidessh99/wahide/internal/shared/response
// ==============================================================================

import { getCookie,  clearAllAuthStorage } from "@/lib/storage/cookies";


export interface GlobalResponse<T = unknown> {
  success: boolean;
  message: string;
  payload?: T;
  error?: unknown;
  additional_info?: {
    code?: string;
    page?: number;
    size?: number;
    total?: number;
    [key: string]: unknown;
  } | unknown;
}

export type ApiResponse<T = unknown> = GlobalResponse<T>;

export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  error?: string;
  additional_info?: {
    code?: string;
    [key: string]: unknown;
  } | Array<{ field: string; message: string }> | unknown;
  field_errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public data?: ApiErrorPayload | unknown;
  public fieldErrors?: Record<string, string[]> | Array<{ field: string; message: string }>;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;

    if (typeof data === "object" && data !== null) {
      const payload = data as ApiErrorPayload;
      if (typeof payload.additional_info === "object" && payload.additional_info !== null) {
        if ("code" in (payload.additional_info as Record<string, unknown>)) {
          this.code = (payload.additional_info as Record<string, string>).code;
        } else if (Array.isArray(payload.additional_info)) {
          this.fieldErrors = payload.additional_info;
        }
      }
      if (payload.field_errors) {
        this.fieldErrors = payload.field_errors;
      }
    }
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
  idempotencyKey?: string;
  timeoutMs?: number;
  retries?: number;
}

let isRedirectingToLogin = false;

class HttpClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    // 1. Try Cookie First
    const cookieToken = getCookie("wahide_session_token");
    if (cookieToken) return cookieToken;

    // 2. Fallback to localStorage
    try {
      const authStorage = localStorage.getItem("wahide_auth_storage");
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed?.state?.token || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  private buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
    if (!params) return url;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  public async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const {
      params,
      token,
      idempotencyKey,
      headers,
      timeoutMs = 15000,
      retries = 0,
      ...customConfig
    } = options;

    const authToken = token || this.getAuthToken();
    const isFormData = typeof FormData !== "undefined" && customConfig.body instanceof FormData;

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    if (authToken) {
      defaultHeaders["Authorization"] = `Bearer ${authToken}`;
    }

    if (idempotencyKey) {
      defaultHeaders["Idempotency-Key"] = idempotencyKey;
    }

    const fullUrl = this.buildUrl(endpoint, params);

    // Timeout Abort Controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const config: RequestInit = {
      ...customConfig,
      signal: customConfig.signal || controller.signal,
      headers: {
        ...defaultHeaders,
        ...(headers as Record<string, string>),
      },
    };

    try {
      const response = await fetch(fullUrl, config);
      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Retry policy for idempotent GET on 502/503/504
        const method = (customConfig.method || "GET").toUpperCase();
        if (retries > 0 && method === "GET" && [502, 503, 504].includes(response.status)) {
          const backoff = Math.floor(300 + Math.random() * 500);
          await new Promise((res) => setTimeout(res, backoff));
          return this.request<T>(endpoint, { ...options, retries: retries - 1 });
        }

        // Auto-Logout & Session Cleanup on HTTP 401 (Session Revoked / Expired Token)
        if (
          response.status === 401 &&
          typeof window !== "undefined" &&
          !endpoint.includes("/auth/login") &&
          !endpoint.includes("/auth/register") &&
          !endpoint.includes("/auth/forgot-password") &&
          !endpoint.includes("/auth/reset-password")
        ) {
          clearAllAuthStorage();

          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/register" && !isRedirectingToLogin) {
            isRedirectingToLogin = true;
            setTimeout(() => {
              isRedirectingToLogin = false;
            }, 3000);
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/login?session_expired=1";
          }
        }


        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        if (typeof data?.message === "string" && data.message) {
          errorMessage = data.message;
        } else if (typeof data?.error === "string" && data.error) {
          errorMessage = data.error;
        } else if (data?.error && typeof data.error === "object" && "message" in data.error) {
          errorMessage = String((data.error as Record<string, unknown>).message);
        }
        throw new ApiError(errorMessage, response.status, data);
      }


      return data as ApiResponse<T>;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          throw new ApiError("Batas waktu koneksi habis (Timeout 15 detik). Server tidak merespons.", 408);
        }
        throw new ApiError(err.message, 500);
      }
      throw new ApiError("Gagal menghubungi server. Periksa koneksi internet.", 500);
    }
  }

  public get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET", retries: options?.retries ?? 1 });
  }

  public post<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const httpClient = new HttpClient();
