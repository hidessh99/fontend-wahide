"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

function useIsMounted() {
  const subscribe = React.useCallback(() => () => {}, []);
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <Button variant="secondaryPill" size="sm" className="w-24 opacity-0">
        ...
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="secondaryPill"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="gap-2 text-xs"
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <>
          <Sun className="text-wise-green size-3.5" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="text-dark-green size-3.5" />
          <span>Dark</span>
        </>
      )}
    </Button>
  );
}
