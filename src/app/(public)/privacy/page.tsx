import { Metadata } from "next";
import { PrivacyView } from "@/components/public/PrivacyView";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (Privacy Policy) — Hide Group & Wahide",
  description:
    "Kebijakan privasi resmi Hide Group berstandar UU Perlindungan Data Pribadi (UU PDP No. 27/2022) dan GDPR.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Kebijakan Privasi (Privacy Policy) — Hide Group & Wahide",
    description:
      "Kebijakan privasi resmi Hide Group berstandar UU Perlindungan Data Pribadi (UU PDP No. 27/2022) dan GDPR.",
    url: "/privacy",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
