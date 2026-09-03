import { Metadata } from "next";
import { TermsView } from "@/components/public/TermsView";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan (Terms of Service) — Hide Group & Wahide",
  description:
    "Syarat & Ketentuan Layanan resmi Hide Group, SLA ketersediaan 99.9%, dan Acceptable Use Policy untuk Wahide Gateway.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Syarat & Ketentuan Layanan (Terms of Service) — Hide Group & Wahide",
    description:
      "Syarat & Ketentuan Layanan resmi Hide Group, SLA ketersediaan 99.9%, dan Acceptable Use Policy untuk Wahide Gateway.",
    url: "/terms",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

export default function TermsPage() {
  return <TermsView />;
}
