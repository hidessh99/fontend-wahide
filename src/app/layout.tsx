import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { env } from "@/lib/config/env";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
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
    default: "Wahide - Platform Otomasi Bisnis & WhatsApp Gateway",
    template: "%s | Wahide",
  },
  description:
    "Wahide adalah platform otomasi bisnis dan WhatsApp Gateway terpadu: pengiriman pesan cerdas dengan proteksi reputasi, sistem reservasi, pengingat otomatis, dan formulir web terintegrasi.",
  keywords: [
    "Wahide",
    "Wahide Gateway",
    "WhatsApp Gateway Indonesia",
    "Platform Otomasi Bisnis",
    "WhatsApp Multi Device",
    "Smart Broadcast WhatsApp",
    "Sistem Reservasi WhatsApp",
    "Pengingat Otomatis WhatsApp",
    "Formulir Dinamis WhatsApp",
    "API WhatsApp Indonesia",
  ],
  authors: [{ name: "Hide Digital Security", url: siteUrl }],
  creator: "Wahide",
  publisher: "Hide Digital Security",
  applicationName: "Wahide",
  generator: "Next.js 16",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Wahide - Platform Otomasi Bisnis & WhatsApp Gateway",
    description:
      "Solusi terpadu otomasi bisnis dan integrasi WhatsApp: pengiriman pesan cerdas dengan proteksi reputasi, reservasi online, pengingat otomatis, dan formulir web siap pakai.",
    url: siteUrl,
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${siteUrl}/icon.png`,
        width: 512,
        height: 512,
        alt: "Wahide - Platform Otomasi Bisnis & WhatsApp Gateway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahide - Platform Otomasi Bisnis & WhatsApp Gateway",
    description:
      "Solusi terpadu otomasi bisnis dan integrasi WhatsApp: pengiriman pesan cerdas dengan proteksi reputasi, reservasi online, pengingat otomatis, dan formulir web siap pakai.",
    creator: "@wahide_app",
    images: [`${siteUrl}/icon.png`],
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
  verification: {
    google: "_bXC0soCSkMAlpzWUwr8A1yvKel4Q3_3KDSClLuhRvA",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Wahide",
      url: siteUrl,
      description: "Platform Otomasi Bisnis & WhatsApp Gateway Terpadu",
      inLanguage: "id-ID",
    },
    {
      "@type": "SoftwareApplication",
      name: "Wahide",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Cloud, Web-based",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
      description:
        "Solusi terpadu otomasi bisnis dan integrasi WhatsApp: pengiriman pesan cerdas dengan proteksi reputasi, sistem reservasi online, pengingat otomatis, formulir dinamis, dan REST API.",
      featureList: [
        "WhatsApp Multi-Device Gateway",
        "Smart Delivery & Broadcast Terjadwal",
        "Sistem Reservasi & Booking Jadwal",
        "Otomasi Pengingat & Jatuh Tempo",
        "Formulir Dinamis Publik",
        "Pustaka Template Pesan Bisnis",
        "REST API & Webhook Real-Time",
      ],
    },
    {
      "@type": "Organization",
      name: "Hide Digital Security",
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62877111301818",
        contactType: "customer service",
        availableLanguage: ["Indonesian", "English"],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`h-full font-sans antialiased ${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {siteUrl && !siteUrl.includes("localhost") && (
          <>
            <link rel="preconnect" href={siteUrl} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={siteUrl} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground selection:bg-wise-green selection:text-dark-green flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
