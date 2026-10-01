import { Metadata } from "next";
import { CRMBoardView } from "@/modules/crm/views/CRMBoardView";

export const metadata: Metadata = {
  title: "Pipeline CRM (Kanban Deals) | Wahide",
  description:
    "Kelola prospek prospek penjualan pelanggan via Kanban visual interaktif terintegrasi langsung dengan Omnichannel WhatsApp dan Telegram.",
};

export default function CRMPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CRMBoardView />
    </div>
  );
}
