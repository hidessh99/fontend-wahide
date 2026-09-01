import type { Metadata } from "next";
import { AddressView } from "@/components/dashboard/AddressView";

export const metadata: Metadata = {
  title: "Alamat Bisnis & Penagihan",
  description:
    "Kelola data lokasi fisik dan alamat penagihan resmi untuk faktur serta verifikasi akun bisnis Anda.",
  alternates: {
    canonical: "/settings/address",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsAddressPage() {
  return <AddressView />;
}
