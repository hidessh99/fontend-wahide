import React from "react";
import { PublicHeader } from "@/components/layout/public/PublicHeader";
import { PublicFooter } from "@/components/layout/public/PublicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors duration-200">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
