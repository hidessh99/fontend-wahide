import { Metadata } from "next";
import { AboutView } from "@/components/public/AboutView";

export const metadata: Metadata = {
  title: "Tentang Kami — Hide Group & Wahide Gateway",
  description:
    "Profil resmi Hide Group, penyedia infrastruktur WhatsApp multi-device gateway berkinerja tinggi berbasis di Semarang, Jawa Tengah.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Tentang Kami — Hide Group & Wahide Gateway",
    description:
      "Profil resmi Hide Group, penyedia infrastruktur WhatsApp multi-device gateway berkinerja tinggi berbasis di Semarang, Jawa Tengah.",
    url: "/about",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutView />;
}
