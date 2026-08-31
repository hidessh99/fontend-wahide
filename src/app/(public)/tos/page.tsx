import { Metadata } from "next";
import { TermsView } from "@/components/public/TermsView";

export const metadata: Metadata = {
  title: "Terms of Service (ToS) — Hide Group & Wahide",
  description:
    "Syarat & Ketentuan Layanan resmi Hide Group, SLA ketersediaan 99.9%, dan Acceptable Use Policy untuk Wahide Gateway.",
};

export default function TosPage() {
  return <TermsView />;
}
