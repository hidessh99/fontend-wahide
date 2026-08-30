"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<"id" | "en">("id");

  const toggleLocale = () => {
    const nextLocale = currentLocale === "id" ? "en" : "id";
    setCurrentLocale(nextLocale);
    // In next phase: router.push(`/${nextLocale}...`)
  };

  return (
    <Button
      variant="secondaryPill"
      size="sm"
      onClick={toggleLocale}
      className="gap-1.5 text-xs font-bold uppercase"
      aria-label="Ganti Bahasa"
    >
      <Globe className="size-3.5" />
      <span>{currentLocale}</span>
    </Button>
  );
}
