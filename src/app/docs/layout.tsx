import { Metadata } from "next";
import { DocsLayoutClient } from "@/components/doc/DocsLayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://wahide.id"),
  title: {
    template: "%s | Wahide API",
    default: "Wahide Omnichannel API Documentation",
  },
  description:
    "Official developer reference for Wahide Omnichannel Messaging Gateway (WhatsApp Multi-Device, Meta Cloud API, Telegram, Email).",
  keywords: [
    "WhatsApp API",
    "WhatsApp Multi Device API",
    "Telegram Bot API",
    "WhatsApp Cloud API WABA",
    "Transactional Email API",
    "Omnichannel Gateway Indonesia",
    "Wahide API Documentation",
  ],
  authors: [{ name: "Wahide Engineering" }],
  creator: "Wahide",
  publisher: "Wahide",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wahide API Docs",
    title: "Wahide Omnichannel API Documentation",
    description:
      "Official developer reference for Wahide Omnichannel Gateway (WhatsApp Multi-Device, Meta Cloud API, Telegram, Email).",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahide Omnichannel API Documentation",
    description:
      "Official developer reference for Wahide Omnichannel Gateway (WhatsApp Multi-Device, Meta Cloud API, Telegram, Email).",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
