import React from "react";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface dark:bg-[#161715] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-3 col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-[#9fe870]" />
            <span className="font-black text-xl tracking-tight text-foreground">
              Wahide<span className="text-[#9fe870]">.</span>
            </span>
          </Link>
          <p className="text-xs font-semibold text-foreground-secondary leading-relaxed max-w-xs">
            Enterprise SaaS WhatsApp Multi-Tenant & Multi-Device Gateway berkinerja tinggi.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Produk</p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li><Link href="/#features" className="hover:text-foreground">Multi-Device Gateway</Link></li>
            <li><Link href="/#spintax" className="hover:text-foreground">Anti-Ban Spintax</Link></li>
            <li><Link href="/#architecture" className="hover:text-foreground">Session Hibernation</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">Paket Langganan</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Developer</p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li><a href="https://github.com/hidessh99/fontend-wahide" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub Repo</a></li>
            <li><Link href="/docs/api" className="hover:text-foreground">Katalog REST API</Link></li>
            <li><Link href="/docs/webhooks" className="hover:text-foreground">Webhook Events</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Legal & Bantuan</p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li><Link href="/support" className="hover:text-foreground">Helpdesk Support</Link></li>
            <li><Link href="/terms" className="hover:text-foreground">Syarat & Ketentuan</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">Kebijakan Privasi</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-foreground-muted">
        <span>&copy; {new Date().getFullYear()} Wahide SaaS Platform. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>SLA 99.9% Uptime</span>
          <span>•</span>
          <span>AES-GCM 256 Enkripsi</span>
        </div>
      </div>
    </footer>
  );
}
