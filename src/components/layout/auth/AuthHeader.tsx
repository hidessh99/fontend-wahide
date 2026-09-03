import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";

export function AuthHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="bg-wise-green h-3.5 w-3.5 rounded-full" />
        <span className="text-foreground text-xl font-black tracking-tight">
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
