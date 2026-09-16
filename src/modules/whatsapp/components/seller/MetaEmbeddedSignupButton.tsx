"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { wabaApi } from "../../api/waba.api";
import { MetaEmbeddedConfig } from "../../types/waba.types";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse?: {
            code?: string;
            accessToken?: string;
            expiresIn?: number;
            signedRequest?: string;
            userID?: string;
          };
          status?: string;
        }) => void,
        options: {
          config_id?: string;
          response_type?: string;
          override_default_response_type?: boolean;
          extras?: Record<string, unknown>;
        },
      ) => void;
    };
  }
}

interface MetaEmbeddedSignupButtonProps {
  onSuccess?: () => void;
  onManualClick?: () => void;
  className?: string;
}

export function MetaEmbeddedSignupButton({
  onSuccess,
  onManualClick,
  className = "",
}: MetaEmbeddedSignupButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [metaConfig, setMetaConfig] = useState<MetaEmbeddedConfig | null>(null);
  const capturedWabaId = useRef<string | undefined>(undefined);
  const capturedPhoneId = useRef<string | undefined>(undefined);

  // Load backend Meta Embedded Config on mount
  useEffect(() => {
    let isMounted = true;
    wabaApi
      .getEmbeddedConfig()
      .then((cfg) => {
        if (isMounted && cfg) {
          setMetaConfig(cfg);
        }
      })
      .catch(() => {
        // Ignored, fallback handled gracefully on click
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for Meta Embedded Signup PostMessage events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 1. Handle success message from callback page inside popup
      if (
        event.origin === window.location.origin &&
        event.data?.type === "WABA_OAUTH_SUCCESS"
      ) {
        setIsLoading(false);
        toast.success("Nomor WhatsApp Official berhasil terhubung via Meta!");
        onSuccess?.();
        return;
      }

      // 2. Handle Meta Embedded Signup sessionInfo events
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }

      try {
        const payload =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (payload?.type === "WA_EMBEDDED_SIGNUP") {
          if (payload.event === "FINISH" && payload.data) {
            const { phone_number_id, waba_id } = payload.data;
            if (phone_number_id) capturedPhoneId.current = String(phone_number_id);
            if (waba_id) capturedWabaId.current = String(waba_id);
          } else if (payload.event === "CANCEL") {
            setIsLoading(false);
          }
        }
      } catch {
        // Non-JSON message from other sources, safe to ignore
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onSuccess]);

  // Dynamically load Facebook JavaScript SDK
  const loadFacebookSDK = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (window.FB) {
        resolve();
        return;
      }

      const existingScript = document.getElementById("facebook-jssdk");
      if (existingScript) {
        const interval = setInterval(() => {
          if (window.FB) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        return;
      }

      window.fbAsyncInit = function () {
        resolve();
      };

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.FB) resolve();
      };
      document.body.appendChild(script);
    });
  }, []);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      // 1. Fetch latest config if not yet available
      let config = metaConfig;
      if (!config) {
        config = await wabaApi.getEmbeddedConfig();
        setMetaConfig(config);
      }

      // 2. Validate App ID configuration
      if (!config?.app_id || !config?.config_id) {
        setIsLoading(false);
        toast.info(
          "Meta App ID belum dikonfigurasi di server. Silakan gunakan Mode Pengembang untuk input manual.",
          {
            action: onManualClick
              ? {
                  label: "Mode Pengembang",
                  onClick: onManualClick,
                }
              : undefined,
            duration: 6000,
          },
        );
        if (onManualClick) {
          onManualClick();
        }
        return;
      }

      // 3. Protocol Detection:
      // Meta JS SDK blocks FB.login() from unencrypted HTTP (like http://localhost:3000).
      // If running on HTTP, open Meta's official OAuth Dialog popup directly to bypass this limitation!
      const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
      const redirectUri = `${window.location.origin}/waba/callback`;

      if (!isHttps) {
        const width = 600;
        const height = 750;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const oauthUrl = `https://www.facebook.com/${config.api_version || "v20.0"}/dialog/oauth?client_id=${config.app_id}&redirect_uri=${encodeURIComponent(redirectUri)}&config_id=${config.config_id}&response_type=code`;

        const popup = window.open(
          oauthUrl,
          "Meta_WhatsApp_Embedded_Signup",
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
        );

        if (!popup || popup.closed || typeof popup.closed === "undefined") {
          // Popup blocked by browser, fallback to full page redirect
          window.location.href = oauthUrl;
          return;
        }

        // Monitor popup close
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer);
            setIsLoading(false);
          }
        }, 1000);

        return;
      }

      // 4. In HTTPS production environment, utilize official Facebook JS SDK
      await loadFacebookSDK();

      if (!window.FB) {
        throw new Error(
          "Gagal memuat Facebook SDK. Periksa koneksi internet atau ekstensi pemblokir iklan Anda.",
        );
      }

      // 5. Initialize Facebook SDK with official App ID
      window.FB.init({
        appId: config.app_id,
        cookie: true,
        xfbml: true,
        version: config.api_version || "v20.0",
      });

      // 6. Trigger Meta Embedded Signup Pop-up
      window.FB.login(
        async (response) => {
          if (response.authResponse?.code) {
            const authCode = response.authResponse.code;
            try {
              await wabaApi.exchangeOAuthCode({
                code: authCode,
                waba_account_id: capturedWabaId.current,
                phone_number_id: capturedPhoneId.current,
              });

              toast.success("Nomor WhatsApp Official berhasil terhubung via Meta!");
              onSuccess?.();
            } catch (exchangeErr: unknown) {
              const msg =
                exchangeErr instanceof Error
                  ? exchangeErr.message
                  : "Gagal menukar otorisasi dengan server Meta.";
              toast.error(msg);
            } finally {
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        },
        {
          config_id: config.config_id,
          response_type: "code",
          override_default_response_type: true,
          extras: {
            setup: {},
            featureType: "",
            sessionInfoVersion: "2",
          },
        },
      );
    } catch (err: unknown) {
      setIsLoading(false);
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuka pop-up Meta.";
      toast.error(msg);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`h-10 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm px-5 py-2 inline-flex items-center gap-2.5 shadow-sm border border-neutral-800 transition-all active:scale-[0.98] ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      ) : (
        /* Meta Official Infinity Icon */
        <svg
          className="h-4 w-4 fill-white shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.994 4.502c-1.996 0-3.79 1.04-4.994 2.651-1.204-1.611-2.998-2.651-4.994-2.651C3.134 4.502 0 7.636 0 11.496c0 3.86 3.134 6.994 6.994 6.994 1.996 0 3.79-1.04 4.994-2.651 1.204 1.611 2.998 2.651 4.994 2.651 3.86 0 6.994-3.134 6.994-6.994 0-3.86-3.134-6.994-7-6.994zm0 11.49a4.498 4.498 0 0 1-4.496-4.496 4.498 4.498 0 0 1 4.496-4.496 4.498 4.498 0 0 1 4.496 4.496 4.498 4.498 0 0 1-4.496 4.496zm-9.988 0A4.498 4.498 0 0 1 2.51 11.496a4.498 4.498 0 0 1 4.496-4.496 4.498 4.498 0 0 1 4.496 4.496 4.498 4.498 0 0 1-4.496 4.496z" />
        </svg>
      )}
      <span>Hubungkan dengan Meta</span>
    </Button>
  );
}
