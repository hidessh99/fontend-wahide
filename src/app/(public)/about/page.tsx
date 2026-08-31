import { Metadata } from "next";
import { AboutView } from "@/components/public/AboutView";

export const metadata: Metadata = {
  title: "Tentang Kami — Hide Group & Wahide Gateway",
  description:
    "Profil resmi Hide Group, penyedia infrastruktur WhatsApp multi-device gateway berkinerja tinggi berbasis di Semarang, Jawa Tengah.",
};

export default function AboutPage() {
  return <AboutView />;
}
