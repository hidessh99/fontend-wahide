import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wahide - Enterprise WhatsApp Multi-Tenant Gateway",
  description: "Next-generation WhatsApp Multi-Device SaaS Gateway built for scale, zero memory leaks, and high throughput.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-wise-green selection:text-dark-green">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
