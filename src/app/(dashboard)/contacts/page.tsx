import type { Metadata } from "next";
import { ContactsView } from "@/components/dashboard/ContactsView";

export const metadata: Metadata = {
  title: "Buku Kontak & Segmentasi Audiens",
  description:
    "Kelola kontak pelanggan, segmentasi tag audiens, dan import/export file CSV untuk kampanye broadcast WhatsApp.",
  alternates: {
    canonical: "/contacts",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactsPage() {
  return <ContactsView />;
}
