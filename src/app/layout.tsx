import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { env } from "@/lib/config/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfcf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f0c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wahide - Enterprise WhatsApp Multi-Tenant Gateway",
    template: "%s | Wahide Enterprise WhatsApp Gateway",
  },
  description:
    "Platform SaaS WhatsApp Multi-Tenant & Multi-Device berkinerja tinggi dengan Session Hibernation hemat RAM 95%, 5 Lapis Anti-Ban, Spintax Engine, dan arsitektur Go Microservices.",
  keywords: [
    "WhatsApp Gateway",
    "WhatsApp API Gateway",
    "WhatsApp Multi Device",
    "WhatsApp SaaS",
    "Anti Ban WhatsApp",
    "Spintax WhatsApp",
    "Session Hibernation",
    "WhatsApp Broadcast Massal",
    "Wahide Gateway",
    "Go Microservices WhatsApp",
  ],
  authors: [{ name: "Wahide Engineering Team", url: siteUrl }],
  creator: "Wahide",
  publisher: "Wahide Enterprise SaaS",
  applicationName: "Wahide",
  generator: "Next.js 16",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "id-ID": siteUrl,
      "en-US": `${siteUrl}/en`,
    },
  },
  openGraph: {
    title: "Wahide - Enterprise WhatsApp Multi-Tenant Gateway",
    description:
      "Scale hingga 10.000+ perangkat WhatsApp aktif dengan 5 Lapis Anti-Ban dan Session Hibernation berkinerja tinggi.",
    url: siteUrl,
    siteName: "Wahide",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahide - Enterprise WhatsApp Multi-Tenant Gateway",
    description:
      "Platform SaaS WhatsApp Multi-Device Gateway berkinerja tinggi dengan 5 Lapis Anti-Ban & Go Microservices.",
    creator: "@wahide_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Wahide WhatsApp Gateway",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IDR",
      },
      "description":
        "Platform SaaS WhatsApp Multi-Tenant & Multi-Device berkinerja tinggi dengan Session Hibernation dan 5 Lapis Anti-Ban.",
    },
    {
      "@type": "Organization",
      "name": "Wahide",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-wise-green selection:text-dark-green">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
