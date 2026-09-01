import type { Metadata } from "next";
import { TeamView } from "@/modules/team/views/TeamView";

export const metadata: Metadata = {
  title: "Manajemen Tim & Agen CS",
  description: "Kelola akun staf customer service dan supervisor untuk bisnis Anda.",
  alternates: {
    canonical: "/team",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeamPage() {
  return <TeamView />;
}
