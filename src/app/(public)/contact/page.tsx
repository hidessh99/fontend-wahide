import { Metadata } from "next";
import { ContactUsView } from "@/components/public/ContactUsView";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Hubungi Kami — Hide Group & Wahide",
  description:
    "Hubungi tim teknis dan kemitraan Hide Group di Semarang. WhatsApp resmi 0877111301818 dan email admin@hidessh.com.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Hubungi Kami — Hide Group & Wahide",
    description:
      "Hubungi tim teknis dan kemitraan Hide Group di Semarang. WhatsApp resmi 0877111301818 dan email admin@hidessh.com.",
    url: "/contact",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

export default function ContactPage() {
  const siteUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Hubungi Kami - Wahide",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Hide Digital Security",
      telephone: "+62877111301818",
      email: "admin@hidessh.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Semarang",
        addressRegion: "Jawa Tengah",
        addressCountry: "ID",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactUsView />
    </>
  );
}
