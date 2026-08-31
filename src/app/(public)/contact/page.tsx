import { Metadata } from "next";
import { ContactUsView } from "@/components/public/ContactUsView";

export const metadata: Metadata = {
  title: "Hubungi Kami — Hide Group & Wahide",
  description:
    "Hubungi tim teknis dan kemitraan Hide Group di Semarang. WhatsApp resmi 0877111301818 dan email admin@hidessh.com.",
};

export default function ContactPage() {
  return <ContactUsView />;
}
