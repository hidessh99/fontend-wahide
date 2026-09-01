import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";

export function AuthHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/" className="flex items-center gap-2">
        <span className="h-3.5 w-3.5 rounded-full bg-wise-green" />
        <span className="font-black text-xl tracking-tight text-foreground">
          Wahide<span className="text-dark-green dark:text-wise-green">.</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
