import type { Metadata } from "next";
import { TicketDetailView } from "@/modules/support/components/seller/TicketDetailView";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

export const metadata: Metadata = {
  title: "Detail Tiket Bantuan",
  description:
    "Lihat riwayat percakapan tiket bantuan, lampiran screenshot, dan kirim balasan.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupportDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <ErrorBoundary>
      <TicketDetailView ticketId={id} />
    </ErrorBoundary>
  );
}
