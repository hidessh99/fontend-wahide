import type { Metadata } from "next";
import { ContactSellerDatabaseView } from "@/modules/contact/views/seller/ContactSellerDatabaseView";

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
  return <ContactSellerDatabaseView />;
}
