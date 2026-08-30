"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/services/iam/hooks/useAuth";
import { User, Menu, X } from "lucide-react";

export function PublicHeader() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-4 w-4 rounded-full bg-[#9fe870] animate-pulse" />
          <span className="font-black text-2xl tracking-tight text-foreground">
            Wahide<span className="text-[#9fe870]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-foreground-secondary">
          <Link href="/#features" className="hover:text-foreground transition">
            Fitur Anti-Ban
          </Link>
          <Link href="/#architecture" className="hover:text-foreground transition">
            Arsitektur Microservice
          </Link>
          <Link href="/#spintax" className="hover:text-foreground transition">
            Spintax Tester
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition">
            Harga Paket
          </Link>
        </nav>

        {/* Action Controls & Auth State */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <Link href="/dashboard">
              <Button variant="primaryPill" size="sm" className="gap-2">
                <User className="size-4" />
                <span>Dashboard ({user.name.split(" ")[0]})</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="secondaryPill" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primaryPill" size="sm">
                  Daftar Gratis
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-foreground-secondary hover:text-foreground"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-surface dark:bg-[#161715] px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-foreground">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50"
            >
              Fitur Anti-Ban
            </Link>
            <Link
              href="/#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50"
            >
              Arsitektur Microservice
            </Link>
            <Link
              href="/#spintax"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50"
            >
              Spintax Tester
            </Link>
          </nav>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outlinePill" size="default" className="w-full">
                Masuk
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primaryPill" size="default" className="w-full">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
