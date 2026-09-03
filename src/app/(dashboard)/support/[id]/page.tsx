import type { Metadata } from "next";
import { TicketDetailView } from "@/modules/support/components/detail/TicketDetailView";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";

export const metadata: Metadata = {
  title: "Detail Tiket Bantuan",
  description: "Lihat riwayat percakapan tiket bantuan, lampiran screenshot, dan kirim balasan.",
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
    <ErrorBoundary fallbackTitle="Gagal Memuat Halaman Tiket Bantuan">
      <TicketDetailView ticketId={id} />
    </ErrorBoundary>
  );
}
