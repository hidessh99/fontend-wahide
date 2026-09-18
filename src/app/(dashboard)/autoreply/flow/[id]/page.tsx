import type { Metadata } from "next";
import { FlowBuilderView } from "@/modules/autoreply/views/FlowBuilderView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Editor Alur Visual (Flow Canvas) | Wahide",
  description: "Edit alur percakapan visual interaktif dan kelola Directed Acyclic Graph.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FlowEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <SellerRouteGuard>
      <FlowBuilderView flowId={id} />
    </SellerRouteGuard>
  );
}
