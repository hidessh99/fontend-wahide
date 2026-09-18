import type { Metadata } from "next";
import { FlowBuilderView } from "@/modules/autoreply/views/FlowBuilderView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Buat Alur Flow Baru | Wahide",
  description: "Rancang alur bot percakapan interaktif baru pada visual canvas.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewFlowPage() {
  return (
    <SellerRouteGuard>
      <FlowBuilderView />
    </SellerRouteGuard>
  );
}
